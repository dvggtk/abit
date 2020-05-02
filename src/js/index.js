if (!localStorage.debug) {
  localStorage.debug = `abit:*`;
}
console.log(`localStorage.debug: "${localStorage.debug}"`);

import EduProgsModel from "./models/edu-progs-model";
import AbitsModel from "./models/abits-model";
import DBApi from "./api/pouchdb-api";
import EduProgsListController from "./controllers/edu-progs-list-controller";
import AbitsListController from "./controllers/abits-list-controller";
import DebugPanelController from "./controllers/debug-panel-controller";

const eduProgsListContainer = document.querySelector(
  `.edu-progs__list-container`
);
const abitsListContainer = document.querySelector(`.abits__list-container`);

const api = new DBApi();

const modelsInit = async (models) => {
  const modelPromises = models.map((model) => {
    return new Promise((resolve, reject) => {
      model.init((err, res) => {
        if (err) return reject(err);
        resolve(res);
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
      abitsModel
    );
    abitsListController.init();

    const debugPanelController = new DebugPanelController(api);
  })().catch((err) => console.error(err));
});
