# system

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



### 修改element默认样式

首先在浏览器中找到要修改的元素的最顶级类，然后依次写入，并且需要添加 /deep/进行说明
 
            .el-form-item__content {   //修改默认样式
                    .el-input{
                        /deep/  .el-input__inner{
                                background-color: transparent;
            }
                    }
            }

### 通过增加行内样式覆盖已有样式

直接在指定的元素中添加行内样式

