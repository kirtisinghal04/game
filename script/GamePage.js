window.addEventListener("load", function () {

  let startButton = document.querySelector("button");
  let buttonParent = document.querySelector("#EmojisContainer");
  let easyModeButton = this.document.querySelector(".easy_mode");
  let hardModeButton = this.document.querySelector(".hard_mode");
  let gameSound = this.document.querySelector("#game_play");
  let click_sound = this.document.querySelector("#click_sound");
  //reset button:-
  let resetButton = document.createElement("button");
  let nameDiv = this.document.querySelector("#username");
  let scoreDiv = this.document.querySelector("#totalScore");
  const existingPlayersInfo = getInfoFromLocalStorage();
  const existingPlayerIndex = existingPlayersInfo.findIndex(player => player.name === localStorage.getItem("Player-Name"));
  nameDiv.innerHTML += existingPlayersInfo[existingPlayerIndex].name;
  let parent = this.document.querySelector("#board");
  let my_image = createRandomImage();
  let gameSpeed = 499; // initial speed is easy mode
  let grid = fillTheGrid(10, 10, parent);

  let column = settingNewPosition(grid, my_image);
  let row = 0;
  grid[row][column].removeImage();
  let score = existingPlayersInfo[existingPlayerIndex].score;  // initial game score
  scoreDiv.innerHTML = `Score: ${score}`; // score coming from the database
  let totalScore = 0;

  let isPaused = false; // to track the pause state
  //let resetButton = document.getElementById("resetButton");

  // Easy mode
  easyModeButton.addEventListener("click", function () {
    hardModeButton.style.backgroundColor = "transparent";
    hardModeButton.style.color = "black";
    easyModeButton.style.backgroundColor = "green";
    easyModeButton.style.color = "white";
    gameSpeed = 499;
    // Change the song source
    gameSound.src = "audio/oggy_cockroaches.mp3";
  });

  // Hard mode
  hardModeButton.addEventListener("click", function () {
    easyModeButton.style.backgroundColor = "transparent";
    easyModeButton.style.color = "black";
    hardModeButton.style.backgroundColor = "red";
    hardModeButton.style.color = "white";
    
    gameSpeed++;
    gameSpeed = (gameSpeed / 2) + 1;

    // Change the song source
    gameSound.src = "audio/oggy_cockroaches.mp3";
  });

  let time = 120;
  let gameProcessId, timeProcessId;  // These will store the interval IDs

  startButton.addEventListener("click", function () {
    click_sound.play();
    // After ending of the play
    click_sound.addEventListener("ended", function () {
      gameSound.play();

      buttonParent.removeChild(startButton);

      // Adding timer
      var timerDiv = document.createElement("div");
      timerDiv.classList.add("timer");
      buttonParent.appendChild(timerDiv);

      // Adding pause button
      let pauseButton = document.createElement("button");
      pauseButton.innerHTML = "Pause";
      pauseButton.classList.add("pause_button");
      buttonParent.appendChild(pauseButton);

      pauseButton.addEventListener("click", function () {
        if (isPaused) {
          // Resume the game
          pauseButton.innerHTML = "Pause";
          isPaused = false;
          startGame();
          startTimer();
        } else {
          // Pause the game
          pauseButton.innerHTML = "Resume";
          isPaused = true;
          clearInterval(gameProcessId);  // Stop game loop
          clearInterval(timeProcessId);  // Stop timer
        }
      }); 
      //reset button section start..........
// Reset button event listener
let resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", function () {
    // Reset the game board
    resetGameBoard(grid);

    // Reset the scores
    totalScore = 0;
    score = 0;
    scoreDiv.innerHTML = `Score: ${score}`;
    
    // Reset the score containers for the emojis
    let emojiScores = document.getElementsByClassName("score");
    for (let i = 0; i < emojiScores.length; i++) {
        emojiScores[i].innerText = "0";
    }

    // Stop the game and timer if running
    clearInterval(gameProcessId);
    clearInterval(timeProcessId);

    // Reset player score in local storage
    existingPlayersInfo[existingPlayerIndex].score = 0;
    saveInfoToLocalStorage(existingPlayersInfo);

    // Optionally reset the timer
    time = 120;
    
    // Show a reset confirmation
    fireAlert("Reset", "Game has been reset", "info");
});
//reset button section end
      // Movement of the image
      document.addEventListener("keydown", function (event) {
        if (!isPaused) {  // Allow movement only if the game is not paused
          if (event.key === "ArrowRight") {
            if (column + 1 <= 9 && grid[row][column + 1].isEmpty()) {
              grid[row][column].removeImage();
              column++;
              grid[row][column].appendImage(my_image);
            }
          } else if (event.key === "ArrowLeft") {
            if (column - 1 >= 0 && grid[row][column - 1].isEmpty()) {
              grid[row][column].removeImage();
              column--;
              grid[row][column].appendImage(my_image);
            }
          }
        }
      });

      let killProcess = 0; // Flag to control interval processes  
      let emojisBoard = document.getElementsByClassName("score");
      let emojisImages = document.getElementsByClassName("emoji_image");

      // Start the game and timer
      startGame();
      startTimer();

      function startGame() {
        gameProcessId = setInterval(function () {
          if (!isPaused) {
            if (row < 10 && grid[lowerBoundry(row)][column].isEmpty()) {
              grid[row][column].removeImage();
              grid[++row][column].appendImage(my_image);
              
              
            } else if (row >= 10 || !grid[lowerBoundry(row)][column].isEmpty()) {
              let verticImage = checkMatchingVertically(grid, row, column);
              let horizonImage = checkHorizontallyMatching(grid, row, column);

              if (verticImage != -1) {
                let verticImageIndex = searchOnImage(verticImage, emojisImages);
                emojisBoard[verticImageIndex].innerText = Number(emojisBoard[verticImageIndex].innerText) + 1 + "";
                score += 1;
                totalScore += 1;
                scoreDiv.innerHTML = `Score: ${score}`;
                existingPlayersInfo[existingPlayerIndex].score = score;
                saveInfoToLocalStorage(existingPlayersInfo);
              }

              if (horizonImage != -1) {
                let horizonImageIndex = searchOnImage(horizonImage, emojisImages);
                emojisBoard[horizonImageIndex].innerText = Number(emojisBoard[horizonImageIndex].innerText) + 1 + "";
                score += 1;
                totalScore += 1;
                scoreDiv.innerHTML = `Score: ${score}`;
                existingPlayersInfo[existingPlayerIndex].score = score;
                saveInfoToLocalStorage(existingPlayersInfo);
              }

              if (totalScore == 10) {
                clearInterval(gameProcessId);
                clearInterval(timeProcessId);
                fireAlert("Congratulations", "You won", "success");
              }

              row = 0;
              my_image = createRandomImage();
              column = settingNewPosition(grid, my_image);
              grid[row][column].removeImage();
              grid[row][column].appendImage(my_image);

              if (!grid[1][column].isEmpty()) {
                killProcess = 1;
              }
            }

            if (killProcess) {
              clearInterval(gameProcessId);
              if (!grid[1][column].isEmpty()) {
                fireAlert("Unfortunately", "You lost", "error");
              }
            }
          }
        }, gameSpeed);
      }

      function startTimer() {
        timeProcessId = setInterval(function () {
          if (!isPaused) {
            displayTime(time, timerDiv);

            if (time > 0) {
              time -= 1;
            } else if (time <= 0) {
              killProcess = 1;
            }

            if (killProcess) {
              clearInterval(timeProcessId);
              if (time <= 0) {
                fireAlert("Unfortunately", "Time is out", "error");
              }
            }
          }
        }, 1000);
      }
    });
  });
  function resetGameBoard(grid) {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            grid[row][col].removeImage(); // Assuming removeImage removes the emoji/image
        }
    }

    // Reinitialize the game if necessary
    row = 0;
    column = settingNewPosition(grid, createRandomImage());
}

});
