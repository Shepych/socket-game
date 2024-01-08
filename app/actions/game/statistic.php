<?

$data = json_decode(file_get_contents("php://input"), true);

header('Content-Type: application/json');
global $mysql;
$userId = $data['userId'];
$matches = $mysql->query("SELECT * FROM matches WHERE (player_one = $userId OR player_two = $userId) AND winner_id IS NOT NULL ORDER BY id DESC")->fetch_all(MYSQLI_ASSOC);

echo json_encode($matches);