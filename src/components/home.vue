<template>
<el-container class="home">  

    <!--侧边栏-->    
  <el-aside :width="iscollapse?'64px':'180px'">

      <!--顶部区域-->
      <div class="topbox" style="visibility:">
        <div :class="iscollapse?'avator2':'avator1'" >
            <img src="../assets/img/galaxy.jpg" alt="">    
        </div>

        <!--管理人员以及退出按钮-->
        <span>admin</span>
        <el-button :type="iscollapse?'danger':'primary'" size="small" @click="logout">退出</el-button>
      </div>


      <!--导航栏-->
        <el-menu background-color="#282b4c" text-color="#fff" active-text-color="#409eff" :unique-opened="true" :router="true" :collapse="iscollapse" :collapse-transition="false" :default-active="this.$route.path"><!--默认活动路径为当前点开路径，path没有放在params中-->
            <!--一级菜单-->
            <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id"> <!--为每一个一级列表绑定一个唯一的值，让他实现独立控制，由于index默认只接收字符串，所以后面加上一个空字符串，让他的结果变为一个字符串-->

                <!--一级菜单模板区域-->
                <template slot="title">
                <!--图标区域-->
                <i :class="iconsobj[item.id]"></i>
                <!--文本区域-->
                <span>{{item.authName}}</span>
                </template>
 
                <!--二级菜单-->
                <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id">

                    <!--二级菜单模板区域-->
                    <template slot="title">
                    <!--图标区域-->
                    <i class="el-icon-s-grid"></i>
                    <!--文本区域-->
                    <span>{{subitem.authName}}</span>
                    </template>
                      
                </el-menu-item> 
            </el-submenu>
            
        </el-menu>


      <!--底部版权-->
      <div :class="iscollapse?'badge2':'badge1'">©后台管理系统</div>
      <div :class="iscollapse?'togglebuttom2':'togglebuttom1'" @click="togglecollapse">|||</div>
      
  </el-aside>
  <el-main>
      <!--放一个路由占位符-->
      <div class="mainbg">
      <router-view></router-view>
      </div>

  </el-main>
</el-container>
  
    
</template>
<script>
export default {
    data(){
        return {
            iscollapse:true,
            menulist:[],
            iconsobj:{
                '125':'iconfont icon-user',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao'
            },
            
            

        }
    },
    created(){
        this.getmenulist()
    },
    methods:{
        logout(){
            window.sessionStorage.clear(); //将所有的sessionstorage全部清空
            this.$router.push('/login')
        },
          //通过异步函数获取回调数据
        async getmenulist(){//左侧菜单获取
            //解构
            const{data:res}=await this.$http.get('menus')
            if(res.meta.status!==200) return this.$message.err(res.meta.msg)
            this.menulist=res.data

        },
        togglecollapse(){
            this.iscollapse=!this.iscollapse
            
        }
        
        

    }
    
}
</script>

<style lang="less" scoped>


.el-aside{
    background-color:#282b4c;
    
}
.el-main{
    background-color:#191b32;
}

.home{
    height: 100%;
    .topbox{
        display: flex;
        flex-direction: column;
        height: 200px;
        border-bottom: 2px double rgba(0, 0, 0, 0.205);
        

        .avator1{
            width: 100px;
            height: 100px;
            border: 3px solid #191b32;
            border-radius: 50%;
            overflow: hidden;
            position: absolute;
            top: 10px;
            align-self: center;
                img{
                    width: 100px;
                    height: 100px;
                }
        }
        .avator2{
            width: 60px;
            height: 60px;
            border-radius: 10px;
            overflow: hidden;
            position: absolute;
            top: 30px;
            align-self: center;
            img{
                    width: 60px;
                    height: 60px;
                }
        }



        span{
            position: absolute;
            top: 120px;
            align-self: center;
            color: white;
            font-weight: blod;

        }
        .el-button{
            position: absolute;
            top: 150px;
            align-self: center;
        }
        
        
    
    }
    .badge1{
            position: absolute;
            bottom: 25px;
            font-size: 25px;
            align-self: center;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            font-weight: bold;
        }
    .badge2{
        visibility: hidden;
    }
}

    
.iconfont {
    margin-right: 10px;
}
.el-menu{
    overflow: hidden;
    border-right: none;
}

.togglebuttom1{
    background-color: #4a5064;
    font-size: 10px;
    color:white;
    text-align: center;
    position: absolute;
    bottom: 5px;
    width: 180px;
    letter-spacing: 3px;
    cursor: pointer;
}

.togglebuttom2{
    background-color: #4a5064;
    font-size: 10px;
    color:white;
    text-align: center;
    position: absolute;
    bottom: 5px;
    width: 64px;
    letter-spacing:3 px;
    cursor: pointer;

}

.mainbg{
    width:100%;
    height: 100%;
    border-radius: 20px;
    padding: 10px;
    background-color:#010028;
    }
</style>