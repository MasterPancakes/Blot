var ensure = require("helper/ensure");
var augment = require("./augment");
var eachEntry = require("./eachEntry");

module.exports = function (req, res, callback) {
  ensure(req, "object").and(res, "object").and(callback, "function");

  eachEntry(
    res.locals,
    function (entry, next) {
      augment(req, res, entry, next);
    },
    function (err) {
      callback(err, req, res);
    }
  );
};

function handleDateSelection(req, res, next) {
  var fromDate, toDate;

  try {
    fromDate = req.query.from ? new Date(req.query.from) : null;
    toDate = req.query.to ? new Date(req.query.to) : null;
  } catch (e) {
    fromDate = null;
    toDate = null;
  }

  res.locals.fromDate = fromDate;
  res.locals.toDate = toDate;

  next();
}
