module.exports = require("./appCSS");

function handleDateSelection(req, callback) {
  var fromDate, toDate;

  try {
    fromDate = req.query.from ? new Date(req.query.from) : null;
    toDate = req.query.to ? new Date(req.query.to) : null;
  } catch (e) {
    fromDate = null;
    toDate = null;
  }

  require("./appCSS")(req, function (err, css) {
    if (err) return callback(err);

    const filteredCSS = css.filter(item => {
      const itemDate = new Date(item.date);
      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;
      return true;
    });

    callback(null, filteredCSS);
  });
}
