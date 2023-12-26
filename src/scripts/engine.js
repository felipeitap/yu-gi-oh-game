const state = {
  score: {
    playerSocre: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  button: document.getElementById("next-duel"),
};
const imagesPath = "./src/assets/icons/";
const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${imagesPath}dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${imagesPath}magician.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${imagesPath}exodia.png`,
    winOf: [0],
    loseOf: [1],
  },
];

const playerSides = {
  player1: "player-cards",
  computer: "computer-cards",
};

async function getRadomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function createCardImage(cardId, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", cardId);

  if (fieldSide === playerSides.player1) {
    cardImage.classList.add("card");

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });

    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(cardId);
    });
  }

  return cardImage;
}

async function setCardsField(cardId) {
  await removeAllCardsImages();

  let computerCardId = await getRadomCardId();

  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  await hiddenCardDetails();

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function hiddenCardDetails() {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerSocre} | Lose: ${state.score.computerScore}`;
}

async function removeAllCardsImages() {
  let cards = document.querySelector(".card-box.framed#computer-cards");
  let imageElements = cards.querySelectorAll("img");

  imageElements.forEach((img) => img.remove());

  cards = document.querySelector(".card-box.framed#player-cards");

  imageElements = cards.querySelectorAll("img");

  imageElements.forEach((img) => img.remove());
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "Empate";
  let playerCard = cardData[playerCardId];

  if (playerCard.winOf.includes(computerCardId)) {
    duelResults = "Ganhou";
    state.score.playerSocre++;
    playAudio("win");
  }

  if (playerCard.loseOf.includes(computerCardId)) {
    duelResults = "Perdeu";
    state.score.computerScore++;
    playAudio("lose");
  }

  return duelResults;
}

async function drawButton(text) {
  state.button.innerText = text;
  state.button.style.display = "block";
}

async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerHTML = `Attribute: ${cardData[index].type}`;
}

async function drawCards(cardsNumbers, fieldSide) {
  for (let i = 0; i < cardsNumbers; i++) {
    const randomIdCard = await getRadomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.button.style.display = "none";
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  init();
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
}

function init() {
  drawCards(5, playerSides.player1);
  drawCards(5, playerSides.computer);

  const bgm = document.getElementById("bgm");
  bgm.play()
}

function initGame(){
  const modal = document.getElementById('modal')
  modal.style.display = "none"

  init()
}
