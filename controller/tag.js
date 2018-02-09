/**
 * 标签controller
 * 增删改查
 * author hgaoke
 * 2018/1/10
 */
const logger = require('log4js').getLogger('controller/tag.js');
const mongoose = require('../db/mongoClient.js');
const Tag = mongoose.model('Tag');
module.exports = {
  async add (req, res) {
    try {
      // 入参校验待添加
      req.checkBody({
        name: {
          notEmpty: true,
          errorMessage: '标签名不能为空'
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
      var name = req.body.name;
      var operator = {
        id: req.userInfo._id,
        uid: req.userInfo.uid,
        name: req.userInfo.name
      };
      var data = new Tag();
      data.name = name;
      data.first_operator = operator;
      data.last_operator = operator;
      const tag = await data.save();
      res.json({
        code: 0,
        msg: '标签新增成功',
        data: tag
      });
    } catch (error) {
      logger.error(error);
      res.json({
        code: 1,
        msg: '标签新增错误',
        data: error.message
      });
    }
  },
  async remove (req, res) {
    try {
      const tagId = req.body.id;
      await Tag.update({_id: tagId}, {$set: {status: 0}});
      res.json({
        code: 0,
        msg: '标签删除成功',
        data: tagId
      });
    } catch (error) {
      logger.error(error);
      res.json({
        code: 1,
        msg: '标签删除错误',
        data: error.message
      });
    }
  },
  update (req, res) {},
  async query (req, res) {
    try {
      const tags = await Tag.find({status: 1});
      res.json({
        code: 0,
        msg: '标签查询成功',
        data: tags
      });
    } catch (error) {
      logger.error(error);
      res.json({
        code: 1,
        msg: '标签查询错误',
        data: error.message
      });
    }
  }
};