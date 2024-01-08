<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Авторизация</title>
    <link rel="stylesheet" href="/public/css/main.css">
</head>
<body>
    <?if(isset($_SESSION['error'])):?>
        <span style="color:red"><?=$_SESSION['error']?></span>
        <?unset($_SESSION['error'])?>
    <?endif?>
    <form class="login__form" method="POST" action="">
        <input class="input__text" type="text" name="login" placeholder="Логин">
        <input class="input__text" type="password" name="password" placeholder="Пароль">
        <input class="input__button" type="submit" value="Войти">
    </form>
</body>
</html>