import ts from 'typescript';
import { getStaticValue } from 'eslint-utils';

const SyntaxKind = ts.SyntaxKind;

export function isPrivate(originalNode: ts.Node) {
  const modifiers = ts.canHaveModifiers(originalNode)
    ? ts.getModifiers(originalNode)
    : undefined;
  if (modifiers) {
    return modifiers.some(
      (m) =>
        m.kind === ts.SyntaxKind.PrivateKeyword ||
        m.kind === ts.SyntaxKind.ProtectedKeyword
    );
  }
  // detect private identifier (#)
  const firstChildNode = originalNode.getChildAt(0);
  return firstChildNode ? firstChildNode.kind === SyntaxKind.PrivateIdentifier : false;
}

export function getDecoratorList(
  originalNode: ts.Node
): readonly ts.Decorator[] | undefined {
  const decorators = ts.canHaveDecorators(originalNode)
    ? ts.getDecorators(originalNode)
    : undefined;
  return decorators;
}

export function getDecorator(node: any, decoratorName?: string): any | any[] {
  if (decoratorName) {
    return node.decorators && node.decorators.find(isDecoratorNamed(decoratorName));
  }
  return node.decorators ? node.decorators.filter((dec: any) => dec.expression) : [];
}

export function parseDecorator(decorator: any) {
  if (decorator && decorator.expression && decorator.expression.type === 'CallExpression') {
    return decorator.expression.arguments.map((a: any) => {
      const parsed = getStaticValue(a);
      return parsed ? parsed.value : undefined;
    });
  }
  return [];
}

export function decoratorName(dec: any): string {
  return dec.expression && dec.expression.callee.name;
}

export function isDecoratorNamed(propName: string) {
  return (dec: any): boolean => {
    return decoratorName(dec) === propName;
  };
}

export function stencilComponentContext() {
  let componentNode: any;
  return {
    rules: {
      'ClassDeclaration': (node: any) => {
        const component = getDecorator(node, 'Component');
        if (component) {
          componentNode = component;
        }
      },
      'ClassDeclaration:exit': (node: any) => {
        if (componentNode === node) {
          componentNode = undefined;
        }
      }
    },
    isComponent() {
      return !!componentNode;
    }
  };
}

export function getType(node: any) {
  return node.typeAnnotation?.typeAnnotation?.typeName?.name;
}

export const stencilDecorators = ['Component', 'Prop', 'State', 'Watch', 'Element', 'Method', 'Event', 'Listen', 'AttachInternals'];

export const stencilLifecycle = [
  'connectedCallback',
  'disconnectedCallback',
  'componentWillLoad',
  'componentDidLoad',
  'componentWillRender',
  'componentDidRender',
  'componentShouldUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'formAssociatedCallback',
  'formDisabledCallback',
  'formResetCallback',
  'formStateRestoreCallback',
  'render'
];

const TOKEN_TO_TEXT: { readonly [P in ts.SyntaxKind]?: string } = {
  [SyntaxKind.OpenBraceToken]: '{',
  [SyntaxKind.CloseBraceToken]: '}',
  [SyntaxKind.OpenParenToken]: '(',
  [SyntaxKind.CloseParenToken]: ')',
  [SyntaxKind.OpenBracketToken]: '[',
  [SyntaxKind.CloseBracketToken]: ']',
  [SyntaxKind.DotToken]: '.',
  [SyntaxKind.DotDotDotToken]: '...',
  [SyntaxKind.SemicolonToken]: ',',
  [SyntaxKind.CommaToken]: ',',
  [SyntaxKind.LessThanToken]: '<',
  [SyntaxKind.GreaterThanToken]: '>',
  [SyntaxKind.LessThanEqualsToken]: '<=',
  [SyntaxKind.GreaterThanEqualsToken]: '>=',
  [SyntaxKind.EqualsEqualsToken]: '==',
  [SyntaxKind.ExclamationEqualsToken]: '!=',
  [SyntaxKind.EqualsEqualsEqualsToken]: '===',
  [SyntaxKind.InstanceOfKeyword]: 'instanceof',
  [SyntaxKind.ExclamationEqualsEqualsToken]: '!==',
  [SyntaxKind.EqualsGreaterThanToken]: '=>',
  [SyntaxKind.PlusToken]: '+',
  [SyntaxKind.MinusToken]: '-',
  [SyntaxKind.AsteriskToken]: '*',
  [SyntaxKind.AsteriskAsteriskToken]: '**',
  [SyntaxKind.SlashToken]: '/',
  [SyntaxKind.PercentToken]: '%',
  [SyntaxKind.PlusPlusToken]: '++',
  [SyntaxKind.MinusMinusToken]: '--',
  [SyntaxKind.LessThanLessThanToken]: '<<',
  [SyntaxKind.LessThanSlashToken]: '</',
  [SyntaxKind.GreaterThanGreaterThanToken]: '>>',
  [SyntaxKind.GreaterThanGreaterThanGreaterThanToken]: '>>>',
  [SyntaxKind.AmpersandToken]: '&',
  [SyntaxKind.BarToken]: '|',
  [SyntaxKind.CaretToken]: '^',
  [SyntaxKind.ExclamationToken]: '!',
  [SyntaxKind.TildeToken]: '~',
  [SyntaxKind.AmpersandAmpersandToken]: '&&',
  [SyntaxKind.BarBarToken]: '||',
  [SyntaxKind.QuestionToken]: '?',
  [SyntaxKind.ColonToken]: ':',
  [SyntaxKind.EqualsToken]: '=',
  [SyntaxKind.PlusEqualsToken]: '+=',
  [SyntaxKind.MinusEqualsToken]: '-=',
  [SyntaxKind.AsteriskEqualsToken]: '*=',
  [SyntaxKind.AsteriskAsteriskEqualsToken]: '**=',
  [SyntaxKind.SlashEqualsToken]: '/=',
  [SyntaxKind.PercentEqualsToken]: '%=',
  [SyntaxKind.LessThanLessThanEqualsToken]: '<<=',
  [SyntaxKind.GreaterThanGreaterThanEqualsToken]: '>>=',
  [SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken]: '>>>=',
  [SyntaxKind.AmpersandEqualsToken]: '&=',
  [SyntaxKind.BarEqualsToken]: '|=',
  [SyntaxKind.CaretEqualsToken]: '^=',
  [SyntaxKind.AtToken]: '@',
  [SyntaxKind.InKeyword]: 'in',
  [SyntaxKind.UniqueKeyword]: 'unique',
  [SyntaxKind.KeyOfKeyword]: 'keyof',
  [SyntaxKind.NewKeyword]: 'new',
  [SyntaxKind.ImportKeyword]: 'import',
  [SyntaxKind.ReadonlyKeyword]: 'readonly'
};

/**
 * Returns the string form of the given TSToken SyntaxKind
 * @param kind the token's SyntaxKind
 * @returns the token applicable token as a string
 */
export function getTextForTokenKind(kind: ts.SyntaxKind): string | undefined {
  return TOKEN_TO_TEXT[kind];
}