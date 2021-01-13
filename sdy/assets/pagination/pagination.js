// 分页器业务逻辑和代码
class Pagination {
  constructor (select, options = {}) {
    // options 是使用者传递进来的对象数据类型, 里面包含使用者需要的配置
    // 构造函数体
    // 你写的所有 this.xxx = yyy
    // 都是将来 Pagination 创建出来的实例对象身上的成员
    this.ele = document.querySelector(select)
    // 需要一个表示当前是第几页的属性
    // current: 当前
    this.current = 1
    // 需要一个表示一共多少条数据的属性
    // total: 总数
    // 如果使用者传递了, 使用人家传递的, 如果没有传递, 那么就用默认值
    this.total = options.total || 90
    // 需要一个表示一页显示多少条的属性
    // pagesize: 一页显示多少条
    this.pagesize = options.pagesize || 10
    // 需要一个一共多少页的属性
    // 根据总数据量 和 一页显示多少条 计算出来的
    // totalPage: 总页数
    this.totalPage = Math.ceil(this.total / this.pagesize)
    // 需要一个表示渲染下拉列表的属性
    this.sizeList = options.sizeList || [10, 20, 30, 40]
    // 需要一个表示首页按钮文本的属性
    // 如果使用者传递了内容, 那么我就用用户传递的
    // 如果使用者没有传递, 那么我就用默认值
    this.first = options.first || 'first'
    // 需要一个表示上一页按钮文本的属性
    // prev: previous
    this.prev = options.prev || 'prev'
    // 需要一个表示下一页按钮文本的属性
    this.next = options.next || 'next'
    // 需要一个表示最后一页按钮文本的属性
    this.last = options.last || 'last'
    // 需要一个表示跳转按钮文本的属性
    this.jump = options.jump || 'go'
    // 需要一个每次分页器改变当前页的时候, 触发的函数
    this.change = options.change || function () {}

    // 利用 this 启动启动器
    // this 就是当前实例
    this.init()
  }

  // 直接开启启动器
  // 直接写的所有内容都是原型上的方法
  // 将来 Pagination 的实例都可以调用
  init () {
    this.setHtml()
    this.setEvent()
  }

  // 1. 渲染页面
  setHtml () {
    let str = `
      <select class="sizeList">
    `

    // 根据 this.sizeList 来进行渲染
    this.sizeList.forEach(item => {
      str += `<option value="${ item }">${ item }</option>`
    })

    str += `
      </select>
      <p class="first ${ this.current === 1 ? 'disable' : '' }">${ this.first }</p>
      <p class="prev ${ this.current === 1 ? 'disable' : '' }">${ this.prev }</p>
      <div class="list">
    `

    // 根据总页数去渲染多少个切换页按钮
    // 要自己设置一个临界点: 9
    // 只有 9 个及一下的时候, 才直接渲染
    // 如果是 9 个以上, 那么就需要 ... 出现了
    if (this.totalPage <= 9) {
      for (let i = 1; i <= this.totalPage; i++) {
        str += `<p class="item ${ this.current === i ? 'active' : '' }">${ i }</p>`
      }
    } else {
      // 根据当前页来判断
      // 当前页 <= 3
      if (this.current <= 3) {
        for (let i = 1; i <= 5; i++) {
          str += `<p class="item ${ this.current === i ? 'active' : '' }">${ i }</p>`
        }
        str += `<span>···</span><p class="item">${ this.totalPage }</p>`
      } else if (this.current <= this.totalPage - 2) { // 当前页 <= 倒数第三页
        str += `<span>···</span>`
        for (let i = this.current - 2; i <= this.current + 2; i++) {
          str += `<p class="item ${ this.current === i ? 'active' : '' }">${ i }</p>`
        }
        str += `<span>···</span>`
      } else { // 当前页 > 倒数第三页
        str += `<p class="item">1</p><span>···</span>`
        for (let i = this.totalPage - 4; i <= this.totalPage; i++) {
          str += `<p class="item ${ this.current === i ? 'active' : '' }">${ i }</p>`
        }
      }
    }

    str += `
      </div>
      <p class="next ${ this.current === this.totalPage ? 'disable' : '' }">${ this.next }</p>
      <p class="last ${ this.current === this.totalPage ? 'disable' : '' }">${ this.last }</p>
      <input type="text" value="${ this.current }" class="jumpText">
      <span>/ ${ this.totalPage }</span>
      <button class="jumpBtn">${ this.jump }</button>
    `

    // 把准备好的结构插入到 this.ele 里面
    // 所有内容都是放在范围元素内的
    // this.ele 就是范围元素
    this.ele.innerHTML = str

    // 设置 select 显示的内容是什么
    const select = this.ele.querySelector('select')
    select.value = this.pagesize

    // 每一次当前页改变都要执行 这个 setHtml 函数
    // 调用使用者传递进来的函数
    // 把当前页和一页显示多少条, 给到使用者
    this.change(this.current, this.pagesize)
  }

  // 2. 绑定事件
  setEvent () {
    // 2-1. 点击事件
    //      一大堆点击事件
    //      都是动态渲染的
    //      事件委托, 委托给范围元素 this.ele
    this.ele.onclick = e => {
      // 处理事件对象兼容
      e = e || window.event
      // 处理事件目标兼容
      const target = e.target || e.srcElement

      // 条件判断
      // if (target.className.indexOf('disable') !== -1 || target.className.indexOf('active') !== -1) {
      //   // 表示元素身上有 disable 类名 或者 active
      //   // 就应该什么都不做
      //   return
      // }
      if (target.className.search(/(disable|active)/) !== -1) return

      // 判断按下的是哪一个按钮
      if (target.className.indexOf('first') !== -1) {
        // 表示元素身上有 first 类名
        // console.log('第一页')
        // 只要修改 this.current
        this.current = 1
        this.setHtml()
        return
      }

      // 判断按下的是上一页
      if (target.className.indexOf('prev') !== -1) {
        // console.log('上一页')
        this.current--
        this.setHtml()
        return
      }

      // 判断按下的是下一页
      if (target.className.indexOf('next') !== -1) {
        // console.log('下一页')
        this.current++
        this.setHtml()
        return
      }

      // 判断按下的是最后一页
      if (target.className.indexOf('last') !== -1) {
        // console.log('最后一页')
        this.current = this.totalPage
        this.setHtml()
        return
      }

      // 判断按下的是某一页
      if (target.className.indexOf('item') !== -1) {
        // console.log('某一页')
        // 拿到我点击的这个元素身上写的是第几页
        // 我点击的这个元素是什么 ? target
        this.current = target.innerText - 0
        this.setHtml()
        return
      }

      // 判断按下的是跳转按钮
      if (target.className.indexOf('jumpBtn') !== -1) {
        // 拿到文本框内部输入的内容
        const text = this.ele.querySelector('.jumpText').value.trim()
        // 判断 text
        // 如果是一个 NaN 不跳转
        if (isNaN(text)) return
        // 如果 text 小于第一页
        if (text < 1) return
        // 如果 text 大于最后一页
        if (text > this.totalPage) return

        // 代码能来到这里, 表示你输入的是一个合法的页数
        this.current = text - 0
        this.setHtml()
        return
      }
    }

    // 2-2. 一页显示多少条的切换
    // 因为这个切换关系到一共多少页
    // 还要关系到一共多少数据
    this.ele.onchange = e => {
      // 处理事件对象兼容
      e = e || window.event
      // 处理事件目标兼容
      const target = e.target || e.srcElement

      // 判断发生改变的是 select 标签
      if (target.nodeName === 'SELECT') {
        // 拿到你准备切换成一页显示多少条
        this.pagesize = target.value - 0
        // 一页显示多少条发生变化了, 那么总页数就得改变
        this.totalPage = Math.ceil(this.total / this.pagesize)
        // 把当前页回到第一页
        this.current = 1
        // 从新渲染页面
        this.setHtml()
        return
      }
    }
  }
}


/*
  for (let i = 1; i <= this.totalPage; i++) {
      str += `<p class="item ${ this.current === i ? 'active' : '' }">${ i }</p>`
    }
*/
