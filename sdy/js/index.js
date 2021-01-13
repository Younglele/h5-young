// 入口函数
$(function () {

  $('.ban-list li').click(function(){window.location.href='list.html'})
  $('.like-list li').mouseover(function()
  {
  $(this).children('.like-box').css('display', 'block')
  })
  $('.like-list li').mouseout(function()
  {
  $(this).children('.like-box').css('display', 'none')
  }
  )
  

  // 2. 请求一级分类列表

  /*
    1. 根据登录状态决定用户信息位置显示的内容
      1-1. 获取 cookie 中的 nickname 信息
      1-2. 判断 nickname 信息
        => 如果存在一个用户昵称, 表示登录过
          -> off 标签不显示
          -> on 标签显示
        => 如果不存在用户昵称, 表示没有登录或者登录过期了
          -> off 标签显示
          -> on 标签不显示
  */

  // 1. 根据登录状态决定用户信息位置显示的内容
  // 1-1. 获取用户昵称
  const nickname = getCookie('nickname')

  // 1-2. 条件判断
  if (nickname) {
    // 登录过
    $('.off').addClass('hide')
    $('.on').text(` ${ nickname }`).removeClass('hide')

    // 拿到 lcoalStorage 里面存储的 list 数据
    const list = JSON.parse(window.localStorage.getItem('list')) || []
    $('.cartNum').text(list.length)
  } else {
    // 没有登录过 或者 过期了
    $('.off').removeClass('hide')
    $('.on').addClass('hide')
  }
})

$('.mytb').mouseover(function(){$('.mytb-erji').css('display','block')})
$('.mytb').mouseout(function(){$('.mytb-erji').css('display','none')})

$('.shoucang').mouseover(function(){$('.shoucang-erji').css('display','block')})
$('.shoucang').mouseout(function(){$('.shoucang-erji').css('display','none')})
$('.connect').mouseover(function(){$('.connect-erji').css('display','block')})
$('.connect').mouseout(function(){$('.connect-erji').css('display','none')})

      
var btns= $('#box>ul>li')
var tabs= $('#box>ol>li')
    btns.on('click', function () {
    btns.eq($(this).index()).addClass("active").siblings().removeClass('active')
    tabs.removeClass('active').eq($(this).index()).addClass('active');
          console.log($(this).index())
    })

    const ul = document.querySelector('.shoushou>ul')

    // 1. 给 input 绑定一个 input 事件
    const inp = document.querySelector('.shoushou>input')


    inp.addEventListener(('input'), function () {
   
      // 2. 拿到用户输入的内容
      const text = this.value.trim()
      // 3. 通过动态创建 script 标签的方式来发送请求
      const script = document.createElement('script')
      // 添加 src 属性
      // 原生属性, 直接元素.属性名 = 属性值
      script.src = `https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=1446,33222,33306,33259,33235,32973,33351,33313,33312,33311,33310,33309,33308,33307,33145,22159,33389&wd=${ text }&req=2&csor=4&pwd=aiq&cb=bindHtml&_=1608775410035`
      // 插入到 body 内部
      document.body.appendChild(script)
      // 卸磨杀驴
      // 使用完毕以后偶, 直接删除 script 标签
      // remove() 直接把自己干掉
      script.remove()
    })


    // 4. 准备一个请求回来的函数
    function bindHtml(res) {
           // 4-2. 判断是否有 g 的存在
      if (!res.g) {
        // 表示 g 不存在
        ul.style.display = 'none'
        return
      }

      // 能来到这里, 表示 res.g 存在, 那么就循环遍历 res.g 渲染页面
      let str = ''
      res.g.forEach(item => {
        str += `
          <li>${ item.q }</li>
        `
      })
      // 渲染完毕以后, 插入到 ul 内部
      ul.innerHTML = str
      // 让 ul 显示出来
      ul.style.display = 'block'
    }
    
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