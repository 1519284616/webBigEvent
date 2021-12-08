$(function(){
    var layer = layui.layer;
    var form = layui.form;
    // 密码6-12位，不能有空格
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        //注册判断两次输入密码是否一样
        repwd:function(value){
            if(value !== $('[name="newPwd"]').val()){
                return '两次输入密码不一致'
              }
        },
        // 检查旧密码是否正确
        oldPwd:function(value){
            if(value!==localStorage.getItem('pwd')){
                return '密码不正确';
            }
        }
    })

    
    

    
    $('form').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            method:"POST",
            url:"/my/updatepwd",
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('更新用户信息失败')
                }
                localStorage.setItem('pwd',$('[name="newPwd"]').val())
                return layer.msg('更新密码成功');
               
            }
        })
    })
})