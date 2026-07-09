import type { StencilWizardPlugin, WizardContext } from "@stencil/cli";
import { access, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import configs from "./configs";

type Runner = "eslint" | "oxlint";
type Preset = "recommended" | "strict";

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function configFileName(runner: Runner): string {
  return runner === "eslint" ? "eslint.config.js" : ".oxlintrc.json";
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
        jsPlugins: ["@stencil/eslint-plugin"],
        rules: configs.oxlint,
      },
      null,
      2,
    ) + "\n"
  );
}

async function updatePackageJsonScripts(rootDir: string, runner: Runner): Promise<void> {
  const pkgPath = join(rootDir, "package.json");
  const pkg = JSON.parse(await readFile(pkgPath, "utf8")) as Record<string, any>;

  pkg["scripts"] ??= {};
  pkg["scripts"]["lint"] ??= runner === "eslint" ? "eslint ." : "oxlint .";
  pkg["scripts"]["lint:fix"] ??= runner === "eslint" ? "eslint . --fix" : "oxlint . --fix";

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

      const runner = await select({
        message: "Which linter do you want to run Stencil rules with?",
        options: [
          {
            value: "oxlint",
            label: "oxlint",
            hint: "fast, Rust-based - a few type-aware rules run type-blind (JS plugins are alpha)",
          },
          {
            value: "eslint",
            label: "ESLint",
            hint: "full rule coverage, including type-aware rules",
          },
        ],
      });
      if (isCancel(runner)) {
        cancel("Setup cancelled.");
        process.exit(0);
      }

      const configPath = join(rootDir, configFileName(runner as Runner));
      if (await fileExists(configPath)) {
        const overwrite = await confirm({
          message: `${configFileName(runner as Runner)} already exists. Overwrite it?`,
          initialValue: false,
        });
        if (isCancel(overwrite) || !overwrite) {
          cancel("Skipping lint setup - existing config kept.");
          return;
        }
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

      await writeFile(
        configPath,
        runner === "eslint" ? eslintConfigContent(preset) : oxlintConfigContent(),
        "utf8",
      );
      await updatePackageJsonScripts(rootDir, runner as Runner);

      outro(`${runner === "eslint" ? "ESLint" : "oxlint"} configured with Stencil rules`);
    },
  },
};
