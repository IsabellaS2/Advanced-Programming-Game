$(document).ready(function () {
  const gameContainer = $("#game-container");
  const diceRollResult = $("#dice-roll-result");

  const gameBoard = new GameBoard(gameContainer, 100, diceRollResult);

  const urlParams = new URLSearchParams(window.location.search);
  const gameMode = urlParams.get("mode") || "singlePlayer"; // Provide a default value

  addCatsBasedOnGameMode(gameBoard, gameMode);

  $("#onePlayerBtn, #playerVsPlayerBtn").click(function () {
    gameBoard.diceRoller.performRoll();
  });

  if (gameMode === "computerVScomputer") {
    gameBoard.runComputerPlayer();
  }

  // Function to add cats based on the game mode
  function addCatsBasedOnGameMode(board, mode) {
    if (mode === "playerVsPlayer") {
      board.addCatToBoard("blue", 1);
      board.addCatToBoard("grey", 2);
    } else if (mode === "onePlayer") {
      board.addCatToBoard("purple", 1);
    } else if (mode === "computerVScomputer") {
      board.addCatToBoard("orange", 1); // Human player
      board.addCatToBoard("black", 2); // Computer player
    }
  }
});