const changeOpacity = function (input, button) {
    if (input.value.trim())
        button.style.opacity = 1;
    else {
        button.style.opacity = 0.5;
    }
}

const displayTime = function (time, element) {
    var minutes = Math.floor(time / 60);
    var seconds = time % 60;
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    element.innerHTML = `${minutes}:${seconds}`;
}
const checkValidUsername = function (username) {
    const usernameRegex = /^[a-zA-Z_]+$/;
    if (!username) {
        return false;
    }
    if (!usernameRegex.test(username)) {
        return false;
    }
    if (username.length < 2) {
        return false;
    }
    return true;
}




const changeSoundButtonState = function (source, music) {

    if (source == "images/sound.png") {
        music.pause();
        return "images/no-sound.png";
    }

    else if (source == "images/no-sound.png") {
        music.play();
        return "images/sound.png";
    }
    else
        return "";

}

const createRandomImage = function () {
    let image = this.document.createElement("img");
    let imageSrcIndex = Math.ceil(5 * Math.random()); //from 1 to 5
    imageSrcIndex -= (imageSrcIndex > 5) //avoiding 6 case
    // console.log(imageSrcIndex);
    image.src = `images/${imageSrcIndex}.png`;
    return image;
}

const fillTheGrid = function (rows, columns, parent) {

    let grid = []; //intial matrix
    for (let i = 0; i < rows; i++) {
        grid[i] = [];  //each element is an array
        for (let j = 0; j < columns; j++) {
            let newCell = new Cell();  //creating new child class each time
            newCell.appendToParent(parent);
            grid[i][j] = newCell;
        }
    }

    return grid;
}

const settingNewPosition = function (grid, image) {
    let columnPosition = Math.round(Math.random() * grid[0].length);
    // console.log(columnPosition);
    columnPosition -= (columnPosition >= grid[0].length);
    grid[0][columnPosition].appendImage(image);

    return columnPosition;
}

const lowerBoundry = function (row) {
    if (row + 1 == 10)
        row = row;
    else if (row + 1 > 10)
        row--;
    else
        row++;
    return row;
}

function handleVerticalFalling(grid, row, column) {
    console.log("the row is"+row);
    for (let r = row - 1; r >= 0; r--) {
        if(!grid[r][column].isEmpty()){
            console.log("done first case")
            let emoji = grid[r][column].cell.childNodes[0];
            grid[r][column].removeContent();
            grid[r][column].removeImage();

            let newRow = r+1; //bottom row
            // Move the emoji down till the busy place
            while(newRow < 10 && grid[newRow][column].isEmpty()){
                grid[newRow++][column].appendImage(emoji);
             }             
        }
    }
}

 function handleHorizontalFalling(grid, row, column,isSuffix) {
    console.log("function is on ");
    if(!isSuffix){ //should i go reverse
    //go to the left
    for (let c = column ; (c < column+4 ) ; c++) {
          console.log("column number"+ c);
          handleVerticalFalling(grid,row,c);
    }
    }
    else{
        //go to the right 
        for (let c = column ; (c > column-4 ) ; c--) {
            console.log("column number"+ c);
            handleVerticalFalling(grid,row,c);
      }   
    }
}



const checkMatchingVertically = function(grid, row, column) {
    let vecticalCounter = 0;
    let elements=[];
    elements.push(grid[row][column]);  //intial state

    for (let r = row; r < grid.length-1; r++) {
        if (grid[r][column].cellImageNumber() === grid[r + 1][column].cellImageNumber()) {
            elements.push(grid[r+1][column]);
            vecticalCounter++;
        }
        else {
            break; //break if there's no stack of equal elements
        }

        if(vecticalCounter == 3)
        { 
          let imageSourceType = elements[0].cellImageNumber();    
          //removing the elements  
          for(let it =0 ;it< elements.length;it ++)
          {
            elements[it].removeContent();
            elements[it].removeImage();
          }      
          return imageSourceType;
        }
    }
    return -1;
}




const checkHorizontallyMatching = function (grid, row, column) {
    let horizontalCounter = 0;
    let elements = [];
    
    let isSuffix=0;
    elements.push(grid[row][column]);
    // Check to the right (next elements)
    for (let c = column; (c < grid[row].length - 1 && horizontalCounter < 3) ; c++) {
        if (!grid[row][c + 1].isEmpty() && grid[row][c].cellImageNumber() === grid[row][c + 1].cellImageNumber()) {
            elements.push(grid[row][c+1]);
            horizontalCounter++;
        } else {
            break;
        }
    }
    
    for (let c = column - 1; (c >= 0 && horizontalCounter < 3) ; c--) {
        if (!grid[row][c].isEmpty() && grid[row][c].cellImageNumber() === grid[row][c + 1].cellImageNumber()) {
            elements.unshift(grid[row][c]); // Add to the beginning of the array
            isSuffix =1;
            horizontalCounter++;
        } else {
            isSuffix =0;
            break; // Break the loop if consecutive elements are not equal
        }
    }

    if (horizontalCounter == 3) {
        // If the current element and three consecutive elements to the right or left are equal
        console.log(elements);
        let imageSourceType = elements[0].cellImageNumber();
        console.log("Horizontal Success");
                
        for (let it = 0; it < elements.length; it++) {
            elements[it].removeContent();
            elements[it].removeImage();
        }
        console.log("calling function now")        
        handleHorizontalFalling(grid,row,column ,isSuffix);
        return imageSourceType;
    }
  return -1;
}

const searchOnImage = function (targetImage, images) {

    for (let i = 0; i < images.length; i++) {
        if (targetImage == images[i].attributes.src.value)
            return i;
    }
    return -1; //not found

}

const fireAlert = function (title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'Ok',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'homePage.html'; // Replace with the actual home page URL
        }
    });
}
// Function to get array of player information from Local Storage
const getInfoFromLocalStorage=function() {
    const playersInfo = localStorage.getItem('Information');
    return playersInfo ? JSON.parse(playersInfo) : [];
}

// Function to save player information to Local Storage
const saveInfoToLocalStorage=function(Information) {
    localStorage.setItem('Information', JSON.stringify(Information));
}

// Function to display all players information in a table
const displayAllPlayersInfo=function(playersInfo, body) {
    const tableBody = document.querySelector(body);
    tableBody.innerHTML = '';

    playersInfo.forEach(player => {
        const row = tableBody.insertRow();
        const cellName = row.insertCell(0);
        const cellScore = row.insertCell(1);

        cellName.textContent = player.name;
        cellScore.textContent = player.score;
    });
}