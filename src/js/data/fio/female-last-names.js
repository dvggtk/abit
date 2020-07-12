import maleLastNames from "./male-last-names";

export default maleLastNames.map((name) => {
  // eslint-disable-next-line unicorn/prefer-starts-ends-with
  if (/ий$/.test(name)) return name.replace(/ий$/, `ая`);
  return `${name}а`;
});
