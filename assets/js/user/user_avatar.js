$(function () {
    var layer = layui.layer
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

    // 为上传按钮绑定点击事件
    $('#btnGetFile').on('click', function () {
        $('#file1').click()
    })

    // 为文件绑定 change 事件
    $('#file1').on('change', function (e) {
        // 获取用户选择的文件
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请上传文件！')
        }
        // 1.拿到用户选择的文件
        var file = e.target.files[0]
        // 2.选择文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        // 
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    //为确认按钮绑定点击事件
    $('.layui-btn').on('click', function () {
        // 1.获取裁剪的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        // 发 ajax 请求发送到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('上传文件失败！')
                }
                layer.msg('上传文件成功！')
                window.parent.getUserIfon()
            }
        })
    })
})