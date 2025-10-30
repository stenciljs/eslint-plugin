enum Example { A, B }
const str: string = Math.random() > 0.5 ? 'a' : 'b';
const num: number = 1;
const en: Example = Example.A;
const promise: Promise<string> = Promise.resolve('x');
const maybe: string | undefined = Math.random() > 0.5 ? 'x' : undefined;
const boolOrUndefined: boolean | undefined = Math.random() > 0.5 ? true : undefined;
if (maybe) {}
const cond = boolOrUndefined ? 1 : 0;
const uplift = promise && 'value';

