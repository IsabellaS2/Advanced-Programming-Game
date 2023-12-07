class DiceRoller {
  constructor(resultText, onRollCallback) {
    this.resultText = $("#" + resultText.attr("id"));
    this.onRollCallback = onRollCallback;
  }

  roll() {
    const diceResult = this.generateRandomNumber();
    this.displayResult(diceResult);
    if (typeof this.onRollCallback === "function") {
      this.onRollCallback(diceResult);
    }
  }

  generateRandomNumber() {
    return Math.floor(Math.random() * 6) + 1;
  }

  displayResult(result) {
    this.resultText.html("Dice Roll Result: <br>" + result);
    console.log("Dice Roll Result: " + result);
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
      alt: `${catColor.charAt(0).toUpperCase()}${catColor.slice(1)} Cat Image`,
   });

   this.catDiv = $("<div>", {
      class: "players",
      id: "box-1", // Set the initial position to box-1
   });

   this.catDiv.html(catImage);

   // Append the cat div to the container
   this.container.append(this.catDiv);
   }





move(steps) {
   const currentPosition = parseInt(this.catDiv.attr("id").split("-")[1]) || 1;
   let newPosition = currentPosition + steps;
   if (newPosition > this.numberOfDivs) {
      newPosition = this.numberOfDivs;
   }

   // Set the cat div position to the center of the new box
   this.catDiv.appendTo($(`#box-${newPosition}`));

   // Update the cat div content
   this.catDiv.attr("id", `box-${newPosition}`);
}

}

class GameBoard {
  constructor(container, numberOfDivs, resultText) {
    this.container = container;
    this.numberOfDivs = numberOfDivs;
    this.resultText = $("#" + resultText.attr("id"));
    this.cats = [];
    this.currentCatIndex = 0;

    // Create the DiceRoller instance and bind the event handler
    const diceRoller = new DiceRoller(this.resultText, this.catMove.bind(this));
    $("#roll-dice-btn").on("click", diceRoller.roll.bind(diceRoller));
    this.diceRoller = diceRoller;
  }

  addCat(catColor) {
    const cat = new Cat(this.container, this.numberOfDivs, catColor);
    this.cats.push(cat);
  }

  catMove(steps) {
    const currentCat = this.cats[this.currentCatIndex];
    currentCat.move(steps);
    this.currentCatIndex = (this.currentCatIndex + 1) % this.cats.length;
  }
}
