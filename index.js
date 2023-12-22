$(document).ready(function () {
  // Get references to the game container and dice roll result elements
  const gameContainer = $("#game-container");
  const diceRollResult = $("#dice-roll-result");

  // Create a new GameBoard instance with 100 squares and set up dice rolling display
  const gameBoard = new GameBoard(gameContainer, 100, diceRollResult);

  // Retrieve the game mode from the URL parameters, default to "singlePlayer" if not provided
  const urlParams = new URLSearchParams(window.location.search);
  const gameMode = urlParams.get("mode") || "singlePlayer";

  setupGame(gameBoard, gameMode);

  $("#onePlayerBtn, #playerVsPlayerBtn").click(function () {
    gameBoard.diceRoller.performRoll();
  });

  // Function to set up the game based on the game mode
  function setupGame(board, mode) {
    addCatsBasedOnGameMode(board, mode);

    if (mode === "computerVScomputer") {
      board.runComputerPlayer();
    }
  }

  // Function to add cats based on the game mode
  function addCatsBasedOnGameMode(board, mode) {
    if (mode === "playerVsPlayer") {
      board.addCatToBoard("blue", 1);
      board.addCatToBoard("grey", 2);
    } else if (mode === "onePlayer") {
      board.addCatToBoard("purple", 1);
    } else if (mode === "computerVScomputer") {
      board.addCatToBoard("orange", 1);
      board.addCatToBoard("black", 2);
    }
  }
});
