import Vue from 'vue'
import { Button,Form,FormItem,Input,Message,Container,Header,Aside,Main} from 'element-ui'
import {Menu,Submenu,MenuItem} from 'element-ui'




//全局注册
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)


Vue.prototype.$message=Message //将message组件挂载到实例原型上，这样所有的都可以用到这个组件