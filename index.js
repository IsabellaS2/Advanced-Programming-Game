class GameBoard {
   constructor(container, numberOfDivs) {
     this.container = container;
     this.numberOfDivs = numberOfDivs;
     this.createBoard();
   }
 
   createBoard() {
     for (let i = 1; i <= this.numberOfDivs; i++) {
       const newDiv = $("<div>", {
         id: "box-" + i,
         class: "box",
       });
       this.container.append(newDiv);
     }
     this.addNumbersToBoxes();
   }
 
   addNumbersToBoxes() {
     let boxes = $('.box');
     let rowCount = 0;
 
     for (let i = 0; i < boxes.length; i++) {
       let rowIndex = Math.floor(i / 10); // Assuming there are 10 boxes in a row
       let isEvenRow = rowIndex % 2 === 0;
 
       if (isEvenRow) {
         boxes.eq(i).html((rowCount + 1) * 10 - i % 10);
       } else {
         boxes.eq(i).html(rowCount * 10 + 1 + i % 10);
       }
 
       if ((i + 1) % 10 === 0) {
         rowCount++;
       }
     }
   }
 }
 
 $(document).ready(function () {
   const gameBoard = new GameBoard($("#game-board"), 100);
 });