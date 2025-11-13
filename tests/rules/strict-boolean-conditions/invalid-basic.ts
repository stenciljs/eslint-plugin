enum Example { A, B }
const str: string = Math.random() > 0.5 ? 'a' : 'b';
const num: number = 1;
const en: Example = Example.A;
const promise: Promise<string> = Promise.resolve('x');
if (str) {}
while (num) {}
if (en) {}
do {} while (promise);

