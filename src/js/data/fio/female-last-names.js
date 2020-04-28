import maleLastNames from "./male-last-names";

export default maleLastNames.map((name) => {
  if (/ий$/.test(name)) return name.replace(/ий$/, `ая`);
  return name + `а`;
});
