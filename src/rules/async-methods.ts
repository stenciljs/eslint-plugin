import type { Rule } from 'eslint';
import ts from 'typescript';
import { stencilComponentContext } from '../utils';
import { isThenableType } from 'tsutils';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'This rule catches Stencil public methods that are not async.',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [],
    type: 'problem',
    fixable: 'code'
  },

  create(context): Rule.RuleListener {
    const stencil = stencilComponentContext();
    const parserServices = context.sourceCode.parserServices;
    const hasTypeChecker = parserServices?.esTreeNodeToTSNodeMap && parserServices?.program;

    let typeChecker: ts.TypeChecker | undefined;
    if (hasTypeChecker) {
      typeChecker = parserServices.program.getTypeChecker() as ts.TypeChecker;
    }

    return {
      ...stencil.rules,
      'MethodDefinition > Decorator[expression.callee.name=Method]': (decoratorNode: any) => {
        if (!stencil.isComponent()) {
          return;
        }
        const node = decoratorNode.parent;

        // Type-checker path: precise thenable check
        if (typeChecker) {
          const method = parserServices.esTreeNodeToTSNodeMap.get(node);
          const signature = typeChecker.getSignatureFromDeclaration(method);
          const returnType = typeChecker.getReturnTypeOfSignature(signature!);
          if (isThenableType(typeChecker, method, returnType)) {
            return; // OK
          }
        } else {
          // ESTree fallback: check async keyword or Promise return type annotation
          const functionNode = node.value;
          if (functionNode?.async) {
            return; // OK
          }
          const returnType = functionNode?.returnType?.typeAnnotation;
          if (returnType) {
            // Check for Promise<T> or TSTypeReference with name Promise
            if (
              returnType.type === 'TSTypeReference' &&
              (returnType.typeName?.name === 'Promise' ||
               returnType.typeName?.right?.name === 'Promise')
            ) {
              return; // OK
            }
          }
        }

        // Report error with fixer
        // Note: context.sourceCode.getText() returns only the node's own text (no leading
        // whitespace), so the trimLeft() call from the old getFullText() approach is not needed.
        const originalText = context.sourceCode.getText(node);
        context.report({
          node: node.key,
          message: `External @Method() ${node.key.name}() must return a Promise. Consider prefixing the method with async, such as @Method() async ${node.key.name}().`,
          fix(fixer) {
            const result = originalText
                .replace(/@Method\(\)\n(\s*)/, '@Method()\n$1async ')
                .replace('@Method() ', '@Method() async')
                .replace('async public', 'public async')
                .replace('async private', 'private async');
            return fixer.replaceText(node, result);
          }
        });
      }
    };
  }
};

export default rule;
