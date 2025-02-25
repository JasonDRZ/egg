---
title: Tutorials
nav:
  title: Tutorials
  order: 2
---

- [Quick Start](./intro/quickstart.md)
- [Progressive Development](./intro/progressive.md)
- [RESTful API](./tutorials/restful.md)

## Boilerplate Type Description

You can use boilerplate type like this:

```bash
$ npm init egg --type=simple
```

### Options

| boilerplate type |                Description |
| :--------------: | -------------------------: |
|      simple      | Simple egg app boilerplate |
|      empty       |  Empty egg app boilerplate |
|      plugin      |     egg plugin boilerplate |
|    framework     |  egg framework boilerplate |

## Template Engines

Build in [egg-view] as template engine solution and support multiple render, which is called by plugin but keeping the consistent render API. Refer to [how to use templates](./core/view.md)，More details on [template plugin development](./advanced/view-plugin.md).

Template engines available as shown below. For more template engines [searching](https://github.com/search?utf8=%E2%9C%93&q=topic%3Aegg-view&type=Repositories&ref=searchresults)

- [egg-view-nunjucks]
- [egg-view-ejs]
- [egg-view-handlebars]
- [egg-view-pug]
- [egg-view-xtpl]

## Databases

Official maintained ORM model is [egg-orm] base on [Leoric], and the following database plugins are currently available:

- [egg-orm]
- [egg-sequelize]
- [egg-mongoose]
- [egg-mysql]，refer to [MySQL tutorials](./tutorials/mysql.md)
- [egg-graphql]

[egg-sequelize]: https://github.com/eggjs/egg-sequelize
[egg-mongoose]: https://github.com/eggjs/egg-mongoose
[egg-mysql]: https://github.com/eggjs/egg-mysql
[egg-view]: https://github.com/eggjs/view
[egg-view-nunjucks]: https://github.com/eggjs/egg-view-nunjucks
[egg-view-ejs]: https://github.com/eggjs/egg-view-ejs
[egg-view-handlebars]: https://github.com/eggjs/egg-view-handlebars
[egg-view-pug]: https://github.com/chrisyip/egg-view-pug
[egg-view-xtpl]: https://github.com/eggjs/egg-view-xtpl
[egg-orm]: https://github.com/eggjs/egg-orm/blob/master/Readme.md
[Leoric]: https://leoric.js.org
