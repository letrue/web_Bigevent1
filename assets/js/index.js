$(function () {
    // 调用用户的基本信息
    getUserIfon()
    let layer = layui.layer
    // 点击退出 显示退出功能
    $('#btnLogOut').on('click', function (index) {
        // 提示用户是否要退出
        layer.confirm('确认退出登入！', { icon: 3, title: '提示' }, function (index) {
            //do something

            // 1。退出本地存储
            localStorage.removeItem('token')
            // 2.跳转到登入页面
            location.href = './login.html'

            layer.close(index);
        });
    })
})

// 获取用户基本信息
function getUserIfon() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户头像
            renderAvatar(res.data)
        },
        // // 无论成功还是失败，最终都会调用complete回调函数
        // complete: function (res) {
        //     // 在complete 回调函数中，可以使用res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空 token 
        //         localStorage.removeItem('token')
        //         // 2.强制跳转到登入页面
        //         location.href = './login.html'
        //     }
        // }

    })
}
// 渲染用户头像的函数
function renderAvatar(user) {
    // 1.获取用户名称
    var name = user.nickname || user.username
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染的头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img')
            .attr('src', user.user_pic)
            .show()
        $('.text-avatar')
            .hide()
    } else {
        $('.layui-nav-img')
            .hide()
        var first = name[0].toUpperCase()
        $('.text-avatar')
            .html(first)
            .show()
    }
}

