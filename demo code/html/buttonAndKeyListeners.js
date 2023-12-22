//KEY CODES
//should clean up these hard-coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40


function handleKeyUp(e) {
//  console.log("key UP: " + e.which)
  if (e.which == ENTER) {
    handleGetPuzzleButton() //treat ENTER key like you would a submit
    document.getElementById('userTextField').value = ''

  }

  e.stopPropagation()
  e.preventDefault()

}

function handleGetPuzzleButton() {
  let userText = document.getElementById('userTextField').value;
  let textDiv = document.getElementById("text-area");
  textDiv.innerHTML = userText; 
  if (userText && userText != '') {

    let userRequestObj = { text: userText };
    let userRequestJSON = JSON.stringify(userRequestObj);
    document.getElementById('userTextField').value = '';

    fetch('userText', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: userRequestJSON
    })
    .then((response) => {
        return response.json();
    })
    .then((responseObj) => {
      words = [];
      if (responseObj.puzzleLines) {
        for (let i = 0; i < responseObj.puzzleLines.length; i++) {
          let line = responseObj.puzzleLines[i];
          for (let j = 0; j < line.length; j++) {
            let word = "";
            while (line[j] != " " && j < line.length) {
              word += line[j];
              j++;
            }
            words.push({
              word: word,
              x: Math.floor(Math.random() * (canvas.width - (word.length*20))),
              y: Math.floor(Math.random() * (canvas.height - 40)) + 20
            });
          }
        }
        //print the file path
        console.log("file path: " + responseObj.filePath);
        //print the randomized puzzle words
        console.log("Puzzle words: "+ randomizeWords());
        console.log("text: " + responseObj.text)
      }
      drawCanvas();
    })
    .catch(err => console.error('Fetch error:', err));
  }
}
function handleSolvePuzzleButton() {
  //get the div's text that contains the user text
  let textDiv = document.getElementById("text-area");
  //clear the div
  textDiv.innerHTML = "";
  //store sorted words by y axis
  let sortedY=sortYaxis(words);
  //loop through the array of words
  //if the y axis of the current word is within 10 pixels of the next word
  //add the words to the str array
  //then sort the str array by x axis
  //then add the words to the lines string to form a line
  //then add the line to the textDiv
  for(let i = 0; i < words.length; i++) {
    let str=[]
    let lines="";
    str.push(sortedY[i]);
    while (i < words.length-1 && Math.abs(sortedY[i].y - sortedY[i+1].y) <= 10) {
      let pivotY=sortedY[i].y;
      str.push(sortedY[i+1]);
      i++;
      sortedY[i].y=pivotY;
    }
    let sortedX=sortXaxis(str);
    for(let j=0;j<sortedX.length;j++){
      lines+=sortedX[j].word+" ";
    }
    textDiv.innerHTML = textDiv.innerHTML + `<p>${lines}</p>`;
  }
  //get everything in the p tags and put it in an array
  //turn lines into an array of words
  //check if the words are in order with the puzzle words
  //if they are, make the line green
  //if not, make the line red
  let lineElement = document.querySelectorAll("p");
  let array = [...lineElement].map(v => v.innerText);
  array=lineToArray(array);
  for(let i=0;i<lineElement.length;i++){
    if(isInOrder(words,array)){
      lineElement[i].style.color = "green"
    }
    else{
      lineElement[i].style.color = "red"
    }
  }
}