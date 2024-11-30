module.exports = function (req, callback) {
  return callback(null, function () {
    this.entries = this.entries.sort(function (a, b) {
      return a.dateStamp > b.dateStamp ? -1 : a.dateStamp < b.dateStamp ? 1 : 0;
    });

    return function (text, render) {
      return render(text);
    };
  });
};

module.exports.sortEntriesByDateRange = function (entries, fromDate, toDate) {
  return entries.filter(entry => {
    const entryDate = new Date(entry.dateStamp);
    if (fromDate && entryDate < fromDate) return false;
    if (toDate && entryDate > toDate) return false;
    return true;
  }).sort((a, b) => b.dateStamp - a.dateStamp);
};
