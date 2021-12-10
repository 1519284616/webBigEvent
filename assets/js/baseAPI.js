$.ajaxPrefilter( function( options ) { 
    options.url = 'http://www.liulongbin.top:3007'+options.url; 
    // 统一为用权限的接口设置请求头
    // 判断路径是否有/my这个字符串，如果有这个字符串说明是有权限的接口
    if(options.url.indexOf('/my/')!==-1){
      options.headers={
          Authorization:localStorage.getItem('token') || ""

      }

    
    // 全局配置complete
    options.complete=function(res){
        
        // 返回值中的responseJSON就是服务器响应回来的数据
        // console.log(res.responseJSON);
        // 
        if(res.responseJSON.status===1 && res.responseJSON.message === '身份认证失败！'){
            // 清除本地token
            localStorage.removeItem('token');
            localStorage.removeItem('pwd');
            // 跳转到登录页
            location.href="./login.html"
        }
    }
  }
    
  });
