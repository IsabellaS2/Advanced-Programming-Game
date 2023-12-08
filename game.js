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

  //distanceToMoveCat
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
    this.addImageToBoard("./assets/streams/stream-image1.png", 45, {
      topOffset: 80,
      leftOffset: 70,
      height: 160,
      width: 150,
    });

    this.addImageToBoard("./assets/streams/stream-image2.png", 5, {
      topOffset: 40,
      leftOffset: 65,
      height: 160,
      width: 150,
    });

    this.addImageToBoard("./assets/streams/stream-image3.png", 68, {
      topOffset: 65,
      leftOffset: 70,
      height: 160,
      width: 150,
    });

    this.addImageToBoard("./assets/streams/stream-image4.png", 29, {
      topOffset: 0,
      leftOffset: 40,
      height: 180,
      width: 200,
    });

    this.addImageToBoard("./assets/streams/stream-image5.png", 34, {
      topOffset: 30,
      leftOffset: 70,
      height: 180,
      width: 200,
    });

    // Adding string images
    this.addImageToBoard("./assets/strings/string-image1.png", 50, {
      topOffset: 30,
      leftOffset: 100,
      height: 180,
      width: 200,
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
      class: "custom-image", // Add a class for styling
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
