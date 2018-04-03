# happy-weapp-template
happy-weapp模板

## 运行步骤

1. 先进入happy-weapp-template目录下，进行```npm install```。
2. ```npm run dev```生成**dist**目录。
3. 打开微信调试工具，然后打开**dist**，就可以看到效果了。
4. 开发完后```npm run build```进行代码压缩，编译等。

## 版本迭代

- 2018.04.03，版本1.0.0，内容包括：
 - 1.模板的生成，项目的输出
 - 2.使用**happy-weapp-loader** 进行.happy的文件进行类似vue文件一样的书写。

- 2018.04.03 版本1.0.1，内容包括：
 - 1.自定义组件支持
 - 2.修改demo
 - 3.引入**manage.js**，以便以后对业务的扩展
 - 4.分开**development**, **production**环境
 - 5.增加happypack来进行线程池打包，优化打包速度