# vue-admin

## 项目介绍

vue, element-ui, springboot 后台管理系统整合方案，UI风格简约雅致，适合快速开发企业级应用。前后端分离项目，前端参考 PanJiaChen 的 [vue-element-ui](https://github.com/PanJiaChen/vue-element-admin/)，后端对接 java 语言的开源项目 [jeecg-boot](https://github.com/zhangdaiscott/jeecg-boot/)。精致版本，目前只包含登陆，用户管理，角色管理，组织机构，菜单管理，数据字典等基础系统功能。

## 为什么造轮子

团队对 jeect-boot 服务端的技术栈比较熟悉，但 jeect-boot 前端工程是基于 ant design vue 组件库搭建的，出于团队规模和开发体验考虑，选择了 element-ui 组件库。又因，个人并没有在网上找到合适的，jeecg-boot 服务端技术栈 + element-ui-vue 前后分离的后台管理系统的整套方案。最重要的一点，vue-element-admin 以及相关的 stars 排名靠前的后台管理系统的 UI 风格，并不受个人青睐，而且某些后台管理系统集成了一些，个人认为对于最小配置来说是 "多余" 的功能或技术，故造此轮子。

## 特色

- Vue全家桶 + Element-UI + Echarts + 权限的最小配置，麻雀虽小，五脏俱全
- UI 风格简约雅致
- 单表CRUD快速开发
- 二次封装表格组件，支持拖拽排序以及表格列的显示/隐藏，并加入浏览器端缓存
- 数据字典下拉及单选组件，自动填充待选项
- 一级菜单支持多种不同的布局，基于良好的路由逻辑
- 手动封装Echarts库，轻量灵活
- 自定义图标面板和选择组件，支持 svg 和 icon-font 图标
- 二次封装树形组件，增加筛选，全选/反选，折叠/展开，关联选择
- 自定义对话框拖拽指令，加入边界处理，防止对话框消失在视口
- 支持多级菜单（有些类似的后台管理可能只支持到二级）
- 菜单支持内部打开和Tab页打开链接

## 项目目录

writing...

## 快速开始

本仓库系前端项目，后端项目请前往 [jeecg-boot](https://github.com/zhangdaiscott/jeecg-boot/) 自行下载。

```bash
# 下载
git clone https://github.com/vvizden/vue-admin

# 安装
npm run init
# or
npm install --registry=https://registry.npm.taobao.org
# or
npm install

# 运行
npm run dev

# 构建
npm run build

# 单测
npm run test:unit

# 代码检查
npm run lint

# svgo
npm run svgo
```
