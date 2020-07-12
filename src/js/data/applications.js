import seedrandom from "seedrandom";

import eduProgs from "./edu-progs";

const rng = seedrandom(Math.random());

const eduProgCodes = eduProgs.map((eduProg) => eduProg.code);

function getApplications(count) {
  const applications = [];
  for (let i = 0; i < count; i += 1) {
    const application = {
      eduProg: eduProgCodes[Math.floor(rng() * eduProgCodes.length)],
      grade: Math.floor(rng() * 5) + 1,
      priority: false,
      disabled: false
    };
    applications.push(application);
  }
  return applications;
}

// eslint-disable-next-line import/prefer-default-export
export {getApplications};
