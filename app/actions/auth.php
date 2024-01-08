<?

global $mysql;

$login = $_POST['login'];
$password = $_POST['password'];
$user = $mysql->query("SELECT * FROM users WHERE login = '$login' AND password = '$password'")->fetch_assoc();

if($user) {
    $_SESSION['user'] = [
        'id' => $user['id'],
        'login' => $user['login'],
        'password' => $user['password'],
    ];
    header('Location: /game');
} else {
    $_SESSION['error'] = 'Неверные данные';
    header('Location: ' . $_SERVER["HTTP_REFERER"]);
}

exit();

# Подключиться к БД
# Проверить данные
# Создать сессию
# Редирект на страницу с игрой