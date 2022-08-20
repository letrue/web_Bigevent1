$(function () {
    var layer = layui.layer
    var form = layui.form
    initCate()
    // 初始化富文本编辑器
    initEditor()
    // 加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/add',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                //调用模板引擎，渲染下拉菜单
                var htmlStr = template('tpl-Pub', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定不要忘记调用 form.render()方法
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

    // 给封面按钮绑定点击事件
    $('#btn_fm').on('click', function () {
        $('#coverFile').click()
    })
    // 为 coverFile 绑定 change 事件
    $('#coverFile').on('change', function (e) {
        var files = e.target.files
        // 判断是否选择了文件
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])

        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 定义文章的发布状态
    var art_state = '已发布'

    // 为发布按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    // 为form表单绑定submit 事件
    $('#form_pub').on('submit', function (e) {
        e.preventDefault()
        // 2基于 form 表单，快速创建一个 formData 对象
        var fd = new FormData($(this)[0])
        // 3.将文章的发布状态存到 fd 中
        fd.append('state', art_state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象存储到 fd 中
                fd.append('cover_img', blob)
                //6.发起 ajax请求
                publishArticle(fd)
            })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器提交的是 FormData 格式的数据，
            // 必须添加一下的两个配置
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                //发布文章成功之后要跳转到文章列表页面
                location.href = "../article/art_list.html"
            }
        })
    }
})