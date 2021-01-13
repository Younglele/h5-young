$(function () {

  // 1. 准备一个商品列表信息对象
  const list_info = {
    cat_one: 'all',
    cat_two: 'all',
    cat_three: 'all',
    sort: 'id', // id 表示 综合排序, price 表示 价格排序
    sortType: 'ASC',
    current: 1,
    pagesize: 12
  }

  // 2. 请求一级分类列表
  getCatOne()
  async function getCatOne() {
    // 2-1. 请求一级分类列表
    const { list } = await $.get('./server/catOne.php', null, null, 'json')

    // 2-2. 渲染页面
    let str = '<span class="active">全部</span>'
    list.forEach(item => {
      str += `<span>${ item.cat_one_id }</span>`
    })
    $('.cat_one .right').html(str)
  }

  // 3. 一级分类的点击事件
  $('.cat_one .right').on('click', 'span', function () {
    // 3-1. 切换类名
    $(this).addClass('active').siblings().removeClass('active')

    // 3-2. 拿到点击的这个 span 的分类内容
    const cat_one = $(this).text()

    // 3-3. 修改 list_info
    // 因为每一次的切换都要从新请求商品列表
    list_info.cat_one = cat_one
    // 任何一个的修改都应该把二级分类修改为 all
    list_info.cat_two = 'all'
    // 任何一个的修改都应该把三级分类修改为 all
    list_info.cat_three = 'all'
    // 给三级列表回归
    $('.cat_three .right').html('<span class="active">全部</span>')

    // 3-4. 要请求二级列表
    // 条件判断, 如果点击的是全部, 那么不请求二级列表
    // 只有点击的不是全部的时候, 才会请求二级列表
    if (cat_one === '全部') {
      // 点击的全部
      // 给二级列表回归
      $('.cat_two .right').html('<span class="active">全部</span>')
      // 把 list_info 里面的 cat_one 改变成 all
      list_info.cat_one = 'all'
    } else {
      // 请求二级分类列表
      getCatTwo()
    }

    console.group('根据下列信息请求商品列表')
    console.log(list_info)
    console.groupEnd()

    // 每次点击一级分类都要从新执行请求总页数的方法
    getCount()
  })

  // 4. 请求二级分类列表
  async function getCatTwo() {
    // 4-1. 请求数据, 携带参数是 list_info.cat_one
    const { list } = await $.get('./server/catTwo.php', { cat_one: list_info.cat_one }, null, 'json')

    // 4-2. 渲染页面
    let str = '<span class="active">全部</span>'
    list.forEach(item => {
      str += `<span>${ item.cat_two_id }</span>`
    })
    $('.cat_two .right').html(str)
  }

  // 5. 二级分类列表的事件
  $('.cat_two .right').on('click', 'span', function () {
    // 5-1. 切换类名
    $(this).addClass('active').siblings().removeClass('active')

    // 5-2. 拿到分类内容
    const cat_two = $(this).text()

    // 5-3. 修改 list_info
    list_info.cat_two = cat_two
    // 修改 list_info 里面的 cat_three 回归
    list_info.cat_three = 'all'

    // 5-4. 条件判断请求三级分类列表
    if (cat_two === '全部') {
      // 让 list_info 里面的 cat_two === 'all'
      list_info.cat_two = 'all'
      // 让三级列表回归
      $('.cat_three .right').html('<span class="active">全部</span>')
    } else {
      // 请求三级分类列表
      getCatThree()
    }


    console.group('根据下列信息请求商品列表')
    console.log(list_info)
    console.groupEnd()

    // 每次切换二级分类也要从新请求总页数
    getCount()
  })

  // 6. 请求三级分类列表
  async function getCatThree() {
    // 6-1. 发送请求
    const { list } = await $.get('./server/catThree.php', { cat_one: list_info.cat_one, cat_two: list_info.cat_two }, null, 'json')

    // 6-2. 渲染页面
    let str = '<span class="active">全部</span>'
    list.forEach(item => {
      str += `<span>${ item.cat_three_id }</span>`
    })
    $('.cat_three .right').html(str)
  }

  // 7. 三级分类列表的事件
  $('.cat_three .right').on('click', 'span', function () {
    // 7-1. 切换类名
    $(this).addClass('active').siblings().removeClass('active')

    // 7-2. 拿到点击的文本内容
    const cat_three = $(this).text()

    // 7-3. 修改 list_info 里面的 cat_three
    list_info.cat_three = cat_three

    // 7-4. 条件判断
    if (cat_three === '全部') {
      list_info.cat_three = 'all'
    }

    console.group('根据下列信息请求商品列表')
    console.log(list_info)
    console.groupEnd()

    // 每次切换三级分类也要请求总页数
    getCount()
  })

  // 8. 请求总条数
  getCount()
  async function getCount() {
    // 8-1. 发起请求
    const { count } = await $.get('./server/getCount.php', { cat_one: list_info.cat_one, cat_two: list_info.cat_two, cat_three: list_info.cat_three }, null, 'json')

    // 8-2. 渲染分页器
    // 使用 pagination 插件渲染
    // 插件内部是给 .pagination 元素添加的事件
    // 每次执行 new 的时候, 都会给这个元素添加一个事件
    // 当我修改一次分类以后, 就会添加一次事件, 修改多次分类以后, 就会添加多个事件处理函数
    // 只要在 new 之前把该元素的事件解绑
    new Pagination('.pagination', {
      total: count,
      pagesize: 12,
      sizeList: [12, 16, 20, 24],
      first:'首页',
      prev: '前一页',
      next:'下一页',
      last:'尾页',
      jump: '跳转',
      // change 函数传递到 Pagination 内部, 每次页面发生改变的时候都会触发
      // 刚创建好的时候, 触发一回
      // 切换当前页, 会触发一回
      // 切换一页显示多少条的时候, 会触发一回
      /*
        根据我们的需求
          打开页面请求一次商品列表
          切换一二三级分类的时候, 请求商品列表
          切换当前页的时候, 请求商品列表
          切换一页显示多少条的时候, 请求商品列表

        代码执行
          打开页面会执行 getCount() 会 new Pagination(), 触发一回 change
          切换一二三级分类的时候汇之星 getCount(), 触发一回 change
          切换当前第几页的时候, 但是会触发 change
          切换一页显示多少条的时候, 会触发 change

        请求商品列表
          我再 change 回调函数里面请求商品列表
          刚好满足我的四个需求位置请求商品列表
          并且在 change 回调函数内部, 把 listInfo 的 current 和 pagesize 修改了
      */
      change (current, pagesize) {
        // 先把 listInfo 里面的数据修改掉
        list_info.current = current
        list_info.pagesize = pagesize

        // 请求商品列表
        getGoodsList()
      }
    })
  }

  // 9. 请求商品列表
  async function getGoodsList() {
    // 9-1. 请求商品列表
    const { list } = await $.get('./server/goodsList.php', list_info, null, 'json')

    // 9-2. 渲染页面
    let str = ''
    list.forEach(item => {
      const res=parseInt(Math.random()*500)
      str += `
        <li class="thumbnail">
          <img src="${ item.goods_big_logo }" alt="...">
          <div class="caption">
            <h3 data-id="${ item.goods_id }">${ item.goods_name }</h3>
            <p class="price">￥ <span class="text-danger">${ item.goods_price }</span></p>
            <p>
              <a href="javascript:;" class="detail btn btn-danger" role="button">查看详情</a>
              <a href="./cart.html" class="btn btn-warning" role="button">去结算</a>
             <br> <span>月销${res}</spdan>
            </p>
          </div>
        </li>
      `
    })

    // 插入页面
    $('.goodsList ul').html(str)
  
  }

  // 10. 排序方式的切换
  $('.sort_list .right').on('click', 'span', function () {
    // 10-3. 修改排序方式
    // 修改 list_info.sort 之前确定
    if (list_info.sort === this.dataset.sort) {
      list_info.sortType = list_info.sortType === 'ASC' ? 'DESC' : 'ASC'
    } else {
      list_info.sortType = 'ASC'
    }

    console.log('切换排序方式')
    // 10-2. 拿到你点击的这个按钮代表的排序方式
    // 设置给 listInfo 里面的 sort 属性就可以
    list_info.sort = this.dataset.sort

    // 10-4. 还原到第一页
    list_info.current = 1

    // 10-5. 切换类名
    $(this).addClass('active').siblings().removeClass('active')

    // 10-6. 请求列表数据
    getGoodsList()
  })

  // 11. 每一个商品的点击事件
  $('.goodsList ul').on('click', 'h3', function () {
    // 拿到元素身上存储的 id
    // 存储在 sessionStorage 里面的
    window.sessionStorage.setItem('goods_id', this.dataset.id)

    // 跳转页面
    window.location.href = './detail.html'
  })
  

})

$(window).scroll(() => {
  // 拿到浏览器卷去的高度
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop

  // 根据临界值判断, 让 回到顶部 按钮显示和隐藏
  scrollTop >= 300 ? $('.back-top').fadeIn(500) : $('.back-top').fadeOut(500)
})

// 2.
$('.back-top').click(() => {
  // 让页面回到顶部

  $('html, body').animate({ scrollTop: 0 }, 1000)
  
}) 