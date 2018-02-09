/**
 * 用例模型
 * author hgaoke
 * 2018/1/23
 */
const mongoose = require('../db/mongoClient.js');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
/**
 * _id 用例主键
 * name 用例名字
 * status 数据状态1正常 0删除
 * result 用例状态 0未执行 1执行中 2执行成功 3执行失败
 * block_id 模块id
 * deps 模块依赖
 * tags 用例标签
 * steps 用例步骤数组
 * first_operator 创建人
 * last_operator 最后操作人
 * create_time 创建时间
 * update_time 更新时间
 */
const CaseSchema = new Schema({
  name: String,
  status: {
    type: Number,
    default: 1
  },
  result: {
    type: Number,
    default: 0
  },
  block_id: ObjectId,
  deps: [{ type: ObjectId, ref: 'Block' }],
  tags: [{ type: ObjectId, ref: 'Tag'}],
  steps: Array,
  first_operator: {
    id: ObjectId,
    uid: String,
    name: String
  },
  last_operator: {
    id: ObjectId,
    uid: String,
    name: String
  },
  create_time: {
    type: Date,
    default: Date.now
  },
  update_time: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false,
  timestamps: {
    createdAt: 'create_time',
    updatedAt: 'update_time'
  }
});
const Case = mongoose.model('Case', CaseSchema);
module.exports = Case;