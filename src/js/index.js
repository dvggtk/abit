/* eslint-disable no-console */
import EduProgsModel from "./models/edu-progs-model";
import AbitsModel from "./models/abits-model";
import api from "./api/pouchdb-api";
import EduProgsListController from "./controllers/edu-progs-list-controller";
import AbitsListController from "./controllers/abits-list-controller";
import AbitsFilterController from "./controllers/abits-filter-controller";
import DebugPanelController from "./controllers/debug-panel-controller";

if (!localStorage.debug) {
  localStorage.debug = `abit:*`;
}
console.log(`localStorage.debug = "${localStorage.debug}"`);

const eduProgsListContainer = document.querySelector(
  `.edu-progs__list-container`
);
const abitsListContainer = document.querySelector(`.abits__list-container`);

const modelsInit = async (models) => {
  const modelPromises = models.map((model) => {
    return new Promise((resolve, reject) => {
      model.init((err, res) => {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  });

  return Promise.all(modelPromises);
};

api.init((err) => {
  if (err) return console.error(err);

  const eduProgsModel = new EduProgsModel(api);
  const abitsModel = new AbitsModel(api);

  (async () => {
    const res = await modelsInit([eduProgsModel, abitsModel]);

    console.log("**********", res);

    const eduProgsListController = new EduProgsListController(
      eduProgsListContainer,
      eduProgsModel
    );
    eduProgsListController.init();

    const abitsListController = new AbitsListController(
      abitsListContainer,
      abitsModel,
      eduProgsModel
    );
    abitsListController.init();

    const abitsFilterController = new AbitsFilterController(
      abitsModel,
      eduProgsModel
    );

    const debugPanelController = new DebugPanelController(api);

    return {abitsFilterController, debugPanelController};
  })().catch((error) => console.error(error));

  return 0;
});
