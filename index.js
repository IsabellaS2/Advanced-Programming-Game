class GameBoard {
  constructor(container, numberOfDivs, resultText) {
    this.container = container;
    this.numberOfDivs = numberOfDivs;
    this.resultText = resultText;
    this.createBoard();
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
    this.addNumbersToBoxes();
  }

  addNumbersToBoxes() {
    let boxes = $(".box");
    let rowCount = 0;

    for (let i = 0; i < boxes.length; i++) {
      let rowIndex = Math.floor(i / 10); // Assuming there are 10 boxes in a row
      let isEvenRow = rowIndex % 2 === 0;

      if (isEvenRow) {
        boxes.eq(i).html((rowCount + 1) * 10 - (i % 10));
      } else {
        boxes.eq(i).html(rowCount * 10 + 1 + (i % 10));
      }

      if ((i + 1) % 10 === 0) {
        rowCount++;
      }
    }
  }
}

class DiceRoller {
  constructor(resultText) {
    this.resultText = resultText;
    this.button = $("#roll-dice-btn");

    this.button.on("click", () => this.roll());
  }

  roll() {
    const diceResult = this.generateRandomNumber();
    this.displayResult(diceResult);
  }

  generateRandomNumber() {
    return Math.floor(Math.random() * 6) + 1;
  }

  displayResult(result) {
    this.resultText.html("Dice Roll Result: <br>" + result);
  }
}

$(document).ready(function () {
  const gameBoard = new GameBoard(
    $("#game-board"),
    100,
    $("#dice-roll-result")
  );
});

const playerName = localStorage.getItem("playerName");
if (playerName) {
  $("#player-turn").text(playerName + "'s Turn");
}
