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

  // Function to add cats based on the game mode
  function addCatsBasedOnGameMode(board, mode) {
    if (gameMode === "playerVsPlayer") {
      board.addCatToBoard("blue");
      board.addCatToBoard("grey");
    } else {
      board.addCatToBoard("purple");
    }
  }
});


