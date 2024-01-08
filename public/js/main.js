document.getElementById('start').addEventListener('click', function() {
    const data = {
        type: 'start',
        userId: userId
    }
    socket.emit('message', data);

    startStopTimer()
})

function game(info = null) {
    const gameWrapper = document.getElementById('game')
    gameWrapper.innerHTML = ''

    document.getElementById('profile').style.display = 'none'
    document.getElementById('app').style.display = 'block'
    moves = []
    if(info) {
        if(typeof (info.moves) === 'string') {
            moves = JSON.parse(info.moves)
        } else {
            moves = info.moves
        }
    }
    
    let cells = 9
    
    for(let i = 0; i < cells; i++) {
        let blockCell = document.createElement('div')
        blockCell.setAttribute('data-block-id', i + 1)
        blockCell.className = 'cell'

        console.log(info)
        //game__info
        
        if(moves.length > 0) {
            moves.forEach((move) => {
                if(move.moveId == i + 1) {
                    let img = document.createElement('img')
                    img.src = gameIcon(move.userId, info.matchData)
                    img.setAttribute('width', '100%')
                    
                    blockCell.append(img)
                }
            })
        }
        
        let gameInfo = document.getElementById('game__info')
        let img = document.createElement('img')
        img.src = gameIcon(userId, info.matchData)
        img.setAttribute('width', '40px')
        gameInfo.innerText = 'Вы играете за - '
        gameInfo.append(img)
        
        // console.log(gameIcon(userId, info.matchData))

        gameWrapper.append(blockCell)
    }

    let blocks = document.querySelectorAll('.cell')

    blocks.forEach(item => {
        item.addEventListener('click', function() {
            // Отправить сообщение на сокет
            socket.emit('message', {
                type: 'move',
                userId: userId,
                moveId: item.getAttribute('data-block-id')
            });
        })
    })
}

function gameIcon(playerId, matchData) {
    let icon
    if(matchData.player_one == playerId) {
        icon = 'cross'
    }

    if(matchData.player_two == playerId) {
        icon = 'square'
    }

    let link = '../../public/images/' + icon + '.png'
    console.log(userId)
    return link
}

function updateTimer() {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    document.getElementById('timer').innerText = `0${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
}

function startStopTimer() {
    if (timer) {
        // clearInterval(timer);
        // document.getElementById('startStopBtn').innerText = 'Старт';
    } else {
        document.getElementById('start').setAttribute('disabled', true)
        document.getElementById('search__game').style.visibility = 'visible'
        document.getElementById('start').style.opacity = '0.3';
        timer = setInterval(function () {
            seconds++;
            updateTimer();
        }, 1000);
        // document.getElementById('startStopBtn').innerText = 'Стоп';
    }
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    seconds = 0;
    updateTimer();
    document.getElementById('startStopBtn').innerText = 'Старт';
}