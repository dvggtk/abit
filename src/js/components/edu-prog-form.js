import AbstractComponent from "./abstract-component";
import {ModelItemMode} from "../utils";

class EduProgForm extends AbstractComponent {
  constructor(data, mode) {
    const {
      code,
      speciality,
      qualification,
      eduForm,
      baseEduLevel,
      duration,
      finSource,
      placesNumber
    } = data;

    super();

    this._code = code;
    this._speciality = speciality;
    this._qualification = qualification;
    this._eduForm = eduForm;
    this._baseEduLevel = baseEduLevel;
    this._duration = duration;
    this._finSource = finSource;
    this._placesNumber = placesNumber;

    if (![ModelItemMode.EDIT, ModelItemMode.ADD].includes(mode)) {
      throw Error();
    }

    this._formMode = mode.toLowerCase();
  }

  getTemplate() {
    return `<li class="edu-progs__item"><form class="edu-prog-form edu-prog-form--mode-${
      this._formMode
    }">
    <section class="edu-prog-form__data">
        <div class="edu-prog-form__data-row">
            <label class="edu-prog-form__control edu-prog-form__control--code">
                <span class="edu-prog-form__label edu-prog-form__label--code">Код ОП</span>
                <input type="text" name="code" placeholder="код ОП" value="${
                  this._code
                }" class="edu-prog-form__input edu-prog-form__input--code">
            </label>
            <label class="edu-prog-form__control edu-prog-form__control--speciality">
                <span class="edu-prog-form__label edu-prog-form__label--speciality">Специальность</span>
                <input type="text" name="speciality" placeholder="специальность" value="${
                  this._speciality
                }" class="edu-prog-form__input edu-prog-form__input--speciality">
            </label>
        </div>
        <div class="edu-prog-form__data-row">
            <label class="edu-prog-form__control edu-prog-form__control--qualification">
                <span class="edu-prog-form__label edu-prog-form__label--qualification">Квалификация</span>
                <input type="text" name="qualification" placeholder="квалификация" value="${
                  this._qualification
                }" class="edu-prog-form__input edu-prog-form__input--qualification">
            </label>
            <label class="edu-prog-form__control edu-prog-form__control--edu-form">
                <span class="edu-prog-form__label edu-prog-form__label--edu-form">Форма обучения</span>
                <select name="edu-form" class="edu-prog-form__select edu-prog-form__select--edu-form">
                    <option value="очная"${
                      this._eduForm === `очная` ? ` selected="true"` : ``
                    }>очная</option>
                    <option value="заочная"${
                      this._eduForm === `заочная` ? ` selected="true"` : ``
                    }>заочная</option>
                </select>
            </label>
            <label class="edu-prog-form__control edu-prog-form__control--base-edu-level">
                <span class="edu-prog-form__label edu-prog-form__label--base-edu-level">Базовое образование</span>
                <select name="base-edu-level" class="edu-prog-form__select edu-prog-form__select--base-edu-level">
                    <option value="11 классов"${
                      this._baseEduLevel === `11 классов`
                        ? ` selected="true"`
                        : ``
                    }>11 классов</option>
                    <option value="9 классов"${
                      this._baseEduLevel === `9 классов`
                        ? ` selected="true"`
                        : ``
                    }>9 классов</option>
                </select>
            </label>
            <label class="edu-prog-form__control edu-prog-form__control--duration">
                <span class="edu-prog-form__label edu-prog-form__label--duration">Продолжительность</span>
                <input type="text" name="duration" placeholder="продолжительность" value="${
                  this._duration
                }" class="edu-prog-form__input edu-prog-form__input--duration">
            </label>
            <label class="edu-prog-form__control edu-prog-form__control--fin-source">
                <span class="edu-prog-form__label edu-prog-form__label--fin-source">Источник финансирования</span>
                <select name="fin-source" class="edu-prog-form__select edu-prog-form__select--fin-source">
                    <option value="бюджет"${
                      this._finSource === `бюджет` ? ` selected="true"` : ``
                    }>бюджет</option>
                    <option value="внебюджет"${
                      this._finSource === `внебюджет` ? ` selected="true"` : ``
                    }>внебюджет</option>
                </select>
            </label>
            <label class="edu-prog-form__control edu-prog-form__control--places-number">
                <span class="edu-prog-form__label edu-prog-form__label--places-number">Количество мест</span>
                <input type="text" name="places-number" placeholder="количество мест" value="${
                  this._placesNumber
                }" class="edu-prog-form__input edu-prog-form__input--places-number">
            </label>
        </div>
    </section>
    <section class="edu-prog-form__panel">
        <div class="edu-prog-form__btn-container">
            <button type="button" class="edu-prog-form__btn edu-prog-form__btn--delete">Удалить</button>
            <button type="button" class="edu-prog-form__btn edu-prog-form__btn--clone">Дублировать</button>
            <button type="submit" class="edu-prog-form__btn edu-prog-form__btn--submit">Сохранить</button>
            <button type="button" class="edu-prog-form__btn edu-prog-form__btn--cancel">Отмена</button>
        </div>
    </section>
  </form></li>`;
  }
}

export default EduProgForm;
