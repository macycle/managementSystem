<template>
<div>
  <el-button type="info" @click="logout">退出</el-button>
</div>
    
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

</style>