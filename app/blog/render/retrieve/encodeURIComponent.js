module.exports = function (req, callback) {
  return callback(null, function () {
    return function (text, render) {
      var encoded_text = "";

      text = render(text);

      try {
        encoded_text = encodeURIComponent(text);
      } catch (e) {
        return text;
      }

      return encoded_text;
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

  callback(null, { fromDate, toDate });
}
