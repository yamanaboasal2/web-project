<?php
session_start();
session_unset();
session_destroy();
header("Location: /web-project1/html_file/login.html");
exit();
?>