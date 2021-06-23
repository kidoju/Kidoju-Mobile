import { Atom } from '../core/atom-class';
import { Box } from '../core/box';
import { Context } from '../core/context';

/*
 * An atom representing a syntactic error, such as an unknown command
 */
export class ErrorAtom extends Atom {
  constructor(value: string) {
    super('error', { value, command: value, mode: 'math' });
    this.verbatimLatex = value;
  }

  render(context: Context): Box {
    const result = this.createBox(context, { classes: 'ML__error' });

    if (this.caret) result.caret = this.caret;

    return result;
  }
}
