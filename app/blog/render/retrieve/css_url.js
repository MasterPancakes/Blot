module.exports = function (req, callback) {
  return callback(null, req.blog.cssURL);
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

  // Assuming cssURL is not affected by date range, return it directly
  return callback(null, req.blog.cssURL);
}
