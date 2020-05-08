<template>
<div>
    <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图-->
        <el-card>
            <el-row>  <!--行-->
                <el-col> <!--列-->
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!--角色列表-->
            <el-table :data="rolelist" stripe>
                <!--展开列功能-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="item1 in scope.row.children" class="vcenter" :key="item1.id">
                            <!--渲染一级权限-->
                            <el-col :span="5">
                               <el-tag closable @close="removeright(scope.row,item1.id)"> {{item1.authName}}</el-tag>
                            </el-col>
                            <!--渲染二级三级权限-->
                            <el-col :span="19">
                                <!--嵌套放置二级权限-->
                                <el-row  v-for="item2 in item1.children" class="vcenter" :key="item2">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeright(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeright(scope.row,item3.id)">{{item3.authName}}</el-tag> <!--close是el-tag自带的一个方法-->
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                       
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色" prop="roleName"></el-table-column>
                <el-table-column label="描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                        <el-button type="warning" size="mini" icon="el-icon-setting" @click="showsetrightdialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!--分配权限对话框-->
        <el-dialog title="分配权限" :visible.sync="setrightdialogVisible" width="50%" @close="defkeys=[]">
            <!--树形控件-->
            <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defkeys" ref="treeref"></el-tree>

            <span slot="footer" class="dialog-footer">
                <el-button @click="setrightdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotrights">确 定</el-button>
            </span>
        </el-dialog>

</div>
    
</template>

<script>
export default {
    data(){
        return {
            rolelist:[],
            //控制分配权限对话框
            setrightdialogVisible:false,
            rightslist:[],
            treeProps:{
                label:'authName',   //根据el-tree的api文档定义。props是一个有两个树形的对象。一个为label,一个为children
                children:'children'
            },
            defkeys:[],
            roleid:''
        }
    },
    created(){
        this.getroleslist()  //一加载就自动加载权限列表
    },
    methods:{
        async getroleslist(){
            const {data:res}=await this.$http.get('roles')
            if(res.meta.status!==200){
                return this.$message.error('获取用户权限失败')
            }
            this.rolelist=res.data
            
        },
        //删除对应的权限
        async removeright(role,rightid){
            const confirmresult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'}).catch(err=>err)
                if(confirmresult!=='confirm'){
                    return this.$message.info('取消删除')
                }
                const {data:res}=this.$http.delete(`roles/${role.id}/rights/${rightid}`)  //用模板字符串拼接一个动态路由

                if(res.meta.status!==200){
                    return this.$message.error('删除权限失败')
                }

                //this.getroleslist()  //删除成功，刷新列表，但是是全部更新
                role.children=res.data  //这样赋予，可以防止页面的刷新
        },
        async showsetrightdialog(role){
            this.roleid=role.id  //参数虽然只有role，但是里面有id
            //获取所有权限列表
            const{data:res}=await this.$http.get('rights/tree')
            if(res.meta.status!==200){
                return this.$message.error('获取权限失败')
            }

            //获取到的权限数据保存到data中的rightslist
            this.rightslist=res.data
            //递归获取三级节点id
            this.getleafkeys(role,this.defkeys)

            //再打开页面
            this.setrightdialogVisible=true

        },
        //通过递归获取角色下的三级权限,并保存到data中
        getleafkeys(node,arr){
            //不含children也就是说他就是三级权限
            if(!node.children){
                return arr.push(node.id)
            }

            node.children.forEach(item => {
                this.getleafkeys(item,arr)
                
            });
        },

        //点击完成为角色分配权限
        async allotrights(){
            const keys=[  //通过ref获取到正颗树的数据
                ...this.$refs.treeref.getCheckedKeys(),  //getCheckedKeys与getHalfCheckedKeys方法都是elment提供的
                ...this.$refs.treeref.getHalfCheckedKeys()  //...为字符串转化为数组形式
            ]

            const idstr=keys.join(',')
            const{data:res}=await this.$http.post(`roles/${this.roleid}/rights`,{rids:idstr})
            if(res.meta.status!==200){
                return this.$message.error('分配权限失败')

            }

            this.$message.success('分配权限成功')
            this.getroleslist()
            this.setrightdialogVisible=false //关闭窗口
        }
    }
    
}
</script>

<style lang="less" scoped>
.el-tag{
    margin:6px
}

.vcenter{
    display: flex;
    align-items: center ;
}
</style>