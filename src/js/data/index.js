import seedrandom from "seedrandom";
import eduProgs from "./edu-progs";
import {getAbits as _getAbits} from "./abits";

// FIXME убрать Math.random() после реализации обновления без перезагрузки страницы целиком
const rng = seedrandom(Math.random());

const getAbits = (n) => _getAbits(rng, n);

export {eduProgs, getAbits};
