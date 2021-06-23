import { Atom, ToLatexOptions } from '../core/atom-class';
import { Box } from '../core/box';
import { Context } from '../core/context';
import { ParseMode, Style } from '../public/core';

export class CompositionAtom extends Atom {
  constructor(value: string, options?: { mode: ParseMode }) {
    super('composition', { mode: options?.mode ?? 'math', value });
  }

  get computedStyle(): Style {
    return {};
  }

  render(context: Context): Box {
    // In theory one would like to be able to draw the clauses
    // in an active composition. Unfortunately, there are
    // no API to give access to those clauses :(
    const result = new Box(this.value, {
      classes: 'ML__composition',
      type: 'composition',
    });
    this.bind(context, result);
    if (this.caret) result.caret = this.caret;
    return result;
  }

  serialize(_options: ToLatexOptions): string {
    return '';
  }
}
