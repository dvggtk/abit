const debug = require("debug")("abit:abits-list-controller");

import ListController from "./abstract-list-controller";
import AbitController from "../controllers/abit-controller";
import AbitsListComponent from "../components/abits-list";

class AbitsListController extends ListController {
  constructor(container, model) {
    debug(`constructor`);

    super(container, model, AbitsListComponent, AbitController);
  }
}

export default AbitsListController;
