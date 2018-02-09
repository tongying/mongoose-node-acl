/**
 * ldap 登录封装
 * 张挺
 */
const ldap = require('ldapjs');
const config = require('../config/index');
let client = {};
const LdapPromise = {
  loginAsync(user) {
    client = ldap.createClient({
      url: config.ldap.url
    });
    return new Promise((resolve, reject) => {
      client.bind(`cn=${user.account}, ou=people, dc=guahao-inc, dc=com`, user.password, (err) => {
        if (err) {
          client.unbind();
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  },
  getUserInfoAsync(user) {
    return new Promise((resolve, reject) => {
      client.search(`cn=${user.account}, ou=people, dc=guahao-inc, dc=com`, {}, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        res.on('searchEntry', (entry) => {
          resolve(entry.object);
        });
        res.on('error', (err) => {
          console.error('ldap出错了: ' + err.message);
          reject(err);
        });
        res.on('end', () => {
          client.unbind();
        });
      });
    });
  }
};

module.exports = LdapPromise;
