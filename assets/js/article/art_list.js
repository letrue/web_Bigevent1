$(function () {
    // 定义时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        let dt = new Date(date)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(ours())
        let mm = padZero(inutes())
        let ss = padZero(econds())

        return y + '-' + m + '-' + d + + hh + ':' + mm + ':' + ss
    }
    // 定义时间补零
    function padZero(n) {
        if (n < 10) {
            return '0' + n
        } else {
            return n
        }
    }

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    //定义一个查询参数的对象，将来请求数据的时候
    // 需要将请求数据对象提交到服务器
    var q = {
        pagenum: 1,// 页码值，默认请求第一页的数据
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章发布的状态
    }
    artGetList()
    initCate()
    // 获取文章列表数据
    function artGetList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 调用模板的函数渲染模板的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页方法
                renderPage(res.total)
            }
        })
    }
    // 初始化文章的分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通知layui 重新渲染表单结构
                form.render()
            }
        })
    }
    //为筛选按钮绑定 submit 事件
    $('#form_search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 为查询字符对象q的对应属性赋值
        q.cate_id = cate_id
        q.state = state
        // 重新渲染表格数据
        artGetList()
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', // 分页容器的 id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            limits: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            //触发 jump 回调有两种方式
            // 1.点击页码的时候，会触发 jump 回调
            // 2.只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为true 证明是方式2触发取得，
                // 否则就是方式1 触发的
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，复制到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                //根据最新的 q 获取对应的数据列表，并渲染表格
                if (!first) {
                    artGetList()
                }
            }
        })

    }

    //   通过代理的方式,为删除绑定单击事件
    $('tbody').on('click', '#layui_del', function () {
        // 获取删除按钮的个数
        var len = $('#layui_del').length
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            var id = $(this).attr('data-id')
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前这一页是否有剩余的数据
                    // 如果没有剩余的数据，则让页码值 -1 之后
                    // 在重新调用  artGetList方法
                    if (len === 1) {  // 页码值最小是1
                        //   如果len 的值等于1 证明删除完毕之后，页面上就没有任何数据
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    artGetList()
                }

            })

            layer.close(index);
        });
    })

})