
$(function(){
    var layer = layui.layer;
    var form = layui.form;
    initArticleList();
    // 获取分类的列表
    function initArticleList(){
        $.ajax({
            method:"GET",
            url:"/my/article/cates",
            success:function(res){
                if(res.status!==0){
                    return layer.msg('获取文章列表失败')
                }
                var arr=res.data;
                var data={
                    arr
                }
                var htmlContent = template('tpl',data)
                $('tbody').html(htmlContent);
            }
        })

    }
    
    var indexAdd=null;
    // 点击添加类别
    $('#add-category').on('click',function(){
        indexAdd=layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#addCategory').html()
          });     
            
    })
    
    //添加文章类别 表单时动态生成的 通过代理的形式为表单绑定提交事件
    $('body').on('submit','#addArticleCategory-form',function(e){
        e.preventDefault()
        $.ajax({
            method:"POST",
            url:"/my/article/addcates",
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('添加文章类别失败')
                }
                layer.msg('添加文章类别成功')
                layer.close(indexAdd);
                initArticleList();
            }
        })
    }) 

    var indexEdit = null;
    // 点击编辑弹出一个模态框 事件代理
    $('tbody').on('click','.btn-change',function(e){
        e.preventDefault()
        indexEdit=layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#editCategory').html()
        }); 
        // 拿到id
        var id = $(this).attr('data-id')
      
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
               
                // 将res.data赋值给属性lay-filter为form-edit的表单
                form.val('form-edit', res.data)
            }
          })
    })

    // 点击确认修改 通过代理的形式
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault();

        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data:$(this).serialize(),
            success: function(res) {
                console.log(res);
                if(res.status!==0){
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                // 关闭弹出层
                layer.close(indexEdit)
                initArticleList()

            }
          })
    })
    
    // 删除文章分类
    var indexDelete = null;
    
    $('tbody').on('click','.btn-delete',function(e){
        e.preventDefault()
        console.log("删除");
        var id = $(this).attr('data-id')
        layer.confirm('确定删除吗？', {icon: 3, title:'提示'}, function(index){
            //do something
            
            console.log(id);
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                   if(res.status!==0){
                       return layer.msg('删除文章类别失败')
                   }
                   layer.msg('删除文章类别成功')
                   // 关闭弹出层
                    layer.close(indexEdit)
                    // 刷新文章类别页面
                    initArticleList()
                }
            })
            layer.close(index);
          }); 

    })
    
})