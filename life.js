const cols = 20; // width
const rows = 20; // height
const gameGrid = document.querySelector('.game-grid');


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


let grid = createGrid();
 

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
    cellElement.style.gridRowStart = row+1;
    cellElement.style.gridColumnStart = col+1;
    // add specific class for cell
    alive = (grid[row][col] === 1);
    className = alive ? "life" : "dead";
    cellElement.classList.add(className);
    // add general class for cell
    cellElement.classList.add('cell');
    gameGrid.appendChild(cellElement);
    
  }
}


function addMouseClickListeners(){
  $('cell').onClick()
}



deltaTime = 200;
let lastRenderTime = 0;

function main(currentTime) {
  window.requestAnimationFrame(main)
  const secondsSinceLastRender = (currentTime - lastRenderTime);
  if (secondsSinceLastRender < deltaTime) return
  lastRenderTime = currentTime;
  draw();
  step();
}


window.requestAnimationFrame(main);
