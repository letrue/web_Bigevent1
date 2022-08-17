// 注意： 每次调用$.get()和 $.post() $.ajax() 请求
// 会调用 ajaxPrefilter这个函数
$.ajaxPrefilter(function (options) {
  //发起 ajax 请求之前，统一拼接根路径
  options.url = 'http://big-event-api-t.itheima.net' + options.url
  console.log(options.url);
  // 统一为有权限的接口，设置headers 请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      headers: {
        Authorization: localStorage.getItem('token') || ''
      }
    }
  }
  // 统一挂载 complete 回调函数
  // 无论成功还是失败，最终都会调用complete回调函数
  options.complete = function (res) {
    // 在complete 回调函数中，可以使用res.responseJSON 拿到服务器响应回来的数据
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 1.强制清空 token 
      localStorage.removeItem('token')
      // 2.强制跳转到登入页面
      location.href = './login.html'
    }
  }
})
