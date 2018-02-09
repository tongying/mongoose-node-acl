const mongoose = require('../db/mongoClient.js');
const User = mongoose.model('User');
const url = require('url');
const addAcl = require('./addacl.js');

function toACLDefinition(subject) {
  var urlParts = subject.split('/');
  var index = 1;
  var corrected = _.map(urlParts, function(part) { // this is a underscore.js/lodash.js method. You may want to include this in your project.      
    if (part.match(/[0-9a-fA-F]{24}/)) { // if there is an unexpected parameterized route, create a default parameter to check
      var param = ':param' + index;
      index++;
      return param;
    } else if (part == ':id([0-9a-fA-F]{24}$)?') { // special case for node-restful routes - node resful routes must be defined as /api/model/:id
      return ":id";
    } else if (part.trim() == '') {} else {
      return part;
    }
  });
  return corrected.join("/");
};

var checkroute = async function(req, res, next) {
  // 管理员放行
  if (req.userInfo.roles.includes('admin')) {
    next();
    return;
  }

  var userId = req.userInfo._id;
  var route = url.parse(req.originalUrl).pathname;
  console.log(userId)
  //console.log('Matches Route:', req.route);
  console.log('Original route:', route);

  //route = toACLDefinition(route).replace(/\/$/, '') || '/';
  console.log('route==' + route);
  //检查权限
  return addAcl.nodeAcl.isAllowed(userId, route, req.method.toLowerCase(), function(err, allow) {
    if (err) {
      //调用出错处理
      return res.send(500, 'Unexpected authorization error');
    }
    if (allow) {
      //用户存在权限就允许通过 
      return next();
    }
    // Check again with the raw path
    return addAcl.nodeAcl.isAllowed(userId, req.path, req.method.toLowerCase(), function(err, allow) {
      if (err) {
        //调用出错
        return res.send(500, 'Unexpected authorization error');
      }
      if (allow) {
        //用户存在权限就允许通过
        return next();
      }
      //用户不存在权限不允许通过
      return res.send(403, 'not allowed,sorry!Forbidden');
    });
  });
};
module.exports = checkroute;