<?

// Берутся ID игроков
$data = json_decode(file_get_contents("php://input"), true);

header('Content-Type: application/json');
global $mysql;
$players = $data['players'];
$playerOne = $players[0]['id'];
$playerTwo = $players[1]['id'];
$mysql->query("INSERT INTO matches (player_one, player_two, moves, winner_id) VALUES ($playerOne, $playerTwo, '[]', null)");

echo json_encode('Матч создан');