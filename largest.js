// Core logic: returns the largest of three numbers
function largest(a, b, c) {
  [a, b, c].forEach((n) => {
    if (typeof n !== 'number' || Number.isNaN(n)) {
      throw new TypeError('All three inputs must be valid numbers');
    }
  });
  if (a >= b && a >= c) return a;
  if (b >= a && b >= c) return b;
  return c;
}
module.exports = { largest };
