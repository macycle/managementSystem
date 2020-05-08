import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/users.vue'
Vue.use(VueRouter)

  const routes = [
  {path:'/',redirect:'login'},//让路由重定向到登录组件，让vue.el-icon-app文件显示该页面
  {path:'/login',component:login},
  {path:'/home',component:home,redirect:'/welcome',//home里面还有一个router-view，所以可以设置redirect让他重定向到welcome页面
    children:[{path:'/welcome',component:welcome},//path这里需要加/
              {path:'/users',component:users}
  ],
    
  }]



const router = new VueRouter({
  routes
})

//挂载路由导航守卫

//路由导航守卫是路由的一个方法，用来组织未登陆状态进入需要token 的页面。
//如果去的路径是登录界面，则放行，不是去login的话，（login的绝对路径为localhost:3000/login）,则先获取sessionstorage中的token,
//如果token不存在，也就是没登录，就强行让他放行至login页面
router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next()
  //获取token
  const tokenstr=window.sessionStorage.getItem('token')
  if(!tokenstr)  return next('/login')
  next()  //这个放行函数是控制token存在，而且直接进入home的权限
  
})

export default router
