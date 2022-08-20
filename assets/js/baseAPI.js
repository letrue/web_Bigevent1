// 注意： 每次调用$.get()和 $.post() $.ajax() 请求
// 会调用 ajaxPrefilter这个函数
$.ajaxPrefilter(function (options) {
  //发起 ajax 请求之前，统一拼接根路径
  options.url = 'http://big-event-api-t.itheima.net' + options.url

  // 统一为有权限的接口，设置headers 请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  options.complete = function (res) {
    // console.log('执行了 complete 回调：')
    // console.log(res)
    // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据

    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 1. 强制清空 token
      localStorage.removeItem('token')
      // 2. 强制跳转到登录页面
      location.href = './login.html'
    }
  }
})

