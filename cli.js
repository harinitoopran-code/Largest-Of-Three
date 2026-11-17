// Command-line program:  node cli.js 10 25 7
const { largest } = require('./largest');
const args = process.argv.slice(2).map(Number);
if (args.length !== 3 || args.some(Number.isNaN)) {
  console.error('Usage: node cli.js <num1> <num2> <num3>');
  process.exit(1);
}
console.log(`Numbers: ${args.join(', ')}`);
console.log(`Largest number is: ${largest(...args)}`);
