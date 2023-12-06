class DiceRoller {
  constructor(resultText, onRollCallback) {
    this.resultText = $("#" + resultText.attr("id"));
    this.button = $("#roll-dice-btn");
    this.diceResult = 0;
    this.onRollCallback = onRollCallback;
    this.button.on("click", this.roll.bind(this));
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
    console.log("Dice Roll Result: " + this.diceResult)
  }
}

class Cat {
  constructor(container, numberOfDivs, catColor) {
    this.container = container;
    this.numberOfDivs = numberOfDivs;
    this.createCat(catColor);
  }

  createCat(catColor) {
    const catImage = $("<img>", {
      src: `./assets/cat-images/${catColor}-cat.png`,
      alt: "Cat Image",
    });

    this.catDiv = $("<div>", {
      class: "players",
    });

    this.catDiv.html(catImage); // Set the image as HTML content

    this.container.append(this.catDiv);
  }

  move(steps) {
    const currentPosition = parseInt(this.catDiv.find('img').attr('alt')) || 1;
    let newPosition = currentPosition + steps;

    if (newPosition > this.numberOfDivs) {
      newPosition = this.numberOfDivs;
    }

    let newBoxNumber = newPosition;

    this.catDiv.find('img').attr('alt', newBoxNumber); // Update the alt attribute

    this.catDiv.animate(
      {
        top: $(`#box-${newBoxNumber}`).position().top + "px",
        left: $(`#box-${newBoxNumber}`).position().left + "px",
      },
      500
    );
  }
}


class GameBoard {
  constructor(container, numberOfDivs, resultText) {
    this.container = container;
    this.numberOfDivs = numberOfDivs;
    this.resultText = $("#" + resultText.attr("id"));
    this.cats = []; // Store all cats in an array
    this.currentCatIndex = 0; // Index of the cat that will move next
    this.diceRoller = new DiceRoller(this.resultText, this.catMove.bind(this));
  }

  addCat(catColor) {
    const cat = new Cat(this.container, this.numberOfDivs, catColor);
    this.cats.push(cat);
  }

  catMove(steps) {
    const currentCat = this.cats[this.currentCatIndex];
    currentCat.move(steps);

    // Switch to the next cat for the next turn
    this.currentCatIndex = (this.currentCatIndex + 1) % this.cats.length;
  }
}

$(document).ready(function () {
  const gameBoard = new GameBoard(
    $("#game-board"),
    100,
    $("#dice-roll-result")
  );

  // Add black cat
  gameBoard.addCat("black");

  // Add orange cat 
  // gameBoard.addCat("orange");
});

