<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (isset($_FILES['video'])) {
    // Check multiple potential public directory locations
    $target_dir = __DIR__ . '/../public/uploads/';
    if (!file_exists(__DIR__ . '/../public/')) {
        $target_dir = __DIR__ . '/uploads/';
    }
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    
    $file_extension = strtolower(pathinfo($_FILES["video"]["name"], PATHINFO_EXTENSION));
    
    // Check if it's actually a video file
    $allowed_extensions = ["mp4", "webm", "ogg", "mov"];
    if (!in_array($file_extension, $allowed_extensions)) {
        echo json_encode(["success" => false, "message" => "Invalid file format. Only MP4, WEBM, OGG and MOV are allowed."]);
        exit();
    }
    
    $filename = uniqid("vid_") . "." . $file_extension;
    $target_file = $target_dir . $filename;
    
    if (move_uploaded_file($_FILES["video"]["tmp_name"], $target_file)) {
        echo json_encode(["success" => true, "url" => "/uploads/" . $filename]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to move uploaded file."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No file sent"]);
}
?>
