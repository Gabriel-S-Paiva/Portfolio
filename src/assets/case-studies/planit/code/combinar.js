export function combinar(arrays, prefix = []) {
  if (!arrays.length) return [prefix];
  const [first, ...rest] = arrays;
  return first.flatMap((voo) => combinar(rest, [...prefix, voo]));
}
