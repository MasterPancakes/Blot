var Entries = require("models/entries");

module.exports = function (req, callback) {
  Entries.lastUpdate(req.blog.id, function (err, dateStamp) {
    return callback(null, new Date(dateStamp).toUTCString());
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

  Entries.getAll(req.blog.id, function (allEntries) {
    var filteredEntries = allEntries.filter(entry => {
      const entryDate = new Date(entry.dateStamp);
      if (fromDate && entryDate < fromDate) return false;
      if (toDate && entryDate > toDate) return false;
      return true;
    });

    if (filteredEntries.length === 0) {
      return callback(null, "No entries found in the selected date range.");
    }

    const lastUpdate = filteredEntries.reduce((latest, entry) => {
      const entryDate = new Date(entry.dateStamp);
      return entryDate > latest ? entryDate : latest;
    }, new Date(0));

    return callback(null, lastUpdate.toUTCString());
  });
}
