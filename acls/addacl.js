const async = require('async');
const config = require('../config/index');

//超级管理员权限
var adminPermissions = {
    role: 'admin',
    resources: [
        '/user/query',
        '/user/add',
        '/user/delete'
    ],
    permissions: ['*'],
};
//测试人员员权限
var testerPermissions = {
    role: 'tester',
    resources: [
        '/user/query',
        '/user/add'
    ],
    permissions: ['get', 'post'],
};
//开发人员权限
var developerPermissions = {
    role: 'developer',
    resources: [
        '/user/add'
    ],
    permissions: ['get'],
};

var permissions = [
    developerPermissions,
    adminPermissions,
    testerPermissions
];

function addACO(subject, nodeAcl, added) {
    var role = subject.role;
    var resource = subject.resource;
    var permissions = subject.permissions;
    nodeAcl.allow(role, resource, permissions, added);
}


var addAcl = {
    nodeAcl:{},
    addACL: function addACL(nodeAcl) {
            this.nodeAcl = nodeAcl;
            async.each(permissions, function(aco, next) {
                var role = aco.role;
                var resources = aco.resources;
                var permissions = aco.permissions;
                var children = aco.children || null;

                async.each(resources, function(resource, next) {
                    var subject = {
                        role: role,
                        resource: resource.name || resource,
                        permissions: resource.permissions || permissions
                    }
                    addACO(subject, nodeAcl, next);
                }, next);

            }, function(err) {
                console.log(err);
            });
        }
    }
module.exports = addAcl;