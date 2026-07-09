import base from "./base";
import recommended from "./recommended";

type OxlintRuleEntry = number | [number, ...unknown[]];

/**
 * Rule set for oxlint's `.oxlintrc.json`, loaded via `jsPlugins`. Unlike the
 * ESLint flat configs, this only carries `stencil/*` rules - oxlint has its
 * own built-in `react` plugin, so `eslint-plugin-react` rules from
 * {@link recommended} are not applicable here.
 */
function stencilRulesOf(rules: Record<string, OxlintRuleEntry>): Record<string, OxlintRuleEntry> {
  return Object.fromEntries(Object.entries(rules).filter(([name]) => name.startsWith("stencil/")));
}

export default {
  ...stencilRulesOf(base.overrides[0].rules),
  ...stencilRulesOf(recommended.rules),
} satisfies Record<string, OxlintRuleEntry>;
