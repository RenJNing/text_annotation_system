### 注意事项

项目中涉及到内部包，需要切换安装源  
_推荐安装 cnpm，然后把 cnpm 的源设置成内部源，这样 cnpm 安装内部项目，npm 安装公共源_

```bash
cnpm set registry http://101.132.127.199:7001
```

## 项目结构

<pre>
public                  // 公共文件 可以放一些第三方字体 样式库等
src
  |-- mock            // mock文件
  |-- components     // 公共组件目录 当业务需要拆分组件的时候，可以在对应的业务文件夹下单独创建一个components文件夹
  |-- models          // 公共model存放位置
    |-- public.js      // 公共model文件 可以多个
  |-- services         // 公共api存放
  |-- pages             // 容器组件
    |-- demo            // 业务容器 相对路由/demo ***不可以有任何大写字母
      |-- index.js      // 业务入口 入口文件只识别index.js 后缀必须是js
      |-- index.less    // 业务样式
      |-- modules       // 业务model目录
        |-- demo.js     // 业务model文件 可以有多个 自动加载
      |-- service       // 业务api目录
        |-- demo.js     // 业务api文件 可以有多个
  |-- utils             // 工具
  |-- global.less       // 样式变量 方法
.eslintignore          // eslint过滤文件清单
.eslintrc.js            // eslint配置
.gitignore
package.json  
README.md  
</pre>

## 准备工作

1.  请使用 vscode 作为开发此项目的 IDE
2.  请安装 ESLint Prettier 插件
3.  请在 vscode 配置文件中添加：

```json
{
  "editor.tabSize": 2,
  "editor.formatOnSave": true
}
```
