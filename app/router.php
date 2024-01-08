<?

$routes = [];

function route($action, Closure $callback, $middleware = false) {
    global $routes;
    $action = trim($action, '/');
    $routes[$action]['callback'] = $callback;
    
    if($middleware) {
        $routes[$action]['middleware'] = $middleware;
    }
}

function dispatch($action) {
    global $routes;
    $action = trim($action, '/');
    $callback = $routes[$action]['callback'];
    if(isset($routes[$action]['middleware'])) {
        require_once $_SERVER['DOCUMENT_ROOT'] . '/app/middleware/' . $routes[$action]['middleware'] . '.php';
    }
    echo call_user_func($callback);
}