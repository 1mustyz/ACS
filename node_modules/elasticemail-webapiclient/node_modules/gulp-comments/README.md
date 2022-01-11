# gulp-comments

Exports all jsdocs-style comments from either `.js` or `.ts` files. 

[![Build Status](https://travis-ci.org/jiborobot/gulp-comments.svg?branch=master)](https://travis-ci.org/jiborobot/gulp-comments)

This is used as a workaround for when the TypeScript compiler strips jsdoc comments from its output. By extracting the comments first, you can run the output directly from `.ts` files into jsdocs.

## Install

```
npm i gulp-comments --save-dev
```

## Usage

The examples below illustrate usage in a gulp file. (Note that this plugin auto converts all file extentions to `.js`
for the benefit of jsdocs.)

Write the comments directly to files:

```js
var gulp = require('gulp');
var comments = require('gulp-comments');

gulp.task('comments', function() {
    return gulp.src('src/**/*.{ts,js}')
        .pipe(comments())
        .pipe(gulp.dest('lib/docs'));
});
```

Stream comments directly into `gulp-jsdocs`:

```js
var gulp = require('gulp');
var comments = require('gulp-comments');
var jsdoc = require('gulp-jsdoc');

gulp.task('docs', function(done) {
    gulp.src('/src/**/*.{ts,js}')
        .pipe(comments())
        .pipe(jsdoc('docs.json', done));
});
```
### Options

An optional **filter** parameter can be added when calling `comments()`. Any jsdoc block containing this string will be _excluded_ from publishing. Can be useful for creating custom documentation builds.

```js
//...
.pipe(comments('@internal'))
// ...
```

Multiple Filters

```js
//...
.pipe(comments('@internal,@justforme'))
// ...
```