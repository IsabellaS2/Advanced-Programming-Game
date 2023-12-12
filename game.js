class DiceRoller {
  constructor(resultTextElement, onRollCallback) {
    if (!resultTextElement || !onRollCallback) {
      throw new Error("resultTextElement and onRollCallback are required");
    }

    this.resultText = $("#" + resultTextElement.attr("id"));
    this.onRollCallback = onRollCallback;
  }

  performRoll() {
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
    this.resultText.html(`Dice Roll Result: <br>${result}`);
    console.log(`Dice Roll Result: ${result}`);
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

  moveToNewPosition(distanceToMoveCat) {
    const currentPosition = parseInt(this.catDiv.attr("id").split("-")[1]) || 1;
    let newPosition = currentPosition + distanceToMoveCat;
    if (newPosition > this.numberOfDivs) {
      newPosition = this.numberOfDivs;
    }

    // Set the cat div position to the center of the new box
    this.catDiv.appendTo($(`#box-${newPosition}`));

    // Update the cat div content
    this.catDiv.attr("id", `box-${newPosition}`);

    // Check for special box conditions
    this.handleSpecialBoxes(newPosition);
  }

  handleSpecialBoxes(box, options) {
    // Define special box conditions
    const specialBoxes = {
      //Strings
      40: { moveTo: 59, message: "Awesome, you moved up by 19" },
      49: { moveTo: 68, message: "Awesome, you moved up by 19" },
      79: { moveTo: 83, message: "Awesome, you moved up by 4" },
      72: { moveTo: 90, message: "Awesome, you moved up by 18" },
      //Streams
      23: { moveTo: 4, message: "Sorry, you moved down by 19" },
      34: { moveTo: 29, message: "Sorry, you moved down by 5" },
      56: { moveTo: 35, message: "Sorry, you moved down by 21" },
      64: { moveTo: 58, message: "Sorry, you moved down by 6" },
      87: { moveTo: 75, message: "Sorry, you moved down by 12" },
    };

    // Check if the box is a special box
    if (specialBoxes[box]) {
      const { moveTo, message } = specialBoxes[box];

      // Move to the specified box
      this.moveToBox(moveTo, options);

      // Show alert message
      alert(message);
    }
  }

  moveToBox(boxNumber) {
    // Move to the specified box
    this.catDiv.appendTo($(`#box-${boxNumber}`));

    // Update the cat div content
    this.catDiv.attr("id", `box-${boxNumber}`);
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

  addCatToBoard(catColor) {
    const cat = new Cat(this.container, this.numberOfDivs, catColor);
    this.cats.push(cat);
  }

  moveCurrentCat(steps) {
    const currentCat = this.cats[this.currentCatIndex];
    currentCat.moveToNewPosition(steps);
    this.currentCatIndex = (this.currentCatIndex + 1) % this.cats.length;
  }
}
