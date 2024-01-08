<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Крестики нолики</title>
    <link 
        rel="stylesheet" 
        href="/public/css/main.css"
    />
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
    />
</head>
<body>
    <div id="matches__stat">
        <span id="stat__header">Статистика</span>
    </div>

    <div id="profile">
        <h1 class="game__name">Крестики нолики</h1>
        <form class="logout__form" method="POST" action="/logout">
            <h2>Login: <?=$_SESSION['user']['login']?></h2>
            <input type="submit" value="Выход">
        </form>
        
        <button id="start" class="button__start-game">Начать игру</button>
        <div id="search__game">
            <h3 style="margin-bottom: 0">Поиск игры</h3>
            <div id="timer">00:00</div>
        </div>
    </div>

    <div id="app" style="display: none;">
        <h1>Игра</h1>
        <div id="game">
            <?for($i = 0; $i< 9; $i++):?>
                <div data-block-id="<?=$i + 1?>" class="cell">
                    <img src="../../public/images/square.png" width="100%">
                </div>
            <?endfor?>
        </div>
        <div id="game__info"></div>
    </div>

    <script>
        const userId = <?=$_SESSION['user']['id']?>
    </script>
    <script src="../../public/js/main.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js"></script>
    <script>
        const socket = io('http://127.0.0.1:3000')

        socket.emit('message', {
            type: 'init',
            userId: userId
        })

        socket.emit('message', {
            type: 'stats',
            userId: userId
        })

        // Обработчик для принятия сообщений от сервера
        socket.on('message', (data) => {
            if(data.type == 'start') { // Показать окно игры и спрятать profile
                game(data)
                resetTimer()
            }

            if(data.type == 'stats') {
                const stats = data.stats
                const statsBlock = document.getElementById('matches__stat')
                console.log(stats)
                stats.forEach(item => {
                    let matchWrap = document.createElement('div')
                    let text = ''
                    let resultClass = ''
                    if(item.winner_id == userId) {
                        text = 'Победа'
                        resultClass = 'match__win'
                    } else if(item.winner_id == '-') {
                        text = 'Ничья'
                    } else {
                        text = 'Поражение'
                        resultClass = 'match__lose'
                    }
                    matchWrap.classList.add('animate__animated', 'animate__fadeInLeft', 'match__result')
                    if(resultClass.length > 0) {
                        matchWrap.classList.add(resultClass)
                    }
                    matchWrap.innerText = text
                    statsBlock.append(matchWrap)
                });
            }

            if(data.type == 'init') {
                game(data)
            }

            if(data.type == 'move') {
                game(data)
            }

            if(data.type == 'error') {
                alert(data.message)
            }

            if(data.type == 'game_over') {
                setTimeout(() => {
                    let text = ''
                    let resultClass = ''
                    if(data.draw) {
                        alert('Ничья!')
                        text = 'Ничья'
                    } else {
                        if(data.winnerId == userId) {
                            alert('Победа!')
                            text = 'Победа'
                            resultClass = 'match__win'
                        }
                        
                        if(data.loserId == userId){
                            alert('Поражение!') 
                            text = 'Поражение'
                            resultClass = 'match__lose'
                        }
                    }

                    let matchWrap = document.createElement('div')
                    matchWrap.innerText = text
                    matchWrap.classList.add('animate__animated', 'animate__fadeInLeft', 'match__result')
                    if(resultClass.length > 0) {
                        matchWrap.classList.add(resultClass)
                    }
                    let statHeader = document.getElementById('stat__header')
                    statHeader.parentNode.insertBefore(matchWrap, statHeader.nextSibling);

                    document.getElementById('profile').style.display = 'block'
                    document.getElementById('app').style.display = 'none'
                    document.getElementById('search__game').style.visibility = 'hidden'
                    document.getElementById('start').removeAttribute('disabled')
                    document.getElementById('start').style.opacity = '1';
                }, 20)
            }
        })

        socket.on('disconnect', () => {
            alert('Вы отключились, обновите страницу')
        });
    </script>

    

    <script>
        let timer;
        let seconds = 0;
    </script>
</body>
</html>