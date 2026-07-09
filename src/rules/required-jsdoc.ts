import type { Rule } from "eslint";
import { getDecorator, getJSDocComments, stencilComponentContext } from "../utils";

const DECORATORS = ["Prop", "Method", "Event"];
const INVALID_TAGS = ["type", "memberof"];

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: "This rule catches Stencil Props and Methods using jsdoc.",
      category: "Possible Errors",
      recommended: true,
    },
    schema: [],
    type: "layout",
  },

  create(context): Rule.RuleListener {
    const stencil = stencilComponentContext();

    function getJSDoc(node: any) {
      if (!stencil.isComponent()) {
        return;
      }

      DECORATORS.forEach((decName) => {
        if (getDecorator(node, decName)) {
          const jsDocs = getJSDocComments(node, context.sourceCode);
          const isValid = jsDocs.length > 0;
          const haveTags =
            isValid &&
            jsDocs.some(
              (jsdoc: any) =>
                jsdoc.tags.length > 0 &&
                jsdoc.tags.some((tag: any) => INVALID_TAGS.includes(tag.tagName.toLowerCase())),
            );
          if (!isValid) {
            context.report({
              node: node,
              message: `The @${decName} decorator must be documented.`,
            });
          } else if (haveTags) {
            context.report({
              node: node,
              message: `The @${decName} decorator have not valid tags (${INVALID_TAGS.join(", ")}).`,
            });
          }
        }
      });
    }

    return {
      ...stencil.rules,
      PropertyDefinition: getJSDoc,
      "MethodDefinition[kind=method]": getJSDoc,
    };
  },
};

export default rule;
