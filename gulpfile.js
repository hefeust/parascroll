
var gulp = require('gulp');
var rollup = require('rollup-stream');
var buble = require('rollup-plugin-buble')
var source = require('vinyl-source-stream');
var resolve = require('rollup-plugin-node-resolve');

gulp.task('default', ['build']);

gulp.task('build', function() {

  rollup({
      input: './src/parascroll/ParaScroll.js',
      format: 'iife',
      name: 'ParaScroll',
      plugins: [
        resolve(),
        buble({
          transforms: {
            arrow: true,
            classes: true,
            conciseMethodProperty: true,
            parameterDestructuring: true,
            destructuring: true,
            letConst: true,
            modules: false,
            dangerousForOf: true
          },
          objectAssign: 'Object.assign'
        })
      ]
    })
    .on('error', function(err) {
      console.log(err)
    })
    .pipe(source('parascroll.js'))
    .pipe(gulp.dest('./dist'));
});
