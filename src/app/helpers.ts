import {CHART_LENGTH} from "./consts";
import {CellState, SimulationParameters} from "./types";
import Chart from 'chart.js/auto';

export function getChartLengthZeros(){
  return [...Array(CHART_LENGTH).keys()].map(_x => 0);
}

export function makeIndexValid(i: number, collectionLength: number){
  if(i === -1){
    return collectionLength - 1;
  }
  if(i === collectionLength){
    return 0;
  }
  return i;
}

export function isAnyCellInTheNeightbourhoodBurning(cellNeightbourhood: CellState[][]){
  return cellNeightbourhood.flat().some(cell => cell === 'FIRE')
}

export function evolveCell(cellState: CellState, cellNeighbourhood: CellState[][], parameters: SimulationParameters): CellState {
  switch(cellState){
    case 'FIRE':
      return 'ASH'
    case 'ASH':
      if(Math.random() < parameters.probabilityOfRandomTree){
        return 'TREE'
      }
      return cellState;
    case 'TREE':
      if(isAnyCellInTheNeightbourhoodBurning(cellNeighbourhood)){
        return 'FIRE'
      }else{
        if(Math.random() < parameters.probabilityOfRandomFire){
          return 'FIRE'
        }
        return cellState
      }
  }
  return cellState;
}

export function generateNewRows(rows: CellState[][], parameters: SimulationParameters): CellState[][] {
  // console.log(`parameters.probabilityOfRandomFire: ${parameters.probabilityOfRandomFire}`)
  let newRows: CellState[][] = [];
  for(let i = 0; i < rows.length; i++){
    let newRow: CellState[] = []
    for(let j = 0; j < rows[0].length; j++){
      let validIMinus1 = makeIndexValid(i - 1, rows.length);
      let validJMinus1 = makeIndexValid(j - 1, rows[0].length);
      let validIPlus1 = makeIndexValid(i + 1, rows.length);
      let validJPlus1 = makeIndexValid(j + 1, rows[0].length);
      let neightbourhood = [
        [rows[validIMinus1][validJMinus1], rows[validIMinus1][j], rows[validIMinus1][validJPlus1]],
        [rows[i][validJMinus1], rows[i][j], rows[i][validJPlus1]],
        [rows[validIPlus1][validJMinus1], rows[validIPlus1][j], rows[validIPlus1][validJPlus1]],
      ]
      const currentCell = rows[i][j];
      const newCellState = evolveCell(currentCell, neightbourhood, parameters);
      newRow.push(newCellState);
    }
    newRows.push(newRow);
  }
  return newRows;
}

export function drawGrid(rows: CellState[][]) {
  const gridElement: HTMLElement = document.querySelector("#grid")!;
  gridElement.innerHTML = '';
  // console.log(gridElement);
  rows.forEach(row => {
    const rowElement = document.createElement("div");
    rowElement.className = "row"
    row.forEach(cell => {
      const cellElement = document.createElement("div");
      const cellClassName = `cell ${getCellClassName(cell)}`
      cellElement.className = cellClassName;
      rowElement.appendChild(cellElement);
    })
    gridElement.appendChild(rowElement);
  })
}

export function getCellClassName(cellState: CellState): string{
  switch(cellState){
    case 'ASH': return 'silver';
    case 'FIRE': return 'red';
    case 'TREE': return 'green';
  }
}

export function createInitialChart(){
  const ctx = (document.getElementById('myChart')! as HTMLCanvasElement);


  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Ash',
          data: [],
          borderColor: 'rgb(155, 155, 155)',
          backgroundColor: 'rgba(155, 155, 155, 0.5)',
        },
        {
          label: 'Tree',
          data: [],
          borderColor: 'rgb(0, 255, 0)',
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
        },
        {
          label: 'Fire',
          data: [],
          borderColor: 'rgb(255, 0, 0)',
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
        }
      ]
    },
    options: {
      // responsive: true,
      scales: {
        y: {
          suggestedMin: 0,
          suggestedMax: 101,
          ticks: {
            stepSize: 10
          }
        }
      }
    }
  });
  return chart
}

export function updateChartData(chart: Chart<"line", number[], number>, historicalStepNumbers: number[], newAshData: number[], newTreeData: number[], newFireData: number[]): void {
  debugger;
  chart.data.labels = historicalStepNumbers;
  chart.data.datasets[0].data = newAshData;
  chart.data.datasets[1].data = newTreeData;
  chart.data.datasets[2].data = newFireData;
  chart.update();
}


export function getCurrentAshPercentage(rows: CellState[][]){
  const flattenCells = rows.flat();
  return flattenCells.filter(cell => cell === 'ASH').length * 100.0 / flattenCells.length;
}

export function getCurrentTreePercentage(rows: CellState[][]){
  const flattenCells = rows.flat();
  return flattenCells.filter(cell => cell === 'TREE').length * 100.0 / flattenCells.length;
}

export function  getCurrentFirePercentage(rows: CellState[][]){
  const flattenCells = rows.flat();
  return flattenCells.filter(cell => cell === 'FIRE').length * 100.0 / flattenCells.length;
}
