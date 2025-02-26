import type { Rule } from 'eslint';
import { getDecorator, getType, parseDecorator, stencilComponentContext } from '../utils';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'This rule catches Stencil Element type not matching tag name.',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [],
    type: 'problem',
    fixable: 'code'
  },

  create(context): Rule.RuleListener {
    const stencil = stencilComponentContext();

    function parseTag(tag: string) {
      let result = tag[0].toUpperCase() + tag.slice(1);
      const tagBody = tag.split('-');
      if (tagBody.length > 1) {
        result = tagBody.map((tpart) => tpart[0].toUpperCase() + tpart.slice(1)).join('');
      }
      return result;
    }

    return {
      ...stencil.rules,
      'PropertyDefinition > Decorator[expression.callee.name=Element]': (node: any) => {
        if (stencil.isComponent()) {
          const tagType = getType(node.parent);
          const component = getDecorator(node.parent.parent.parent, 'Component');
          const [opts] = parseDecorator(component);
          if (!opts || !opts.tag) {
            return;
          }
          const parsedTag = `HTML${parseTag(opts.tag)}Element`;

          if (tagType !== parsedTag) {
            context.report({
              node: node.parent.typeAnnotation ?? node.parent,
              message: `@Element type is not matching tag for component (${parsedTag})`,
              fix(fixer) {
                // If the property has a type annotation, we can replace just that node with the parsed tag
                // @Element() elm: HTMLElement; -> @Element() elm: HTMLSampleTagElement;
                if (node.parent.typeAnnotation?.typeAnnotation) {
                  return fixer.replaceText(node.parent.typeAnnotation.typeAnnotation, parsedTag);
                }

                // If no type annotation exists on the property, we'll do some string manipulation to insert one.
                // @Element() elm; -> @Element() elm: HTMLSampleTagElement;
                const text = context.sourceCode.getText(node.parent).replace(';', '').concat(`: ${parsedTag};`)
                return fixer.replaceText(node.parent, text);
              }
            });
          }
        }
      }
    };
  }
};

export default rule;
