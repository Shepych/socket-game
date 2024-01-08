<?

require_once './config.php';
require_once './app/router.php';
session_start();

route('/', function() {
    return 'Главная';
});

route('/login', function() {
    if(!$_POST) {
        require_once './app/views/auth.php';
    } else {
        require_once './app/actions/auth.php';
    } 
}, 'auth');

route('/logout', function() {
    require_once './app/actions/logout.php';
});

route('/game', function() {
    require_once './app/views/game.php';
}, 'auth');

route('/game/get', function() {
    require_once './app/actions/game/get.php';
});

route('/game/create', function() {
    require_once './app/actions/game/create.php';
});

route('/game/move', function() {
    require_once './app/actions/game/move.php';
});

route('/game/game_over', function() {
    require_once './app/actions/game/game_over.php';
});

route('/game/statistic', function() {
    require_once './app/actions/game/statistic.php';
});

$action = $_SERVER['REQUEST_URI'];
dispatch($action);