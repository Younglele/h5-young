// 入口函数
$(function () {
  

  // 1-1. 点击事件
  $('.register').click(async () => {
    // 1-2. 拿到用户输入的内容
    const username = $('#username').val()
    const password = $('#password').val()
    const nickname = $('#nickname').val()
    // 1-3. 进行验证
    // 非空验证
    if (!username || !password) return alert('请输入账号密码')
    // 正则验证
    if (!/^[a-z0-9]\w{4,11}$/i.test(username) || !/^\w{6,12}$/i.test(password)) return alert('账号或密码不符合规则')

    // 1-4. 提交到后端
    // 什么请求 ? post
    // 参数是什么 ? username 和 password
    // 哪一个方法 ? $.post(地址, 数据, 回调, 解析)
    const { code,nick} = await $.post('./server/register.php', { username, password,nickname}, null, 'json')


    // 1-5. 通过返回的结果来进行操作
    if (!code) return alert('用户名密码错误')

    // 代码能执行到这里, 表示登录成功
    // 存储一个昵称标识符
    setCookie('nickname', nike, 60 * 60 * 24)
    // 获取 sessionStorage 里面的 url 信息, 如果有, 跳转到信息所在的页面
    // 如果没有, 跳转回 首页
    const url = window.sessionStorage.getItem('url')
    // 跳转页面
    window.location.href = `./${ url ? url : 'index' }.html`
  
  })


})
