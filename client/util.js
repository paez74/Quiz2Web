


let getPokemonPromise = (pokemonName) => {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.onload = function(data) {
      console.log(req.response);
    }
    req.open("GET", `http://localhost:3000/${pokemonName}`);
    req.onreadystatechange = (req_event) => {
      if (req.readyState == XMLHttpRequest.DONE) {
        if (req.status == 200) {
          return resolve(req.response);
        } else {
          console.log(req);
          showErrorMessage(pokemonName)
          return reject(req.reject);
        }
      }
    };
    req.send();
  });
};

function addElement(name){
  var itemName = document.getElementById('item-name');
  var pokemon = null;
  if(!name) {
    itemName.className = "error";
    return;
  }
  itemName.className= "";
  getPokemonPromise(name.toLowerCase()).then(result => {
    pokemon = JSON.parse(result);
    addPokemon(pokemon);
  })

  
}
function addPokemon(pokemon) {
  var node = document.createElement('li');
  node.className ="added-item";

  var secondNode = document.createElement('ul');
  secondNode.className = "pokeattributes";
  var nodes = [];
  nodes[0] = document.createElement('li');
  nodes[0].innerText = "Name: " + pokemon.name;
  nodes[1] = document.createElement('li');
  nodes[1].innerText = "Id: " + pokemon.id;
  nodes[2] = document.createElement('li');
  nodes[2].innerText = "Weight: " + pokemon.weight;
  nodes[3] = document.createElement('li');
  nodes[3].innerText = "Height: " + pokemon.height;
  nodes[4] = document.createElement('li');
  nodes[4].innerText = "Base Experience: " + pokemon.base_experience;
  
  for(var i = 0; i < nodes.length ; i++) {
    secondNode.appendChild(nodes[i]);
  }
  //  id, weight, all the types, height, base_experience and the image
  
  for(var i = 5; i < pokemon.types.length + 5; i++) {
    nodes[i] = document.createElement('li');
    nodes[i].innerText = "Type " + (i - 4).toString()  + ": " + pokemon.types[i-5].type.name;
 }
  for(var i = 0; i < nodes.length ; i++) {
    secondNode.appendChild(nodes[i]);
  }

  // sprites.front_default
  var firstNode = document.createElement('img');
  firstNode.src = pokemon.sprites.front_default;
  firstNode.className ="image";
  node.appendChild(firstNode);
  node.appendChild(secondNode);
  var thirdnode = document.createElement('button')
  thirdnode.innerText = "remove";
  thirdnode.className="remove-item";
  thirdnode.addEventListener('click', function(){
    remove_item(node);
});
  node.appendChild(thirdnode);

  var parent = document.getElementById('list');
  parent.innerHTML ="";
  parent.appendChild(node);
  clean();
}

function clean(){
  var itemName = document.getElementById('item-name');
  itemName.value ="";
}



function showErrorMessage(pokemonName) {
  var errorMessage = document.getElementById('error-message');
  errorMessage.innerText = "The pokemon " + pokemonName +  " does not exist :("
  errorMessage.className ="visible error";
  setTimeout(HideErrorMessage,10000)
}
function HideErrorMessage() {
  var errorMessage = document.getElementById('error-message');
  errorMessage.className ="invisible error";
}
let remove_item  = (parent) => {
  parent.remove();
}

