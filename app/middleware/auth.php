<?

$deffaultPage = '/game';
$url = $_SERVER['REQUEST_URI'];

if(!isset($_SESSION['user'])) {
    if($url != '/login') {
        header('Location: /login');
    }
} else {
    if($url != $deffaultPage) {
        header('Location: /game');
    }
}