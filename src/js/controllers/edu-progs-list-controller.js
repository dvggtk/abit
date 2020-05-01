const debug = require("debug")("abit:edu-progs-list-controller");

import ListController from "./abstract-list-controller";
import EduProgController from "../controllers/edu-prog-controller";
import EduProgsListComponent from "../components/edu-progs-list";

class EduProgsListController extends ListController {
  constructor(container, model) {
    debug(`constructor`);

    super(container, model, EduProgsListComponent, EduProgController);
  }
}

export default EduProgsListController;
