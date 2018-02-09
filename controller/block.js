/**
 * 模块controller
 * 增删改查
 * author hgaoke
 * 2018/1/10
 */
const logger = require('log4js').getLogger('controller/block.js');
const mongoose = require('../db/mongoClient.js');
const Block = mongoose.model('Block');
module.exports = {
  async add (req, res) {
    try {
      req.checkBody({
        name: {
          notEmpty: true,
          errorMessage: '模块名不能为空'
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
      var tags = req.body.tags ? req.body.tags.split(',') : [];
      var operator = {
        id: req.userInfo._id,
        uid: req.userInfo.user_uid,
        name: req.userInfo.name
      };
      var parent_id = req.body.parent_id || null;
      var data = new Block();
      data.name = name;
      data.first_operator = operator;
      data.last_operator = operator;
      data.tags = tags;
      data.parent_id = parent_id;
      const block = await data.save();
      res.json({
        code: 0,
        msg: '模块新增成功',
        data: block
      });
    } catch (error) {
      logger.error(error);
      res.json({
        code: 1,
        msg: '模块新增错误',
        data: error.message
      });
    }
  },
  async remove (req, res) {
    try {
      const blockId = req.body.id;
      await Block.update({_id: blockId}, {$set: {status: 0}});
      res.json({
        code: 0,
        msg: '模块删除成功',
        data: blockId
      });
    } catch (error) {
      logger.error(error);
      res.json({
        code: 1,
        msg: '模块删除错误',
        data: error.message
      });
    }
  },
  update (req, res) {},
  async query (req, res) {
    try {
      const blocks = await Block.find({status: 1}).populate({
        path: 'tags',
        select: {
          first_operator: 0,
          last_operator: 0,
          create_time: 0,
          update_time: 0,
          status: 0
        },
        match: {
          status: 1
        }
      });
      res.json({
        code: 0,
        msg: '模块查询成功',
        data: blocks
      });
    } catch (error) {
      logger.error(error);
      res.json({
        code: 1,
        msg: '模块查询错误',
        data: error.message
      });
    }
  }
};