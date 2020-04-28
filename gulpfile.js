const gulp = require("gulp");

const serve = require(`./gulp/serve`);
const clean = require(`./gulp/clean`);
const copy = require(`./gulp/copy`);
const html = require(`./gulp/html`);
const pug2html = require(`./gulp/pug2html`);
const style = require(`./gulp/style`);
const script = require(`./gulp/script`);
const validateHTML = require(`./gulp/validate`);

const build = gulp.series(clean, copy, html, pug2html, style, script);
const start = gulp.series(build, validateHTML, serve);
const validate = gulp.series(build, validateHTML);

module.exports = {
  start,
  build,
  validate,
  clean,
  copy,
  html,
  pug2html,
  style,
  script,
  serve
};
