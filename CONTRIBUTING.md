# Contributing to @stencil/eslint-plugin

Thank you for your interest in contributing to the Stencil ESLint Plugin! This guide will help you get started with development, testing, and submitting contributions.

## 📋 Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Creating New Rules](#creating-new-rules)
- [Testing](#testing)
- [Code Standards](#code-standards)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## 🚀 Development Setup

### Prerequisites

- **Node.js**: >=22.13.1 (for development)
- **npm**: Latest version recommended
- **TypeScript**: Knowledge of TypeScript is essential
- **ESLint**: Understanding of ESLint rule development

### Getting Started

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/eslint-plugin.git
   cd eslint-plugin
   ```

2. **Install Dependencies**
   ```bash
   npm ci
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

5. **Watch Mode for Development**
   ```bash
   npm run watch
   ```

## 📁 Project Structure

```
src/
├── configs/          # ESLint configuration presets
│   ├── base.ts
│   ├── recommended.ts
│   └── strict.ts
├── rules/            # ESLint rule implementations
│   ├── async-methods.ts
│   ├── ban-default-true.ts
│   └── ...
├── utils.ts          # Shared utilities for rule development
└── index.ts          # Main plugin entry point

tests/
├── rules/            # Rule test suites
│   ├── async-methods/
│   │   ├── async-methods.test.ts
│   │   ├── async-methods.good.tsx    # Valid code examples
│   │   └── async-methods.wrong.tsx   # Invalid code examples
│   └── ...
└── rule-tester.ts    # Shared test configuration

docs/                 # Rule documentation
├── async-methods.md
├── ban-default-true.md
└── ...
```

## 🛠️ Creating New Rules

### 1. Rule Implementation

Create your rule file in `src/rules/your-rule-name.ts`:

```typescript
import type { Rule } from 'eslint';
import { stencilComponentContext } from '../utils';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Brief description of what this rule does.',
      category: 'Possible Errors', // or 'Best Practices', 'Stylistic Issues'
      recommended: true // or false
    },
    schema: [], // JSON schema for rule options
    type: 'problem', // 'problem', 'suggestion', or 'layout'
    fixable: 'code' // Optional: 'code' or 'whitespace' if rule is auto-fixable
  },

  create(context): Rule.RuleListener {
    const stencil = stencilComponentContext();
    
    return {
      ...stencil.rules,
      // Your rule logic here
      'SelectorNode': (node: any) => {
        if (!stencil.isComponent()) {
          return;
        }
        
        // Rule implementation
        context.report({
          node,
          message: 'Your error message here',
          fix(fixer) {
            // Optional: provide auto-fix
            return fixer.replaceText(node, 'corrected code');
          }
        });
      }
    };
  }
};

export default rule;
```

### 2. Add Rule to Index

Update `src/rules/index.ts`:

```typescript
import yourRuleName from './your-rule-name';

export default {
  // ... existing rules
  'your-rule-name': yourRuleName,
};
```

### 3. Add to Configurations

Update the appropriate config files in `src/configs/` to include your rule:

- `base.ts` - Essential rules
- `recommended.ts` - Recommended rules
- `strict.ts` - Strict rules

### 4. Create Documentation

Create `docs/your-rule-name.md` with:

````markdown
# your-rule-name

Brief description of the rule.

## Rule Details

Detailed explanation of what the rule checks for.

## Examples

### ❌ Incorrect

```tsx
// Bad code example
```

### ✅ Correct

```tsx
// Good code example
```

## Options

If your rule accepts options, document them here.

## When Not To Use It

Explain scenarios where this rule might not be applicable.
````

### 5. Update README

Add your rule to the "Supported Rules" section in `README.md`.

## 🧪 Testing

### Test Structure

Each rule should have comprehensive tests in `tests/rules/your-rule-name/`:

1. **`your-rule-name.test.ts`** - Main test file
2. **`your-rule-name.good.tsx`** - Valid code examples
3. **`your-rule-name.wrong.tsx`** - Invalid code examples
4. **`your-rule-name.output.tsx`** - Expected output after auto-fix (if applicable)

### Test Implementation

```typescript
import path from 'node:path';
import fs from 'node:fs';
import { test } from 'vitest';
import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/your-rule-name';

test('your-rule-name', () => {
  const files = {
    good: path.resolve(__dirname, 'your-rule-name.good.tsx'),
    wrong: path.resolve(__dirname, 'your-rule-name.wrong.tsx'),
    output: path.resolve(__dirname, 'your-rule-name.output.tsx') // if fixable
  };

  ruleTester.run('your-rule-name', rule, {
    valid: [
      {
        code: fs.readFileSync(files.good, 'utf8'),
        filename: files.good
      }
    ],
    invalid: [
      {
        code: fs.readFileSync(files.wrong, 'utf8'),
        filename: files.wrong,
        errors: 1, // Expected number of errors
        output: fs.readFileSync(files.output, 'utf8') // if fixable
      }
    ]
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test
npm test -- async-methods
```

The project enforces code coverage thresholds that must be maintained.

## 📝 Code Standards

### TypeScript

- Use strict TypeScript configuration
- Provide proper type annotations
- Use ESLint's type definitions from `@types/eslint`

### Code Style

- Follow existing code patterns in the project
- Use meaningful variable and function names
- Add JSDoc comments for complex logic
- Use the Stencil utilities from `../utils` when possible

### Stencil-Specific Guidelines

- Use `stencilComponentContext()` to ensure rules only apply to Stencil components
- Leverage TypeScript's type checker for accurate analysis
- Consider Stencil decorators: `@Component`, `@Prop`, `@State`, `@Method`, `@Event`, `@Listen`, `@Watch`, `@Element`

## 📤 Submitting Changes

### Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-rule-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make Your Changes**
   - Implement your rule
   - Add comprehensive tests
   - Update documentation
   - Ensure tests pass and coverage meets requirements

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your-rule-name rule"
   # or
   git commit -m "fix: resolve issue with existing-rule"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-rule-name
   ```

### PR Requirements

✅ **Required for all PRs:**
- [ ] Tests pass (`npm test`)
- [ ] Code builds successfully (`npm run build`)
- [ ] New rules include comprehensive tests
- [ ] Documentation is updated (README.md, docs/, etc.)
- [ ] Code follows existing patterns and style

✅ **For new rules:**
- [ ] Rule implementation in `src/rules/`
- [ ] Tests with good/wrong/output examples
- [ ] Documentation in `docs/`
- [ ] Added to appropriate configs
- [ ] Added to README.md rule list

### CI/CD

The project uses GitHub Actions for:
- **[Build & Test](https://github.com/stenciljs/eslint-plugin/blob/main/.github/workflows/main.yml)**: Runs on Node.js 20, 22, 24 across Ubuntu and Windows
- **Coverage**: Ensures code coverage thresholds are met
- **[Automated Releases](https://github.com/stenciljs/eslint-plugin/blob/main/.github/workflows/release.yml)**: Handles version bumping and npm publishing

## 🚀 Release Process

Releases are handled through GitHub Actions and are restricted to maintainers.

### Release Types

- **Patch** (`1.0.1`): Bug fixes and minor improvements
- **Minor** (`1.1.0`): New features, new rules
- **Major** (`2.0.0`): Breaking changes

### Release Workflow

1. **Prepare Release**
   - Ensure all PRs are merged to `main`
   - Verify all tests pass
   - Review changelog and breaking changes

2. **Trigger Release**
   - Go to [GitHub Actions](https://github.com/stenciljs/eslint-plugin/actions) → ["Release Eslint Stencil"](https://github.com/stenciljs/eslint-plugin/actions/workflows/release.yml)
   - Choose release type (patch/minor/major)
   - Choose "no" for dev release (unless testing)
   - Run workflow

3. **Post-Release**
   - Verify npm package is published
   - Check GitHub release is created
   - Update any dependent projects

### Dev Releases

For testing purposes, maintainers can create dev releases:
- Set "devRelease" to "yes" in the workflow
- Creates a version like `1.1.0-dev.1677185104.7c87e34`
- Published with `dev` tag on npm

## 🆘 Getting Help

- **Issues**: Check existing [GitHub Issues](https://github.com/stenciljs/eslint-plugin/issues)
- **Discord**: Join our [Discord community](https://chat.stenciljs.com) for questions and discussions
- **ESLint Docs**: [ESLint Rule Guidelines](https://eslint.org/docs/developer-guide/working-with-rules)
- **Stencil Docs**: [Stencil Documentation](https://stenciljs.com/docs/introduction)

## 🙏 Thank You

Your contributions help make Stencil development better for everyone. Whether it's a bug fix, new rule, or documentation improvement, every contribution is valued!

---

For questions about this contributing guide, please open an issue or discussion in the repository. 