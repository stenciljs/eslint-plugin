import type { Linter } from "eslint";

import base from "./base";
import oxlint from "./oxlint";
import recommended from "./recommended";
import strict from "./strict";

export default {
  base,
  recommended,
  strict,
  oxlint,
  /**
   * will be populated in `/src/index.ts`
   * For backward compatibility
   */
  flat: {} as Record<string, Linter.Config>,
};
