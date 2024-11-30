var Tags = require("models/tags");
var Entry = require("models/entry");
var async = require("async");

module.exports = function (req, callback) {
  Tags.list(req.blog.id, function (err, tags) {
    // In future, we might want to expose
    // other options for this sorting...
    tags = tags.sort(function (a, b) {
      if (a.entries.length > b.entries.length) return -1;

      if (a.entries.length < b.entries.length) return 1;

      return 0;
    });

    async.each(
      tags,
      function (tag, next) {
        // so we can do {{tag}} since I like it.
        tag.tag = tag.name;
        tag.total = tag.entries.length;

        Entry.get(req.blog.id, tag.entries, function (entries) {
          tag.entries = entries;

          next();
        });
      },
      function () {
        callback(null, tags);
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

  Tags.list(req.blog.id, function (err, tags) {
    tags = tags.sort(function (a, b) {
      if (a.entries.length > b.entries.length) return -1;
      if (a.entries.length < b.entries.length) return 1;
      return 0;
    });

    async.each(
      tags,
      function (tag, next) {
        tag.tag = tag.name;
        tag.total = tag.entries.length;

        Entry.get(req.blog.id, tag.entries, function (entries) {
          tag.entries = entries.filter(entry => {
            const entryDate = new Date(entry.dateStamp);
            if (fromDate && entryDate < fromDate) return false;
            if (toDate && entryDate > toDate) return false;
            return true;
          });

          next();
        });
      },
      function () {
        callback(null, tags);
      }
    );
  });
}
