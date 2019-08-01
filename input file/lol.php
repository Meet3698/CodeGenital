<?php
	$conn = mysql_connect("localhost","root","");
	$db = mysql_select_db("hibernate",$conn);

	if($db)
		$query = "select * from user";
		$query1 = mysql_query($query,$conn);
		$no = mysql_num_rows($query1);
		$ans = mysql_fetch_assoc($query1);

		for($i=0;$i<$no;$i++)
			echo $ans['name']."<br>";

	
?>