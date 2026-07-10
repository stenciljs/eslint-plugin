import base from "./base";
import recommended from "./recommended";

type Severity = "off" | "warn" | "error";
type RawRuleEntry = number | string | [number | string, ...unknown[]];
type OxlintRuleEntry = Severity | [Severity, ...unknown[]];

const SEVERITY_BY_NUMBER: Record<number, Severity> = { 0: "off", 1: "warn", 2: "error" };

function toSeverity(value: number | string): Severity {
  return typeof value === "string" ? (value as Severity) : SEVERITY_BY_NUMBER[value];
}

function normalize(entry: RawRuleEntry): OxlintRuleEntry {
  if (Array.isArray(entry)) {
    const [severity, ...options] = entry;
    return [toSeverity(severity), ...options];
  }
  return toSeverity(entry);
}

/**
 * Rule set for oxlint's `.oxlintrc.json`, loaded via `jsPlugins`. Unlike the
 * ESLint flat configs, this only carries `stencil/*` rules - oxlint has its
 * own built-in `react` plugin, so `eslint-plugin-react` rules from
 * {@link recommended} are not applicable here. Severities are normalized to
 * oxlint's string form ("off"/"warn"/"error") rather than the numeric form
 * the legacy `.eslintrc` configs use, since oxlint users read them directly
 * out of `.oxlintrc.json`.
 */
function stencilRulesOf(rules: Record<string, RawRuleEntry>): Record<string, OxlintRuleEntry> {
  return Object.fromEntries(
    Object.entries(rules)
      .filter(([name]) => name.startsWith("stencil/"))
      .map(([name, entry]) => [name, normalize(entry)]),
  );
}

export default {
  ...stencilRulesOf(base.overrides[0].rules),
  ...stencilRulesOf(recommended.rules),
} satisfies Record<string, OxlintRuleEntry>;
