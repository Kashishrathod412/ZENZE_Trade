<?php
require_once 'db.php';
$stmt = $conn->query("ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL");
$stmt = $conn->query("UPDATE users SET role = 'team_member' WHERE id LIKE 'team-%'");
echo "Role column modified and updated!";
?>
