// 注意： 每次调用$.get()和 $.post() $.ajax() 请求
// 会调用 ajaxPrefilter这个函数
$.ajaxPrefilter(function (options) {
  //发起 ajax 请求之前，统一拼接根路径
  options.url = 'http://big-event-api-t.itheima.net' + options.url
  console.log(options.url);
})
