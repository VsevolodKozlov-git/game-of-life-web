function* createMatrixIter(){
  let iterCnt = 0;
  for(let row=0; row<rows; row++){
    for(let col=0; col<cols; col++){
      iterCnt++;
      yield [row, col];
    }
  }
  return iterCnt;
}

function createGrid(){
  let grid = [];
  for (let [row, col] of createMatrixIter()){
    if (col === 0){
      grid.push([])
    }
    cell_val = Math.round(Math.random());
    grid[row].push(cell_val)
  }
  return grid;
}


// main game variables
const cols = 20; // width
const rows = 20; // height
const gameGrid = document.querySelector('.game-grid');
const animDeltaTime = 200; // time between next step of animation
let grid = createGrid();
let pause = false;


function getNeighbours(row, col){
  res = 0;
  stRow = row - 1 + Number(row == 0)
  stCol = col - 1 + Number(col == 0)
  enRow = (row + 1) - Number(row == rows - 1)
  enCol = (col + 1) - Number(col == cols - 1)
  for(let forRow=stRow; forRow<=enRow; forRow++){
    for(let forCol=stCol; forCol<=enCol; forCol++){
      if(forRow === row && forCol === col){
        continue;
      }
      res += grid[forRow][forCol]; 
    }
  }
  return res;
}

function getNextGeneration(){
  newGrid = [];
  for ([row, col] of createMatrixIter()){
    if (col === 0){
      newGrid.push([]);
    } 
    let neighbours = getNeighbours(row, col);
    let alive = grid[row][col];
    if (alive){
      if ((neighbours === 2) || (neighbours === 3)){
        newGrid[row].push(1);
      }
      else {
        newGrid[row].push(0);
      }
    } 
    else {
      if (neighbours === 3) {
        newGrid[row].push(1);
      }
      else {
        newGrid[row].push(0);
      }
    }
  }
  return newGrid;
}

function step(){
  new_grid = getNextGeneration();
  grid = newGrid;
}


function draw(){
  gameGrid.innerHTML = '';
  for(let [row, col] of createMatrixIter()){
    const cellElement = document.createElement('div');
    cellElement.style.gridRowStart = String(row + 1);
    cellElement.style.gridColumnStart = String(col + 1);
    // add specific class for cell
    alive = (grid[row][col] === 1);
    className = alive ? "life" : "dead";
    cellElement.classList.add(className);
    // add general class for cell
    cellElement.classList.add('cell');
    gameGrid.appendChild(cellElement);
    
  }
}




let a = null; // debug variable

//jquery listeners add
function addMouseClickListeners(){
  $('.cell').on("click", function(event) {
    let jqueryObj = $(event.target);

    // a = event.target;
    let target = $(event.target);

    //visual part(change css classes)
    if (target.hasClass("life")){
      target.removeClass("life");
      target.addClass("dead");
    }
    else {
      target.removeClass("dead");
      target.addClass("life");
    }

    // logical part(change grid)
    let row = Number(target.css("grid-row-start")) - 1;
    let col = Number(target.css("grid-column-start")) - 1;
    grid[row][col] = grid[row][col] === 1 ? 0 : 1;
  })
}



function addKeyboardListeners(){
  $("body").on("keypress", function(event){
    if (event.key === "p"){
      pause = !pause;
    }
  });
}


// technical animation variable
let lastRenderTime = 0;

// function that repeat each $animDeltaTime
function main(currentTime) {
  window.requestAnimationFrame(main)
  const secondsSinceLastRender = (currentTime - lastRenderTime);
  if (secondsSinceLastRender < animDeltaTime || pause) return;
  lastRenderTime = currentTime;
  draw();
  addMouseClickListeners();
  step();
}

// run main function
addKeyboardListeners();
window.requestAnimationFrame(main);
