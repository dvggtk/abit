import AbstractComponent from "./abstract-component";

class EduProgView extends AbstractComponent {
  constructor({
    code,
    speciality,
    qualification,
    eduForm,
    baseEduLevel,
    duration,
    finSource,
    placesNumber
  }) {
    super();

    this._code = code;
    this._speciality = speciality;
    this._qualification = qualification;
    this._eduForm = eduForm;
    this._baseEduLevel = baseEduLevel;
    this._duration = duration;
    this._finSource = finSource;
    this._placesNumber = placesNumber;
  }

  getTemplate() {
    // prettier-ignore
    return `
    <li class="list__item">
      <button class="list__btn list__btn--edit" type="button">✏️</button>
      <article class="edu-prog">
        <div class="edu-prog__field edu-prog__field--code">${this._code}</div>
        <div class="edu-prog__field edu-prog__field--speciality">${this._speciality}</div>
        <div class="edu-prog__field edu-prog__field--qualification">${this._qualification}</div>
        <div class="edu-prog__field edu-prog__field--edu-form">${this._eduForm}</div>
        <div class="edu-prog__field edu-prog__field--edu-base-level">${this._baseEduLevel}</div>
        <div class="edu-prog__field edu-prog__field--duration">${this._duration}</div>
        <div class="edu-prog__field edu-prog__field--fin-source">${this._finSource}</div>
        <div class="edu-prog__field edu-prog__field--places-number">${this._placesNumber}</div>
      </article>
    </li>`.trim();
  }
}

export default EduProgView;
