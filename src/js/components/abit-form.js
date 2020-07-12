import AbstractComponent from "./abstract-component";
import {ModelItemMode} from "../utils";

import ApplicationsForm from "./applications-form";

// eslint-disable-next-line no-unused-vars
const debug = require("debug")("abit:abit-form");

class AbitForm extends AbstractComponent {
  constructor(data, mode) {
    const {
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
    } = data;

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

    if (![ModelItemMode.EDIT, ModelItemMode.ADD].includes(mode)) {
      throw new Error("halt");
    }
    this._formMode = mode.toLowerCase();

    this._applicationsForm = new ApplicationsForm(this._applications);
  }

  getTemplate() {
    // prettier-ignore
    return `<li class="list__item">
    <article class="abit-form">
      <h3 class="visually-hidden">Форма редактирования абитуриента</h3>
      <form class="form form--mode-${this._formMode}">
        <section class="form__data">
          <h4 class="visually-hidden">Данные абитуриента</h4>
          <div class="form__data-row">
            <label class="form__control form__control--reg-date"><span class="form__label form__label--reg-date">Дата регистрации</span>
              <input class="form__input form__input--reg-date" type="text" name="reg-date" placeholder="дд.мм.гггг" value="${this._regDate}"/>
            </label>
            <label class="form__control form__control--fio"><span class="form__label form__label--fio">ФИО</span>
              <input class="form__input form__input--fio" type="text" name="fio" placeholder="Фамилия Имя Отчество" value="${this._fio}"/>
            </label>
            <label class="form__control form__control--gender"><span class="form__label form__label--gender">пол</span>
              <select class="form__select form__select--gender" name="gender">
                <option value="м"${this._gender === `м` ? ` selected="selected"` : ``}>м</option>
                <option value="ж"${this._gender === `ж` ? ` selected="selected"` : ``}>ж</option>
              </select>
            </label>
            <label class="form__control form__control--cert-score"><span class="form__label form__label--cert-score">Средний балл аттестата</span>
              <input class="form__input form__input--cert-score" type="text" name="cert-score" placeholder="0,00000" value="${this._certScore}"/>
            </label>
            <label class="form__control form__control--extra-score"><span class="form__label form__label--extra-score">Дополнительные баллы</span>
              <input class="form__input form__input--extra-score" type="text" name="extra-score" placeholder="0,0" value="${this._extraScore}"/>
            </label>
            <label class="form__control form__control--total-score"><span class="form__label form__label--total-score">Итоговый конкурсный балл</span>
              <input class="form__input form__input--total-score" type="text" name="total-score" placeholder="0,00000" value="3,972" readonly="readonly" disabled="disabled"/>
            </label>
          </div>
          <div class="form__data-row">
            <div class="form__control form__control--has-edu-cert-original">
              <label class="checkbox">
                <input class="visually-hidden" type="checkbox" name="has-edu-cert-original" value="has-edu-cert-original"${this._hasEduCertOriginal ? ` checked="checked"` : ``}/><span class="checkbox__indicator"></span><span>подлинник аттестата</span>
              </label>
            </div>
            <div class="form__control form__control--has-medical-cert">
              <label class="checkbox">
                <input class="visually-hidden" type="checkbox" name="has-medical-cert" value="has-medical-cert"${this._hasMedicalCert ? ` checked="checked"` : ``}/><span class="checkbox__indicator"></span><span>медицинская справка</span>
              </label>
            </div>
            <div class="form__control form__control--has-fluoro">
              <label class="checkbox">
                <input class="visually-hidden" type="checkbox" name="has-fluoro" value="has-fluoro"${this._hasFluoro ? ` checked="checked"` : ``}/><span class="checkbox__indicator"></span><span>флюорография</span>
              </label>
            </div>
            <div class="form__control form__control--has-vaccine">
              <label class="checkbox">
                <input class="visually-hidden" type="checkbox" name="has-vaccine" value="has-vaccine"${this._hasVaccine ? ` checked="checked"` : ``}/><span class="checkbox__indicator"></span><span>прививки</span>
              </label>
            </div>
          </div>
          <div class="form__data-row">
            <label class="form__control form__control--address"><span class="form__label form__label--address">Адрес</span>
              <input class="form__input form__input--address" type="text" name="address" placeholder="адрес" value="${this._address}"/>
            </label>
            <label class="form__control form__control--tel"><span class="form__label form__label--tel">Телефон</span>
              <input class="form__input form__input--tel" type="text" name="tel" placeholder="телефон" value="${this._tel}"/>
            </label>
          </div>
          <div class="form__data-row">
            <label class="form__control form__control--need-dorm"><span class="form__label form__label--need-dorm">Общежитие</span>
              <select class="form__select form__select--need-dorm" name="need-dorm">
                <option value="0"${Number(this._needDorm) === 0 ? ` selected="selected"` : ``}>не требуется</option>
                <option value="1"${Number(this._needDorm) === 1 ? ` selected="selected"` : ``}>требуется</option>
                <option value="2"${Number(this._needDorm) === 2 ? ` selected="selected"` : ``}>приоритетное</option>
              </select>
            </label>
            <label class="form__control form__control--school-year"><span class="form__label form__label--school-year">Год окончания школы</span>
              <input class="form__input form__input--school-year" type="text" name="school-year" placeholder="гггг" value="${this._schoolYear}"/>
            </label>
            <label class="form__control form__control--school"><span class="form__label form__label--school">Школа</span>
              <input class="form__input form__input--school" type="text" name="school" placeholder="гггг" value="${this._school}"/>
            </label>
          </div>
          <div class="form__data-row">
            <label class="form__control form__control--memo"><span class="form__label form__label--memo">Примечания</span>
              <input class="form__input form__input--memo" type="text" name="memo" placeholder="примечания" value="${this._memo}"/>
            </label>
          </div>
          <div class="form__data-row">
            ${this._applicationsForm.getTemplate()}
          </div>
        </section>
        <section class="form__panel">
          <h4 class="visually-hidden">Кнопочная панель</h4>
          <div class="form__btn-container">
            <button class="form__btn form__btn--delete" type="button">Удалить</button>
            <button class="form__btn form__btn--clone" type="button">Дублировать</button>
            <button class="form__btn form__btn--submit" type="submit">Сохранить</button>
            <button class="form__btn form__btn--cancel" type="button">Отмена</button>
          </div>
        </section>
      </form>
    </article>
  </li>`;
  }
}

export default AbitForm;
