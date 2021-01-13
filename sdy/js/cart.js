// 入口函数

$(function () {
  // 0. 定义一个变量接受 list 数据
  let cart_list = null

  // 1-1. 获取 nickname 信息
  const nickname = getCookie('nickname')

  // 1-2. 判断 nickname 是否存在
  if (!nickname) {
    // 跳转回登录页并且记录一下是哪里回去去
    // 可以记录在 cookie
    // 可以记录在 sessionStorage 里面
    window.sessionStorage.setItem('url', 'cart')
    // 跳转回登录页
    window.location.href = './login.html'
    return
  }

  // 代码能来到这里, 表示登录成功了
  // 2. 渲染购物车的函数
  bindCart()
  function bindCart() {
    // 2-2. 获取 list 数据
    cart_list = JSON.parse(window.localStorage.getItem('list')) || []

    // 2-3. 条件判断
    if (cart_list.length) {
      $('.on').removeClass('hide')
      $('.off').addClass('hide')

      // 有内容的时候渲染
      bindHtml()
    } else {
      $('.on').addClass('hide')
      $('.off').removeClass('hide')
    }
  }

  // 3. 渲染购物车列表
  function bindHtml() {


    // 3-2. 判断全选按钮是不是选中
    const selectAll = cart_list.every(item => item.is_select === 1)

    // 3-3. 计算总件数 和 总价格
    let total = 0
    let totalPrice = 0
    cart_list.forEach(item => {
      // 选中的商品才会叠加
      if (item.is_select === 1) {
        total += item.cart_number
        totalPrice += item.cart_number * item.goods_price
      }
    })

    let str = `
      <div class="panel-heading">
        <p class="selectAll">
          <span>全选:</span>
          <input class="all" type="checkbox" ${ selectAll ? 'checked' : '' }>
          <span class="text">购 物 清 单</span>
        </p>
      </div>
      <div class="panel-body">
        <ul class="goodsList">
    `

    cart_list.forEach(item => {
      const xiaoji = item.goods_price * item.cart_number

      str += `
        <li>
          <div class="select">
            <input data-id="${ item.goods_id }" class="select_item" type="checkbox" ${ item.is_select === 1 ? 'checked' : '' }>
          </div>
          <div class="goodsImg">
            <img src="${ item.goods_small_logo }" alt="">
          </div>
          <div class="goodsDesc">
            <p>${ item.goods_name }</p>
          </div>
          <div class="price">
            ￥ <span class="text-danger">${ item.goods_price }</span>
          </div>
          <div class="count">
            <button class="sub" data-id="${ item.goods_id }">-</button>
            <input type="text" value="${ item.cart_number }">
            <button class="add" data-id="${ item.goods_id }">+</button>
          </div>
          <div class="xiaoji">
            ￥ <span class="text-danger">${ xiaoji.toFixed(2) }</span>
          </div>
          <div class="operate">
            <button data-id="${ item.goods_id }" class="delete_item btn btn-danger">删除</button>
          </div>
        </li>
      `
    })

    str += `
        </ul>
      </div>
      <div class="panel-footer">
        <div class="row buyInfo">
          <p class="col-sm-3 buyNum">
            购买总数量: <span class="text-danger cartNum">${ total }</span> 件商品
          </p>
          <p class="col-sm-3 buyMoney">
            购买总价格: <span class="text-danger total">${ totalPrice.toFixed(2) }</span> 元
          </p>
          <p class="col-sm-4 operate">
            <button class="btn btn-success" ${ totalPrice === 0 ? 'disabled' : '' }>立即付款</button>
            <button class="btn btn-danger clear">清空购物车</button>
            <button class="btn btn-primary list">继续购物</button>
          </p>
        </div>
      </div>
    `

    // 渲染页面
    $('.content .panel').html(str)
  }

  // 4. 各种事件
  // 4-1. 每一个选项的选中事件
  $('.content .panel').on('click', '.select_item', function () {
    // 拿到元素身上记录的 id
    const id = this.dataset.id - 0

    // 拿到自己的选中状态是什么
    const type = this.checked

    // 在 cart_list 里面找到对应的数据
    const res = cart_list.filter(item => item.goods_id == id)[0]

    // 修改制定数据的 is_select
    res.is_select = type - 0

    // 更新 localStorage 里面找到对应的数据
    window.localStorage.setItem('list', JSON.stringify(cart_list))

    // 从新渲染页面
    bindCart()
  })

  // 4-2. 每一个商品的数量增加
  $('.content .panel').on('click', '.add', function () {
    // 拿到 id
    const id = this.dataset.id - 0

    // 在 cart_list 里面找到数据
    const res = cart_list.filter(item => item.goods_id == id)[0]

    // 把 res 里面的数据修改
    res.cart_number >= res.goods_number ? '' : res.cart_number++

    // 同步 localStorage 里面的数据
    window.localStorage.setItem('list', JSON.stringify(cart_list))

    // 从新渲染页面
    bindCart()
  })

  // 4-3. 每一项的数量减少
  $('.content .panel').on('click', '.sub', function () {
    // 拿到 id
    const id = this.dataset.id - 0

    // 在 cart_list 里面找到数据
    const res = cart_list.filter(item => item.goods_id == id)[0]

    // 把 res 里面的数据修改
    res.cart_number <= 1 ? '' : res.cart_number--

    // 同步 localStorage 里面的数据
    window.localStorage.setItem('list', JSON.stringify(cart_list))

    // 从新渲染页面
    bindCart()
  })

  // 4-4. 每一项的删除操作
  $('.content .panel').on('click', '.delete_item', function () {
    // 拿到 id
    const id = this.dataset.id - 0

    // 从数组中删除一条
    for (let i = 0; i < cart_list.length; i++) {
      if (cart_list[i].goods_id == id) {
        cart_list.splice(i, 1)
        break
      }
    }

    // 同步 localStorage 里面的数据
    window.localStorage.setItem('list', JSON.stringify(cart_list))

    // 从新渲染页面
    bindCart()
  })

  // 4-5. 全选按钮
  $('.content .panel').on('click', '.all', function () {
    // 直接遍历 cart_list
    cart_list.forEach(item => {
      item.is_select = this.checked - 0
    })

    // 同步 localStorage 里面的数据
    window.localStorage.setItem('list', JSON.stringify(cart_list))

    // 从新渲染页面
    bindCart()
  })

  // 4-6. 清空购物车
  $('.content .panel').on('click', '.clear', function () {
    // 把 cart_list 变成空
    cart_list = []

    // 同步 localStorage 里面的数据
    window.localStorage.setItem('list', JSON.stringify(cart_list))

    // 从新渲染页面
    bindCart()
  })
  $('.content .panel').on('click', '.list', function () {
    
    window.location.href = './list.html'
  })


})


