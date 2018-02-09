/**
 * 标签模型
 * tag hgaoke
 * 2018/1/23
 */
const mongoose = require('../db/mongoClient.js');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
/**
 * _id 标签主键
 * name 标签名字
 * status 数据状态1正常 0删除
 * first_operator 创建人
 * last_operator 最后操作人
 * create_time 创建时间
 * update_time 更新时间
 */
const TagSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  status: {
    type: Number,
    default: 1
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
  }
}, {
  versionKey: false,
  timestamps: {
    createdAt: 'create_time',
    updatedAt: 'update_time'
  }
});
const Tag = mongoose.model('Tag', TagSchema);

// 标签名字不允许重复
TagSchema.path('name').validate({
  isAsync: true,
  validator: function(value, respond) {
    this.model('Tag').count({ name: value }, function(err, count) {
      if (count > 0) {
        respond(false);
      } else {
        respond(true);
      }
    });
  },
  message: '标签名重复'
});

module.exports = Tag;