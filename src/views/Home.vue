<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="title">
          微人事
        </div>
        <el-dropdown split-button type="primary" class="userInfo" @command="commandHandler">
          <span class="username">{{user.name}}<img :src="user.userface"/></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px" >
          <el-menu router unique-opened>
            <el-submenu :index="index+''" v-for="(item,index) in routes" v-if="!item.hidden" :key="index">
              <template slot="title">
                <i style="color: #3e8cff;margin-right: 4px" :class="item.iconCls"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item :index="child.path" v-for="(child,indexj) in item.children" :key="indexj">
                {{child.name}}
              </el-menu-item>
            </el-submenu>

          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div v-if="this.$router.currentRoute.path == '/home'" class="mainTitle">
            欢迎来到主页
          </div>
          <router-view class="homeRouterView"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: "Home",
    computed:{
      routes(){
        return this.$store.state.routes;
      }
    },
    data(){
      return {user:JSON.parse(window.sessionStorage.getItem("user"))}
    },
    methods:{
      commandHandler(cmd){
        if(cmd == "logout"){
          this.$confirm('此操作将注销登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.getRequest("/logout");
            window.sessionStorage.removeItem("user");
            this.$store.commit("initRoutes",[])
            this.$router.replace("/");
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消注销'
            });
          });
        }
      }
    }
  }
</script>

<style>
  .homeHeader{
    background: #409EFF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 15px;
    box-sizing: border-box;
  }
  .homeHeader .title{
    font-size: 30px;
    font-family: "Microsoft Sans Serif";
    color: aliceblue;
  }
  .homeHeader .userInfo{
    cursor: pointer;

  }
  .homeHeader img{
    height: 16px;
    width: 16px;
    border-radius: 8px;
    margin-left: 4px;
  }
  .homeHeader .username{
    display: flex;
    align-items: center;
  }

  .mainTitle{
    font-family: "Microsoft YaHei";
    text-align: center;
    font-size: 20px;
    color: #3e8cff;
  }
  .homeRouterView{
    margin-top: 10px;
  }


</style>
