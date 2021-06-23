/**
 * This module contains utilities to debug mathlive internal data structures.
 *
 * It is also used by the automated test suite.
 */

import { ParseMode } from '../public/core';
import { parseLatex } from '../core/parser';
import {
  LEGACY_COMMANDS,
  MATH_SYMBOLS,
  TEXT_SYMBOLS,
  ENVIRONMENTS,
} from '../core-definitions/definitions';
import { INLINE_SHORTCUTS } from '../editor/shortcuts';
import { DEFAULT_KEYBINDINGS } from '../editor/keybindings-definitions';
import { getKeybindingMarkup } from '../editor/keybindings';

import { atomToAsciiMath } from '../editor/atom-to-ascii-math';
import { parseMathString } from '../editor/parse-math-string';
import { Atom } from '../core/atom';

export function latexToAsciiMath(
  latex: string,
  mode: ParseMode = 'math'
): string {
  const root = new Atom('root', { mode: 'math' });
  root.body = parseLatex(latex, { parseMode: mode });
  return atomToAsciiMath(root);
}

export function asciiMathToLatex(ascii: string): string {
  return parseMathString(ascii, { format: 'ascii-math' })[1];
}

const MathliveDebug = {
  latexToAsciiMath,
  asciiMathToLatex,
  FUNCTIONS: LEGACY_COMMANDS,
  MATH_SYMBOLS,
  TEXT_SYMBOLS,
  ENVIRONMENTS,

  INLINE_SHORTCUTS,
  DEFAULT_KEYBINDINGS,

  getKeybindingMarkup,
};

// Export the public interface for this module
export default MathliveDebug;
