<?
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);
global $mysql;
$moves = json_encode($data['moves']);
$matchId = $data['matchId'];
$mysql->query("UPDATE matches SET moves = '$moves' WHERE id = $matchId");

echo json_encode($data);