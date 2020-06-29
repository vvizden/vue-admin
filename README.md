# vue-admin

## 项目介绍

后台系统基础架子。参考 PanJiaChen 的 [vue-element-ui](https://github.com/PanJiaChen/vue-element-admin/)，并对接 [jeecg-boot](https://github.com/zhangdaiscott/jeecg-boot/) 的服务端接口。基础版本，目前只包含登陆，用户管理，角色管理，组织机构，菜单管理，数据字典等功能。

## 为什么造轮子

团队对 jeect-boot 服务端的技术栈比较熟悉，但 jeect-boot 前端工程是基于 ant design vue 组件库搭建的，出于团队规模和开发体验考虑，选择了 element-ui 组件库。又因为，个人并没有在网上找到合适的，jeecg-boot 服务端技术栈 + element-ui-vue 前后分离的后台管理系统的整套方案。同时，vue-element-admin 的 UI 风格个人不太喜欢，并且集成了很多我司业务上用不上的技术，并不能贴合业务，开箱即用，故造此轮子。

## 项目目录

writing...

## 快速开始

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
```
