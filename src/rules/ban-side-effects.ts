import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'This rule catches function calls at the top level',
      category: 'Possible Errors',
      recommended: false
    },
    schema: [
      {
        type: 'array',
        items: {
          type: 'string'
        },
        minLength: 0,
        additionalProperties: false
      }
    ],
    type: 'suggestion'
  },

  create(context): Rule.RuleListener {
    const shouldSkip = /\b(spec|e2e|test)\./.test(context.getFilename());
    const skipFunctions = context.options[0] || DEFAULTS;
    if (shouldSkip) {
      return {};
    }
    return {
      'CallExpression': (node: any) => {
        if (skipFunctions.includes(node.callee.name)) {
          return;
        }
        if (!isInScope(node)) {
          context.report({
            node: node,
            message: `Call expressions at the top-level should be avoided.`
          });
        }
      }
    };
  }
};

const isInScope = (n: any): boolean => {
  const type = n.type;
  if (
    type === 'ArrowFunctionExpression' ||
    type === 'FunctionDeclaration' ||
    type === 'ClassDeclaration' ||
    type === 'ExportNamedDeclaration'
  ) {
    return true;
  }
  n = n.parent;
  if (n) {
    return isInScope(n);
  }
  return false;
}

const DEFAULTS = ['describe', 'test', 'bind', 'createStore'];

export default rule;

