<?php

  // 1. 接受前端的数据
  $id = $_GET['id'];

  // 2. 组装sql 语句
  $sql = "SELECT * FROM `goods` WHERE `goods_id`=$id";

  // 3. 操作数据库
  $link = mysqli_connect('127.0.0.1', 'root', 'root', 'sdy');
  $res = mysqli_query($link, $sql);
  $data = mysqli_fetch_all($res, MYSQLI_ASSOC);
  mysqli_close($link);

  // 4. 返回结果给前端
  $arr = array(
    "message" => "获取商品信息成功",
    "code" => 1,
    "info" => $data[0]
  );

  echo json_encode($arr);

?>
