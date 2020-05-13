import Vue from 'vue'
import { Button,Form,FormItem,Input,Message,Container,Header,Aside,Main} from 'element-ui'
import {Menu,Submenu,MenuItem,Breadcrumb,BreadcrumbItem,Card,Row,Col} from 'element-ui'
import {Table,TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox} from 'element-ui'
import {Tag,Tree,Select,Option,Cascader} from 'element-ui'


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
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)


Vue.prototype.$message=Message //将message组件挂载到实例原型上，这样所有的都可以用到这个组件
Vue.prototype.$confirm=MessageBox.confirm