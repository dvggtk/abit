import seedrandom from "seedrandom";
const rng = seedrandom(`1`);

const toCamelCase = (s) => {
  return s
    .replace(/-\S/g, ($) => $.toUpperCase())
    .replace(/^./, ($) => $.toLowerCase())
    .replace(/-/g, ``);
};

const toKebabCase = (s) => {
  return s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};

const rnd = () => {
  return 0;
};

// Fisher–Yates Shuffle
function shuffle(array) {
  let m = array.length;
  let t;
  let i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(rng() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

const ModelItemMode = {
  VIEW: `view`,
  EDIT: `edit`,
  ADD: `add`
};

const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
  BEFOREBEGIN: `beforebegin`,
  REPLACE: `replace`
};

const Key = {
  ESCAPE_IE: `Escape`,
  ESCAPE: `Esc`
};

const FormMode = {
  VIEW: `view`,
  EDIT: `edit`,
  ADD: `add`
};

const ShowMode = {
  FORM: `form`,
  VIEW: `view`
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
    case Position.AFTEREND:
      container.after(element);
      break;
    case Position.BEFOREBEGIN:
      container.before(element);
      break;
    default:
      throw Error();
  }
};

const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

// http://stackoverflow.com/questions/728360/how-to-correctly-clone-a-javascript-object
const clone = (obj) => {
  let copy;

  // Handle the 3 simple types, and null or undefined
  if (obj === null || typeof obj !== `object`) {
    return obj;
  }

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = clone(obj[attr]);
      }
    }
    return copy;
  }

  throw Error(`Unable to copy obj! Its type isn't supported.`);
};

export {
  toCamelCase,
  toKebabCase,
  rnd,
  shuffle,
  createElement,
  render,
  unrender,
  clone,
  ModelItemMode,
  Position,
  Key,
  FormMode,
  ShowMode
};
