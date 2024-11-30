const Entries = require("models/entries");

module.exports = function (req, callback) {
  var fromDate, toDate;

  try {
    fromDate = req.query.from ? new Date(req.query.from) : null;
    toDate = req.query.to ? new Date(req.query.to) : null;
  } catch (e) {
    fromDate = null;
    toDate = null;
  }

  Entries.getAll(req.blog.id, function (allEntries) {
    var filteredEntries = allEntries.filter(entry => {
      const entryDate = new Date(entry.dateStamp);
      if (fromDate && entryDate < fromDate) return false;
      if (toDate && entryDate > toDate) return false;
      return true;
    });

    callback(null, filteredEntries.length);
  });
};
