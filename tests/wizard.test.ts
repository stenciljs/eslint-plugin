import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("node:fs/promises", () => ({
  access: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
  rm: vi.fn(),
}));

import { access, readFile, rm, writeFile } from "node:fs/promises";
import configs from "../src/configs";
import { wizard } from "../src/wizard";

const CANCEL = Symbol("cancel");

function fakePrompts(overrides: { select?: unknown; confirm?: unknown } = {}) {
  return {
    intro: vi.fn(),
    outro: vi.fn(),
    log: { warn: vi.fn() },
    select: overrides.select ?? vi.fn(),
    confirm: overrides.confirm ?? vi.fn(),
    isCancel: (v: unknown) => v === CANCEL,
    cancel: vi.fn(),
    spinner: () => ({ start: vi.fn(), stop: vi.fn() }),
  };
}

function fakeContext(prompts: ReturnType<typeof fakePrompts>) {
  return {
    config: { rootDir: "/proj" },
    isNewProject: false,
    prompts,
    nypm: { addDependency: vi.fn() },
  } as any;
}

// By default neither config file exists - individual tests override via mockImplementation
// for the "reconfigure" scenarios.
function mockNoExistingConfig() {
  vi.mocked(access).mockRejectedValue(new Error("missing"));
}

function mockExistingConfig(...paths: string[]) {
  vi.mocked(access).mockImplementation(async (path) => {
    if (paths.includes(path as string)) return undefined;
    throw new Error("missing");
  });
}

describe("eslint plugin wizard", () => {
  beforeEach(() => {
    vi.mocked(access).mockReset();
    vi.mocked(readFile).mockReset();
    vi.mocked(writeFile).mockReset();
    vi.mocked(rm).mockReset();
    vi.mocked(readFile).mockResolvedValue('{"scripts":{}}');
  });

  test("exports a stable id for de-duplication", () => {
    expect(wizard.init?.id).toBe("@stencil/eslint-plugin");
  });

  test("cancelling the runner prompt exits without installing anything", async () => {
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    const select = vi.fn().mockResolvedValueOnce(CANCEL);
    const prompts = fakePrompts({ select });
    mockNoExistingConfig();

    await wizard.init!.run(fakeContext(prompts));

    expect(prompts.cancel).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(0);
    exitSpy.mockRestore();
  });

  test("declining to reconfigure an existing setup leaves it unchanged", async () => {
    const select = vi.fn();
    const confirm = vi.fn().mockResolvedValueOnce(false);
    const prompts = fakePrompts({ select, confirm });
    const ctx = fakeContext(prompts);
    mockExistingConfig("/proj/.oxlintrc.json");

    await wizard.init!.run(ctx);

    expect(confirm).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining(".oxlintrc.json") }),
    );
    expect(select).not.toHaveBeenCalled();
    expect(vi.mocked(rm)).not.toHaveBeenCalled();
    expect(ctx.nypm.addDependency).not.toHaveBeenCalled();
    expect(vi.mocked(writeFile)).not.toHaveBeenCalled();
  });

  test("reconfiguring removes a stale config from the other runner and force-overwrites scripts", async () => {
    vi.mocked(readFile).mockResolvedValue(
      '{"scripts":{"lint":"custom-lint","lint:fix":"custom-fix"}}',
    );
    const select = vi.fn().mockResolvedValueOnce("oxlint");
    const confirm = vi.fn().mockResolvedValueOnce(true);
    const prompts = fakePrompts({ select, confirm });
    const ctx = fakeContext(prompts);
    mockExistingConfig("/proj/eslint.config.js");

    await wizard.init!.run(ctx);

    expect(vi.mocked(rm)).toHaveBeenCalledWith("/proj/eslint.config.js");
    expect(ctx.nypm.addDependency).toHaveBeenCalledWith(["oxlint"], { cwd: "/proj", dev: true });

    const [configPath] = vi.mocked(writeFile).mock.calls[0];
    expect(configPath).toBe("/proj/.oxlintrc.json");

    const [, pkgContent] = vi.mocked(writeFile).mock.calls[1];
    expect(JSON.parse(pkgContent as string).scripts).toEqual({
      lint: "oxlint .",
      "lint:fix": "oxlint . --fix",
    });
  });

  test("oxlint runner installs oxlint and writes .oxlintrc.json with only stencil rules", async () => {
    const select = vi.fn().mockResolvedValueOnce("oxlint");
    const prompts = fakePrompts({ select });
    const ctx = fakeContext(prompts);
    mockNoExistingConfig();

    await wizard.init!.run(ctx);

    expect(ctx.nypm.addDependency).toHaveBeenCalledWith(["oxlint"], { cwd: "/proj", dev: true });

    const [configPath, configContent] = vi.mocked(writeFile).mock.calls[0];
    expect(configPath).toBe("/proj/.oxlintrc.json");
    const written = JSON.parse(configContent as string);
    expect(written.jsPlugins).toEqual([{ name: "stencil", specifier: "@stencil/eslint-plugin" }]);
    expect(written.rules).toEqual(configs.oxlint);
    expect(Object.keys(written.rules).every((name) => name.startsWith("stencil/"))).toBe(true);

    const [pkgPath, pkgContent] = vi.mocked(writeFile).mock.calls[1];
    expect(pkgPath).toBe("/proj/package.json");
    expect(JSON.parse(pkgContent as string).scripts).toEqual({
      lint: "oxlint .",
      "lint:fix": "oxlint . --fix",
    });
  });

  test("eslint runner prompts for a preset and writes eslint.config.js", async () => {
    const select = vi.fn().mockResolvedValueOnce("eslint").mockResolvedValueOnce("strict");
    const prompts = fakePrompts({ select });
    const ctx = fakeContext(prompts);
    mockNoExistingConfig();

    await wizard.init!.run(ctx);

    expect(ctx.nypm.addDependency).toHaveBeenCalledWith(
      [
        "eslint",
        "@typescript-eslint/parser",
        "@typescript-eslint/eslint-plugin",
        "eslint-plugin-react",
      ],
      { cwd: "/proj", dev: true },
    );

    const [configPath, configContent] = vi.mocked(writeFile).mock.calls[0];
    expect(configPath).toBe("/proj/eslint.config.js");
    expect(configContent).toContain("stencil.configs.flat.strict");

    const [, pkgContent] = vi.mocked(writeFile).mock.calls[1];
    expect(JSON.parse(pkgContent as string).scripts).toEqual({
      lint: "eslint .",
      "lint:fix": "eslint . --fix",
    });
  });

  test("first-time setup does not clobber pre-existing unrelated lint scripts", async () => {
    vi.mocked(readFile).mockResolvedValue('{"scripts":{"lint":"custom-lint"}}');
    const select = vi.fn().mockResolvedValueOnce("oxlint");
    const prompts = fakePrompts({ select });
    const ctx = fakeContext(prompts);
    mockNoExistingConfig();

    await wizard.init!.run(ctx);

    const [, pkgContent] = vi.mocked(writeFile).mock.calls[1];
    const scripts = JSON.parse(pkgContent as string).scripts;
    expect(scripts.lint).toBe("custom-lint");
    expect(scripts["lint:fix"]).toBe("oxlint . --fix");
  });
});
