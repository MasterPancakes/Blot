var debug = require("debug")("blot:clients:dropbox:database");
var redis = require("client");
var Blog = require("blog");
var async = require("async");
var ensure = require("helper/ensure");
var Model;

function get(blogID, callback) {
  redis.hgetall(accountKey(blogID), function(err, account) {
    if (err) return callback(err, null);

    if (!account) return callback(null, null);

    // Restore the types of the properties
    // of the account object before calling back.
    for (var i in Model) {
      if (Model[i] === "number") account[i] = parseInt(account[i]);

      if (Model[i] === "boolean") account[i] = account[i] === "true";
    }

    return callback(null, account);
  });
}

function listBlogs(account_id, callback) {
  var blogs = [];

  debug("Getting blogs conencted to Dropbox account", account_id);

  redis.SMEMBERS(blogsKey(account_id), function(err, members) {
    if (err) return callback(err);

    debug("Found these blog IDs", members);

    async.each(
      members,
      function(id, next) {
        Blog.get({ id: id }, function(err, blog) {
          if (blog && blog.client === "dropbox") {
            blogs.push(blog);
          } else {
            debug(
              id,
              "does not match an extant blog using the Dropbox client."
            );
          }
          next();
        });
      },
      function(err) {
        callback(err, blogs);
      }
    );
  });
}

function set(blogID, changes, callback) {
  var multi = redis.multi();

  debug("Setting dropbox account info for blog", blogID);

  get(blogID, function(err, account) {
    if (err) return callback(err);

    // When saving account for the first time,
    // this will be null so we make a fresh object.
    account = account || {};

    // We need to do this to prevent bugs if
    // the user switches from one account ID
    // to another Dropbox account.
    if (
      account.account_id &&
      changes.account_id &&
      account.account_id !== changes.account_id
    ) {
      multi.srem(blogsKey(account.account_id), blogID);
    }

    // Overwrite existing properties with any changes
    for (var i in changes) account[i] = changes[i];

    // Verify that the type of new account state
    // matches the expected types declared in Model below.
    try {
      ensure(account, Model, true);
    } catch (e) {
      return callback(e);
    }

    debug("Saving this account");
    multi.sadd(blogsKey(changes.account_id), blogID);
    multi.hmset(accountKey(blogID), account);
    multi.exec(callback);
  });
}

function drop(blogID, callback) {
  var multi = redis.multi();

  get(blogID, function(err, account) {
    // Deregister this blog from the set containing
    // the blog IDs associated with a particular dropbox.
    if (account && account.account_id)
      multi.srem(blogsKey(account.account_id), blogID);

    // Remove all the dangerous Dropbox account information
    // including the OAUTH token used to interact with
    // Dropbox's API.
    multi.del(accountKey(blogID));
    multi.exec(callback);
  });
}

// Redis Hash which stores the Dropbox account info
function accountKey(blogID) {
  return "blog:" + blogID + ":dropbox:account";
}

// Redis set whoses members are the blog IDs
// connected to this dropbox account.
function blogsKey(account_id) {
  return "clients:dropbox:" + account_id;
}

Model = {
  // Used to identify which blogs need to be updated
  // when we recieve a webhook from Dropbox
  account_id: "string",

  // Used to help the user identify which
  // Dropbox account is connected to which blog.
  email: "string",

  // Used to authenticate Dropbox API requests
  access_token: "string",

  // HTTP status code of an error from the
  // Dropbox API. Will be 0 if sync succeeded
  error_code: "number",

  // Date stamp of the last successful sync
  last_sync: "number",

  // true if Blot has full access to the user's
  // Dropbox folder, false if we only have
  // access to a folder in their Apps folder
  full_access: "boolean",

  // Used to help the user identify which
  // Dropbox account is connected to which blog.
  // We use to more dependable folder_id
  // in calls to /delta and for determining
  // which changes apply to this blog. Root
  // should be an empty string.
  folder: "string",

  // Generated by Dropbox and used to robustly
  // identify a folder even after it has been
  // renamed. Empty string if the user has set
  // the root directory of their Dropbox.
  folder_id: "string",

  // Generated by Dropbox and used to fetch
  // changes which occur after a certain point
  // in time. When the user sets up Dropbox,
  // this is an empty string.
  cursor: "string"
};

module.exports = {
  set: set,
  drop: drop,
  get: get,
  listBlogs: listBlogs
};
