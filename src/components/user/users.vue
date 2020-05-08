<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图区域-->
        <el-card >
            <!--搜索区域-->
             <el-row :gutter="30" >
                 <el-col :span='10'>    
                    <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="getuserlist">
                        <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button>
                    </el-input>
                 </el-col>
                 <el-col :span='5'>
                     <el-button type='primary' @click="adddialogVisible=true">添加用户</el-button>
                 </el-col>
             </el-row>

             <!--用户列表区域-->
             <el-table :data="userlist" stripe="">  <!--指定表格要渲染的数据源,这里并不是通过v-for循环来实现渲染-->
                 <el-table-column type="index" label="序号"></el-table-column>  <!--加个type=index就能够将该列识别为一个序号列-->
                 <el-table-column label="姓名" prop="username"></el-table-column>
                 <el-table-column label="邮箱" prop="email"></el-table-column>
                 <el-table-column label="电话" prop="mobile"></el-table-column>
                 <el-table-column label="角色" prop="role_name"></el-table-column>
                 <el-table-column label="状态" >
                    <template slot-scope="scope">  <!--作用域插槽会覆盖prop，因此prop可以去掉-->
                        <!--{{scope.row}}-->
                        <el-switch v-model="scope.row.mg_state" @change="userstatechange(scope.row)"></el-switch>
                    </template>

                 </el-table-column>

                 <el-table-column label="操作" width="180">
                     <template slot-scope="scope">
                         <!--修改按钮-->
                         <el-button type="primary" size="mini" icon="el-icon-edit" @click="showeditdialog(scope.row.id)"></el-button>  <!--把该行对应的id传过来-->
                         <!--删除按钮-->
                         <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeuser(scope.row.id)"></el-button>
                         <!--分配角色按钮-->
                         <el-tooltip  effect="dark" content="分配角色" placement="分配角色" :enterable="false">
                            <el-button type="warning" size="mini" icon="el-icon-setting" @click="setrole(scope.row)"></el-button>
                         </el-tooltip>
                         
                     </template>
                     
                 </el-table-column> <!--后端传过来的没有prop，不写-->
             </el-table>

             <!--分页区域-->
             <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryinfo.pagenum" :page-sizes="[1,2,5,10]" :page-size="queryinfo.pagesize"
                layout="total,sizes, prev, pager, next,jumper" :total="total">
             </el-pagination>


        </el-card>

        <!--添加用户对话框-->
        <el-dialog title="添加用户" :visible.sync="adddialogVisible" width="60%" @close='adddialogclosed'>
            <!--内容主体区域-->
            <el-form :model="addform" :rules="addformrules" ref="addformref" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addform.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addform.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addform.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input v-model="addform.phone"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="adddialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="adduser">确 定</el-button>
            </span>
        </el-dialog>

        <!--修改用户对话框-->
        <el-dialog title="修改用户" :visible.sync="editdialogVisible" width="60%" @close="editdialogclosed">
            <!--修改区域-->
            <el-form :model="editform" :rules="editformrules" ref="editformref" label-width="70px" >
                <el-form-item label="用户名" >
                    <el-input v-model="editform.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop='email'>
                    <el-input v-model="editform.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile">
                    <el-input v-model="editform.mobile"></el-input>
                </el-form-item>
            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="edituserinfo">确 定</el-button>  <!--直接让data中的editdialogVisible等于false,对话框显示为false-->
            </span>
        </el-dialog>

        <!--分配角色对话框-->
        <el-dialog title="分配角色" :visible.sync="setroledialogVisible" width="50%" @close="setroledialogclosed">
            <div class="userclient">
                <h3>当前的用户:{{userInfo.username}}</h3>
                <h3>当前角色:{{userInfo.role_name}}</h3>
                <h3>分配新角色:
                    <el-select v-model="selectedroleid" placeholder="请选择">
                        <el-option v-for="item in roleslist" :key="item.id" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </h3>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setroledialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveroleinfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        //验证邮箱规则（需要放在data里面）
        var checkemail=(rule,value,cb)=>{
            const regemail=/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
             if(regemail.test(value)) { return cb() }
             cb(new Error('请输入合法的邮箱'))
        
        }
        //验证手机号规则
        var checkphone=(rule,value,cb)=>{
            const regphone=/^(0|86|17951)?1[3|4|5|7|8][0-9]{9}$/
            if(regphone.test(value)) {return cb()}

            cb(new Error("请输入合法的手机号"))
        }
        return {
            //获取用户列表参数对象
            queryinfo:{
                query:'',//搜索关键字为空
                pagenum:1,
                pagesize:2
            },
            userlist:[],  //保存用户列表
            total:0,
            adddialogVisible:false,  //控制添加用户对话框的显示与隐藏
            addform:{
                username:'',
                password:'',
                email:'',
                phone:''
            }, //添加用户的表单数据
            addformrules:{  //添加表单的验证规则对象
                username:[{required:true,message:'请输入用户名',trigger:'blur'},{min:3,max:10,message:'用户名的长度在3-10个字符之间',trigger:'blur'}],
                password:[{required:true,message:'请输入密码',trigger:'blur'},{min:6,max:18,message:'用户名的长度在6-18个字符之间',trigger:'blur'}],
                email:[{required:true,message:'请输入邮箱',trigger:'blur'},{validator:checkemail,trigger:'blur'}],
                phone:[{required:true,message:'请输入手机号码',trigger:'blur'},{validator:checkphone,trigger:'blur'}]
            },
            editdialogVisible:false,//控制修改用户对话框的布尔值
            editform:{},//用来保存修改的私有数据
            editformrules:{
                email:[{required:true,message:'请输入用户邮箱',trigger:'blur'},{validator:checkemail,trigger:'blur'}],
                mobile:[{required:true,message:'请输入手机号码',trigger:'blur'},{validator:checkphone,trigger:'blur'}]
            },

            //控制分配对话框显示与隐藏
            setroledialogVisible:false,
            //需要备分配角色的用户信息
            userInfo:{},
            //所以角色的数据列表
            roleslist:[],
            //已选中的角色
            selectedroleid:''
        }
    },
    created(){
        this.getuserlist()
    },
    methods:{
        async getuserlist(){
            const {data:res}= await this.$http.get('users',{params:this.queryinfo})//通过解构获取一个对象，不解构的话他会默认返回全部，但是实际应用中并不需要都用到，这里通过解构可以拿到全部中的一个，并对他改名
            if(res.meta.status!==200){
                return this.$message.error('获取用户失败')
            }
            this.userlist=res.data.users
            this.total=res.data.total
            //console.log(res) 
        },
        //监听pagesize改变的事件
        handleSizeChange(newsize){  //重新布置条数
            //console.log(newsize)
            this.queryinfo.pagesize=newsize
            this.getuserlist()  //因为更改了布局，所以的重新调用。
        },
        //监听页码值改变的事件
        handleCurrentChange(newpage){
            //console.log(newpage)
            this.queryinfo.pagenum=newpage
            this.getuserlist()

        },
        //监视switch的更改状态
        async userstatechange(userinfo){
            const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if(res.meta.status!==200){ //操作失败的话
                userinfo.mg_state=!userinfo.mg_state
                return this.$message.error('更改用户状态失败')
            }
            this.$message.success('更新用户状态成功')
        },
        //关闭弹窗时自动清空输入框的内容
        adddialogclosed(){
            this.$refs.addformref.resetFields()
        },
        //表单预校验
        adduser(){
            this.$refs.addformref.validate(async valid=>{
                if(!valid) return;
                //可以发起添加用户的网络请求
                const {data:res}=await this.$http.post('users',this.addform)
                 if(res.meta.status!==201){
                     this.$message.error('添加用户失败！')
                 }
                 this.$message.success('添加用户成功！')
                 //隐藏添加用户的对话框
                 this.adddialogVisible=false
                 //重新获取用户列表
                 this.getuserlist()
            })
        },
        //展示编辑用户的对话框
        async showeditdialog(id){  
            const {data:res}=await this.$http.get('users/'+id)
            if(res.meta.status!==200){
                return this.$message.error('查询失败')
            }
            this.editform=res.data   //每次都会覆盖整个editform的数据
            this.editdialogVisible=true
        },
        editdialogclosed(){  //监听表单框关闭事件。
            this.$refs.editformref.resetFileds()
        },
        edituserinfo(){  //修改用户信息并提交
            this.$refs.editformref.validate(async valid=>{  //进行预校验
               if(!valid) return;
                const {data:res}=await this.$http.put('users/'+ this.editform.id,{email:this.editform.email,mobile:this.editform.mobile})   //发起提交修改请求
                 if(res.meta.status!==200){return this.$message.error('更新用户失败')}  //发送成功，就会得到服务器返回的数据
                 //关闭对话框
                 this.editdialogVisible=false
                 //更新数据列表
                 this.getuserlist()
                 //提示修改成功
                 this.$message.success('更新用户成功')


            })
        },
        async removeuser(id){  //根据id删除用户信息
          const confirmresult =await this.$confirm('是否删除该用户','提示',{  //弹窗比较特别，不需要有一个窗口
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
              
          }).catch(err=>err) //返回错误消息   promise对象都可以用await与async，有一些还需要返回结果，就需要加上then或者catch

            //如果用户确认删除,返回的 confirmresult为confirm,
            //如果用户确认删除，则返回的confirmresult为catch接收err,为
            if (confirmresult !='confirm'){
                return this.$message.info('取消删除')
            }
            const{data:res}= await this.$http.delete('users/'+id)
                if(res.meta.status!==200){
                 return this.$message.error('删除失败')
                }
                this.$message.success('删除成功')
                this.getuserlist()  //记得更新列表
        
        },
        //展示分配角色
        async setrole(userinfo){
            this.userInfo=userinfo
            //在展示对话框时，先获取角色列表
            const {data:res}=await this.$http.get('roles')
            if(res.meta.status!==200){
                return this.$message.error('获取角色列表失败')
            }

            this.roleslist=res.data

            this.setroledialogVisible=true
        },
        async saveroleinfo(){
            if(!this.selectedroleid){
                return this.$message.error('请选择角色')
            }
            const {data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedroleid})
                if(res.meta.status!==200){
                    return this.$message.error('更新用户失败！')
                }
                this.$message.success('分配角色成功')
                this.getuserlist()
                this.setroledialogVisible=false
        },
        //监听分配角色对话框关闭时间
        setroledialogclosed(){
            this.selectedroleid=''
            this.userInfo=''
        }


    }
    
}
</script>
<style lang='less'scoped>

*{
    color:white
}


.el-card{
    background-color:#060638;
    border: none;
    .el-table{
        border-radius: 6px;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .el-pagination{
        vertical-align: middle;
    }
    
}
.userclient h3{
    color: black;
    
}

.el-table-column{
    color:black
}


</style>