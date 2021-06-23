import { Atom, ToLatexOptions } from '../core/atom-class';
import { Context } from '../core/context';
import { Box } from '../core/box';

export class MacroAtom extends Atom {
  macroLatex: string;
  expand: boolean;

  constructor(
    macro: string,
    options: {
      expand?: boolean;
      args: string;
      body: Atom[];
      captureSelection?: boolean;
    }
  ) {
    super('macro', { command: macro });
    this.body = options.body;
    // Set the `captureSelection` attribute so that the atom is handled
    // as an unbreakable unit
    this.captureSelection = options.captureSelection ?? true;
    // Don't use verbatimLatex to save the macro, as it can get wiped when
    // the atom is modified (adding super/subscript, for example).
    this.macroLatex = macro + options.args;

    this.expand = options.expand ?? false;
  }

  serialize(options: ToLatexOptions): string {
    return options.expandMacro && this.expand
      ? this.bodyToLatex(options)
      : this.macroLatex;
  }

  render(context: Context): Box | null {
    const result = Atom.createBox(context, this.body);
    if (!result) return null;
    if (this.caret) result.caret = this.caret;
    return this.bind(context, result);
  }
}
