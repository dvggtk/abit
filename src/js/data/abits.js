const debug = require("debug")("abit:fake-data/abit");

import {getApplications} from "./applications";
import {getFio} from "./fio";
import schools from "./schools";
import addresses from "./addresses";
import telCodes from "./tel-codes";
import memos from "./memos";

const randomDate = (rng, fromDate, toDate) => {
  const d1 = new Date(fromDate);
  const d2 = new Date(toDate);

  const days = Math.floor(
    rng() *
      Math.floor(
        (Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate()) -
          Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate())) /
          (1000 * 60 * 60 * 24)
      )
  );

  const rd = new Date(d1);
  rd.setDate(rd.getDate() + days);

  return rd.toISOString().slice(0, 10);
};

function getAbits(rng, n) {
  const abits = [];
  for (let i = 0; i < n; i++) {
    const gender = rng() < 0.35 ? `ж` : `м`;
    const fio = getFio(rng, gender);
    let certScore = Math.floor((rng() * 5 + 1) * 1e4) * 1e-4;
    if (certScore > 5) {
      certScore = 5;
    }

    const abit = {
      fio, // ФИО (личный код, в случае полных тезок добавить к ФИО город или другой идентификатор для отличия тезок)
      gender,
      regDate: randomDate(rng, `2020-03-01`, `2020-08-15`), // дата регистрации в приемной комиссии
      certScore: certScore.toFixed(4), // средний балл аттестата
      extraScore: (Math.floor(rng() * 10) / 10).toFixed(1), // дополнительный балл
      totalScore: null, // конкурсный балл
      hasEduCertOriginal: rng() < 0.3, // наличие подлинника аттестата
      hasMedicalCert: rng() < 0.9, // наличие медицинской справки
      hasFluoro: rng() < 0.8, // наличие флюорограммы
      hasVaccine: rng() < 0.7, // наличие прививок
      needDorm: Math.floor(rng() * 3), // требуется общежитие
      address: addresses[Math.floor(rng() * addresses.length)], // адрес
      tel:
        `8` +
        telCodes[Math.floor(rng() * telCodes.length)] +
        `0000000`.replace(/0/g, () => String(Math.floor(rng() * 10))), // телефон
      school: schools[Math.floor(rng() * schools.length)], // школа
      schoolYear: 2020 - Math.floor(rng() + 0.1) - Math.floor(rng() + 0.1), // год окончания школы
      memo: rng() < 0.5 ? memos[Math.floor(rng() * memos.length)] : ``
    };

    abit.totalScore = (
      Number(abit.certScore) + Number(abit.extraScore)
    ).toFixed(4);

    abit.applications = getApplications(3);

    abits.push(abit);
  }

  return abits;
}

export {getAbits};
