<template>
<div class="login">
    <div class="loginbox">
        <!--头像区域-->
        <div class="avatarbox">
            <img alt="" src="../assets/img/avator.jpg">
        </div>

        <!--登录表单区域-->
        <el-form  class="loginform" ref='loginformref' :model='loginform' :rules="loginrules"> <!--这个model是该元素的一个属性-->
            <!--用户名输入-->
            <el-form-item  prop='username'>   
                <el-input prefix-icon="iconfont icon-user" v-model="loginform.username"></el-input>
            </el-form-item>
            <!--密码-->
            <el-form-item prop='password'>   <!--prop属性是写在item上而不是写在input上-->
                <el-input prefix-icon="iconfont icon-3702mima" v-model="loginform.password" type="password" ></el-input>
            </el-form-item>
            <!--按钮-->
            <el-form-item class="btns">
                 <el-button type="primary" style="background:transparent" @click="login">登录</el-button>
                  <el-button type="info" style="background:transparent" @click='resetloginform'>重置</el-button>
            </el-form-item>
        </el-form> 

    </div>

</div>

    
</template>

<script>
export default {
    data(){
        return{
            loginform:{
                username:'admin',
                password:'123456'
            },


            //表单验证规则
            loginrules:{
                //验证用户名
                username:[
                            { required: true, message: '请输入登录账号', trigger: 'blur' },
                            { min: 3, max:10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                //验证密码
                password:[
                            { required: true, message: '请输入用户密码', trigger: 'blur' },
                            { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                ]

            }
           
        }
    },
    methods:{
        resetloginform(){
            this.$refs.loginformref.resetFields();

        },
        login(){
            this.$refs.loginformref.validate(async valid=>{
                if(!valid) return;  //如果校验规则不通过，就跳出，不向后台发送请求
                const {data:res}= await this.$http.post('login',this.loginform) //进行类型结构
                
                if(res.meta.status!==200) return this.$message.error('登录失败')
                this.$message.success('登录成功')
                //将获取得到的token保存到sessionstorage中。
                window.sessionStorage.setItem('token',res.data.token);
                //通过编程式导航跳转到后台主页，路由地址是/home
                this.$router.push('/home')
        
            }
            )
        }
    }
    
}
</script>

<style lang="less" scoped>
.login{
    background:url('../assets/img/background.jpg');
    background-repeat: no-repeat;
    background-size: cover; //让背景覆盖整个页面
    height: 100%;
}
.loginbox{
    width: 450px;
    height: 300px;
    background-color: rgba(106, 106, 124, 0.25);
    position: absolute;
    left:50%;
    top:50%;
    
    transform: translate(-50%,-50%);
    border-radius: 20px;
     .avatarbox{  //子元素的样式是覆盖在父元素之上的
         width: 100px;
         height: 100px;
         border:2px solid transparent;
         border-radius: 20px;
         padding: 5px;
         position: absolute;
         left: 50%;
         transform: translate(-50%,-50%);
         
        
        img{
            width: 100%;
            height: 100%;
            border-radius: 20px;
            background-color:#1f1e1e ;
            

        }
    
     
  }
}

el-form-item{
    margin: 0;
    padding: 0;
}

.loginform{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns{
    display: flex;
    justify-content: center;
}

.el-form-item__content {   //修改默认样式
        .el-input{
            /deep/  .el-input__inner{
                     background-color: transparent;
}
        }
}


</style>