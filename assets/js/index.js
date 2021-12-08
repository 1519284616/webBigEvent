$(function(){
    
    // 调用函数获取用户的基本信息
    getUserInfo();
    
    $('#logOut').on('click',function(){
        console.log(1);
        layer.confirm('确定退出登录？', {icon: 3, title:'提示'}, function(index){
            //do something
            // 1、清空本地存储中的token
            localStorage.removeItem('token');
            localStorage.removeItem('pwd');
            // 2、跳转到登录页
            location.href="./login.html";
            layer.close(index);
          });
    })
    
})
var layer = layui.layer;

// 获取用户的基本信息
function getUserInfo(){
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        // 请求头配置对象
        /* headers:{
            Authorization:localStorage.getItem('token') || ""
        }, */
        success:function(res){
            if(res.status!==0){
                return layer.msg('获取用户信息失败')
            }
            // 调用函数渲染头像
            renderAvatar(res.data);
        },
        
    })
}
// 渲染用户头像,将用户信息传递给这个函数
function renderAvatar(user){
    // 欢迎后面的名字
    // 如果用户有昵称就渲染昵称，如果没有就渲染用户名
    var welcomeName = user.nickname||user.username;
    $('#welcome-name').html(welcomeName)
    // 判断用户有没有头像图片
    if(user.user_pic===null){
        // 用户没有头像图片,渲染文本头像
        var namePic = welcomeName[0].toUpperCase();
        $('.text-avatar').html(namePic);
        $('.layui-nav-img').hide();
    }else{
        // 渲染图片头像
        $('.text-avatar').hide();
        $('.layui-nav-img').show();
        $('.layui-nav-img').attr('src',user.user_pic).show();
    }
    // 等渲染好内容再显示到页面上
    $('.userinfo').show();
}