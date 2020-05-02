import eduProgs from "./edu-progs";
import {getAbits as _getAbits} from "./abits";

import seedrandom from "seedrandom";
const rng = seedrandom(`1`);

const getAbits = (n) => _getAbits(rng, n);

export {eduProgs, getAbits};
