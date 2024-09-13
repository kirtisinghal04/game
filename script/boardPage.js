window.addEventListener("load", function () {
    let playersInfo = getInfoFromLocalStorage();
    
    // Ensure player info is displayed before calculating scores
    displayAllPlayersInfo(playersInfo, 'tbody');
    
    // After displaying player info, calculate the total score
    const rows = document.querySelectorAll('#InfoTable tbody tr');
    let totalScore = 0;

    rows.forEach(row => {
        const score = parseInt(row.cells[1].innerText); // Get the score from the second column
        totalScore += score;
    });

    const resultText = document.getElementById('resultText');
    const emoji = document.getElementById('emoji');

    // Calculate the average score
    const averageScore = totalScore / rows.length;

    // Update the result text and emoji based on the average score
    if (averageScore > 10) {
        resultText.innerText = "Perfect!";
        emoji.innerHTML = "&#127881;"; // Party emoji
    } else {
        resultText.innerText = "Well Tried!";
        emoji.innerHTML = "&#128578;"; // Normal smile emoji
    }

    console.log("Player information loaded and score calculated");
});
