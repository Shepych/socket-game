<?php

$mysql = new mysqli('localhost', 'root', '', 'tic_tac_toe');

function dd($variable) { # Функция дебага
    echo '<pre>';
    var_dump($variable);
    echo '</pre>';
}