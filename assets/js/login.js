$(function(){
    // 点击去注册账号
    $('#link-reg').on('click',function(){
        console.log(1);
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 点击去登录
    $('#link-login').on('click',function(){
        $('.reg-box').hide();
        $('.login-box').show();
    })
    var fm = layui.form;
    // 判断输入框是否符合规则 必填功能已内置
    // 密码6-12位，不能有空格
    fm.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        //注册判断两次输入密码是否一样
        repwd:function(value,item){
            if(value !== $('.reg-box [name=password]').val()){
                return '两次输入密码不一致'
              }
        }
    })
    // 引入layer模块，用于弹出提示
    var layer = layui.layer;
    // 监听登录事件
    $('#login-form').on('submit',function(e){
        // 阻止表单提交
        e.preventDefault();
        // 如果符合规则就发起post请求
        var loginData=$('#login-form').serialize();
        $.post('/api/login',loginData,function(res){
            if(res.status===0){
                layer.msg(res.message+"马上跳转到首页...");
                localStorage.setItem('token',res.token);
                localStorage.setItem('pwd',$('[name="password"]').val());
                setTimeout(function(){
                    location.href="./index.html"
                },500)
            }else{
                layer.msg(res.message);
            }
        })
    })
    // 监听注册事件
    $('#reg-form').on('submit',function(e){
        console.log("监听到注册");
        e.preventDefault();
        // 如果符合规则就发起post请求
        var regData=$('#reg-form').serialize();
        $.post('/api/reguser',regData,function(res){
            if(res.status===0){
                layer.msg(res.message+"马上跳转到登录...");
                setTimeout(function(){
                    $('#link-login').click()
                },500)
            }else{
                layer.msg(res.message);
            }
        })
    })
})


