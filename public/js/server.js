const axios = require('axios')
const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
app.use(cors())

const server = http.createServer(app)
const io = new Server (server, {
    cors: {
      origin: "*"
    }
})

let users = []
let players = []

io.on('connection', (socket) => {
  // console.log('Пользователь подключился ' + socket.id);

  // Обработчик для принятия сообщений от клиента
  socket.on('message', async (data) => {
    let serverUrl = 'http://game/game/get';
    let requestData = {
      userId: data.userId
    }
    let options = {
      method: 'post',
      url: serverUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestData,
    }

    recipientId = socket.id
    if(data.type == 'stats') {
      let stats = () => fetch('http://game/game/statistic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ userId: requestData.userId }),
      })
      .then(response => response.json()) // Преобразуем ответ в JSON
      .then(data => {
        return data;
      })

      let statsMatches = await stats()

      io.to(recipientId).emit('message', {
        type: 'stats',
        stats: statsMatches
      });
    }

    if(data.type == 'init') {
      users.push({
        userId: data.userId,
        socketId: socket.id
      })

      setTimeout(() => {
        axios(options)
        .then(response => {
          if(response.data) {
            io.to(recipientId).emit('message', {
              type: 'init',
              matchData: response.data,
              moves: response.data.moves,
            });
          }
        })
      }, 50)
    }

    if(data.type == 'start') {
      let userFounded = false

      players.forEach(player => {
        if(player.id == data.userId) {
          userFounded = true
        }
      })

      
      if(!userFounded) {
        player = {
          id: data.userId,
          socketId: recipientId
        }

        players.push(player)
      }
      
      // console.log('Игрок с ID:' + data.userId + " встал в очередь на игру");
      io.to(recipientId).emit('message', `Сервер: пользователь с ID: ${player.id} ожидайте начала игры`);

      // Если есть хотя бы 2 игрока в массиве - тогда начинаем игру
      if(players.length > 1) {
        // Создать комнату на PHP (fetch)
        let serverUrl = 'http://game/game/create';
        let requestData = {
          players: players
        }
        let options = {
          method: 'post',
          url: serverUrl,
          headers: {
            'Content-Type': 'application/json',
          },
          data: requestData,
        }

        axios(options)

        setTimeout(() => {
          fetch('http://game/game/get', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', 
            },
            body: JSON.stringify({ userId: data.userId }),
          })
          .then(response => response.json()) // Преобразуем ответ в JSON
          .then(dataMatch => {
            players.forEach(player => {
              // Отправить эту комнату по сокету
              io.to(player.socketId).emit('message', {
                type: 'start',
                matchData: dataMatch,
                moves: []
              })
            })
            players = []

            // Удалить юзеров из очереди
            console.log('Начало игры')
          })
        },
        120)
      }
    }

    if(data.type == 'move') {
      // Достать матч через axios
      // Проверить ходы в move
      // Если всё норм - записать ход в move
      // Отдать move.json
      let matchFetch = () => fetch('http://game/game/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ userId: requestData.userId }),
      })
      .then(response => response.json()) // Преобразуем ответ в JSON
      .then(data => {
        return data;
      })

      let matchData = await matchFetch()
      if(!matchData) {
        console.log('Некорректные данные')
        return
      }

      let moves = JSON.parse(matchData.moves)
      let error = false

      if(moves.length <= 0 && data.userId != matchData.player_one) {
        io.to(recipientId).emit('message', {
          type: 'error',
          message: 'Противник ходит первым!'
        })
        return
      }

      
      

      // 1 - проверка вашего хода
      moves.forEach((element, index) => {
        if(index + 1 == moves.length) {
          if(element.userId == data.userId) {
            error = true
            io.to(recipientId).emit('message', {
              type: 'error',
              message: 'Не ваш ход!'
            })
            return
          }
        }
      })

      if(error) {
        return
      }

      // 2 - проверка занятой ячейки
      moves.forEach((element, index) => {
        if(data.moveId == element.moveId) {
          error = true
          io.to(recipientId).emit('message', {
            type: 'error',
            message: 'Клетка занята!'
          })
          return
        }
      })

      if(error) {
        return
      }

      moves.push({
        moveId: data.moveId,
        userId: requestData.userId
      })
      
      fetch('http://game/game/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          matchId: matchData.id,
          moves: moves,
          matchData: matchData
        }),
      })
      
      let matchPlayers = [parseInt(matchData.player_one), parseInt(matchData.player_two)]
      users.forEach(user => {
        if(matchPlayers.includes(user.userId)) {
          io.to(user.socketId).emit('message', {
            type: 'move',
            moves: moves,
            matchData: matchData
          })
        }
      })

      // Функция проверки победы или ничьей
      let winnerCombo = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],

        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],

        [1, 5, 9],
        [3, 5, 7],
      ]
      let firstPlayerCombo = []
      let secondPlayerCombo = []
      moves.forEach(item => {
        if(item.userId == data.userId && data.userId == matchData.player_one) {
          firstPlayerCombo.push(parseInt(item.moveId))
        }

        if(item.userId == data.userId && data.userId == matchData.player_two){
          secondPlayerCombo.push(parseInt(item.moveId))
        }
      })

      if(moves.length == 9) {
        fetch('http://game/game/game_over', { // Запрос в бд на обновление winner_id
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
              matchId: matchData.id,
              winnerId: '-'
            }),
          })

          users.forEach(user => {
            if(matchPlayers.includes(user.userId)) {
              io.to(user.socketId).emit('message', {
                type: 'game_over',
                draw: true
              })
            }
          })
        return
      }

      winnerCombo.forEach(combo => {
        let winCounterOne = 0
        let winCounterTwo = 0
        for(let i = 0; i < combo.length; i++) {
          firstPlayerCombo.forEach(moveId => {
            if(moveId == combo[i]) {
              winCounterOne++
            }
          })

          secondPlayerCombo.forEach(moveId => {
            if(moveId == combo[i]) {
              winCounterTwo++
            }
          })
        }

        if(winCounterOne >= 3 || winCounterTwo >= 3) {
          let winnerId = null
          let loserId = null

          if(winCounterOne >= 3) {
            winnerId = matchPlayers[0]
            loserId = matchPlayers[1]
          } else if(winCounterTwo >= 3) {
            winnerId = matchPlayers[1]
            loserId = matchPlayers[0]
          }
          
          fetch('http://game/game/game_over', { // Запрос в бд на обновление winner_id
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
              matchId: matchData.id,
              winnerId: winnerId
            }),
          })

          users.forEach(user => {
            if(matchPlayers.includes(user.userId)) {
              io.to(user.socketId).emit('message', {
                type: 'game_over',
                winnerId: winnerId,
                loserId: loserId,
              })
            }
          })
        }
      })
    }
  });

  // Обработчик для отключения пользователя
  socket.on('disconnect', () => {
    users = users.filter(obj => obj.socketId !== socket.id)
    players = players.filter(obj => obj.socketId !== socket.id)
    console.log('Пользователь отключился');
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});