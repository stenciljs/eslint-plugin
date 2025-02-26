import type { Linter } from 'eslint';

import base from './base';
import recommended from './recommended';
import strict from './strict';

export default {
  base,
  recommended,
  strict,
  /**
   * will be populated in `/src/index.ts`
   * For backward compatibility
   */
  flat: {} as Record<string, Linter.Config>
};
