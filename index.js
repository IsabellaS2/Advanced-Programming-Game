$(document).ready(function () {
  const gameContainer = $("#game-container");
  const diceRollResult = $("#dice-roll-result");

  const gameBoard = new GameBoard(gameContainer, 100, diceRollResult);

  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");

  if (mode === "playerVsPlayer") {
    gameBoard.addCat("black");
    gameBoard.addCat("orange");
  } else {
    gameBoard.addCat("black");
  }

  $("#onePlayerBtn, #playerVsPlayerBtn").click(function () {
    gameBoard.diceRoller.roll();
  });
});
