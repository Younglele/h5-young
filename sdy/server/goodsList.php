<?php

  // 1. 接受前端的数据
  $one = $_GET['cat_one'];
  $two = $_GET['cat_two'];
  $three = $_GET['cat_three'];
  $sort = $_GET['sort'];
  $sortType = $_GET['sortType'];
  $current = $_GET['current'];
  $pagesize = $_GET['pagesize'];

  // 2. 组装 sql 语句
  $sql = "SELECT * FROM `goods`";
  // 2-1. 组装一级分类
  if ($one != 'all') $sql .= " WHERE `cat_one_id`='$one'";
  // 2-2. 组装二级分类
  if ($two != 'all') $sql .= " AND `cat_two_id`='$two'";
  // 2-3. 组装三级分类
  if ($three != 'all') $sql .= " AND `cat_three_id`='$three'";
  // 2-4. 组装排序方式
  // 如果 sort === id, 组装 ORDER BY `goods_id`
  // 如果 sort === price, 组装 ORDER  BY `goods_price`
  $sql .= " ORDER BY `goods_$sort` $sortType";

  // 2-5. 组装分页信息
  //  sql 语法: LIMIT 开始索引((第几页 - 1) * 一页多少条), 多少个($pagesize)
  //  第 1 页, 一页 12 条, 0, 12
  //  第 2 页, 一页 12 条, 12, 12
  //  第 3 页, 一页 20 条, 40, 20
  $start = ($current - 1) * $pagesize;
  $sql .= " LIMIT $start, $pagesize";

  // 3. 操作数据库
  $link = mysqli_connect('127.0.0.1', 'root', 'root', 'sdy');
  $res = mysqli_query($link, $sql);
  $data = mysqli_fetch_all($res, MYSQLI_ASSOC);
  mysqli_close($link);

  // 4. 给前端返回数据
  $arr = array(
    "message" => "获取商品列表成功",
    "code" => 1,
    "list" => $data
  );

  echo json_encode($arr);


?>
