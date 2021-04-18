<template>
    <div>
        <el-form :rules="rules" ref="loginForm" :model="loginForm" class="loginForm">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text" v-model="loginForm.username" autofocus placeholder="请输入用户名" auto-complete="false"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password"  placeholder="请输入密码" auto-complete="false"></el-input>
            </el-form-item>
            <el-checkbox class="loginRemeberMe" v-model="checkd"></el-checkbox>
            <el-form-item>
                <el-button type="primary" style="width: 100%" @click="loginSubmit" >登录</el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
            return{
                loginForm:{
                    username:'admin',
                    password:'123'
                },
                checkd:true,
                rules:{
                    username:[{required:true,message:'请输入用户名',trigger:'blur'}],
                    password:[{required:true,message:'请输入密码',trigger:'blur'}]
                }
            }
        },methods:{
            loginSubmit:function () {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.postKeyValueRequest('/doLogin',this.loginForm).then(resp=>{
                          if(resp){
                            window.sessionStorage.setItem('user',JSON.stringify(resp.obj));
                            var redirectPath = this.$route.query.redirect;
                            if(redirectPath==undefined || redirectPath == '/'){
                              redirectPath = '/home';
                            }
                            this.$router.replace(redirectPath);
                          }
                        });
                    } else {
                        this.$message.error("请修改登录信息");
                        return false;
                    }
                });
            }
        }

    }
</script>

<style scoped>
    .loginForm{
        border: 1px solid #3e8cff;
        border-radius: 15px;
        background-clip: padding-box;
        width: 350px;
        margin: 180px auto;
        padding: 25px 25px 15px 25px;
        background: #FFF;
        box-shadow: 0 0 25px rgba(139, 228, 255, 0.62);
    }
    .loginTitle{
        text-align: center;
        font-size: 2rem;
        margin: 15px;
        color: rgba(62, 140, 255, 0.83);
    }
    .loginRemeberMe{
        text-align: left;
        margin: 0px auto 10px auto;
    }
</style>
