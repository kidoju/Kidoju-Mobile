import { Atom } from '../core/atom-class';
import { Box } from '../core/box';
import { VBox } from '../core/v-box';
import { Context } from '../core/context';
import { Style } from '../public/core';

export class LineAtom extends Atom {
  private readonly position: 'overline' | 'underline';
  constructor(
    command: string,
    body: Atom[],
    options: { position: 'overline' | 'underline'; style: Style }
  ) {
    super('line', { command, style: options.style });
    this.skipBoundary = true;
    this.body = body;
    this.position = options.position;
  }

  render(parentContext: Context): Box | null {
    // TeXBook:443. Rule 9 and 10
    const context = new Context(parentContext, this.style, 'cramp');
    const inner = Atom.createBox(context, this.body);
    if (!inner) return null;
    const ruleWidth =
      context.metrics.defaultRuleThickness / context.scalingFactor;
    const line = new Box(null, { classes: this.position + '-line' });
    line.height = ruleWidth;
    line.maxFontSize = ruleWidth * 1.125 * context.scalingFactor;
    let stack: Box;
    if (this.position === 'overline') {
      stack = new VBox({
        shift: 0,
        children: [{ box: inner }, 3 * ruleWidth, { box: line }, ruleWidth],
      });
    } else {
      stack = new VBox({
        top: inner.height,
        children: [ruleWidth, { box: line }, 3 * ruleWidth, { box: inner }],
      });
    }

    if (this.caret) stack.caret = this.caret;
    return new Box(stack, {
      classes: this.position,
      type: 'mord',
    });
  }
}
