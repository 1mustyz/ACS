var gutil = require('gulp-util');
var ext = gutil.replaceExtension;
var through = require('through2');

module.exports = function(filter) {
    return through.obj(function(file, encoding, callback) {
        if (file.isBuffer()) {
            file.path = ext(file.path, '.js');
            var contents = file.contents.toString();
            var comments = contents.match(/[^\S\r\n]*\/(?:\*{2})([\W\w]+?)\*\//gm);
            if(comments) {
                if(filter){
                    if (typeof filter === "string") {
                        filter = filter.split(',');
                    }
                    var regexFilter = new RegExp('(' + filter.join('|') + ')');
                    for (var i = comments.length - 1; i >= 0; i--) {
                        if (regexFilter.test(comments[i])) {
                            comments.splice(i, 1);
                        }
                    }
                }
                contents = comments.join('\n\n');
            }
            else {
                contents = '';
            }
            file.contents = new Buffer(contents);

            // Only export non-empty files
            if (contents.trim().length > 0) {
                return callback(null, file);
            }
            else {
                callback();
            }
        }
        else {
            callback(null, file);
        }
    });
};