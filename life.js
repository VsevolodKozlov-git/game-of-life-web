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
    if (grid[row][col]){
      const cellElement = document.createElement('div');
      cellElement.style.gridRowStart = row+1;
      cellElement.style.gridColumnStart = col+1;
      cellElement.classList.add('life');
      gameGrid.appendChild(cellElement);
    }
  }
}

delta_time = 200;


let lastRenderTime = 0;

function main(currentTime) {
  // if (gameOver) {
  //   if (confirm('You lost. Press ok to restart.')) {
  //     window.location = '/'
  //   }
  //   return
  // }

  window.requestAnimationFrame(main)
  const secondsSinceLastRender = (currentTime - lastRenderTime);
  if (secondsSinceLastRender < 200) return
  lastRenderTime = currentTime
  draw();
  step();
}


window.requestAnimationFrame(main);
// draw();

// for(let [row, col] of createMatrixIter()){
//   getNeighbours(row,col);
// }
