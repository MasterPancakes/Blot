const fs = require("fs-extra");
const async = require("async");
const Entry = require("models/entry");
const Path = require("path");
const localPath = require("helper/localPath");
const alphanum = require("helper/alphanum");

module.exports = function (req, callback) {
  let path = "/";
  let parent;

  if (req.query.path) {
    path = req.query.path;
  }

  if (path !== "/") {
    parent = Path.dirname(path);
  }

  fs.readdir(localPath(req.blog.id, path), function (err, contents) {
    // We should pass this error back to the template in future
    if (err) return callback(null, []);

    // Remove dotfiles and folders
    contents = contents.filter((item) => item[0] !== ".");
    contents = alphanum(contents, { property: "name" });

    async.mapLimit(
      contents,
      5,
      function (name, next) {
        let fullPathToItem = Path.join(path, name);
        async.parallel(
          [
            function (done) {
              fs.stat(localPath(req.blog.id, fullPathToItem), function (
                err,
                stat
              ) {
                if (err) return done(err);
                done(null, { stat });
              });
            },
            function (done) {
              Entry.get(req.blog.id, fullPathToItem, function (entry) {
                done(null, { entry });
              });
            },
          ],
          function (err, results) {
            if (err) return next(err);
            next(null, {
              name: name,
              path: fullPathToItem,
              pathURI: encodeURIComponent(fullPathToItem),
              isDirectory: results[0].stat.isDirectory(),
              isFile: results[0].stat.isFile(),
              entry: results[1].entry,
              updated: results[0].stat.mtime,
            });
          }
        );
      },
      function (err, contents) {
        if (err) return callback(null, []);
        callback(null, {
          contents,
          parent,
          parentURI: encodeURIComponent(parent),
        });
      }
    );
  });
};

function handleDateSelection(req, callback) {
  var fromDate, toDate;

  try {
    fromDate = req.query.from ? new Date(req.query.from) : null;
    toDate = req.query.to ? new Date(req.query.to) : null;
  } catch (e) {
    fromDate = null;
    toDate = null;
  }

  let path = "/";
  let parent;

  if (req.query.path) {
    path = req.query.path;
  }

  if (path !== "/") {
    parent = Path.dirname(path);
  }

  fs.readdir(localPath(req.blog.id, path), function (err, contents) {
    if (err) return callback(null, []);

    contents = contents.filter((item) => item[0] !== ".");
    contents = alphanum(contents, { property: "name" });

    async.mapLimit(
      contents,
      5,
      function (name, next) {
        let fullPathToItem = Path.join(path, name);
        async.parallel(
          [
            function (done) {
              fs.stat(localPath(req.blog.id, fullPathToItem), function (
                err,
                stat
              ) {
                if (err) return done(err);
                done(null, { stat });
              });
            },
            function (done) {
              Entry.get(req.blog.id, fullPathToItem, function (entry) {
                if (entry) {
                  const entryDate = new Date(entry.dateStamp);
                  if (fromDate && entryDate < fromDate) return done(null, { entry: null });
                  if (toDate && entryDate > toDate) return done(null, { entry: null });
                }
                done(null, { entry });
              });
            },
          ],
          function (err, results) {
            if (err) return next(err);
            next(null, {
              name: name,
              path: fullPathToItem,
              pathURI: encodeURIComponent(fullPathToItem),
              isDirectory: results[0].stat.isDirectory(),
              isFile: results[0].stat.isFile(),
              entry: results[1].entry,
              updated: results[0].stat.mtime,
            });
          }
        );
      },
      function (err, contents) {
        if (err) return callback(null, []);
        callback(null, {
          contents: contents.filter(item => item.entry !== null),
          parent,
          parentURI: encodeURIComponent(parent),
        });
      }
    );
  });
}
