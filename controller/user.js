/**
 * 用户controller
 * 登陆/退出/查询
 * author hgaoke
 * 2018/1/10
 */
const ldap = require('../service/ldap');
const logger = require('log4js').getLogger('controller/user.js');
const mongoose = require('../db/mongoClient.js');
const User = mongoose.model('User');
const { jwt_secert } = require('../config/index');
const jwt = require('jsonwebtoken');
module.exports = {
  async login(req, res) {
    try {
      req.checkBody({
        account: {
          notEmpty: true,
          errorMessage: '账号不能为空'
        },
        password: {
          notEmpty: true,
          errorMessage: '密码不能为空'
        }
      });
      const valErrs = req.validationErrors();
      if (valErrs[0]) {
        const msg = valErrs[0].msg;
        return res.status(200).json({
          code: 1,
          msg: msg,
          data: null
        });
      }
      const account = req.body.account;
      const password = req.body.password;
      const state = await ldap.loginAsync({
        account,
        password
      });
      let ldapUser = await ldap.getUserInfoAsync({
        account
      });
      const { uid, givenName, displayName, mail } = ldapUser;
      // 判断该用户是否是首次登陆
      const count = await User.count({ user_uid: uid });
      // 注册ldap用户到系统中
      if (count === 0) {
        const newUser = new User();
        newUser.name = givenName + displayName;
        newUser.user_uid = uid;
        newUser.user_mobile = '';
        newUser.user_email = mail;
        newUser.user_photo = '';
        newUser.password = '123456';
        // newUser.roles = ['admin'];
        await newUser.save();
      }
      const userInfo = await User.findOne({ user_uid: uid });
      const remember_me = 2592000000;
      const token = jwt.sign({
        userInfo
      }, jwt_secert, { expiresIn: 60 * 60 * 24 * 30 });
      res.cookie('userToken', token, { maxAge: remember_me })
      res.json({
        code: 0,
        msg: '登录成功',
        data: {
          token,
          userInfo,
          ldapUser
        }
      });
    } catch (error) {
      logger.error(error);
      res.json({
        code: 1,
        msg: '用户名或密码错误',
        data: null
      });
    }
  },
  logout(req, res) {
    res.cookie('user', '', { maxAge: 0 });
    res.json({
      code: 0,
      msg: '退出成功',
      data: null
    });
  },
  async getuserinfo(req, res) {
    try {
      const _id = req.userInfo._id;
      const user = await User.findOne({ _id });
      res.json({
        code: 0,
        msg: '查询成功',
        data: user
      });
    } catch (err) {
      res.json({
        code: 1,
        msg: '查询失败',
        data: null
      })
    }
  },
  // 只有管理员可以操作
  async remove(req, res) {
    const userId = req.body.id;
    try {
      await User.update({ _id: userId }, { $set: { status: 0 } });
      res.json({
        code: 0,
        msg: '用户删除成功',
        data: userId
      });
    } catch (error) {
      logger.error(error);
      res.json({
        code: 1,
        msg: '用户删除错误',
        data: error.message
      });
    }
  },
  // 更新用户信息, 管理员或者用户自身可以操作
  async update(req, res) {
    try {
      const id = req.userInfo._id;
      const obj = {};
      const { user_mobile, user_email, user_photo, name } = req.body;
      user_mobile && (obj.user_mobile = user_mobile);
      user_email && (obj.user_email = user_email);
      user_photo && (obj.user_photo = user_photo);
      name && (obj.name = name);
      const user = await User.findOneAndUpdate({ _id: id }, { $set: obj });
      res.json({
        code: 0,
        msg: '操作成功',
        data: id
      });
    } catch (err) {
      res.json({
        code: 1,
        msg: '修改失败',
        data: null
      })
    }
  },
  async query(req, res) {
    try {
      var users = await User.find({ status: 1 });
      res.json({
        code: 0,
        msg: '用户查询成功',
        data: users
      });
    } catch (error) {
      logger.error(error);
      res.json({
        code: 1,
        msg: '用户查询错误',
        data: error.message
      });
    }
  },
};