/**
 * Created by hgaoke on 2018/1/18.
 * mongoose client
 */
const mongoose = require('mongoose');
const config = require('../config/index');
const acl = require('acl');
const addAcl = require('../acls/addacl.js');
//设置mongo存储路径
const DB_URL = `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`;

//连接数据库
mongoose.connect(DB_URL, {
  user: config.mongodb.account,
  pass: config.mongodb.pass
});
//连接成功后输出语句
mongoose.connection.on('connected', function(err, db) {
  if (!err) {
    //路由权限控制做准备	
    const nodeAcl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'acl_'));
    addAcl.addACL(nodeAcl);
  }
  console.log('Mongoose connect ' + DB_URL + ' success');
});

//连接异常现实错误原因
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connect Error:' + err);
});

//连接断开后输出语句
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose connect disconnected');
});

//导出mongoose对象
module.exports = mongoose;