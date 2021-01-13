<?php

  /*
    一级分类列表的后端操作
      + 直接操作数据库
      + 获取到有多少种一级分类
  */

  // 准备 sql 语句
  $sql = "SELECT `cat_one_id` FROM `goods` GROUP BY `cat_one_id`";

  $link = mysqli_connect('127.0.0.1', 'root', 'root', 'sdy');
  $res = mysqli_query($link, $sql);
  $data = mysqli_fetch_all($res, MYSQLI_ASSOC);
  mysqli_close($link);

  // 返回给前端结果
  $arr = array(
    "message" => "获取一级列表成功",
    "code" => 1,
    "list" => $data
  );

  echo json_encode($arr);

?>
