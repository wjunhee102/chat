const fs      = require("fs");
const express = require("express");
const cors    = require("cors"); 
const socket  = require("socket.io");
const http    = require("http");
const querystring = require("querystring");

//user 정보
const usersData = require("./data/user.json");
const { isRegExp } = require("util");


const app    = express(); 
const server = http.createServer(app);
const io     = socket(server);

app.use(cors());
app.use(express.json());

app.use("/css", express.static("./public"));
app.use("/js", express.static("./src"));

// 접속 제한
let nowUsersCount = 0;


// 회원가입 API
app.post('/sign-up', function(request, response) {
  if(nowUsersCount >= 5) return response.end("full");
  
  nowUsersCount++;

  const data = request.body;

  const checkEmail = new RegExp(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i);
  const checkPassword = new RegExp(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/);

  console.log(checkEmail.test(data.email), checkPassword.test(data.password), data.password)
  if(!checkEmail.test(data.email) || !checkPassword.test(data.password)) {
    const errMessage = checkEmail.test(data.email)? "pwTypeError" : "emailTypeError" 
    response.json({
      status : "error",
      message : errMessage
    });
  } else {
    const user = usersData.user.filter(ele=> ele.email == data.email);

    console.log(user, typeof(user), user==null, user[0] == null);
    
    if(user[0]) {
      
      response.json({
        status : "error",
        message : "overlap"
      });

    } else {  
      usersData.user.push(data)

      fs.writeFileSync("./data/user.json", JSON.stringify(usersData, null, 2));

      response.json({
        status : "sucess",
        message : "sucess"
      });

      nowUsersCount--;
      
    }
  }

  setTimeout(()=>{
    nowUsersCount--
  }, 500);

  response.end();
})


// 로그인 API
app.post('/sign-in', function(request, response) {
  if(nowUsersCount >= 5) return response.end();
  
  nowUsersCount++

  const data = request.body;

  const user = usersData.user.filter(ele=> ele.email == data.email && ele.password == data.password);

  console.log(user, typeof(user), user[0] == null);

  if(user[0]) {
    
    response.json({
      email : user[0].email,
      name : user[0].name
    });

  } else {
    response.json({
      status : "error",
      message : "undefined"
    })
  }

 
  setTimeout(()=>{
    nowUsersCount--
  }, 500);

  response.end();
})

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

// let rawData = fs.readFileSync("./data/user.json");
// let users = JSON.parse(userData);
// console.log(users);

// app.get('/', function(request, response) {
//   if(nowUsersCount >= 1) return response.send(err)
//   fs.readFile("./public/index.html", function(err, data) {
//     if(err) {
//       response.send("에러");
//     } else {
//       response.writeHead(200, {'content-type' : 'text/html'});
//       response.write(data);
//       response.end();
//     }
//   })
// });

// app.post('/login', function(request, response) {
//   console.log(request)
//   fs.readFile("./public/login.html", function(err, data) {
//     if(err) {
//       response.send("에러");
//     } else {
//       response.writeHead(200, {'content-type' : 'text/html'});
//       response.write(data);
//       response.end();
//     }
//   })
// });

// let users1 = [
//   {
//     id : 1,
//     name : "hello"
//   }
// ]

// app.get('/users', (req, res) => {
//   console.log(req);
//   return res.json(users1);
// })