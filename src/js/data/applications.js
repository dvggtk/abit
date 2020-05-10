import seedrandom from "seedrandom";
const rng = seedrandom(Math.random());

import eduProgs from "./edu-progs";

const eduProgCodes = eduProgs.map((eduProg) => eduProg.code);

function getApplications(count) {
  const applications = [];
  for (let i = 0; i < count; i++) {
    const application = {
      eduProg: eduProgCodes[Math.floor(rng() * eduProgCodes.length)],
      grade: Math.floor(rng() * 5) + 1,
      priority: false,
      active: true
    };
    applications.push(application);
  }
  return applications;
}

export {getApplications};
