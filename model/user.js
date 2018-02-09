/**
 * 用户模型
 * author 
 * 2018/1/24
 */
/**
 * name 用户名称
 * user_uid 用户uid lodap提供
 * user_mobile 手机号
 * user_email 邮箱
 * user_photo 头像
 * password 用户密码
 * last_ip 最后登录ip
 * last_time 最后登录时间
 */
const mongoose = require('../db/mongoClient.js');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const addAcl = require('../acls/addacl');

const UserSchema = new Schema({
  name:String,
  user_uid:{
    type: String,
    index: true
  },
  user_mobile:String,
  user_email:String,
  user_photo:String,
  password:String,
  roles: {
    type: [String],
    default: "tester"
  },
  status: {
    type: Number,
    default: 1
  },
  last_ip: {
    type: String,
    default: '0.0.0.0'
  },
  last_time: {
    type: Date,
    default: Date.now
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
// uid不允许重复
UserSchema.path('user_uid').validate({
  isAsync: true,
  validator: function(value, respond) {
    this.model('User').count({ user_uid: value }, function(err, count) {
      if (count > 0) {
        respond(false);
      } else {
        respond(true);
      }
    });
  },
  message: '账号重复'
});

UserSchema.post('save', function(doc) {
    var roles = doc.roles;
    if (!roles.length) {
        roles = ['tester'];
    }
    addAcl.nodeAcl.addUserRoles(doc._id.toString(), roles, function(err) {
        // if error handle error 
        // otherwise be happy or double check 
    });
});
const User = mongoose.model('User', UserSchema);

module.exports = User;