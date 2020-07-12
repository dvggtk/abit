import ListController from "./abstract-list-controller";
import AbitController from "./abit-controller";
import AbitsListComponent from "../components/abits-list";

const debug = require("debug")("abit:abits-list-controller");

class AbitsListController extends ListController {
  constructor(container, model, eduProgsModel) {
    debug(`constructor`);

    super(container, model, AbitsListComponent, AbitController);

    this._eduProgsModel = eduProgsModel;
  }
}

export default AbitsListController;
