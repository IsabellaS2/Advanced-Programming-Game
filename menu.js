// menu.js
$(document).ready(function () {
  $("#onePlayerBtn").click(function () {
    window.location.href = "index.html?mode=onePlayer";
  });

  $("#computerVScomputerBtn").click(function () {
    window.location.href = "index.html?mode=playerVsPlayer";
  });

  $("#playerVsPlayerBtn").click(function () {
    window.location.href = "index.html?mode=computerVScomputer";
  });
});

//Handle the modal functionality

// Function to open the modal
function openModal() {
  const modal = document.getElementById("instructionsModal");
  modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById("instructionsModal");
  modal.style.display = "none";
}

// Close the modal if the user clicks outside of it
window.onclick = function (event) {
  const modal = document.getElementById("instructionsModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
