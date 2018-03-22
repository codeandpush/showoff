"use strict";
const gulp = require('gulp')
const _ = require('lodash')
const bz = require('bkendz')

gulp.task('sync:models', bz.modelsSync)

gulp.task('db:migrate', bz.db.generateMigrations)
gulp.task('db:seed', () => {
    bz.db.init(true)
})