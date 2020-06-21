const fs      = require("fs");
const express = require("express");
const socket  = require("socket.io");
const http    = require("http");
const querystring = require("querystring");
// const crypto  = require("crypto");
// const models  = require("../models");

const app    = express(); 
const server = http.createServer(app);
const io     = socket(server);
// const router = app.Router();


app.use("/css", express.static("./public"));
app.use("/js", express.static("./src"));

app.get('/', function(request, response) {
  fs.readFile("./public/index.html", function(err, data) {
    if(err) {
      response.send("에러");
    } else {
      response.writeHead(200, {'content-type' : 'text/html'});
      response.write(data);
      response.end();
    }
  })
});

app.post('/login', function(request, response) {
  console.log(request)
  fs.readFile("./public/login.html", function(err, data) {
    if(err) {
      response.send("에러");
    } else {
      response.writeHead(200, {'content-type' : 'text/html'});
      response.write(data);
      response.end();
    }
  })
});

app.post('/sign-up',function(request, response) {
  console.log(request)
  // fs.readFile("./data/user.json", function(err, data) {
  //   if(err) {
  //     response.send("에러");
  //   } else {
  //     response.writeHead(200, {'content-type' : 'application/json'});
  //     response.write(data);
  //     response.end();
  //   }
  // })
  response.send("안녕")
})

let users = [
  {
    id : 1,
    name : "hello"
  }
]

app.get('/users', (req, res) => {
  console.log(req);
  return res.json(users);
})

// app.post('/sign-up',function(request, response) {
//     request({
//       method: "POST",
//       json: true,   // <--Very important!!!
//       body: myJSONObject
//   }, function (error, response, body){
//       console.log(response);
//   });
//   // console.log(request);
//   // response.send("성공!");
//   // response.end();
// })

// io.sockets.on("connection", function(socket) {
//   console.log("유저 접속 됨");
  
//   socket.on("send", function(data) {
//     console.log("전달된 메세지:", data.msg);
//   })

//   socket.on("disconnect", function() {
//     console.log("접속 종료");
//   })

// });

io.sockets.on("connection", function(socket) {
  socket.on("newUser", function(name) {
    console.log(name + " 님이 접속하였습니다.");

    socket.name = name;

    io.sockets.emit("updata", {type: "connect", name: "SERVER", message: name + "님이 접속하였습니다."});
  });

  socket.on("message", function(data) {
    data.name = socket.name
    
    console.log(data);

    socket.broadcast.emit("update", data);
  });

  socket.on("disconnect", function() {
    console.log(socket.name + "님이 나가셨습니다.")

    socket.broadcast.emit("update", {type: "disconnect", name: "SERVER", message: socket.name + "님이 나가셨습니다."});
  })
})


server.listen(8085, function () {
  console.log('서버 실행 중...');
});


