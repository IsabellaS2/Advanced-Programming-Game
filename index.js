class GameBoard {
  constructor(container, numberOfDivs, resultText) {
    this.container = container;
    this.numberOfDivs = numberOfDivs;
    this.resultText = resultText;
    this.cat = new Cat(this.container, this.numberOfDivs); // Create an instance of Cat
    this.diceRoller = new DiceRoller(this.resultText, this.catMove.bind(this)); // Pass the catMove method
  }
  catMove(steps) {
    this.cat.move(steps);
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
    if (typeof this.onRollCallback === "function") {
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

class Cat {
  constructor(container, numberOfDivs) {
    this.container = container;
    this.numberOfDivs = numberOfDivs;
    this.createCat();
  }

  createCat() {
    this.catDiv = $("<div>", {
      id: "black-cat",
      class: "players",
    });

    this.container.append(this.catDiv);
  }

  move(steps) {
    const currentPosition = parseInt(this.catDiv.html()) || 1; // Get the current position

    // Calculate the new position
    let newPosition = currentPosition + steps;
    if (newPosition > this.numberOfDivs) {
      newPosition = this.numberOfDivs;
    }

    // Get the box number at the new position
    let newBoxNumber = newPosition;

    // Move the cat div to the new position
    this.catDiv.html(newBoxNumber);

    // Move the cat div visually
    this.container.find(`#${this.catDiv.attr("id")}`).animate(
      {
        top: $(`#box-${newBoxNumber}`).position().top + "px",
        left: $(`#box-${newBoxNumber}`).position().left + "px",
      },
      500
    ); // Adjust the animation duration as needed
  }
}

$(document).ready(function () {
  const gameBoard = new GameBoard(
    $("#game-board"),
    100,
    $("#dice-roll-result")
  );
});
