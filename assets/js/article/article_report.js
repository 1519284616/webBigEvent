$(function(){
    var layer = layui.layer;
    var form = layui.form;
    articleCates();
    // 初始化富文本编辑器
    initEditor()
    // 定加载文章分类的方法
    function articleCates(){
        $.ajax({
            methos:"GET",
            url:"/my/article/cates",
            success:function(res){
                if(res.status!==0){
                    return layer.msg('获取文章分类失败')
                }
                var htmlStr = template('tpl-cates',res);
                $('[name="cate_id"]').html(htmlStr)
                console.log(res);
                form.render()
            }
        })
    }

      // 1. 初始化图片裁剪器
        var $image = $('#image')
        
        // 2. 裁剪选项
        var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        
        // 3. 初始化裁剪区域
        $image.cropper(options)

        $('#btn-cover-choose').on('click',function(){
            $('#cover-file').click()
            
        })
        // 为文件选择框绑定change事件
        $('#cover-file').on('change',function(e){ 
            // 判断用户是否选择了文件 
            if(e.target.files.length===0){
                return 
            }
            // 拿到用户选择的文件
            var file = e.target.files[0]
           
            // 根据选择的文件，创建一个对应的 URL 地址：
            var newImgURL = URL.createObjectURL(file)
            // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
            $image
                .cropper('destroy')      // 销毁旧的裁剪区域
                .attr('src', newImgURL)  // 重新设置图片路径
                .cropper(options)        // 重新初始化裁剪区域
        })

        // 根据接口文档，定义请求携带的参数 是一个FormData对象
        // 定义文章发布的状态，默认为已发布
        var art_state = "已发布";
        // 当点击存为草稿时
        $('#btnSave2').on('click',function(){
            art_state = "草稿";
        })
        // 为表单绑定提交事件
        $('#form-pub').on('submit',function(e){
            e.preventDefault();
            // 创建一个FormData对象实例
            var fd = new FormData($(this)[0])
            fd.append('state',art_state)
            // 将剪裁好的封面图片输出为一个文件对象
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    // 将文件存储到fd中
                    fd.append('cover_img',blob)
                    fd.forEach((v,i)=>{
                        console.log(i,v);
                    })
                    // 发起请求
                    publishArticle(fd)
                })
            
        })
        // 定义发表文章的函数
        function publishArticle(fd){
            $.ajax({
                method:"POST",
                url:"/my/article/add",
                data:fd,
                // 如果提交的是formData格式的数据必须有以下两个配置项
                contentType:false,
                processData:false,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg('发表文章失败')
                    }
                    layer.msg('文章发布成功')
                    // 发布文章成功后，跳转到文章列表页
                    location.href="article_list.html"
                }
            })
        }
        
})