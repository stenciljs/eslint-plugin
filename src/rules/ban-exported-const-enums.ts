import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'This rule catches exports of const enums',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [],
    type: 'problem'
  },

  create(context): Rule.RuleListener {
    return {
      'ExportNamedDeclaration > TSEnumDeclaration[const]': (node: any) => {
        context.report({
          node: node,
          message: `Exported const enums are not allowed`
        });
      }
    };
  }
};

export default rule;
