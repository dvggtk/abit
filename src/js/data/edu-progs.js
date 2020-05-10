const eduProgsText = `
СЭЗИС|08.02.01 Строительство и эксплуатация зданий и сооружений|техник|О|11|2 года 10 месяцев|Б|25
СЭЗИСк|08.02.01 Строительство и эксплуатация зданий и сооружений|техник|О|11|2 года 10 месяцев|К|5
СЭЗИС9|08.02.01 Строительство и эксплуатация зданий и сооружений|техник|О|9|3 года 10 месяцев|Б|25
СЭЗИС9к|08.02.01 Строительство и эксплуатация зданий и сооружений|техник|О|9|3 года 10 месяцев|К|5
СЭЗИСзк|08.02.01 Строительство и эксплуатация зданий и сооружений|техник|З|11|3 года 10 месяцев|К|20
ПБ|20.02.04 Пожарная безопасность|техник|О|11|2 года 10 месяцев|Б|50
ПБк|20.02.04 Пожарная безопасность|техник|О|11|2 года 10 месяцев|К|10
ПБ9|20.02.04 Пожарная безопасность|техник|О|9|3 года 10 месяцев|Б|25
ПБ9к|20.02.04 Пожарная безопасность|техник|О|9|3 года 10 месяцев|К|25
ЗИО|21.02.05 Земельно-имущественные отношения|специалист по земельно-имущественным отношениям|О|11|1 год 10 месяцев|Б|25
ЗИОк|21.02.05 Земельно-имущественные отношения|специалист по земельно-имущественным отношениям|О|11|1 год 10 месяцев|К|5
ЗИО9|21.02.05 Земельно-имущественные отношения|специалист по земельно-имущественным отношениям|О|9|2 года 10 месяцев|Б|25
ЗИО9к|21.02.05 Земельно-имущественные отношения|специалист по земельно-имущественным отношениям|О|9|2 года 10 месяцев|К|25
ЗИОзк|21.02.05 Земельно-имущественные отношения|специалист по земельно-имущественным отношениям|З|11|2 года 10 месяцев|К|20
СП9|22.02.06 Сварочное производство|техник|О|9|3 года 10 месяцев|Б|25
СП9к|22.02.06 Сварочное производство|техник|О|9|3 года 10 месяцев|К|5
ТОРАТ|23.02.03 Техническое обслуживание и ремонт автомобильного транспорта|техник|О|11|2 года 10 месяцев|Б|25
ТОРАТк|23.02.03 Техническое обслуживание и ремонт автомобильного транспорта|техник|О|11|2 года 10 месяцев|К|5
ТОРАТ9|23.02.03 Техническое обслуживание и ремонт автомобильного транспорта|техник|О|9|3 года 10 месяцев|Б|50
ТОРАТ9к|23.02.03 Техническое обслуживание и ремонт автомобильного транспорта|техник|О|9|3 года 10 месяцев|К|10
ТОРАТзк|23.02.03 Техническое обслуживание и ремонт автомобильного транспорта|техник|З|11|3 года 10 месяцев|К|20
БУ|38.02.01 Экономика и бухгалтерский учет|бухгалтер|О|11|1 год 10 месяцев|Б|25
БУк|38.02.01 Экономика и бухгалтерский учет|бухгалтер|О|11|1 год 10 месяцев|К|5
БУзк|38.02.01 Экономика и бухгалтерский учет|бухгалтер|З|11|2 года 10 месяцев|К|20
СР|39.02.01 Социальная работа|специалист по социальное работе|О|11|1 год 10 месяцев|Б|25
СРк|39.02.01 Социальная работа|специалист по социальное работе|О|11|1 год 10 месяцев|К|5
СР9|39.02.01 Социальная работа|специалист по социальное работе|О|9|2 года 10 месяцев|Б|25
СР9к|39.02.01 Социальная работа|специалист по социальное работе|О|9|2 года 10 месяцев|К|5
СРзк|39.02.01 Социальная работа|специалист по социальное работе|З|11|2 года 10 месяцев|К|20
ПСО|40.02.01 Право и организация социального обеспечения|юрист|О|11|1 год 10 месяцев|Б|50
ПСОк|40.02.01 Право и организация социального обеспечения|юрист|О|11|1 год 10 месяцев|К|10
ПСО9|40.02.01 Право и организация социального обеспечения|юрист|О|9|2 года 10 месяцев|Б|25
ПСО9к|40.02.01 Право и организация социального обеспечения|юрист|О|9|2 года 10 месяцев|К|25
ПСОз|40.02.01 Право и организация социального обеспечения|юрист|З|11|2 года 10 месяцев|Б|20
ПСОзк|40.02.01 Право и организация социального обеспечения|юрист|З|11|2 года 10 месяцев|К|15
`;

const eduProgFieldNames = [
  `code`, // код образовательной программы
  `speciality`, // специальность
  `qualification`, // квалификация
  `eduForm`, // форма обучения
  `baseEduLevel`, // базовое образование
  `duration`, // продолжительность
  `finSource`, // источник финансирования
  `placesNumber` // число мест
];

const eduProgLines = eduProgsText.split(`\n`).filter((line) => line.length > 0);
const eduProgArrays = eduProgLines.map((line) => line.split(`|`));
const eduProgRows = eduProgArrays.map((eduProgArray) => {
  const eduProgRow = eduProgFieldNames.reduce((acc, cur, idx) => {
    let eduProgElement = eduProgArray[idx];
    if (cur === `eduForm`) {
      eduProgElement = {О: "очная", З: "заочная"}[
        eduProgElement.toUpperCase().trim()
      ];
    }
    if (cur === `baseEduLevel`) {
      eduProgElement = {"9": "9 классов", "11": "11 классов"}[
        eduProgElement.trim()
      ];
    }
    if (cur === `finSource`) {
      eduProgElement = {Б: "бюджет", К: "внебюджет"}[
        eduProgElement.toUpperCase().trim()
      ];
    }

    acc[cur] = eduProgElement;
    return acc;
  }, {});
  return eduProgRow;
});

export default eduProgRows;
