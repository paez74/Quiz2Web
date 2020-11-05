

let globalCards = [];
let globalGameId = null;

let getCardsPromise = () => {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.onload = function(data) {
      console.log(req.response);
    }
    req.open("GET", `http://localhost:3000/cards`);
    req.onreadystatechange = (req_event) => {
      if (req.readyState == XMLHttpRequest.DONE) {
        if (req.status == 200) {
          return resolve(req.response);
        } else {
          console.log(req);
          return reject(req.reject);
        }
      }
    };
    req.send();
  });
};

let getGamePromise = () => {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.onload = function(data) {
      console.log(req.response);
    }
    req.open("GET", `http://localhost:3000/game/${globalGameId}`);
    req.onreadystatechange = (req_event) => {
      if (req.readyState == XMLHttpRequest.DONE) {
        if (req.status == 200) {
          return resolve(req.response);
        } else {
          console.log(req);
          return reject(req.reject);
        }
      }
    };
    req.send();
  });
};

let createGamePromise = () => {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.onload = function(data) {
      console.log(req.response);
    }
    req.open("POST", `http://localhost:3000/`);
    req.onreadystatechange = (req_event) => {
      if (req.readyState == XMLHttpRequest.DONE) {
        if (req.status == 200) {
          return resolve(req.response);
        } else {
          console.log(req);
          return reject(req.reject);
        }
      }
    };
    req.send();
  });
};

let updateGamePromise = () => {
  console.log(globalCards);
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.onload = function(data) {
      console.log(req.response);
    }
    let game = {id:globalGameId,cards:globalCards}
    req.body = game;
    console.log(req.body);
    req.open("POST", `http://localhost:3000/game`);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    req.onreadystatechange = (req_event) => {
      if (req.readyState == XMLHttpRequest.DONE) {
        if (req.status == 200) {
          return resolve(req.response);
        } else {
          console.log(req);
          return reject(req.reject);
        }
      }
    };
    req.send(JSON.stringify(game));
  });
};



function addElement(){
  var cards = null;
  getCardsPromise().then(result => {
    console.log(result);
    cards = JSON.parse(result);
    cards.forEach(card => {
      globalCards.push(card);
      addCard(card);
    })
    console.log(globalCards);
    updateGamePromise().then(result2 => {
      console.log(result2);
    })
  })

  
}
function getStatus(){
  var id = localStorage.getItem("gameId");
  console.log(id);
  if(id == null || id === undefined)
  {
    createGamePromise().then(result => {
      console.log(result);
      var result = JSON.parse(result);
      gameId = result._id;
      localStorage.setItem("gameId",gameId);
      console.log(gameId);
      setInterval(function(){ 
        clean();
        getGamePromise().then(result => {
          var game = JSON.parse(result);
          globalCards = game.cards;
          globalCards.forEach(card => {
          addCard(card);
      })
        });
    }, 5000);
    })
  } else {
    globalGameId = id;
    getGamePromise().then(result => {
      var game = JSON.parse(result);
      globalCards = game.cards;
      globalCards.forEach(card => {
        addCard(card);
      })
      setInterval(function(){ 
        clean();
        getGamePromise().then(result => {
          var game = JSON.parse(result);
          globalCards = game.cards;
          globalCards.forEach(card => {
          addCard(card);
      })
        });
    }, 5000);

    })
  }
}
function addCard(card) {
  var node = document.createElement('li');
  node.className ="added-item";

  var secondNode = document.createElement('ul');
  secondNode.className = "pokeattributes";
  var nodes = [];
  nodes[0] = document.createElement('li');
  nodes[0].innerText = "Number: " + card.number;
  nodes[1] = document.createElement('li');
  nodes[1].innerText = "Sign: " + card.sign;
  nodes[2] = document.createElement('li');

  
  for(var i = 0; i < nodes.length ; i++) {
    secondNode.appendChild(nodes[i]);
  }


  var firstNode = document.createElement('img');
  var sourceFile = "img/";
  switch(card.sign) {
    case "hearts":
          sourceFile += "hearts.jpg"
          break;
    case "clovers":
          sourceFile += "clovers.jpg"
          break;
    case "spades":
          sourceFile += "spades.png"
          break;
    case "diamonds":
          sourceFile += "diamonds.jpg"
          break;
  }
   firstNode.src = sourceFile;
  
   firstNode.className ="image";
  node.appendChild(firstNode);
  node.appendChild(secondNode);
  var thirdnode = document.createElement('button')
  thirdnode.innerText = "remove";
  thirdnode.className="remove-item";
  thirdnode.addEventListener('click', function(){
    remove_item(node,card._id);
});
  node.appendChild(thirdnode);

  var parent = document.getElementById('list');
  parent.appendChild(node);
}

function clean(){
  var parent = document.getElementById('list');
  parent.innerHTML = "";
}


let remove_item  = (parent,id) => {
  parent.remove();
  globalCards = globalCards.filter(globalCard => globalCard._id != id);
  updateGamePromise().then(result => {
    console.log(result);
  })
}

