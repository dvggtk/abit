const gulp = require(`gulp`);
const htmlValidator = require("gulp-w3c-html-validator");
const bemValidator = require("gulp-html-bem-validator");

module.exports = function validate() {
  return gulp
    .src(`public/**/*.html`)
    .pipe(htmlValidator())
    .pipe(bemValidator());
};
