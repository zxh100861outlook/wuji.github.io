## wj1	hello,world

这是一个开始

## wj2  github clone 加速

在平日里在github上看到好玩的项目想clone下来却发现clone速度慢到离谱！

有时甚至只有几十KB每秒这样的速度很容易把我们给气死.

我来帮你解决这个问题.

其实十分简单只需要配置全局替换规则,就像这样.

```bash
git config --global url."填一个镜像站".insteadOf "https://github.com/"
```

哪镜像站该如何获取呢?我推荐几个.

### gh-proxy.org(富哥可以给这位活佛捐点https://gh-proxy.com/donate/)

```
git config --global url."https://gh-proxy.org/https://github.com/".insteadOf "https://github.com/"
```

### Fastly CDN

```
git config --global url."https://cdn.gh-proxy.org/https://github.com/".insteadOf "https://github.com/"
```

### **(链接🔗来源：https://gh-proxy.com/  活佛🐮🍺好用)**

### 注意事项(别人站长给出的注意事项!)

* 本服务仅供学习研究使用
* 请勿滥用，否则可能会被限制访问
* 如果遇到问题，请检查链接格式是否正确
* 建议收藏本站，以便日后使用
* 转换工具会自动更新，无需手动升级
* 选择最适合您网络环境的区域节点
