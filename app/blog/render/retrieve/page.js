var Entries = require("models/entries");

module.exports = function (req, callback) {
  var blog = req.blog,
    pageNo = parseInt(req.query.page) || 1,
    pageSize = req.blog.pageSize || 5,
    fromDate = req.query.from ? new Date(req.query.from) : null,
    toDate = req.query.to ? new Date(req.query.to) : null;

  Entries.getPage(blog.id, pageNo, pageSize, fromDate, toDate, function (entries, pagination) {

    var pageTitle = blog.title;

    if (pageNo > 1) pageTitle = "Page " + pageNo + " of " + pageTitle;

    pagination.current = pageNo;

    return callback(null, {
      entries: entries,
      pagination: pagination,
    });
  });
};
