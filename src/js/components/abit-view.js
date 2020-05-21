const debug = require("debug")("abit:abit-view");

import AbstractComponent from "./abstract-component";

class AbitView extends AbstractComponent {
  constructor({
    fio,
    gender,
    regDate,
    certScore,
    extraScore,
    totalScore,
    hasEduCertOriginal,
    hasMedicalCert,
    hasFluoro,
    hasVaccine,
    needDorm,
    school,
    schoolYear,
    address,
    tel,
    memo,
    applications
  }) {
    super();

    this._fio = fio;
    this._gender = gender;
    this._regDate = regDate;
    this._certScore = certScore;
    this._extraScore = extraScore;
    this._totalScore = totalScore;
    this._hasEduCertOriginal = hasEduCertOriginal;
    this._hasMedicalCert = hasMedicalCert;
    this._hasFluoro = hasFluoro;
    this._hasVaccine = hasVaccine;
    this._needDorm = needDorm;
    this._school = school;
    this._schoolYear = schoolYear;
    this._address = address;
    this._tel = tel;
    this._memo = memo;

    this._applications = applications;
  }

  getTemplate() {
    // prettier-ignore
    return `<li class="abits-list__item list__item">
    <button class="list__btn list__btn--edit" type="button">✏️</button>
    <article class="abit">
      <h3 class="visually-hidden">просмотр абитуриента</h3>
      <div class="abit__row">
        <div class="abit__field abit__field--reg-date">${this._regDate}</div>
        <div class="abit__field abit__field--fio" data-gender="${this._gender}">${this._fio}</div>
        <div class="abit__field-container abit__field-container--score">
          <div class="abit__field abit__field--cert-score">${this._certScore}</div>
          <div class="abit__field abit__field--extra-score">${this._extraScore}</div>
          <div class="abit__field abit__field--total-score">${this._totalScore}</div>
        </div>
        <div class="field-container">
          <div class="field field--checkbox field--edu-cert" data-checked="${this._hasEduCertOriginal}"><span class="visually-hidden">Подлинник аттестата</span></div>
          <div class="field field--checkbox field--medical-cert" data-checked="${this._hasMedicalCert}"><span class="visually-hidden">Медицинская справка</span></div>
          <div class="field field--checkbox field--fluoro" data-checked="${this._hasFluoro}"><span class="visually-hidden">Флюорограмма</span></div>
          <div class="field field--checkbox field--vaccine" data-checked="${this._hasVaccine}"><span class="visually-hidden">Прививки</span></div>
        </div>
      </div>
<!--
      <div class="abit__row">
        <div class="abit__field abit__field--has-edu-cert-original">
          <div class="checkbox" data-checked="${this._hasEduCertOriginal}"><span class="checkbox__indicator"></span><span>подлинник аттестата</span></div>
        </div>
        <div class="abit__field abit__field--has-medical-cert">
          <div class="checkbox" data-checked="${this._hasMedicalCert}"><span class="checkbox__indicator"></span><span>медицинская справка</span></div>
        </div>
        <div class="abit__field abit__field--has-fluoro">
          <div class="checkbox" data-checked="${this._hasFluoro}"><span class="checkbox__indicator"></span><span>флюорография</span></div>
        </div>
        <div class="abit__field abit__field--has-vaccine">
          <div class="checkbox" data-checked="${this._hasVaccine}"><span class="checkbox__indicator"></span><span>прививки</span></div>
        </div>
      </div>
-->
        <div class="abit-view__row">
        <div class="abit-view__field abit-view__field--address">${this._address}</div>
        <div class="abit-view__field abit-view__field--tel"><a href="tel:${this._tel}">${this._tel}</a></div>
      </div>
      <div class="abit__row">
        <div class="abit__field abit__field--need-dorm">${[`не требуется`, `требуется`, `приоритетное`][this._needDorm]}</div>
        <div class="abit__field abit__field--school-year">${this._schoolYear}</div>
        <div class="abit__field abit__field--school">${this._school}</div>
        <div class="abit__field abit__field--memo">${this._memo}</div>
      </div>
      <div class="abit__row">
        ${this._applications.map(app => {
          return `
          <div class="application-view${app.priority ? ` application-view--priority` : ``}${app.disabled ? ` application-view--disabled` : ``}">
            <div class="application-view__edu-prog">${app.eduProg}</div>
            <div class="application-view__grade">${app.grade}</div>
          </div>`.trim()
        }).join(``)}
      </div>
    </article>
  </li>`;
  }
}

export default AbitView;
