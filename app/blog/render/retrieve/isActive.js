var normalize = require("helper/urlNormalizer");

module.exports = function (req, callback) {
  return callback(null, function () {
    var url = normalize(req.url) || "/";

    return function (text) {
      var active = "";

      if (text === url) active = "active";

      return active;
    };
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

  callback(null, function () {
    var url = normalize(req.url) || "/";

    return function (text) {
      var active = "";

      if (text === url) active = "active";

      return active;
    };
  });
}
