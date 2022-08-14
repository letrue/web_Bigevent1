$(function () {
  $('#link_reg').on('click', function () {
    $('#reg').show()
    $('#login').hide()
  })
  $('#link_login').on('click', function () {
    $('#login').show()
    $('#reg').hide()
  })
  // 从layui 中获取form对象
  var form = layui.form
  // 从layui 中获取layer
  let layer = layui.layer
  // 使用 form.verify() 函数自定义校验规则
  form.verify({
    // 自定义一个pwd 校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

    repwd: function (value) {
      // 我们拿到的是确认密码框的值
      // 需要拿到的是密码框的值
      // 我们进行等值的判断
      // 如果失败，return提示错误消息
      var pwd = $('#upwd').val()
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }
  })

  let data = {
    username: $('#form_reg input[name=username]').val(),
    password: $('#form_reg input[name=password]').val()
  }
  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    //  1.阻止表单默认提交行为
    e.preventDefault()
    //  在发起ajax中的 post 请求
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      layer.msg('注册成功,请登录！')
      // 当注册成功跳转到登录页面 .click()
      $('#link_login').click()
    })

  })

  $('.layui-form').submit(function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/api/login',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登入失败！')
        }
        layer.msg('登入成功！')
        // console.log(res.token)
        // 将登入成功得到的 token 字符串保存到本地localStorage
        localStorage.setItem('token', res.token)
        //跳转到后台主页
        location.href = '/index.html'
      }
    })
  })

})
