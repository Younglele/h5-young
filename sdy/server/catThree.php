<?php

  /*
    获取三级分类列表的逻辑

    1. 获取前端传递来的一级分类内容 和 二级分类内容
      => 请求方式 ? GET
      => 存储位置 ? $_GET

    2. 组装 sql 语句

    3. 操作数据库

    4. 返回结果给前端
  */

  // 1. 获取前端传递来的一级分类内容
  $one = $_GET['cat_one'];
  $two = $_GET['cat_two'];

  // 2. 组装 sql 语句
  $sql = "SELECT `cat_three_id` FROM `goods` WHERE `cat_one_id`='$one' AND `cat_two_id`='$two' GROUP BY `cat_three_id`";

  // 3. 操作数据库
  $link = mysqli_connect('127.0.0.1', 'root', 'root', 'sdy');
  $res = mysqli_query($link, $sql);
  $data = mysqli_fetch_all($res, MYSQLI_ASSOC);
  mysqli_close($link);

  // 4. 返回结果给前端
  $arr = array(
    "message" => "获取三级列表成功",
    "code" => 1,
    "list" => $data
  );

  echo json_encode($arr);


?>
