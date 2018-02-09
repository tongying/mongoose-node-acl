/**
 * 模块模型
 * author hgaoke
 * 2018/1/23
 */
const mongoose = require('../db/mongoClient.js');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
/**
 * _id 模块主键
 * name 模块名称
 * parent_id 父模块id 如果没有则为null
 * tags 模块标签
 * first_operator 创建人
 * last_operator 最后操作人
 * create_time 创建时间
 * update_time 更新时间
 * view_count 模块访问量
 */
const BlockSchema = new Schema({
  name: String,
  status: {
    type: Number,
    default: 1
  },
  parent_id: ObjectId,
  tags: [{ type: ObjectId, ref: 'Tag'}],
  user: {
      type: ObjectId,
      ref: 'User'
  },
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
  },
  view_count: {
    type: Number,
    default: 0
  }
}, {
  versionKey: false,
  timestamps: {
    createdAt: 'create_time',
    updatedAt: 'update_time'
  }
});
const Block = mongoose.model('Block', BlockSchema);
module.exports = Block;