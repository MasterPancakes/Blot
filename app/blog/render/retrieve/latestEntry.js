var Entries = require("models/entries");

module.exports = function (req, callback) {
  var fromDate, toDate;

  try {
    fromDate = req.query.from ? new Date(req.query.from) : null;
    toDate = req.query.to ? new Date(req.query.to) : null;
  } catch (e) {
    fromDate = null;
    toDate = null;
  }

  Entries.getPage(req.blog.id, 1, 1, fromDate, toDate, function (entries) {
    entries = entries || [];

    return callback(null, entries[0] || {});
  });
};
