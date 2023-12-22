/*
Javascript example using an html <canvas> as the main
app client area.
The application illustrates:
-handling mouse dragging and release
to drag a strings around on the html canvas
-Keyboard arrow keys are used to move a moving box around

Here we are doing all the work with javascript.
(none of the words are HTML, or DOM, elements.
The only DOM element is just the canvas on which
where are drawing and a text field and button where the
user can type data

Mouse event handlers are being added and removed.

Keyboard keyDown handler is being used to move a "moving box" around
Keyboard keyUP handler is used to trigger communication with the
server via POST message sending JSON data

*/

//DATA MODELS
//Use javascript array of objects to represent words and their locations

let words = []
words.push({word: "I", x: 50, y: 50})
words.push({word: "like", x: 70, y: 50})
words.push({word: "javascript", x: 120, y: 50})


let timer //used for the motion animation

const canvas = document.getElementById('canvas1') //our drawing canvas
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function randomLocation(item) {
  const context = canvas.getContext('2d')
  let width = context.measureText(item.word).width
  item.x=Math.floor(Math.random() * (canvas.width - (width+item.x)))
  item.y= Math.floor(Math.random() * (canvas.height - 40)) + 20
}
words.forEach(randomLocation)

function getWordAtLocation(aCanvasX, aCanvasY) {

  //locate the word near aCanvasX,aCanvasY
  //Just use crude region for now.
  //should be improved to using length of word etc.

  //note you will have to click near the start of the word
  //as it is implemented now
  let TOLERANCE = 10;
  const context = canvas.getContext('2d')
  for (let i = 0; i < words.length; i++) {
    let width = context.measureText(words[i].word).width
    if ((Math.abs(words[i].x) <= aCanvasX) && (Math.abs((width+words[i].x )) >= aCanvasX) &&
      (Math.abs(words[i].y -TOLERANCE- aCanvasY)) <= TOLERANCE) {
        return words[i]
  }
  }
  return null
}
//Copy values in array fullArray to emptyArray
function copy(emptyArray,fullArray){
  for(let i=0;i<fullArray.length;i++){
    emptyArray.push(fullArray[i]);
  }
}
//Sorts the array by x axis from smallest to largest
function sortXaxis(arr){
  let sortXaxis=[]
  copy(sortXaxis,arr)
  for(let i=0;i<arr.length-1;i++){
    if(sortXaxis[i].x>sortXaxis[i+1].x){
      let temp=sortXaxis[i]
      sortXaxis[i]=sortXaxis[i+1]
      sortXaxis[i+1]=temp
      i=-1;
    }
  }
  return sortXaxis
}
//Sorts the array by y axis from smallest to largest
function sortYaxis(arr){
  let sortYaxis=[]
  copy(sortYaxis,arr)
  for(let i=0;i<arr.length-1;i++){
    if(sortYaxis[i].y>sortYaxis[i+1].y){
      let temp=sortYaxis[i]
      sortYaxis[i]=sortYaxis[i+1]
      sortYaxis[i+1]=temp
      i=-1;
    }
  }
  return sortYaxis
}
//Checks if the words are in order with the puzzle words
function isInOrder(puzzleLines,arr){
  for(let i=0;i<puzzleLines.length;i++){
    if(puzzleLines[i].word!=arr[i]){
      return false;
    }
  }
  return true;
}
//Splits the lines into an array
function lineToArray(a){
  str=[]
  for(let i=0;i<a.length;i++){
    a[i]=a[i].split(" ");
    for(let j=0;j<a[i].length;j++){
      str.push(a[i][j]);
    }
  }
  return str;
}
//Randomizes the words in the puzzle
function randomizeWords(){
  let index=[];
  for(let i=0;i<words.length;i++){
    index.push(i);
  }
  array = []
  for(let i=0;i<words.length;i++){
    let randIndex=getRndInteger(0,words.length);
    if(index.includes(randIndex)){
      array.push(words[randIndex].word);
      index.splice(index.indexOf(randIndex),1);
    }
    if(i==words.length-1&&array.length!=words.length){
      i=-1;
    }
  }
  return array;
}
function drawCanvas() {
  /*
  Call this function whenever the canvas needs to be redrawn.
  */
  const context = canvas.getContext('2d')

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  context.font = '20pt Arial'
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'

  for (let i = 0; i < words.length; i++) {

    let data = words[i]
    context.fillText(data.word, data.x, data.y)
    context.strokeText(data.word, data.x, data.y)

  }
}
