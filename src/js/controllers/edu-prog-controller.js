import ListItemController from "./abstract-list-item-controller";
import EduProgView from "../components/edu-prog-view";
import EduProgForm from "../components/edu-prog-form";
// import {
//   render,
//   unrender,
//   Position,
//   Key,
//   toCamelCase,
//   clone,
//   ModelItemMode
// } from "../utils";

const debug = require("debug")("abit:edu-prog-controller");

class EduProgController extends ListItemController {
  constructor(ownerListController, container, item) {
    debug(`constructor, item: %O`, item);

    super(ownerListController, container, item, EduProgView, EduProgForm);
  }

  bind() {
    super.bind();
  }

  unbind() {
    super.unbind();
  }
}

export default EduProgController;
