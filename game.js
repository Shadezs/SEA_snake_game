/* game.js

This code handles the game elements and interactions on game.html. 
Most of your work will be here!
*/
console.log("hello, game is started")
/***INITIALIZING VARIABLES AND OBJECTS***/
let life =3;
let Highestscore=0;
let score =0;
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
let grid = 40;
let count = 0;
let img =document.getElementById('apple');
let speed=16;
let dif =5;
let snake = {
  x: 160,
  y: 160,
  x_step: grid, //snake velocity. moves one grid length every frame in either the x or y direction
  y_step: 0,
  cells: [],  //an array that keeps track of all grids the snake body occupies
  currentLength: 1,//current length of the snake. grows when eating an apple.
  color:'#AA1B74'
};
let apple=
{
  x:0,
  y:0,
  color:'#ff0000'
  
}
/***MAIN FUNCTIONS***/
/* start the game */
function randomcolor(){
  return "#" + Math.random().toString(16).slice(2, 8)
  
}
requestAnimationFrame(snakeSquadLoop);
function drawApple(){
  context.fillStyle = "#FF0000";
  context.fillRect(apple.x,apple.y,grid-3,grid-3)
  //context.drawImage(img,apple.x,apple.y,grid,grid)
  console.log("im runnig")
  /* TO DO */
}
/* Listen to keyboard events to move the snake */
document.addEventListener('keydown', function(e) {
  // prevent snake from backtracking on itself by checking that it's 
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)

  // left arrow key
  if (e.which === 37 && snake.x_step === 0) {
    snake.x_step = -grid;
    snake.y_step = 0;
  }
  // up arrow key
  else if (e.which === 38 && snake.y_step === 0) {
    snake.y_step = -grid;
    snake.x_step = 0;
  }
  // right arrow key
  else if (e.which === 39 && snake.x_step === 0) {
    snake.x_step = grid;
    snake.y_step = 0;
  }
  // down arrow key
  else if (e.which === 40 && snake.y_step === 0) {
    snake.y_step = grid;
    snake.x_step = 0;
  }
});

/***HELPER FUNCTIONS***/

/*snakeSquadLoop: This is the main code that is run each time the game loops*/
function reset(){
  speed=16;
  score=0;
  snake.cells=[];
  snake.currentLength =1;
  randomlyGenerateApple()
  
}
function displayScoreAndLife(){
  document.getElementById("score").innerHTML=`Score: ${score}`;
  document.getElementById("lives").innerHTML=`Live: ${life}`;
  document.getElementById("Maxscore").innerHTML=`High score: ${Highestscore}`;
}
function highscore(){
  if(score>Highestscore)
  {
    Highestscore=score;
  }
  
}
randomlyGenerateApple();
randomstart();
function snakeSquadLoop() {
  requestAnimationFrame(snakeSquadLoop);
  // if count < 16, then keep looping. Don't animate until you get to the 16th frame. This controls the speed of the animation.
  if (count < speed) {
    count++;
    return;
  }
  //Otherwise, it's time to animate. 
  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);
  
  calculateSnakeMove();
  highscore();
  drawSnake();
  checkCrashItself();
  drawApple();
  displayScoreAndLife();
  if(snakeTouchesApple()){
   randomlyGenerateApple();
   lengthenSnakeByOne();
   score+=1;
  }
  if(life<=0)
  {
    endGame();
  }
  if(score>dif && speed>0)
  {
    speed-=1.5;
    dif*=1.5;
  }
  
  
}

function calculateSnakeMove(){
  // move snake by its velocity
  snake.x += snake.x_step;
  snake.y += snake.y_step;

  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});

  // remove cells as we move away from them
  if (snake.cells.length > snake.currentLength) {
    snake.cells.pop();
  }
}
function drawSnake(){
  for(let i =0;i<snake.cells.length;i++)
  {
    if(i==0)
    {
      drawCellWithBitmoji(snake);
    }else
    {
     context.fillStyle=snake.color;
     context.fillRect(snake.cells[i].x,snake.cells[i].y,grid-3,grid-3); 
     //console.log(`snake cell index:${i} cell${i}.x:${snake.cells[i].x} cell${i}.y:${snake.cells[i].y}`)
    }
  }
}
function drawCellWithBitmoji(cell){
  const avatar_url = localStorage.getItem('avatarurl');
  document.getElementById('avatar').src = avatar_url;
  context.drawImage(document.getElementById('avatar'),0, 0, 200, 200, cell.x+5, cell.y+5, grid, grid);
}
function snakeTouchesApple(){
  if(snake.cells[0].x==apple.x && snake.cells[0].y==apple.y)
  {
    return true;
  }else{
    return false;
  }
}
function lengthenSnakeByOne(){
  snake.currentLength = snake.currentLength + 1;
}
function randomstart(){
  snake.x=getRandomInt(0,15) * grid;
  snake.y=getRandomInt(0,15) * grid;
}
function randomlyGenerateApple(){
  apple.x = getRandomInt(0, 15) * grid;
  apple.y = getRandomInt(0, 15) * grid;
}
function checkCrashItself(){
    for (let i = 0; i < snake.cells.length; i++) {
      const curr_cell = snake.cells[i];
      for (let j = i + 1; j < snake.cells.length; j++){
        const next_cell = snake.cells[j];
        if (curr_cell.x == next_cell.x && curr_cell.y == next_cell.y) {
          life-=1;
          reset();
      }
    }
  }
}
function endGame(){
  alert("GAME OVER");
  document.location.reload();
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
