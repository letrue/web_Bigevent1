$(function () {
    var layer = layui.layer
    var form = layui.form
    artGetList()
    // 获取文章分类列表
    function artGetList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexAdd = null
    // 为添加类别绑定点击事件
    $('#btnGetlei').on('click', function () {
        // 跳出弹出层
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类'
            , content: $('#dialog_add').html(),
            area: ['500px', '250px']
        })
    })
    //通过代理的方式为 form_add 绑定 submit 事件
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！')
                }
                //重新渲染页面
                artGetList()
                layer.msg('新增文章分类成功！')
                layer.close(indexAdd)
            }
        })
    })
    var indexEdit = null
    // 通过代理的方式，将 btn_editor 绑定点击事件 
    $('tbody').on('click', '#btn_editor', function () {
        // 跳出弹出层
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('#dialog_edit').html(),
            area: ['500px', '250px']
        })
        var id = $(this).attr('data-id')
        // 获取id 以后要发 ajax 请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res) 拿到数据进行表单的填充
                form.val('form_edit', res.data)
            }
        })
    })

    //通过代理的方式，将form_edit绑定 submit 事件
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault()
        // 发起 ajax 请求 
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                // 关闭弹出层
                layer.close(indexEdit)
                // 重新渲染页面
                artGetList()
            }
        })
    })
    // 通过代理的方式，为删除按钮绑定点击事件
    $('tbody').on('click', '#btn_del', function () {
        // 获取 id
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类成功！')
                    // 删除成功，关闭弹出层
                    layer.close(index)
                    artGetList()
                }

            })




        });
    })

})