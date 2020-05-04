import Vue from 'vue'
import { Button,Form,FormItem,Input,Message} from 'element-ui'

//全局注册
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message=Message //将message组件挂载到实例原型上，这样所有的都可以用到这个组件