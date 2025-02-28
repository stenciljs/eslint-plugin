import type { Rule } from 'eslint';
import { parseDecorator, stencilComponentContext } from '../utils';

const mutableProps = new Map<string, any>();
const mutableAssigned = new Set<string>();

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'This rule catches mutable Props that not need to be mutable.',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [],
    type: 'layout',
  },

  create(context): Rule.RuleListener {
    const stencil = stencilComponentContext();

    function getMutable(node: any) {
      if (!stencil.isComponent()) {
        return;
      }
      const parsed = parseDecorator(node);
      const mutable = parsed && parsed.length && parsed[0].mutable || false;

      if (mutable) {
        const varName = node.parent.key.name;
        mutableProps.set(varName, node);
      }
    }

    function checkAssigment(node: any) {
      if (!stencil.isComponent()) {
        return;
      }
      const propName = node.left.property.name;
      mutableAssigned.add(propName);
    }

    stencil.rules["ClassDeclaration:exit"]
    return {
      'ClassDeclaration': stencil.rules.ClassDeclaration,
      'PropertyDefinition > Decorator[expression.callee.name=Prop]': getMutable,
      'AssignmentExpression[left.object.type=ThisExpression][left.property.type=Identifier]': checkAssigment,
      'ClassDeclaration:exit': (node: any) => {
        const isCmp = stencil.isComponent();
        stencil.rules["ClassDeclaration:exit"](node);

        if (isCmp) {
          mutableAssigned.forEach((propName) => mutableProps.delete(propName));
          mutableProps.forEach((varNode, varName) => {
            context.report({
              node: varNode.parent,
              message: `@Prop() "${varName}" should not be mutable`,
            });
          });

          mutableAssigned.clear();
          mutableProps.clear();
        }
      }
    };
  }
};

export default rule;
