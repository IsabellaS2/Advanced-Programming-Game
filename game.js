// Manages and performs dice rolls, displaying results in a specified element and executing a callback function on each roll.
class DiceRoller {
  // resultTextElement: jQuery object representing the element where the dice roll result will be displayed
  // onRollCallback: Callback function to be executed when a dice roll is performed
  constructor(resultTextElement, onRollCallback) {
    // Check if required parameters are provided, throw an error if not
    if (!resultTextElement || !onRollCallback) {
      throw new Error("resultTextElement and onRollCallback are required");
    }

    // Store a reference to the result text element
    this.resultText = $("#" + resultTextElement.attr("id"));
    // Store the callback function to be executed on dice roll
    this.onRollCallback = onRollCallback;
  }

  // Method to perform a dice roll
  performRoll() {
    // Check if the Roll Dice button is disabled
    if ($("#roll-dice-btn").prop("disabled")) {
      return;
    }

    // Generate a random number representing the result of the dice roll
    const diceResult = this._generateRandomNumber();
    this.displayResult(diceResult);

    // Execute the callback function if it is a function
    if (typeof this.onRollCallback === "function") {
      this.onRollCallback(diceResult);
    }
  }

  // Private method to generate a random number between 1 and 6
  _generateRandomNumber() {
    return Math.floor(Math.random() * 6) + 1;
  }

  // Method to display the dice roll result
  displayResult(result) {
    this.resultText.html(`Dice Roll Result: <br>${result}`);
    console.log(`Dice Roll Result: ${result}`);
  }
}

// Constants for magic numbers
const GAME_BOARD_SIZE = 100;
const NOTIFICATION_DURATION = 1500;
const GAME_WIN_DELAY = 800;

// Manages the game logic for a player's cat, including creation, movement, handling special boxes, and checking for a win condition on the game board.
class Cat {
  constructor(container, numberOfDivs, catColor, playerNumber) {
    this.container = container;
    this.numberOfDivs = numberOfDivs;
    this.playerNumber = playerNumber;
    this.createCat(catColor);
  }

  // Function to create the cat with an image and set initial position
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

  // Function to move the cat to a new position on the game board
  moveToNewPosition(distanceToMoveCat) {
    const currentPosition = this.getCurrentPosition();
    let newPosition = currentPosition + distanceToMoveCat;
    newPosition = Math.min(newPosition, this.numberOfDivs);

    this.moveCatToPosition(newPosition);
    this.handleSpecialBoxes(newPosition);
    this.checkForGameWin(newPosition);
  }

  // Function to move the cat to a specific position on the game board
  moveCatToPosition(newPosition) {
    this.catDiv.appendTo($(`#box-${newPosition}`));
    this.catDiv.attr("id", `box-${newPosition}`);
  }

  // Function to handle the effects of special boxes on the game board
  handleSpecialBoxes(box) {
    const messages = {
      awesomeUp: "Awesome, you moved up by",
      sorryDown: "Sorry, you moved down by",
      laserMove: "Your cat chased a laser and is moving up by",
      yarnTangle: "Sorry, your cat got tangled up in a yarn ball! Move back by",
    };

    // Special boxes with their corresponding actions
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

  // Function to handle the effects of a specific special box
  handleSpecialBoxMove(moveTo, message) {
    // Disable the Roll Dice button
    $("#roll-dice-btn").prop("disabled", true);

    const notification = $("<div>", {
      class: "notification",
      text: message,
    });

    this.container.append(notification);

    setTimeout(() => {
      notification.remove(); // Remove the notification after a delay
      this.moveCatToPosition(moveTo);
      // Enable the Roll Dice button after the notification is gone
      $("#roll-dice-btn").prop("disabled", false);
    }, NOTIFICATION_DURATION);
  }

  // Function to check if the cat has reached the end of the game board and won
  checkForGameWin(newPosition) {
    if (newPosition === GAME_BOARD_SIZE) {
      setTimeout(() => {
        alert(`Player ${this.playerNumber} has won the game!`);
        window.location.href = "menu.html";
      }, GAME_WIN_DELAY);
    }
  }

  // Function to get the current position of the cat on the game board
  getCurrentPosition() {
    return parseInt(this.catDiv.attr("id").split("-")[1]) || 1;
  }
}

// Manages the overall game logic, including handling cats, dice rolls, player turns, special boxes, and images on the game board.
class GameBoard {
  // container: jQuery object representing the game board container
  // numberOfDivs: Number of divisions on the game board
  // resultText: jQuery object representing the element where the dice roll result will be displayed
  constructor(container, numberOfDivs, resultText) {
    this.container = container;
    this.numberOfDivs = numberOfDivs;
    this.resultText = $("#" + resultText.attr("id"));
    this.cats = []; // Array to store cat instances
    this.currentCatIndex = 0; // Index to keep track of the current cat's turn
    this.currentPlayer = 1; // Variable to track the current player (1 or 2)

    // Create the DiceRoller instance and bind the event handler
    const diceRoller = new DiceRoller(
      this.resultText,
      this.moveCurrentCat.bind(this)
    );
    $("#roll-dice-btn").on("click", diceRoller.performRoll.bind(diceRoller));
    this.diceRoller = diceRoller;

    // Initialise the SnakeImagesManager for managing snake images
    this.snakeImagesManager = new SnakeImagesManager(this.container);

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
    $(window).on(
      "resize",
      this.snakeImagesManager.updatePositions.bind(this.snakeImagesManager)
    );
  }

  // Method to add a cat to the game board
  addCatToBoard(catColor, playerNumber) {
    const cat = new Cat(
      this.container,
      this.numberOfDivs,
      catColor,
      playerNumber
    );
    this.cats.push(cat);
  }

  // Method to move the current cat based on the dice roll result
  moveCurrentCat(steps) {
    const currentCat = this.cats[this.currentCatIndex];
    currentCat.moveToNewPosition(steps);

    // If there is more than one cat, update player turn and switch players
    if (this.cats.length > 1) {
      this.updatePlayerTurnText();
      this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }

    // Update the current cat index for the next turn
    this.currentCatIndex = (this.currentCatIndex + 1) % this.cats.length;
  }

  // Method to update the text indicating the current player's turn
  updatePlayerTurnText() {
    const playerTurnText = $("#player-turn");

    if (this.currentPlayer === 1) {
      playerTurnText.text("Player 1's Turn");
    } else {
      playerTurnText.text("Player 2's Turn");
    }
  }

  // Method to add images to the game board (stream and string images)
  addImages(images) {
    images.forEach(({ filename, box, options }) => {
      this.snakeImagesManager.addImageToBoard(filename, box, options);
    });
  }
}

// Manages the placement and positioning of snake images on the game board, allowing dynamic addition and updating of their positions.
class SnakeImagesManager {
  // container: jQuery object representing the game board container
  constructor(container) {
    this.container = container; // Store reference to the game board container
    this.snakePositions = []; // Array to store positions of snake images on the game board
  }

  // Method to add a snake image to the game board
  //   imageFilename: File path of the snake image
  //   nearBoxNumber: Box number near which the snake image should be placed
  //   options: Object containing optional parameters for image positioning
  addImageToBoard(imageFilename, nearBoxNumber, options) {
    // Set default values for optional parameters if not provided
    options = options || {};
    const {
      topOffset = 0, //Offset from the top of the box (default: 0)
      leftOffset = 0, //Offset from the left of the box (default: 0)
      height = 100, //Height of the image (default: 100)
      width = 100, //Width of the image (default: 100)
    } = options;

    // Create a jQuery image element
    const image = $("<img>", {
      src: imageFilename,
      alt: "Image",
      class: "custom-image",
    });

    // Calculate the position of the image based on the specified box
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

    // Generate a unique ID for the image and set it as the image's ID attribute
    const uniqueID = imageFilename.replace(/\W/g, "_").replace(/\./g, "_");
    image.attr("id", uniqueID);

    // Append the image to the game board container
    this.container.append(image);

    // Store the snake image's position in the array
    this.snakePositions.push({ snake: image, box: nearBoxNumber });
  }
  // Method to update the positions of snake images on the game board
  // options: Object containing optional parameters for image positioning
  updatePositions(options) {
    // Iterate through each snake image position and update its position
    this.snakePositions.forEach(({ snake, box }) => {
      // Calculate the new position based on the specified box and offsets
      const boxOffset = $(`#box-${box}`).offset();
      snake.css({
        top: boxOffset.top - options.topOffset,
        left: boxOffset.left - options.leftOffset,
      });
    });
  }
}

// Method to simulate the computer player's turn
GameBoard.prototype.runComputerPlayer = function () {
  // Get the computer player's cat instance
  const computerCat = this.cats[1];

  // Function to roll the dice automatically with a delay
  const rollDiceAutomatically = () => {
    const delay = 600;

    // Execute the following code after the specified delay
    setTimeout(() => {
      // Generate a random number of steps (1 to 6) for the dice roll
      const steps = Math.floor(Math.random() * 6) + 1;

      // Perform the dice roll using the DiceRoller instance
      this.diceRoller.performRoll(steps);

      // Check if the computer cat has not reached the end of the game board
      if (computerCat.catDiv.attr("id") !== "box-100") {
        // Roll the dice automatically again (recursive call)
        rollDiceAutomatically();
      }
    }, delay);
  };

  // Start the automatic dice rolling for the computer player
  rollDiceAutomatically();
};
