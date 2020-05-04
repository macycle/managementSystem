<template>
<el-container class="home">  

    <!--侧边栏-->    
  <el-aside width="180px">

      <!--顶部区域-->
      <div class="topbox">
        <div class="avator">
            <img src="../assets/img/galaxy.jpg" alt="">    
        </div>

        <!--管理人员以及退出按钮-->
        <span>admin</span>
        <el-button type="info" @click="logout">退出</el-button>
      </div>


      <!--导航栏-->
        <el-menu background-color="#282b4c" text-color="#fff" active-text-color="#ffd04b">
            <!--一级菜单-->
            <el-submenu index="1">

                <!--一级菜单模板区域-->
                <template slot="title">
                <!--图标区域-->
                <i class="el-icon-location"></i>
                <!--文本区域-->
                <span>导航一</span>
                </template>
 
                <!--二级菜单-->
                <el-menu-item index="1-4-1">

                    <!--二级菜单模板区域-->
                    <template slot="title">
                    <!--图标区域-->
                    <i class="el-icon-location"></i>
                    <!--文本区域-->
                    <span>导航一</span>
                    </template>
                      
                </el-menu-item> 
            </el-submenu>
            
        </el-menu>


      <!--底部版权-->
      <div class="badge">©后台管理系统</div>
        
  </el-aside>
  <el-main>

  </el-main>
</el-container>
  
    
</template>
<script>
export default {
    methods:{
        logout(){
            window.sessionStorage.clear(); //将所有的sessionstorage全部清空
            this.$router.push('/login')
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

        .avator{
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
    .badge{
            position: absolute;
            bottom: 10px;
            font-size: 20px;
            align-self: center;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            font-weight: bold;
        }
}
</style>