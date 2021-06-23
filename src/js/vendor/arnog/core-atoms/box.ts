import { Atom, ToLatexOptions } from '../core/atom-class';
import { Box } from '../core/box';
import { Context } from '../core/context';
import { convertToDimension } from '../core/parser';
import { Style } from '../public/core';
import { convertDimensionToEm } from '../core/registers-utils';
export class BoxAtom extends Atom {
  readonly framecolor?: string;
  readonly verbatimFramecolor?: string;
  readonly backgroundcolor?: string;
  readonly verbatimBackgroundcolor?: string;
  readonly padding?: string;
  readonly border?: string;

  constructor(
    command: string,
    body: Atom[],
    options: {
      framecolor?: string;
      verbatimFramecolor?: string;
      backgroundcolor?: string;
      verbatimBackgroundcolor?: string;
      padding?: string;
      border?: string;
      style: Style;
      serialize?: (atom: BoxAtom, options: ToLatexOptions) => string;
    }
  ) {
    super('box', {
      command,
      serialize: options.serialize,
      style: options.style,
    });
    this.body = body;

    this.framecolor = options.framecolor;
    this.verbatimFramecolor = options.verbatimBackgroundcolor;
    this.backgroundcolor = options.backgroundcolor;
    this.verbatimBackgroundcolor = options.verbatimBackgroundcolor;
    this.padding = options.padding;
    this.border = options.border;
  }

  render(parentContext: Context): Box | null {
    const context = new Context(parentContext, this.style);

    const fboxsep = convertDimensionToEm(
      context.getRegisterAsDimension('fboxsep')
    );
    // The padding extends outside of the base
    const padding =
      this.padding === undefined
        ? fboxsep
        : convertDimensionToEm(
            convertToDimension(this.padding, parentContext.registers)
          );
    // Base is the main content "inside" the box
    const content = Atom.createBox(parentContext, this.body);
    if (!content) return null;
    content.setStyle('vertical-align', -content.height, 'em');
    const base = new Box(content, { type: 'mord' });

    // This box will represent the box (background and border).
    // It's positioned to overlap the base.
    // The 'ML__box' class is required to prevent the box from being omitted
    // during rendering (it looks like an empty, no-op box)
    const box = new Box(null, { classes: 'ML__box' });
    box.height = base.height + padding;
    box.depth = base.depth + padding;
    box.setStyle('box-sizing', 'border-box');
    box.setStyle('position', 'absolute');

    box.setStyle('height', base.height + base.depth + 2 * padding, 'em');
    if (padding === 0) {
      box.setStyle('width', '100%');
    } else {
      box.setStyle('width', `calc(100% + ${2 * padding}em)`);
      box.setStyle('top', fboxsep, 'em'); // empirical
      box.setStyle('left', -padding, 'em');
    }

    box.setStyle('z-index', '-1'); // Ensure the box is *behind* the base

    if (this.backgroundcolor) {
      box.setStyle('background-color', this.backgroundcolor);
    }

    if (this.framecolor) {
      box.setStyle(
        'border',
        `${convertDimensionToEm(
          context.getRegisterAsDimension('fboxrule')
        )}em solid ${this.framecolor}`
      );
    }

    if (this.border) box.setStyle('border', this.border);
    // box.setStyle('top', /* width of the border */);

    base.setStyle('display', 'inline-block');
    base.setStyle('height', content.height + content.depth, 'em');
    base.setStyle('vertical-align', -padding, 'em');

    // The result is a box that encloses the box and the base
    const result = new Box([box, base]);
    // Set its position as relative so that the box can be absolute positioned
    // over the base
    result.setStyle('position', 'relative');
    result.setStyle('display', 'inline-block');
    result.setStyle('line-height', 0);

    // The padding adds to the width and height of the pod
    result.height = base.height + padding;
    result.depth = base.depth + padding;
    result.left = padding;
    result.right = padding;
    result.setStyle('height', base.height + padding, 'em');
    result.setStyle('top', base.depth - base.height, 'em');
    result.setStyle('vertical-align', base.depth + padding, 'em');

    if (this.caret) result.caret = this.caret;

    return this.attachSupsub(parentContext, { base: result });
  }
}
