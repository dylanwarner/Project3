// This file is used to define tasks that can be run by Gulp (https://gulpjs.com/)
// Gulp is an automation/build pipeline tool that will allow us to define
// complex tasks that can be run from the command line. Essentially gulp
// will allow us to create a tasks similar to the ones we have been running
// from the console out of package.json (npm test, npm run nodemon, etc).
// However, it will allow us to chain these together, pass data between them,
// and much more.

// Here we are importing the gulp package, as well as a number of plugins
// that will be used in tandem with it. Many of them are libraries we have
// seen many times before (eslint, babel, etc), but we need the version
// specifically made to work with gulp.
const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');
const concat = require('gulp-concat');


// Here we are defining a task to build our SCSS into browser ready css.
const sassTask = (done) => {
  // First, we have gulp retrieve the file we want to build.
  gulp.src('./scss/main.scss')
  // We then use the pipe functionality to route the output of
  // gulp.src into the sass() function. The sass() function will
  // convert our .scss into .css. We also hook up the 'error' event
  // handler, in case sass encounters an error trying to build.
  .pipe(sass().on('error', sass.logError))
  // Finally, we take the .css output by the sass() function and pipe
  // that to gulp.dest, which writes a file out to a destination.
  .pipe(gulp.dest('./hosted/'));
  
  
  // Sometimes we might want to run this task on a separate thread. Gulp
  // is happy to do that for us, but it needs us to tell it when the task
  // is done so that it can close the thread. The easiest way is for it to
  // give us a callback function as a parameter to call when we are done.
  done();
};


/* // The jsTask is going to transpile our client-side code using babel so
// that it is compatible with most web browsers.
const jsTask = (done) => {
  // Again, we begin by having gulp load in files for us to transpile.
  // Here we can see that gulp is capable of loading in multiple files
  // at once. Using the '*' character, we can tell it to grab every
  // file inside of the client folder that has the .js extension.
  gulp.src('./client/*.js')
  // We then send all of those files to babel using the pipe function.
  // When setting up babel, we tell it which presets we want it to use,
  // similar to our .babelrc file.
  .pipe(babel({
    presets: ['@babel/preset-env', '@babel/preset-react']
  }))
  // Once babel outputs transpiled javascript, we have gulp place it in
  // the /hosted/ folder.
  .pipe(gulp.dest('./hosted/'));
  
  
  // Finally, we alert gulp that we are done running our functionality
  // by calling the done callback function.
  done();
};
 */

const loginBundleTask = (done) => {
  // grab multiple files, concat will combine them
  gulp.src(['./client/client.js', './client/helper.js'])

  .pipe(concat('loginBundle.js')) //Final output file name
  .pipe(babel({
    presets: ['@babel/preset-env', '@babel/preset-react']
  }))
  .pipe(gulp.dest('./hosted/'));
  
  done();
};

const appBundleTask = (done) => {
  //Grab multiple files, concat will combine them
  gulp.src(['./client/maker.js', './client/helper.js'])
  .pipe(concat('appBundle.js')) //Final output file name
  .pipe(babel({
    presets: ['@babel/preset-env', '@babel/preset-react']
  }))
  .pipe(gulp.dest('./hosted/'));
  
  done();
};

// Here we are defining a task that will run ESLint on our server code.
const lintTask = (done) => {
  // We start by grabbing all the .js files in our server folder.
  gulp.src(['./server/*.js'])
  // We then send that through eslint, which will check for anywhere that
  // we deviate from the styleguide.
  .pipe(eslint())
  // eslint() outputs an unformatted report of our errors, so we will pipe
  // that to the format function, which will make it human readable.
  .pipe(eslint.format())
  // We then tell eslint that if there is an error (where we didn't follow
  // the style guide) then it should stop the rest of the task.
  .pipe(eslint.failAfterError())
  
  // Finally, we tell gulp we are done running the task.
  done();
};

// To make gulp tasks accessible from the command line, we need to export them
// from this gulpFile.js. In this case, rather than exporting each task alone,
// we can create a "build" script that can run them all. Since none of them are
// reliant on each other, we can have them all run in parallel. After exporting
// this, we can write a script like our "build" script in package.json.
module.exports.build = gulp.parallel(sassTask, loginBundleTask, appBundleTask, lintTask);


// We can also use our above tasks in a watch script. Just like our previous
// watch scripts, a "watch" will watch a file and do something if it changes.
// Because gulp can start up threads, we can have multiple watches running at
// the same time from the same commandline window.
const watch = () => {
  // First, we tell gulp to watch our main.scss file, and rerun our sass task
  // whenever there is a change to that file.
  gulp.watch('./scss/main.scss', sassTask);
  
  // We also want it to watch our client side javascript, and if there are any
  // changes, we want it to run the jsTask from above.
  gulp.watch(['./client/maker.js', './client/helper.js'], appBundleTask);
  gulp.watch(['./client/client.js', './client/helper.js'], loginBundleTask);
  
  // Finally, we want to start up nodemon to restart whenever our code changes.
  // Nodemon will watch EVERY file in our project, and will restart our 'script'
  // file when there is a change detected.
  // We don't want it to watch our client/, scss/, or node_modules/ folder. The
  // reason for this being that our above watch scripts are already watching these
  // files, and when a change happens in one of them it will build to the hosted
  // folder. Nodemon will then notice these changes to the hosted folder and will
  // restart. If we didn't ignore them, it would restart at least twice for each
  // change made. We want to ignore node_modules/ as it is a lot of extra files to
  // watch, and it shouldn't change if we are programming anyways.
  // Finally we tell it to only watch files with the js, html, or css file extension.
  nodemon({
    script: './server/app.js',
    ignore: ['client/', 'scss/', 'node_modules/'],
    ext: 'js html css'
  });
};


// We then export the watch function so that gulp can use it from the command line.
// Take a look at the watch script in package.json to see how that works.
module.exports.watch = watch;