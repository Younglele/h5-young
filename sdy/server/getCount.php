<?php


  // 1. 接受前端传递来的数据
  $one = $_GET['cat_one'];
  $two = $_GET['cat_two'];
  $three = $_GET['cat_three'];

  // 2. 组装 sql 语句
  $sql = "SELECT * FROM `goods`";
  // $one 要么是一个 all, 要么是一个 分类名称
  if ($one != 'all') $sql .= " WHERE `cat_one_id`='$one'";
  // $two 要么是一个 all, 要么是一个 分类名称
  if ($two != 'all') $sql .= " AND `cat_two_id`='$two'";
  // $three 要么是一个 all, 要么是一个 分类名称
  if ($three != 'all') $sql .= " AND `cat_three_id`='$three'";

  // 3. 操作数据库查询
  $link = mysqli_connect('127.0.0.1', 'root', 'root', 'sdy');
  $res = mysqli_query($link, $sql);
  $data = mysqli_fetch_all($res, MYSQLI_ASSOC);
  mysqli_close($link);

  // 4. 返回结果给前端
  $arr = array(
    "message" => "获取总数成功",
    "code" => 1,
    "count" => count($data)
  );

  echo json_encode($arr);

?>
