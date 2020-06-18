var socket = io();

// socket.on("connect", function() {
//   var input = document.getElementById("test");
//   input.value = '접속 됨'
// })

// function send() {
//   var message = document.getElementById("test").value

//   document.getElementById("test").value = ""

//   socket.emit("send", {msg: message})
// }



function send() {
  var message = document.getElementById("test").value
  
  document.getElementById("test").value = ''

  socket.emit("message", {type: "message", message: message})
}
socket.on("connect", function() {
  var name = prompt("이름을 알려주세요",0);

  if(!name) {
    name = "익명"
  }

  socket.emit("newUser", name)
});

socket.on("update", function(data) {
  console.log(`${data.name}: ${data.message}`)
});

function handleRes(res) {
  console.log(res)  
}

function handleRes2(res) {
  console.log(res)  
}

// const button = document.getElementById('signout_button');
//     button.onclick = () => {
//       google.accounts.id.disableAutoSelect();
//     }