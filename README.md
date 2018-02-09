# 开发目录结构

### 启动方式
``` bash
# nodemon bin/www

# install dependencies
npm install

# start at localhost:3000
node www/bin

# with pm2
pm2 start pm2.config.json
```
### 开发规范
- 代码统一缩进两格
- 代码结束必须使用封号
- 详情参见eslint

### 1.目录结构
```
├── server
    ├── bin
    ├── config
    ├── controller
    ├── middleware
    ├── model
    ├── node_modules
    ├── public
    ├── routes
    ├── service
    ├── db/*
    ├── test
    ├── utils
    ├── views
    ├── logs
    ├── app.js
    ├── package.json
```

**目录结构说明**
>==bin/www== 二进制执行文件

>==config/index.js== 存放配置文件

>==routes/**== 路由转发文件

>==controller/**== 控制器，用于解析用户的输入，处理后返回相应的结果

>==service/**== 用于编写业务逻辑层（可复用）

>==middleware/**== 用来存放中间件

>==model/**== 用于存放数据模型

>==public/**== 用于存放静态资源

>==utils/**== 用于存放公共插件

>==views/**== 用于存放渲染模板

>==node_modules/**== 用于存放依赖包

>==test/**== 单元测试

>==app.js== 用于启动时初始化工作

>==db== 数据库

>==package.json== 项目配置文件

**插件说明**

>co 异步流程库 https://github.com/tj/co

>mongoose mongodb ORM https://github.com/Automattic/mongoose

>mongoose-paginate https://github.com/edwardhotchkiss/mongoose-paginate 插件处理，源码不到100行，主要封装了count和find的联查

>log4js 日志插件 https://github.com/log4js-node/log4js-node

>express-validator 参数校验插件 https://github.com/ctavan/express-validator


**日志说明**

>业务日志

```
// 统一通过logger插件打印，输出目录在logs/tastcase-xxxxxxx.log
// 调用方法 getLogger的参数优先设文件路径
const logger = require('log4js').getLogger('controller/user.js');
logger.info('Cheese is Gouda.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');

// output
[2018-01-21T16:15:38.784] [INFO] controller/user.js - Cheese is Gouda.
[2018-01-21T16:15:38.784] [WARN] controller/user.js - Cheese is quite smelly.
[2018-01-21T16:15:38.784] [ERROR] controller/user.js - Cheese is too ripe!
[2018-01-21T16:15:38.784] [FATAL] controller/user.js - Cheese was breeding ground for listeria.
```

>系统日志
```
// 统一使用
console.log()
console.error()
// 由pm2生成日志文件
```

>debug日志
```
// 统一使用debug插件
// 需要通过 DEBUG=wy-testcase:server node www/bin 启动才能显示
// 通过pm2启动需要单独配置
// 此类日志在线上会直接忽略
const debug = require('debug')('wy-testcase:server');
debug('hello world')
```
