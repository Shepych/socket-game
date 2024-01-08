<?

$data = json_decode(file_get_contents("php://input"), true);

header('Content-Type: application/json');
global $mysql;
$userId = $data['userId'];
$match = $mysql->query("SELECT * FROM matches WHERE (player_one = $userId OR player_two = $userId) AND winner_id IS NULL")->fetch_assoc();

echo json_encode($match);