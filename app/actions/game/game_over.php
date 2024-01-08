<?

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);
global $mysql;

$winnerId = $data['winnerId'];
$matchId = $data['matchId'];
$mysql->query("UPDATE matches SET winner_id = '$winnerId' WHERE id = $matchId");