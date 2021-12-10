
// 定义一个数组保存刚开始的tr
var articleEleList = $('.article_list');
// 5个tr组成的数组
var articleEleCate = [];
// 定义一个数组，如果符合条件，就push数组,最后显示在页面中得内容在这个数组中
var articleList=[];
for(let i=0;i<articleEleList.length;i++){
    // 获取文章分类的数组
    articleEleCate.push(articleEleList[i])
}
var laypage = layui.laypage;



$(function(){
    renderPage(articleEleCate.length)
    var layer = layui.layer;
    var form = layui.form;
    
    // 统计总共有多少中分类以及每种分类出现了多少次
    // 定义一个对象，将数组元素作为对象的属性名，将出现的次数作为对象的属性值
    var articleCateObj={};
    var articleCateObjList=[];
    // 定义一个数组获取所有分类
    
    var arr = $('.article_cate');

    initCate();
    
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date){
        const dt = new Date(date);
        var y = dt.getFullYear()
        var m = dt.getMonth()+1
        var d = dt.getDate()
        var hh = dt.getHours()
        var mm = dt.getMinutes()
        var ss = dt.getSeconds()
        return y+"-"+addZero(m)+"-"+addZero(d)+" "+addZero(hh)+":"+addZero(mm)+":"+addZero(ss)
    }
    // 定义一个补零的函数
    function addZero(num){
        return num < 10 ? '0'+num : num
    }
    
    
    // 点击筛选按钮时会调用，两个参数 类别和状态
    function initTable(cate,state,curr){
        // 定义一个数组，里面放tr对象
        articleList=[]
        var articleEleArr=[]
        articleEleCate.forEach(ele=>{
            articleEleArr.push({dataId:ele.getAttribute('data-id'),
            title:ele.children[0].innerHTML,
            cate_name:ele.children[1].innerHTML,
            pub_date:ele.children[2].innerHTML,
            state:ele.children[3].innerHTML})
        })
        
        // 遍历数组，如果元素的类别和状态符合条件
        if(cate===''&&state===''){
            articleList=articleEleArr;
        }else if(cate===''&&state!==''){
            articleEleArr.forEach(ele=>{
                // ele是一个对象 ele.selCate是类别，ele.selState是状态
                if(ele.state===state){
                    articleList.push(ele)
                }
            })
        }else if(cate!==''&&state===''){
            articleEleArr.forEach(ele=>{
                // ele是一个对象 ele.selCate是类别，ele.selState是状态
                if(ele.cate_name===cate){
                    articleList.push(ele)
                }
            })
        }else{
            articleEleArr.forEach(ele=>{
                // ele是一个对象 ele.selCate是类别，ele.selState是状态
                if(ele.cate_name===cate&&ele.state===state){
                    articleList.push(ele)
                }
            })
        }
        // 根据curr
        var data={articleList}
        var articleStr = template('article-list',data)
        $('tbody').html(articleStr)
        renderPage(articleEleArr.length)
        
    }

 
    
    // 根据列表获取分类
    function initCate(){
        var articleCate = [];
        for(let i=0;i<arr.length;i++){
            // 获取文章分类的数组
            articleCate.push(arr[i].innerHTML)
        }
        
        // 遍历数组
        articleCate.forEach(ele=>{
            // 判断元素是否在对象中
            if(ele in articleCateObj){
                articleCateObj[ele]++
            }else{
                articleCateObj[ele]=1
            }
        })
        // 将对象的所有属性名放到一个数组里
        
        for(var k in articleCateObj){
            articleCateObjList.push(k)
        }
        var data={articleCateObjList}
        var catesStr = template('tpl-cates',data)
        $('#sel-cate').html(catesStr)
        //因为我们自己的js文件在layui的js文件的后面，所以模板引擎不能被layui的js文件监听到
        // 所以需要调用render方法 重新渲染表单
        form.render()
    }

    //当点击筛选按钮时 为表单绑定提交事件
    $('#form-search').on('submit',function(e){
        e.preventDefault()
        // 获取所有分类下拉框中的值
        var selcate = $('#sel-cate').val();
        // 获取所有状态下拉框中的值
        var selstate = $('#sel-state').val();
        initTable(selcate,selstate)
    })

   

// 定义渲染分页的方法
    function renderPage(total){
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            ,count: total //数据总数
            ,limit:2 //每一页显示几条数据
            ,curr:1 //默认第几页被选中
            ,limits:[2,3,5,10]//定义条目选项条数
            ,layout:['count','limit','prev', 'page', 'next','skip']//顺序决定页面中功能项的顺序
            // 第二个参数first,当jump函数是通过renderPage(total)方法被调用时为true
            // 如果直接点击页码，first为undefined
            ,jump: function(obj, first){
                //obj包含了当前分页的所有参数，比如：
                 //console.log(obj.curr);得到当前页，以便向服务端请求对应页的数据。
                //console.log(obj.limit); 得到每页显示的条数
                // console.log(obj.limit);
                //首次不执行
                if(!first){
                    // 如果是直接点击页码的方式就调用initTable重新渲染页面
                  initTable();
                }
              }
        });
    }

    // 删除文章
    // 为删除按钮绑定点击事件
    $('.btn-delete').on('click',function(){
        layer.confirm('确定删除？', {icon: 3, title:'提示'}, function(index){
            //do something
            
            layer.close(index);
          });   
    })
}) 