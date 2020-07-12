import ListController from "./abstract-list-controller";
import EduProgController from "./edu-prog-controller";
import EduProgsListComponent from "../components/edu-progs-list";

const debug = require("debug")("abit:edu-progs-list-controller");

class EduProgsListController extends ListController {
  constructor(container, model) {
    debug(`constructor`);

    super(container, model, EduProgsListComponent, EduProgController);
  }
}

export default EduProgsListController;
