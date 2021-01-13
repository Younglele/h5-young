<?php

  /*
    登录 后端的逻辑
      1. 接受前端传递的数据
      2. 去数据库查询比对
      3. 根据数据库查询结果给前端返回响应
  */

  // 1. 接受前端传递的数据
  //   什么请求方式 ? post
  //   后端存储在 ? $_POST
  $username = $_POST['username'];
  $password = $_POST['password'];


  // 2. 去数据库查询比对
  // 2-1. 准备 sql 语句
  $sql = "SELECT * FROM `users` WHERE `username`='$username' AND `password`='$password'";
  // 2-2. 连接数据库
  $link = mysqli_connect('127.0.0.1', 'root', 'root', 'sdy');
  // 2-3. 执行 sql 语句
  $res = mysqli_query($link, $sql);
  // 2-4. 解析结果
  $data = mysqli_fetch_all($res, MYSQLI_ASSOC);
  // 2-5. 关闭连接
  mysqli_close($link);

  // 3. 根据数据库查询结果给前端返回响应
  /*
    $data = array(
      [0] => array( "username" => "xxx", "password" => "xxx", "nickname" => "xxx" )
    )

    $data = array()

    通过 $data 的 长度 来判断是不是登录成功了
      长度为 1 表示成功
      长度为 0 表示失败

    php 如何获取数组长度
      count(数组)
  */

  if (count($data)) {
    $arr = array(
      "message" => "登录成功",
      "code" => 1,
      "nickname" => $data[0]['nickname']
    );
  } else {
    $arr = array(
      "message" => "登录失败",
      "code" => 0
    );
  }

  // 返回一个 json 格式字符串
  echo json_encode($arr);

?>
