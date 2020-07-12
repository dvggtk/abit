import maleFirstNames from "./male-first-names";
import maleMiddleNames from "./male-middle-names";
import maleLastNames from "./male-last-names";

import femaleFirstNames from "./female-first-names";
import femaleMiddleNames from "./female-middle-names";
import femaleLastNames from "./female-last-names";

function getFio(rng, gender) {
  if (!/^[жм]$/.test(gender)) {
    throw new Error(`неизвестный пол: ${gender}`);
  }

  let lastname;
  let firstname;
  let middlename;
  switch (gender) {
    case `м`:
      lastname = maleLastNames[Math.floor(rng() * maleLastNames.length)];
      firstname = maleFirstNames[Math.floor(rng() * maleFirstNames.length)];
      middlename = maleMiddleNames[Math.floor(rng() * maleMiddleNames.length)];
      break;
    case `ж`:
      lastname = femaleLastNames[Math.floor(rng() * femaleLastNames.length)];
      firstname = femaleFirstNames[Math.floor(rng() * femaleFirstNames.length)];
      middlename =
        femaleMiddleNames[Math.floor(rng() * femaleMiddleNames.length)];
      break;
    default:
      throw new Error("Halt");
  }

  return `${lastname} ${firstname} ${middlename}`;
}

// eslint-disable-next-line import/prefer-default-export
export {getFio};
