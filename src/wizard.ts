import type { StencilWizardPlugin, WizardContext } from "@stencil/cli";
import { access, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

import configs from "./configs";

type Runner = "eslint" | "oxlint";
type Preset = "recommended" | "strict";

const ESLINT_CONFIG_FILE = "eslint.config.js";
const OXLINT_CONFIG_FILE = ".oxlintrc.json";

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function eslintConfigContent(preset: Preset): string {
  return `import stencil from '@stencil/eslint-plugin';

export default [stencil.configs.flat.${preset}];
`;
}

function oxlintConfigContent(): string {
  return (
    JSON.stringify(
      {
        $schema: "./node_modules/oxlint/configuration_schema.json",
        // Aliased to "stencil" - `@stencil/eslint-plugin` has no `meta.name`, so without an
        // alias oxlint derives the plugin name from the package name instead (`@stencil`),
        // which wouldn't match the `stencil/*` rule keys below.
        jsPlugins: [{ name: "stencil", specifier: "@stencil/eslint-plugin" }],
        rules: configs.oxlint,
      },
      null,
      2,
    ) + "\n"
  );
}

async function updatePackageJsonScripts(
  rootDir: string,
  runner: Runner,
  force: boolean,
): Promise<void> {
  const pkgPath = join(rootDir, "package.json");
  const pkg = JSON.parse(await readFile(pkgPath, "utf8")) as Record<string, any>;

  pkg["scripts"] ??= {};
  const lint = runner === "eslint" ? "eslint ." : "oxlint .";
  const lintFix = runner === "eslint" ? "eslint . --fix" : "oxlint . --fix";

  if (force) {
    pkg["scripts"]["lint"] = lint;
    pkg["scripts"]["lint:fix"] = lintFix;
  } else {
    pkg["scripts"]["lint"] ??= lint;
    pkg["scripts"]["lint:fix"] ??= lintFix;
  }

  await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
}

export const wizard: StencilWizardPlugin = {
  init: {
    id: "@stencil/eslint-plugin",
    displayName: "ESLint Plugin",
    description: "Stencil-specific lint rules, via ESLint or oxlint",

    async run({ config, prompts, nypm }: WizardContext): Promise<void> {
      const { intro, outro, select, confirm, isCancel, cancel, spinner } = prompts;
      const rootDir = config.rootDir;

      intro("@stencil/eslint-plugin - Stencil-specific lint rules");

      const eslintConfigPath = join(rootDir, ESLINT_CONFIG_FILE);
      const oxlintConfigPath = join(rootDir, OXLINT_CONFIG_FILE);
      const [hasEslintConfig, hasOxlintConfig] = await Promise.all([
        fileExists(eslintConfigPath),
        fileExists(oxlintConfigPath),
      ]);
      const isReconfigure = hasEslintConfig || hasOxlintConfig;

      if (isReconfigure) {
        const existing = [
          hasEslintConfig && ESLINT_CONFIG_FILE,
          hasOxlintConfig && OXLINT_CONFIG_FILE,
        ]
          .filter((name): name is string => Boolean(name))
          .join(" and ");
        const reconfigure = await confirm({
          message: `Lint is already configured (${existing}). Reconfigure?`,
          initialValue: false,
        });
        if (isCancel(reconfigure) || !reconfigure) {
          cancel("Lint setup left unchanged.");
          return;
        }
        // Clear out both, regardless of which runner is picked next - otherwise switching
        // runners leaves the old runner's config behind alongside the new one.
        if (hasEslintConfig) await rm(eslintConfigPath);
        if (hasOxlintConfig) await rm(oxlintConfigPath);
      }

      const runner = await select({
        message: "Which linter do you want to run Stencil rules with?",
        options: [
          {
            value: "oxlint",
            label: "oxlint",
            hint: "fast, Rust-based - a few type-aware rules cannot run at-present",
          },
          {
            value: "eslint",
            label: "ESLint",
            hint: "slower, JS-based - full rule coverage, including type-aware rules",
          },
        ],
      });
      if (isCancel(runner)) {
        cancel("Setup cancelled.");
        process.exit(0);
      }

      let preset: Preset = "recommended";
      if (runner === "eslint") {
        const chosenPreset = await select({
          message: "Which rule preset?",
          options: [
            { value: "recommended", label: "Recommended", hint: "sensible defaults" },
            { value: "strict", label: "Strict", hint: "recommended + formatting/style rules" },
          ],
        });
        if (isCancel(chosenPreset)) {
          cancel("Setup cancelled.");
          process.exit(0);
        }
        preset = chosenPreset as Preset;
      }

      const deps =
        runner === "eslint"
          ? [
              "eslint",
              "@typescript-eslint/parser",
              "@typescript-eslint/eslint-plugin",
              "eslint-plugin-react",
            ]
          : ["oxlint"];

      const s = spinner();
      s.start("Installing dependencies");
      await nypm.addDependency(deps, { cwd: rootDir, dev: true });
      s.stop("Dependencies installed");

      const configPath = runner === "eslint" ? eslintConfigPath : oxlintConfigPath;
      await writeFile(
        configPath,
        runner === "eslint" ? eslintConfigContent(preset) : oxlintConfigContent(),
        "utf8",
      );
      await updatePackageJsonScripts(rootDir, runner as Runner, isReconfigure);

      outro(`${runner === "eslint" ? "ESLint" : "oxlint"} configured with Stencil rules`);
    },
  },
};
