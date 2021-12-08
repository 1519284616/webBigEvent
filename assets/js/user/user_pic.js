$(function(){

    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 点击上传的时候手动调用选择文件的点击事件
    $('#upload').on('click',function(){
        $('#uploadPic').click();
    })
    // 监听用户选择头像图片
    $('#uploadPic').on('change',function(e){
        // 通过e拿到用户选择的图片
        var fileList = e.target.files;
        console.log(fileList);
        if(fileList.length===0){
            return layer.msg('请选择照片');
        }
        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 将指定的文件转换为文件的路径
        var newImgURL = URL.createObjectURL(file)
        console.log(newImgURL);
        // 换掉结构中的图片
        $('#image')
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
        // 为确定按钮绑定点击事件，点击后获取剪裁后的图片
        $('#btnUpload').on('click',function(){
            // 将用户裁剪后的图片输出为一张单独的照片
            var dataURL = $('#image')
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 100,
                    height: 100
                })
                .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
                // 掉接口上传到服务器
                $.ajax({
                    method:"POST",
                    url:"/my/update/avatar",
                    data:{
                        avatar:dataURL
                    },
                    success:function(res){
                        if(res.status!==0){
                            return layer.msg('更换头像失败')
                        }
                        layer.msg('更换头像成功')
                        // 上传头像后调用父页面的函数，重新从服务器拿到用户的信息并渲染页面
                        window.parent.getUserInfo();
                    }
                })
            })
            
    })
})