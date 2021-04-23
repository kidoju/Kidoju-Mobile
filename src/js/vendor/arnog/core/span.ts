import { isArray } from '../common/types';

import { Style, ParseMode } from '../public/core';
import { getCharacterMetrics, METRICS } from './font-metrics';
import { svgBodyToMarkup, svgBodyHeight } from './svg-span';
import { Mode } from './modes-utils';
import { Context } from './context';

/*
 * See https://tex.stackexchange.com/questions/81752/
 * for a thorough description of the TeXt atom type and their relevance to
 * proper kerning.
 */

const SPAN_TYPE = [
  '',
  'chem',
  'mord',
  'mbin',
  'mop',
  'mrel',
  'mopen',
  'mclose',
  'mpunct',
  'minner',
  'spacing',
  'first',
  'latex',
  'composition',
  'error',
  'placeholder',
  'supsub',
  'none',
] as const; // The const assertion prevents widening to string[]
export type SpanType = typeof SPAN_TYPE[number];

export function isSpanType(type: string): type is SpanType {
  return ((SPAN_TYPE as unknown) as string[]).includes(type);
}

/*
 * See http://www.tug.org/TUGboat/tb30-3/tb96vieth.pdf for
 * typesetting conventions for mathematical physics (units, etc...)
 */

const INTER_ATOM_SPACING = {
  'mord+mop': 3,
  'mord+mbin': 4,
  'mord+mrel': 5,
  'mord+minner': 3,

  'mop+mord': 3,
  'mop+mop': 3,
  'mop+mbin': 5,
  'mop+minner': 3,

  'mbin+mord': 4,
  'mbin+mop': 4,
  'mbin+mopen': 4,
  'mbin+minner': 4,

  'mrel+mord': 5,
  'mrel+mop': 5,
  'mrel+mopen': 5,
  'mrel+minner': 5,

  'mclose+mop': 3,
  'mclose+mbin': 4,
  'mclose+mrel': 5,
  'mclose+minner': 3,

  'mpunct+mord': 3,
  'mpunct+mop': 3,
  'mpunct+mbin': 4,
  'mpunct+mrel': 5,
  'mpunct+mopen': 3,
  'mpunct+mpunct': 3,
  'mpunct+minner': 3,
};

const INTER_ATOM_TIGHT_SPACING = {
  'mord+mop': 3,
  'mop+mord': 3,
  'mop+mop': 3,
  'mclose+mop': 3,
  'minner+mop': 3,
};

/**
 * Return a string made up of the concatenated arguments.
 * Each arguments can be either a string, which is unchanged,
 * or a number, which is converted to a string with at most 2 fractional digits.
 *
 */
function toString(arg: (string | number)[] | string | number): string {
  if (typeof arg === 'string') {
    return arg;
  }

  if (typeof arg === 'number') {
    return Number(Math.ceil(1e2 * arg) / 1e2).toString();
  }

  if (arg === undefined) {
    return '';
  }

  if (isArray<string | number>(arg)) {
    let result = '';
    for (const element of arg) {
      result += toString(element);
    }

    return result;
    // } else if (arg) {
    //     result += (arg as number).toString();
  }

  console.error('Span.toStringUnexpected argument type');
  return '';
}

//----------------------------------------------------------------------------
// SPAN
//----------------------------------------------------------------------------
/**
 * A span is the most elementary element that can be rendered.
 * It is composed of an optional body of text and an optional list
 * of children (other spans). Each span can be decorated with
 * CSS classes and style attributes.
 *
 * @param content the items 'contained' by this node
 * @param classes list of classes attributes associated with this node


 * @property  type - For example, `'latex'`, `'mrel'`, etc...
 * @property classes - A string of space separated CSS classes
 * associated with this element
 * @property cssId - A CSS ID assigned to this span (optional)
 * @property htmlData - data fields assigned to this span (optional)
 * @property children - An array, potentially empty, of spans which
 * this span encloses
 * @property body - Content of this span. Can be empty.
 * @property cssProperties - A set of key/value pairs specifying CSS properties
 * associated with this element.
 * @property height - The measurement from baseline to top, in em.
 * @property depth - The measurement from baseline to bottom, in em.
 * @property width
 */
export class Span {
  type: SpanType;

  children?: Span[];
  value: string;

  classes: string;
  delim?: string; // @revisit

  caret: ParseMode;
  isSelected: boolean;

  height?: number;
  depth?: number;
  skew?: number;
  italic?: number;
  maxFontSize: number;

  isTight?: boolean;

  cssId?: string;
  htmlData?: string;

  svgBody?: string;
  svgOverlay?: string;
  svgStyle?: string;

  private cssProperties: Record<string, string>;
  attributes?: Record<string, string>; // HTML attributes, for example 'data-atom-id'

  /**
   * If a `style` option is provided, a `mode` must also be provided.
   */
  constructor(
    content: null | string | Span | (Span | null)[],
    options?: {
      classes?: string;
      type?: SpanType;
      mode?: ParseMode;
      style?: Style;
    }
  ) {
    if (typeof content === 'string') {
      this.value = content;
    } else if (isArray<Span | null>(content)) {
      this.children = content.filter((x) => x !== null);
      // if (this.children.length === 0) this.children = undefined;
    } else if (content && content instanceof Span) {
      this.children = [content];
    }

    this.type = options?.type;
    this.isSelected = false;
    this.maxFontSize = 0;

    // CSS style, as a set of key value pairs.
    // Use `Span.setStyle()` to modify it.
    this.cssProperties = null;

    // Apply color
    if (options?.style?.color) {
      if (options.style.color === 'none') {
        this.setStyle('color', '');
      } else {
        this.setStyle('color', options.style.color);
      }
    }

    if (options?.style?.backgroundColor) {
      if (options.style.backgroundColor === 'none') {
        this.setStyle('background-color', '');
      } else {
        this.setStyle('background-color', options.style.backgroundColor);
      }
    }

    // Set initial classes
    this.classes = options?.classes ?? '';

    let fontName = 'Main-Regular';
    if (options?.style && this.value) {
      console.assert(
        typeof options.mode === 'string' && options.mode.length > 1
      );
      fontName = Mode.applyStyle(options.mode, this, options.style);
    }

    // Calculate the dimensions of this span based on its children
    // assuming they are laid out horizontally
    if (this.type === 'latex') {
      this.height = 0.8;
      this.depth = 0.2;
    } else if (this.children) {
      let height = -Infinity;
      let depth = -Infinity;
      let maxFontSize = -Infinity;
      for (const child of this.children) {
        if (child.height > height) height = child.height;
        if (child.depth > depth) depth = child.depth;
        if (child.maxFontSize > maxFontSize) maxFontSize = child.maxFontSize;
      }
      this.height = height;
      this.depth = depth;
      this.maxFontSize = maxFontSize;
    } else if (this.value && this.value.length > 0) {
      // Get the metrics information
      this.maxFontSize =
        {
          size1: 0.5,
          size2: 0.7,
          size3: 0.8,
          size4: 0.9,
          size5: 1,
          size6: 1.2,
          size7: 1.44,
          size8: 1.73,
          size9: 2.07,
          size10: 2.49,
        }[options?.style?.fontSize] ?? 1;
      this.height = 0;
      this.depth = 0;
      this.skew = 0;
      this.italic = 0;
      for (let i = 0; i < this.value.length; i++) {
        const metrics = getCharacterMetrics(
          this.value.codePointAt(i),
          fontName ?? 'Main-Regular'
        );
        // If we were able to get metrics info for this character, store it.
        if (metrics) {
          this.height = metrics.height;
          this.depth = metrics.depth;
          this.skew = metrics.skew;
          this.italic = metrics.italic;
        }
      }
    } else if (this.value) {
      this.height = METRICS.baselineskip;
      this.depth = 0;
    } else {
      this.height = 0;
      this.depth = 0;
    }
  }

  selected(isSelected: boolean): void {
    this.isSelected = isSelected;
    if (this.children) {
      for (const child of this.children) {
        child.selected(isSelected);
      }
    }
  }

  /**
   * Set the value of a CSS property associated with this span.
   * For example, setStyle('border-right', 5.6, 'em');
   *
   * @param prop the CSS property to set
   * @param value a series of strings and numbers that will be concatenated.
   */
  setStyle(prop: string, ...value: (string | number)[]): void {
    const v = toString(value);
    if (v.length > 0) {
      if (!this.cssProperties) this.cssProperties = {};
      this.cssProperties[prop] = v;
    }
  }

  setTop(top: number): void {
    if (Number.isFinite(top) && Math.abs(top) > 1e-2) {
      if (!this.cssProperties) this.cssProperties = {};
      this.cssProperties.top = toString(top) + 'em';
      this.height -= top;
      this.depth += top;
    }
  }

  get left(): number {
    if (this.cssProperties?.['margin-left']) {
      return Number.parseFloat(this.cssProperties['margin-left']);
    }

    return 0;
  }

  set left(value: number) {
    if (!Number.isFinite(value)) return;
    if (!this.cssProperties) this.cssProperties = {};
    if (value === 0) {
      delete this.cssProperties['margin-left'];
    } else {
      this.cssProperties['margin-left'] = toString(value) + 'em';
    }
  }

  set right(value: number) {
    if (!Number.isFinite(value)) return;
    if (!this.cssProperties) this.cssProperties = {};
    if (value === 0) {
      delete this.cssProperties['margin-right'];
    } else {
      this.cssProperties['margin-right'] = toString(value) + 'em';
    }
  }

  set width(value: number) {
    if (!this.cssProperties) this.cssProperties = {};
    this.cssProperties.width = toString(value) + 'em';
  }

  /**
   * Generate the HTML markup to represent this span.
   *
   * @param hskip - Space (in mu, 1/18em) to leave on the left side
   * of the span.
   * This is used to adjust the inter-spacing between spans of different types,
   * e.g. 'bin' and 'rel', according to the TeX rules (TexBook p.170)
   *
   * @param hscale - If a value is provided, the margins are scaled by
   * this factor.
   *
   * @return HTML markup
   */

  toMarkup(
    options: { hskip?: number; hscale?: number } = {
      hskip: 0,
      hscale: 1,
    }
  ): string {
    let result = '';
    let body = this.value ?? '';

    //
    // 1. Calculate the spacing between spans, based on their type
    // (`mord`, `mbin`, `mrel`, etc...)
    //
    if (this.children) {
      let previousType: SpanType = 'none';
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i];
        let spacing = 0;
        const type = getEffectiveType(this.children, i);
        const combinedType = `${previousType}+${type}`;
        spacing = child.isTight
          ? INTER_ATOM_TIGHT_SPACING[combinedType] ?? 0
          : INTER_ATOM_SPACING[combinedType] ?? 0;
        body += child.toMarkup({
          hskip: spacing,
          hscale: options.hscale,
        });
        if (type !== 'supsub') previousType = type;
      }
    }

    if (
      (body === '\u200B' || (!body && !this.svgBody)) &&
      !this.classes &&
      !this.cssId &&
      !this.htmlData &&
      !this.cssProperties &&
      !this.svgOverlay
    ) {
      // 2a. Collapse 'empty' spans
      result = '';
    } else {
      // Note: We can't omit the tag, even if it has no class and no style,
      // as some layouts (vlist) depends on the presence of the tag to function
      result = '<span';

      if (this.cssId) {
        // A (HTML5) CSS id may not contain a space
        result += ` id=${this.cssId.replace(/ /g, '-')} `;
      }

      if (this.htmlData) {
        const entries = this.htmlData.split(',');
        for (const entry of entries) {
          const matched = entry.match(/([^=]+)=(.+$)/);
          if (matched) {
            const key = matched[1].trim().replace(/ /g, '-');
            if (key) {
              result += ` data-${key}=${matched[2]} `;
            }
          } else {
            const key = entry.trim().replace(/ /g, '-');
            if (key) {
              result += ` data-${key} `;
            }
          }
        }
      }

      if (this.attributes) {
        result +=
          ' ' +
          Object.keys(this.attributes)
            .map((x) => `${x}="${this.attributes[x]}"`)
            .join(' ');
      }

      const classes = this.classes.split(' ');

      // Add the type (mbin, mrel, etc...) if specified
      classes.push(
        {
          latex: 'ML__latex',
          placeholder: 'ML__placeholder',
          error: 'ML__error',
        }[this.type] ?? ''
      );
      if (this.caret === 'latex') {
        classes.push('ML__latex-caret');
      }

      // Remove duplicate and empty classes
      let classList = '';
      classList =
        classes.length > 1
          ? classes
              .filter((x, e, a) => {
                return x.length > 0 && a.indexOf(x) === e;
              })
              .join(' ')
          : classes[0];

      if (classList.length > 0) {
        result += ` class="${classList}"`;
      }

      // If a `hskip` value was provided, add it to the margin-left
      if (options.hskip) {
        this.left += options.hskip / 18;
      }

      if (this.cssProperties) {
        const styleString = Object.keys(this.cssProperties)
          .map((x) => {
            // Render the style property, except the background
            // of selected spans
            if (x === 'background-color' && this.isSelected) {
              return '';
            }

            return x + ':' + this.cssProperties[x];
          })
          .join(';');

        if (styleString.length > 0) {
          result += ' style="' + styleString + '"';
        }
      }

      result += '>';

      // If there is some SVG markup associated with this span,
      // include it now
      if (this.svgBody) {
        result += svgBodyToMarkup(this.svgBody);
      } else if (this.svgOverlay) {
        result += '<span style="';
        result += 'display: inline-block;';
        result += `height:${this.height + this.depth}em;`;
        result += `vertical-align:${this.depth}em;`;
        result += '">';
        result += body;
        result += '</span>';
        result += '<svg ';
        result += 'style="position:absolute;';
        result += 'overflow:overlay;';
        result += `height:${this.height + this.depth}em;`;
        if (this.cssProperties?.padding) {
          result += `top:${this.cssProperties.padding};`;
          result += `left:{this.style.padding};`;
          result += `width:calc(100% - 2 * ${this.cssProperties.padding} );`;
        } else {
          result += 'top:0;';
          result += 'left:0;';
          result += 'width:100%;';
        }

        result += 'z-index:2;';
        result += '"';
        if (this.svgStyle) {
          result += ' style="' + this.svgStyle + '"';
        }

        result += '>';
        result += this.svgOverlay;
        result += '</svg>';
      } else {
        result += body;
      }

      result += '</span>';
    }

    //
    // Add markup for the caret
    //
    if (this.caret === 'text') {
      result += '<span class="ML__text-caret"></span>';
    } else if (this.caret === 'math') {
      result += '<span class="ML__caret"></span>';
    }

    return result;
  }

  /**
   * Can this span be coalesced with 'span'?
   * This is used to 'coalesce' (i.e. group together) a series of spans that are
   * identical except for their value, and to avoid generating redundant spans.
   * That is: '12' ->
   *      "<span class='mord mathrm'>12</span>"
   * rather than:
   *      "<span class='mord mathrm'>1</span><span class='mord mathrm'>2</span>"
   */
  tryCoalesceWith(span: Span): boolean {
    // Don't coalesce if the types are different
    if (this.type !== span.type) return false;

    // Don't coalesce consecutive errors, placeholders or raw latex
    if (
      this.type === 'error' ||
      this.type === 'placeholder' ||
      this.type === 'latex'
    ) {
      return false;
    }

    // Don't coalesce if some of the content is SVG
    if (this.svgBody || !this.value) return false;
    if (span.svgBody || !span.value) return false;

    // If this span or the candidate span have children, we can't
    // coalesce them, but we'll try to coalesce their children
    const hasChildren = this.children && this.children.length > 0;
    const spanHasChildren = span.children && span.children.length > 0;
    if (hasChildren || spanHasChildren) return false;

    // If they have a different number of styles, can't coalesce
    const thisStyleCount = this.cssProperties ? this.cssProperties.length : 0;
    const spanStyleCount = span.cssProperties ? span.cssProperties.length : 0;
    if (thisStyleCount !== spanStyleCount) return false;

    // For the purpose of our comparison,
    // any 'empty' classes (whitespace)
    const classes = this.classes.trim().replace(/\s+/g, ' ').split(' ');
    const spanClasses = span.classes.trim().replace(/\s+/g, ' ').split(' ');

    // If they have a different number of classes, can't coalesce
    if (classes.length !== spanClasses.length) return false;

    // OK, let's do the more expensive comparison now.
    // If they have different classes, can't coalesce
    classes.sort();
    spanClasses.sort();
    for (const [i, class_] of classes.entries()) {
      // Don't coalesce vertical separators
      // (used in column formating with {l||r} for example
      if (class_ === 'vertical-separator') return false;
      if (class_ !== spanClasses[i]) return false;
    }

    // If the styles are different, can't coalesce
    if (this.cssProperties && span.cssProperties) {
      for (const style in this.cssProperties) {
        if (
          Object.prototype.hasOwnProperty.call(this.cssProperties, style) &&
          Object.prototype.hasOwnProperty.call(span.cssProperties, style)
        ) {
          if (this.cssProperties[style] !== span.cssProperties[style]) {
            return false;
          }
        }
      }
    }

    // OK, the attributes of those spans are compatible.
    // Merge span into this
    this.value += span.value;
    this.height = Math.max(this.height, span.height);
    this.depth = Math.max(this.depth, span.depth);
    this.maxFontSize = Math.max(this.maxFontSize, span.maxFontSize);
    // The italic correction for the coalesced spans is the
    // italic correction of the last span.
    this.italic = span.italic;
    return true;
  }
}

function getEffectiveType(xs: Span[], i: number): SpanType {
  if (i < 0 || i >= xs.length) return 'none';

  let result: SpanType = xs[i].type ?? 'none';

  // The effective type of a 'supsub' span is 'supsub':
  // it attaches directly to its left sibling
  if (result === 'supsub') return 'supsub';

  if (result === 'first') return 'none';

  if (result === 'mbin') {
    const previousType: SpanType = xs[i - 1]?.type ?? 'none';
    const nextType = xs[i + 1]?.type ?? 'none';

    // If a `mbin` span, i.e. "+" is after or before spans
    // of a certain type, consider it to be a `mord` instead.
    // This is to handle proper spacing of, e.g. "-4" vs "1-4"
    if (
      /first|none|mrel|mpunct|mopen|mbin|mop/.test(previousType) ||
      /none|mrel|mpunct|mclose/.test(nextType)
    ) {
      result = 'mord';
    }
  }

  return result;
}

/**
 * Attempts to coalesce (merge) spans, for example consecutive text spans.
 * Return a new tree with coalesced spans.
 *
 */
function coalesceRecursive(spans: Span[]): Span[] {
  if (!spans || spans.length === 0) return [];

  spans[0].children = coalesceRecursive(spans[0].children);
  const result = [spans[0]];

  for (let i = 1; i < spans.length; i++) {
    if (!result[result.length - 1].tryCoalesceWith(spans[i])) {
      spans[i].children = coalesceRecursive(spans[i].children);
      result.push(spans[i]);
    }
  }

  return result;
}

export function coalesce(span: Span): Span {
  if (span.children) span.children = coalesceRecursive(span.children);
  return span;
}

//----------------------------------------------------------------------------
// UTILITY FUNCTIONS
//----------------------------------------------------------------------------

export function height(spans: Span[]): number {
  return spans.reduce((acc: number, x: Span) => Math.max(acc, x.height), 0);
}

export function depth(spans: Span[]): number {
  return spans.reduce((acc: number, x: Span) => Math.max(acc, x.depth), 0);
}

export function skew(spans: Span | Span[]): number {
  if (!spans) return 0;
  if (isArray<Span>(spans)) {
    let result = 0;
    for (const span of spans) {
      result += span.skew || 0;
    }

    return result;
  }

  return spans.skew;
}

export function italic(spans: Span | Span[]): number {
  if (!spans) return 0;
  if (isArray<Span>(spans)) {
    return spans[spans.length - 1].italic ?? 0;
  }

  return spans.italic ?? 0;
}

export function makeSymbol(
  fontFamily: string,
  symbol: number,
  options?: {
    classes?: string;
    type?: SpanType;
  }
): Span {
  const base = new Span(String.fromCodePoint(symbol), options);

  const metrics = getCharacterMetrics(symbol, fontFamily);
  base.height = metrics.height;
  base.depth = metrics.depth;
  base.skew = metrics.skew;
  base.italic = metrics.italic;
  base.right = metrics.italic;
  // // Wrap the result symbol:
  // // This allow us to account for the italic correction in the bounding box
  // // e.g. for `\int`
  // const result = new Span(base, options);
  // result.height = metrics.height;
  // result.depth = metrics.depth;
  // result.skew = metrics.skew;
  // result.italic = metrics.italic;
  // result.right = metrics.italic;
  return base;
}

/**
 * Makes an element placed in each of the vlist elements to ensure that each
 * element has the same max font size. To do this, we create a zero-width space
 * with the correct font size.
//  * Note: without this, even when fontSize = 0, the fraction bar is no
//  * longer positioned correctly
 */
function makeFontSizer(context: Context, fontSize: number): Span | null {
  const fontSizeAdjustment = fontSize
    ? fontSize / context.mathstyle.sizeMultiplier
    : 0;
  const fontSizeInner = new Span('\u200B'); // ZERO WIDTH SPACE
  fontSizeInner.depth = 0;
  fontSizeInner.height = 0;
  if (fontSizeAdjustment !== 1) {
    fontSizeInner.setStyle(
      'font-size',
      fontSizeAdjustment,
      fontSizeAdjustment > 0 ? 'em' : ''
    );
    fontSizeInner.attributes = {
      'aria-hidden': 'true',
    };
  }

  if (context.size !== 'size5') {
    return new Span(fontSizeInner, {
      classes: 'sz-set reset-' + context.size + ' size5',
    });
  }

  return fontSizeAdjustment !== 0 ? fontSizeInner : null;
}

export function makeStruts(
  content: Span,
  options: {
    classes: string;
    type?: SpanType;
  }
): Span {
  const topStrut = new Span(null, { classes: 'ML__strut' });
  topStrut.setStyle('height', Math.max(0, content.height), 'em');
  const struts = [topStrut];

  if (content.depth !== 0) {
    const bottomStrut = new Span(null, { classes: 'ML__strut--bottom' });
    bottomStrut.setStyle('height', content.height + content.depth, 'em');
    bottomStrut.setStyle('vertical-align', -content.depth, 'em');
    struts.push(bottomStrut);
  }

  struts.push(content);
  return new Span(struts, options);
}

/**
 * Add some SVG markup to be overlaid on top of the span
 */
export function addSVGOverlay(
  body: Span,
  svgMarkup: string,
  svgStyle: string
): Span {
  body.svgOverlay = svgMarkup;
  body.svgStyle = svgStyle;
  return body;
}

export function makeHlist(
  spans: Span | Span[],
  options?: {
    classes?: string;
    type?: SpanType;
    mode?: ParseMode;
    style?: Style;
  }
): Span {
  // Note: do not try to optimize and avoid creating the span below
  // Some layouts, e.g. vlist, depend on that span being there.

  const result = new Span(spans, options);

  // Apply the scaling factor to the height/depth
  let factor = 0;
  factor =
    spans instanceof Span
      ? spans.maxFontSize
      : result.children.reduce(
          (acc, x) => Math.max(acc, x.maxFontSize),
          factor
        );
  result.height *= factor;
  result.depth *= factor;

  return result;
}

// function normalizeVlist(
//   posMethod: 'shift' | 'top' | 'bottom' | 'individualShift' = 'shift',
//   elements: (number | Span)[]
// ): [(number | Span)[], number] {
//   if (posMethod === 'individualShift') {
//     const oldChildren = elements;
//     const children: (number | Span)[] = [oldChildren[0]];

//     // Add in kerns to the list of params.children to get each element to be
//     // shifted to the correct specified shift
//     const depth = -oldChildren[0].shift - oldChildren[0].elem.depth;
//     let currPos = depth;
//     for (let i = 1; i < oldChildren.length; i++) {
//       const diff = -oldChildren[i].shift - currPos - oldChildren[i].elem.depth;
//       const size =
//         diff - (oldChildren[i - 1].elem.height + oldChildren[i - 1].elem.depth);

//       currPos = currPos + diff;

//       children.push({ type: 'kern', size });
//       children.push(oldChildren[i]);
//     }

//     return [children, depth];
//   }

//   let depth;
//   if (posMethod === 'top') {
//     // We always start at the bottom, so calculate the bottom by adding up
//     // all the sizes
//     let bottom = params.positionData;
//     for (let i = 0; i < params.children.length; i++) {
//       const child = params.children[i];
//       bottom -=
//         child.type === 'kern'
//           ? child.size
//           : child.elem.height + child.elem.depth;
//     }
//     depth = bottom;
//   } else if (posMethod === 'bottom') {
//     depth = -params.positionData;
//   } else {
//     const firstChild = params.children[0];
//     console.assert(firstChild.type === 'elem');
//     if (posMethod === 'shift') {
//       depth = -firstChild.elem.depth - params.positionData;
//     } else if (posMethod === 'firstBaseline') {
//       depth = -firstChild.elem.depth;
//     }
//   }
//   return [elements, depth];
// }

/**
 * Create a new span of type `vlist`, a set of vertically stacked items
 * @param elements  An array of Span and integer. The integer can be either some kerning information
 * or the value of an individual shift of the preceding child if in 'individualShift' mode
 * @param posMethod The method that will be used to position the elements in the vlist.
 *
 * One of:
 * - `"individualShift"`: each child must be followed by a number indicating how much to shift it (i.e. moved downwards)
 * - `"top"`: posData specifies the topmost point of the vlist (>0 move up)
 * - `"bottom"`: posData specifies the bottommost point of the vlist (>0 move down)
 * - `"shift"`: the baseline of the vlist will be positioned posData away from the baseline
 * of the first child. (>0 moves down)
 */
export function makeVlist(
  context: Context,
  elements: ([Span, number] | number | Span)[],
  posMethod: 'shift' | 'top' | 'bottom' | 'individualShift' = 'shift',
  options?: {
    initialPos?: number;
    classes?: string;
  }
): Span {
  let minPos = 0; // <0 if below the baseline
  let pos = 0;
  const initialPos = options?.initialPos ?? 0;

  if (posMethod === 'shift') {
    if (elements[0] instanceof Span) {
      minPos = -elements[0].depth - initialPos;
    } else {
      minPos = -initialPos;
    }
  } else if (posMethod === 'bottom') {
    minPos = -initialPos;
  } else if (posMethod === 'top') {
    let bottom = initialPos;
    for (const element of elements) {
      if (element instanceof Span) {
        // It's a Span, use the dimension data
        bottom -= element.height + element.depth;
      } else if (typeof element === 'number') {
        // It's a kern adjustment
        bottom -= element;
      }
    }

    minPos = bottom;
  } else if (posMethod === 'individualShift') {
    // Individual adjustment to each elements.
    // The elements list is made up of a Span followed
    // by a shift adjustment as an integer
    const originalElements: [Span, number][] = elements as [Span, number][];
    console.assert(originalElements[0][0] instanceof Span);
    elements = [originalElements[0][0]];

    // Add in kerns to the list of elements to get each element to be
    // shifted to the correct specified shift
    minPos = -originalElements[0][1] - originalElements[0][0].depth;
    pos = minPos;
    for (let i = 1; i < originalElements.length; i += 1) {
      const diff = -originalElements[i][1] - pos - originalElements[i][0].depth;
      pos += diff;

      const kern =
        diff -
        (originalElements[i - 1][0].height + originalElements[i - 1][0].depth);

      elements.push(kern);
      elements.push(originalElements[i][0]);
    }
  }

  // Make the fontSizer
  let maxFontSize = 0;
  for (const element of elements) {
    if (element instanceof Span) {
      maxFontSize = Math.max(maxFontSize, element.maxFontSize);
    }
  }

  const fontSizer = makeFontSizer(context, maxFontSize);

  const newElements: Span[] = [];
  pos = minPos;
  let maxPos = pos;
  for (const element of elements) {
    if (typeof element === 'number') {
      // It's a kern adjustment
      pos += element;
    } else if (element instanceof Span) {
      const wrap = new Span([fontSizer, element]);
      wrap.setTop(-element.depth - pos);
      newElements.push(wrap);
      pos += element.height + element.depth;
    }
    maxPos = Math.max(maxPos, pos);
  }

  const result = new Span(newElements, {
    classes: 'vlist ' + (options?.classes ?? ''),
  });

  // Fix the final height and depth
  result.depth = Math.max(-minPos, result.depth ?? 0);
  result.height = Math.max(pos, result.height ?? 0);

  return result;
}

/**
 * Create a span that consist of a (stretchy) SVG element
 */
export function makeSVGSpan(svgBodyName: string): Span {
  const span = new Span(null);
  span.svgBody = svgBodyName;
  span.height = svgBodyHeight(svgBodyName) / 2;
  span.depth = span.height;
  return span;
}
