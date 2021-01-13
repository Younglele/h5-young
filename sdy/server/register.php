
<?php
    header("content-type:text/html;charset=utf-8");
    //注册
    //第一步 ： 接受客户端提交的数据
    $username = $_POST['username'];
    $password = $_POST['password'];
    $nickname = $_POST['nickname'];
    //第二步 ： 处理数据  操作mysql
    //1、连接数据源(登录mysql服务器)   mysql_connect();  返回连接的数据源
    $db = mysql_connect("localhost","root","root");
    
    //2、选择数据库 mysql_select_db( 数据库名 , 数据源 )
    mysql_select_db( "sdy" , $db );
    
    //3、设置字符编码 （防止数据库的数据显示到客户端时出现乱码） mysql_query("set names utf8")
    mysql_query("set names utf8");
    
    //4、编写sql语句 
    $sql = "INSERT INTO `users` (`username`, `password`,`nickname`) VALUES('$username', '$password','$nickname')";
    
    
    //5、执行sql语句 mysql_query()
    $res =  mysql_query( $sql );
    
    //第三步 ：返回处理结果
    if( $res ){
        echo "<script>alert('注册成功');location.href='../login.html';</script>";
    }else{
        echo "<script>alert('注册失败');location.href='../register.html';</script>";
    }
?>
