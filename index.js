class GameBoard {
  constructor(container, numberOfDivs, resultText) {
    this.container = container;
    this.numberOfDivs = numberOfDivs;
    this.resultText = resultText;
    this.createBoard();
    this.boxNumbers(); 
    this.diceRoller = new DiceRoller(this.resultText);
  }

  createBoard() {
    for (let i = 1; i <= this.numberOfDivs; i++) {
      const newDiv = $("<div>", {
        id: "box-" + i,
        class: "box",
      });
      this.container.append(newDiv);
    }
  }

  boxNumbers() {
    let boxes = $(".box"); 
    boxes.each((i, box) => {
      if (String(i).length == 1 || (String(i).length == 2 && Number(String(i)[0]) % 2 == 0)) {
        $(box).html(100 - i);
      } else {
        $(box).html(Number(`${9 - Number(String(i)[0])}${String(i)[1]}`) + 1);
      }
    });
  }
}

class DiceRoller {
  constructor(resultText, onRollCallback) {
    this.resultText = resultText;
    this.button = $("#roll-dice-btn");
    this.diceResult = 0; 
    this.onRollCallback = onRollCallback;

    this.button.on("click", () => this.roll());
  }

  roll() {
    this.diceResult = this.generateRandomNumber();
    this.displayResult();
    if (typeof this.onRollCallback === 'function') {
      this.onRollCallback(this.diceResult);
    }
  }

  generateRandomNumber() {
    return Math.floor(Math.random() * 6) + 1;
  }

  displayResult() {
    this.resultText.html("Dice Roll Result: <br>" + this.diceResult);
  }
}

$(document).ready(function () {
  const gameBoard = new GameBoard($("#game-board"), 100, $("#dice-roll-result"));
  const onRollCallback = function (diceResult) {
    console.log("Stored Dice Roll Result:", diceResult);
  };
  const diceRoller = new DiceRoller($("#dice-roll-result"), onRollCallback);
});




// const playerName = localStorage.getItem("playerName");
// if (playerName) {
//   $("#player-turn").text(playerName + "'s Turn");
// }


