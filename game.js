class DiceRoller {
  constructor(resultTextElement, onRollCallback) {
    if (!resultTextElement || !onRollCallback) {
      throw new Error("resultTextElement and onRollCallback are required");
    }

    this.resultText = $("#" + resultTextElement.attr("id"));
    this.onRollCallback = onRollCallback;
  }

  performRoll() {
    const diceResult = this._generateRandomNumber();
    this.displayResult(diceResult);
    if (typeof this.onRollCallback === "function") {
      this.onRollCallback(diceResult);
    }
  }

  _generateRandomNumber() {
    return Math.floor(Math.random() * 6) + 1;
  }

  displayResult(result) {
    this.resultText.html(`Dice Roll Result: <br>${result}`);
    console.log(`Dice Roll Result: ${result}`);
  }
}

class Cat {
  constructor(container, numberOfDivs, catColor, playerNumber) {
    this.container = container;
    this.numberOfDivs = numberOfDivs;
    this.playerNumber = playerNumber;
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

  moveToNewPosition(distanceToMoveCat) {
    const currentPosition = parseInt(this.catDiv.attr("id").split("-")[1]) || 1;
    let newPosition = currentPosition + distanceToMoveCat;
    if (newPosition > this.numberOfDivs) {
      newPosition = this.numberOfDivs;
    }

    this.moveCatToPosition(newPosition);

    this.handleSpecialBoxes(newPosition);

    if (newPosition === 100) {
      this.handleGameWin();
    }
  }

  moveCatToPosition(newPosition) {
    this.catDiv.appendTo($(`#box-${newPosition}`));
    this.catDiv.attr("id", `box-${newPosition}`);
  }

  handleSpecialBoxes(box) {
    const messages = {
      awesomeUp: "Awesome, you moved up by",
      sorryDown: "Sorry, you moved down by",
      laserMove: "Your cat chased a laser and is moving up by",
      yarnTangle: "Sorry, your cat got tangled up in a yarn ball! Move back by",
    };

    const specialBoxes = {
      // Strings
      40: { moveTo: 59, steps: 19, type: "awesomeUp" },
      49: { moveTo: 68, steps: 19, type: "awesomeUp" },
      79: { moveTo: 83, steps: 4, type: "awesomeUp" },
      72: { moveTo: 90, steps: 18, type: "awesomeUp" },
      // Streams
      23: { moveTo: 4, steps: 19, type: "sorryDown" },
      34: { moveTo: 29, steps: 5, type: "sorryDown" },
      56: { moveTo: 35, steps: 21, type: "sorryDown" },
      64: { moveTo: 58, steps: 6, type: "sorryDown" },
      87: { moveTo: 75, steps: 12, type: "sorryDown" },
      // Extra Move
      25: { moveTo: 30, steps: 5, type: "laserMove" },
      // Reverse Direction
      96: { moveTo: 92, steps: 4, type: "yarnTangle" },
    };

    if (specialBoxes[box]) {
      const { moveTo, steps, type } = specialBoxes[box];
      const message = `${messages[type]} ${steps}`;
      this.handleSpecialBoxMove(moveTo, message);
    }
  }

  handleSpecialBoxMove(moveTo, message) {
    setTimeout(() => {
      this.moveCatToPosition(moveTo);
      alert(message);
    }, 150);
  }

  handleGameWin() {
    setTimeout(() => {
      alert(`Player ${this.playerNumber} has won the game!`);
      window.location.href = "menu.html";
    }, 800);
  }
}

class GameBoard {
  constructor(container, numberOfDivs, resultText) {
    this.container = container;
    this.numberOfDivs = numberOfDivs;
    this.resultText = $("#" + resultText.attr("id"));
    this.cats = [];
    this.currentCatIndex = 0;
    this.currentPlayer = 1; // Track the current player

    // Create the DiceRoller instance and bind the event handler
    const diceRoller = new DiceRoller(
      this.resultText,
      this.moveCurrentCat.bind(this)
    );
    $("#roll-dice-btn").on("click", diceRoller.performRoll.bind(diceRoller));
    this.diceRoller = diceRoller;

    // Adding stream images
    this.addImages([
      {
        filename: "./assets/streams/stream-image1.png",
        box: 45,
        options: { topOffset: 55, leftOffset: 60, height: 160, width: 140 },
      },
      {
        filename: "./assets/streams/stream-image2.png",
        box: 5,
        options: { topOffset: 30, leftOffset: 55, height: 130, width: 110 },
      },
      {
        filename: "./assets/streams/stream-image3.png",
        box: 68,
        options: { topOffset: 55, leftOffset: 60, height: 120, width: 100 },
      },
      {
        filename: "./assets/streams/stream-image4.png",
        box: 29,
        options: { topOffset: 0, leftOffset: 30, height: 150, width: 150 },
      },
      {
        filename: "./assets/streams/stream-image5.png",
        box: 34,
        options: { topOffset: 25, leftOffset: 50, height: 160, width: 200 },
      },
    ]);

    // Adding string images
    this.addImages([
      {
        filename: "./assets/strings/string-image1.png",
        box: 50,
        options: { topOffset: 23, leftOffset: 50, height: 150, width: 200 },
      },
      {
        filename: "./assets/strings/string-image2.png",
        box: 38,
        options: { topOffset: 20, leftOffset: 50, height: 150, width: 150 },
      },
      {
        filename: "./assets/strings/string-image3.png",
        box: 70,
        options: { topOffset: 60, leftOffset: 25, height: 100, width: 130 },
      },
      {
        filename: "./assets/strings/string-image3.png",
        box: 63,
        options: { topOffset: 50, leftOffset: -5, height: 90, width: 90 },
      },
    ]);

    // Update snake positions on window resize
    $(window).on("resize", this.updateSnakePositions.bind(this));
  }

  addCatToBoard(catColor, playerNumber) {
    const cat = new Cat(
      this.container,
      this.numberOfDivs,
      catColor,
      playerNumber
    );
    this.cats.push(cat);
  }

  moveCurrentCat(steps) {
    const currentCat = this.cats[this.currentCatIndex];
    currentCat.moveToNewPosition(steps);

    // Update the player turn text only in player versus player mode
    if (this.cats.length > 1) {
      this.updatePlayerTurnText();
      this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }

    this.currentCatIndex = (this.currentCatIndex + 1) % this.cats.length;
  }

  updatePlayerTurnText() {
    const playerTurnText = $("#player-turn");

    if (this.currentPlayer === 1) {
      playerTurnText.text("Player 1's Turn");
    } else {
      playerTurnText.text("Player 2's Turn");
    }
  }

  updateSnakePositions() {
    // Iterate over stored snake positions and update them
    this.snakePositions.forEach(({ snake, box }) => {
      const boxOffset = $(`#box-${box}`).offset();
      snake.css({
        top: boxOffset.top - options.topOffset,
        left: boxOffset.left - options.leftOffset,
      });
    });
  }

  addImages(images) {
    images.forEach(({ filename, box, options }) => {
      this.addImageToBoard(filename, box, options);
    });
  }

  addImageToBoard(imageFilename, nearBoxNumber, options) {
    options = options || {};
    const {
      topOffset = 0,
      leftOffset = 0,
      height = 100,
      width = 100,
    } = options;

    const image = $("<img>", {
      src: imageFilename,
      alt: "Image",
      class: "custom-image",
    });

    // Set the position based on the desired box position
    const boxOffset = $(`#box-${nearBoxNumber}`).offset();
    image.css({
      position: "absolute",
      top: boxOffset.top - topOffset,
      left: boxOffset.left - leftOffset,
      height: height + "px",
      width: width + "px",
      transform: "translate(-50%, -50%)",
      zIndex: 1,
    });

    // Generate a unique ID for each image based on the filename
    const uniqueID = imageFilename.replace(/\W/g, "_").replace(/\./g, "_");

    image.attr("id", uniqueID);
    this.container.append(image);
  }
}
