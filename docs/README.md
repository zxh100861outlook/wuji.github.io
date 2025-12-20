## wj1	hello,world

这是第一篇文章

hello,world

## wj2	c语言

导入标准输入输出库

```c
#include <stdio.h>
```

写下整个程序入口main将它归为int并加入void参数

> [!NOTE]
>
> int是整数的意思,void参数指的是无参数

```c
int main(void) {}
```

然后在这个入口中加入printf和return就可以了

> [!NOTE]
>
> printf表打印的意思,return表返回在后面加个0表示程序执行完了

```c
printf("hello,world");
return 0;
```

这样就得到一个野生的hello,world

```c
#include <stdio.h>

int main(void) {
printf("hello,world");
return 0;
}
```

编译后输出

```shell
hello,world
```

