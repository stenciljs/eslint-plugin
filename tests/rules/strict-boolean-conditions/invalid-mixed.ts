const mixed: string | number = Math.random() > 0.5 ? 'x' : 1;
if (mixed && typeof mixed === 'string') {}
const either = mixed || 0;
const inverted = !mixed;
const ternary = mixed ? 'left' : 'right';
for (; mixed;) {
  break;
}

