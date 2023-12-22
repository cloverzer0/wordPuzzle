
document.addEventListener('DOMContentLoaded', function() {
  //This is called after the browser has loaded the web page

  //add mouse down listener to our canvas object
  document.getElementById('canvas1').addEventListener('mousedown', handleMouseDown)
  //add listener to submit button
  document.getElementById('Get_puzzle_button').addEventListener('click', handleGetPuzzleButton)
  document.getElementById('Solve_puzzle_button').addEventListener('click', handleSolvePuzzleButton)

  document.addEventListener('keyup', handleKeyUp)



  drawCanvas()
})
