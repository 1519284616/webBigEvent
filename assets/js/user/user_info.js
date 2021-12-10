$(function(){
    var layer = layui.layer;
    var form = layui.form;
    initUserInfo();
    
    form.verify({
        // 昵称长度1-6
        nickname:function(value){
            if(value.length>6){
                return '昵称长度必须是1到6个字符'
            }
        }
    })
    
    // 初始化用户基本信息
    function initUserInfo(){
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            // 请求头token配置在baseAPI中实现
            success:function(res){
                
                if(res.status!==0){
                    return layer.msg('获取用户基本信息失败')
                }
                console.log(res.data);
                // 调用form.val快速为表单赋值
                // 第一个参数由lay-filter属性确定
                form.val("form-userInfo", res.data);
            },
            
        })
    }
    // 重置 默认会清空所有数据
    $('#resetForm').on('click',function(e){
        // 阻止清空所有数据的默认事件
        e.preventDefault();
        // 重新调用初始表单的函数，表单回到初始化状态
        initUserInfo();

    })

    // 提交修改 给提交按钮绑定点击事件，还可以给表单绑定提交事件
    /* $('#changeUserInfo').on('click',function(e){
        e.preventDefault();
        // 参数：ID nickname email
        var id = $('#userID').val();
        var nickname = $('[name="nickname"]').val();
        var email = $('[name="email"]').val();
        var changeData = {
            id,nickname,email
        }
        $.ajax({
            method:"POST",
            url:"/my/userinfo",
            data:changeData,
            success:function(res){
                if(res.status!==0){
                    return layer.msg('更新用户信息失败')
                }
                console.log(res);
            }
        })
    }) */
    $('form').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            method:"POST",
            url:"/my/userinfo",
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('更新用户信息失败')
                }
                console.log(res);
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo();
                return layer.msg('更新用户信息成功')
            }
        })
    })
})

/* 错误原因：
    1、getUserInfo应该写在入口函数的外边，因为入口函数是等页面元素加载完毕才执行的，
    如果写在入口函数的内部，就不能讲这个函数挂在到父页面的属性上
    2、接口不一样 */

