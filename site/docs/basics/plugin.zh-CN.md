---
title: 插件
order: 9
---

插件机制是我们框架的一大特色。它不但可以保证框架核心的足够精简、稳定、高效，还可以促进业务逻辑的复用，生态圈的形成。有人可能会问了：

- Koa 已经有了中间件的机制，为什么还要插件呢？
- 中间件、插件、应用之间是什么关系，它们之间有什么区别？
- 我该如何使用一个插件？
- 如何编写一个插件？

接下来我们就来逐一讨论。

## 为什么要插件

我们在使用 Koa 中间件过程中发现了下面一些问题：

1. 中间件加载其实是有先后顺序的，但是中间件自身却无法管理这种顺序，只能交给使用者。这样其实非常不友好，一旦顺序不对，结果可能有天壤之别。
2. 中间件的定位是拦截用户请求，并在它前后做一些事情，例如：鉴权、安全检查、访问日志等等。但实际情况是，有些功能是和请求无关的，例如：定时任务、消息订阅、后台逻辑等等。
3. 有些功能包含非常复杂的初始化逻辑，需要在应用启动的时候完成。这显然也不适合放到中间件中去实现。

综上所述，我们需要一套更加强大的机制，来管理、编排那些相对独立的业务逻辑。

### 中间件、插件、应用的关系

一个插件其实就是一个“迷你的应用”，和应用（app）几乎一样：

- 它包含了 [Service](./service.md)、[中间件](./middleware.md)、[配置](./config.md)、[框架扩展](./extend.md)等等。
- 它没有独立的 [Router](./router.md) 和 [Controller](./controller.md)。
- 它没有 `plugin.js`，只能声明和其他插件的依赖，而**不能决定**其他插件的开启与否。

他们的关系是：

- 应用可以直接引入 Koa 的中间件。
- 当遇到上一节提到的场景时，应用需引入插件。
- 插件本身可以包含中间件。
- 多个插件可以包装为一个[上层框架](../advanced/framework.md)。

## 使用插件

插件通常通过 npm 模块的方式进行复用：

```bash
npm i egg-mysql --save
```

**注意：我们推荐通过 `^` 的方式引入依赖，并且强烈不建议锁定版本。**

```json
{
  "dependencies": {
    "egg-mysql": "^3.0.0"
  }
}
```

接着，需要在应用或框架的 `config/plugin.js` 中声明：

```js
// config/plugin.js
// 使用 mysql 插件
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};
```

这样就可以直接使用插件提供的功能：

```js
app.mysql.query(sql, values);
```

### 参数介绍

`plugin.js` 中的每个配置项支持：

- `{Boolean} enable` - 是否开启此插件，默认为 true
- `{String} package` - `npm` 模块名称，通过 `npm` 模块形式引入插件
- `{String} path` - 插件绝对路径，与 package 配置互斥
- `{Array} env` - 只有在指定运行环境才能开启，会覆盖该插件自身 `package.json` 中的配置

### 开启和关闭

在上层框架内置的插件，应用在使用时，可以不配置 package 或者 path，只需指定 enable 即可：

```js
// 对于内置插件，可采用以下简洁方式开启或关闭
exports.onerror = false;
```

### 根据环境配置

同时，我们还支持 `plugin.{env}.js` 的模式，会根据[运行环境](../basics/env.md)加载插件配置。

比如，如果定义了一个只在开发环境使用的插件 `egg-dev`，希望只在本地环境加载，可以将其安装到 `devDependencies` 中。

```js
// npm i egg-dev --save-dev
// package.json
{
  "devDependencies": {
    "egg-dev": "*"
  }
}
```

接下来，在 `plugin.local.js` 中声明：

```js
// config/plugin.local.js
exports.dev = {
  enable: true,
  package: 'egg-dev',
};
```

这样，在生产环境下执行 `npm i --production` 时，就不需要下载 `egg-dev` 包了。

**注意:**

- `plugin.default.js` 不存在
- **只能在应用层使用，框架层请勿使用。**

### package 和 path

- `package` 是 `npm` 方式引入，也是最常见的引入方式
- `path` 是绝对路径引入，例如应用内部提取了一个插件，但尚未发布至 npm；或者是应用自行改写了框架的某些插件
- 关于这两种方式的使用场景，可参见[渐进式开发](../intro/progressive.md)文档。

```js
// config/plugin.js
const path = require('path');
exports.mysql = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-mysql'),
};
```

## 插件配置

插件一般会包含自己的默认配置。应用开发者可以在 `config.default.js` 中覆盖对应的配置：

```js
// config/config.default.js
exports.mysql = {
  client: {
    host: 'mysql.com',
    port: '3306',
    user: 'test_user',
    password: 'test_password',
    database: 'test'
  }
};
```

具体的合并规则可以参见[配置](./config.md)。

## 插件列表

- 框架默认内置了企业级应用[常用的插件](https://eggjs.org/zh-cn/plugins/)：
  - [onerror](https://github.com/eggjs/onerror) 统一异常处理
  - [session](https://github.com/eggjs/session) Session 实现
  - [i18n](https://github.com/eggjs/i18n) 多语言
  - [watcher](https://github.com/eggjs/watcher) 文件和文件夹监控
  - [multipart](https://github.com/eggjs/multipart) 文件流式上传
  - [security](https://github.com/eggjs/security) 安全
  - [development](https://github.com/eggjs/development) 开发环境配置
  - [logrotator](https://github.com/eggjs/logrotator) 日志切分
  - [schedule](https://github.com/eggjs/schedule) 定时任务
  - [static](https://github.com/eggjs/static) 静态服务器
  - [jsonp](https://github.com/eggjs/jsonp) jsonp 支持
  - [view](https://github.com/eggjs/egg-view) 模板引擎
- 更多社区的插件可以在 GitHub 上搜索 [egg-plugin](https://github.com/topics/egg-plugin)。

## 如何开发一个插件

参见文档：[插件开发](../advanced/plugin.md)。
