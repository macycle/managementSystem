<template>
<div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="showaddcatedialog">添加分类</el-button>
            </el-col>
        </el-row>

        <!--表格-->
        <tree-table class="treetable" :data='catelist' :columns='columns' :selection-type='false' :expand-type='false' show-index border>  <!--标签格式是-，而js格式是驼峰式-->
            <template slot="isok" slot-scope="scope">  <!--作用域插槽的书写方式，必须要用template，slot-scope用来将获取该行的数据,该行的数据叫做scope，-->
                <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>   <!--注意scope的书写方式-->
                <i class="el-icon-error" v-else style="color:red"></i>
            </template>

            <template slot="order" slot-scope="scope">  <!--作用域插槽的书写方式，必须要用template，slot-scope用来将获取该行的数据,该行的数据叫做scope，-->
                <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
                <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
                <el-tag type='warning' size="mini" v-else>三级</el-tag>
            </template>

            <template slot="opt" >
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>

            </template>
        
        </tree-table>  

        <!--分页区域-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryinfo.pagenum" :page-sizes="[3, 5, 7, 10]"
            :page-size="queryinfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
         </el-pagination>


    </el-card>

    <!--添加分类的对话框-->

    <el-dialog title="添加分类" :visible.sync="addcatedialogVisible" width="50%" @close="addcatedialogclosed">
        <!--添加分类表单-->
        <el-form :model="addcateform" :rules="addcateformrules" ref="addcateformref" label-width="100px">   <!--在form中指定验证规则的名词-->
            <!--子级分类-->
            <el-form-item label="分类名称:" prop="cat_name">  <!--在验证框中写入prop，表示要用哪个验证规则-->
                <el-input v-model="addcateform.cat_name"></el-input>
            </el-form-item>
            <!--父级分类-->
            <el-form-item label="父级分类:">  <!--在验证框中写入prop，表示要用哪个验证规则-->
                    <!--options用来设置数据源-->
                    <!--props用来指定配置对象-->
                <el-cascader v-model="selectedkeys" :options="parentcatelist" :props="cascaderprops" expandTrigger='hover'  @change="parentcatechanged" clearable change-on-select></el-cascader>
                
                </el-form-item>
        </el-form>
        
        <span slot="footer" class="dialog-footer">
            <el-button @click="addcatedialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addcate">确 定</el-button>
        </span>
    </el-dialog>

</div>
    
</template>

<script>
export default {
    data(){
        return {
            queryinfo:{  //查询参数，由后台接口确定
                type:3,  //type=3是说默认接受1、2、3级列表
                pagenum:1, //默认显示第一页
                pagesize:5  //一页有五条数据
            },
            catelist:[],//商品列表
            total:0,
            columns:[  //根据table的官方api，在这里指定列的接收形式
             {label:'分类名称',prop:'cat_name'},   //prop用来接收名称，而数据官方文档的名字叫做cat-name
             {label:'是否有效',type:'template',template:'isok'},  //这个是定义该table的作用域插槽的方式,与一般的作用域插槽的定义不同
             {label:'排序',type:'template',template:'order'},
             {label:'操作',type:'template',template:'opt'}
            ],
            addcatedialogVisible:false,
            addcateform:{  //添加分类的表单数据对象
                cat_name:'',  //将要添加的分类的名称
                cat_pid:0, //父分类的id
                cat_level:0 // 默认添加的等级分类为1级分类

            },
            addcateformrules:{
                cate_name:[
                    {required:true,message:'请输入类别',trigger:'blur'}
                ]
            },
            parentcatelist:[], //父级分类数组
            cascaderprops:{  //指定级联选择器的配置对象
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            selectedkeys:[]   //选中的父级分类的id数组
        }
    },
    created(){
        this.getcatelist()//进入该页面自动获取商品
    },
    methods:{
        async getcatelist(){
            const{data:res}=await this.$http.get('categories',{params:this.queryinfo}) //get请求还有一个参数，这个参数是一个对象，用来指示请求的需求
            if(res.meta.status!==200){
                return this.$message.error('获取商品失败')
            }
            this.catelist=res.data.result;  
            this.total=res.data.total;  //总条数
        },
        handleSizeChange(newsize){   //监听pagesize改变
            this.queryinfo.pagesize=newsize
            this.getcatelist() //重新请求
        },
        handleCurrentChange(newpage){  //监听pagenum改变
            this.queryinfo.pagenum=newpage
            this.getcatelist()

        },
        showaddcatedialog(){
            this.getparnetcatelist()  // 先获取父级的数据列表
            this.addcatedialogVisible=true
        },
        async getparnetcatelist(){  //获取父级分类的数据列表
            const{data:res}=await this.$http.get('categories',{params:{type:2}})
                if(res.meta.status!==200){
                    return this.$message.error('获取父级列表失败')
                }

                this.parentcatelist=res.data
        },
        parentcatechanged(){ //当选中发生改变时，立即触发
            //如果selectedkeys数组中的length大于0，证明选中父级分类
            //反之,则说明没有选中父级分类
            if(this.selectedkeys.length>0){
                this.addcateform.cat_pid=this.selectedkeys[this.selectedkeys.length-1]
                this.addcateform.cat_level=this.selectedkeys.length

                return 
            }else{
                this.addcateform.cat_pid=0
                this.addcateform.cat_level=0
            }
        },
        addcate(){
            this.$refs.addcateformref.validate(async valid=>{
                if(!valid) return  //如果预验证失败则跳出
                const{data:res}=await this.$http.post('categories',this.addcateform)

                if(res.meta.status!==201){
                    return this.$message.error('添加分类失败')
                }
                this.$message.success('添加分类成功')
                this.getcatelist()  //把新增加的分类添加到数据库之后，然后再获取数据库的消息
                this.addcatedialogVisible=false
            })
        },
        addcatedialogclosed(){
            this.$refs.addcateformref.resetFields()
            this.selectedkeys=[]
            this.addcateform.cat_pid=0
            this.addcateform.cat_level=0
        }
    }
    
}
</script>

<style lang="less" scoped>
*{
    color :black
}

.treetable{
    margin-top: 15px;
}

</style>