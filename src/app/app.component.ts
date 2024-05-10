import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CellState, SimulationParameters} from "./types";
import {CELL_COUNT, CHART_LENGTH, ROW_COUNT} from "./consts";
import {
  createInitialChart,
  drawGrid,
  evolveCell,
  generateNewRows, getCellClassName,
  getChartLengthZeros, getCurrentAshPercentage, getCurrentFirePercentage, getCurrentTreePercentage,
  isAnyCellInTheNeightbourhoodBurning,
  makeIndexValid, updateChartData
} from "./helpers";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "./material.module";
import {interval, Subscription} from "rxjs";
import {Chart} from "chart.js";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    CommonModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'forest_fire_simulation';
  currentStep = 0;
  // isStopped = false;

  rows: CellState[][] = generateInitialRows();
  windDirection: number = 0;
  windSpeed: number = 0;

  parameters: SimulationParameters = {
    windSpeed: 0,
    windDirection: 0,
    probabilityOfRandomTree: 0.01,
    probabilityOfRandomFire: 0.0001,
  }

  historicalStepNumbers: number[] = [];
  historicalAshPercentages: number[] = [];
  historicalTreePercentages: number[] = [];
  historicalFirePercentages: number[] = [];
  programRunSubscription?: Subscription;
  chart?: Chart<"line", number[], number>;

  ngOnInit() {
    const parameters = this.parameters;
    document.getElementById('windSelector')?.addEventListener('click', function(event) {
      const rect = this.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
      const degrees = angle * (180 / Math.PI) + 90;  // Normalize angle to make 0 degrees point upwards
      parameters.windDirection =  degrees;
      document.getElementById('arrow')!.style.transform = `rotate(${degrees}deg)`;
    });

    this.chart = createInitialChart();

    this.run();
  }

  run(){
    const source = interval(500);
    this.programRunSubscription = source.subscribe(_i => {
      this.step();
    })
  }


  step(){
    this.currentStep += 1;
    this.rows = generateNewRows(this.rows, this.parameters);
    drawGrid(this.rows);

    const ashCellPercentage = getCurrentAshPercentage(this.rows)
    const treeCellPercentage = getCurrentTreePercentage(this.rows)
    const fireCellPercentage = getCurrentFirePercentage(this.rows)
    this.historicalStepNumbers = [...this.historicalStepNumbers, this.currentStep];
    this.historicalAshPercentages = [...this.historicalAshPercentages, ashCellPercentage];
    this.historicalTreePercentages =  [...this.historicalTreePercentages, treeCellPercentage];
    this.historicalFirePercentages =  [...this.historicalFirePercentages, fireCellPercentage];
    debugger;
    updateChartData(this.chart!, this.historicalStepNumbers, this.historicalAshPercentages, this.historicalTreePercentages, this.historicalFirePercentages);
  }

  reset(){
    console.log("reset")
    this.programRunSubscription?.unsubscribe();
    this.rows = generateInitialRows();
    this.currentStep = 0;
  }

  start(){
    console.log("statr")
    this.run();
  }

  pause(){
    console.log("pause")
    this.programRunSubscription?.unsubscribe();
  }


  protected readonly getCurrentAshPercentage = getCurrentAshPercentage;
  protected readonly getCurrentTreePercentage = getCurrentTreePercentage;
  protected readonly getCurrentFirePercentage = getCurrentFirePercentage;
}

function generateInitialRows() {
  const rows = [...Array(ROW_COUNT).keys()].map(_i => {
    return [...Array(CELL_COUNT).keys()].map(_j => {
      const isTree = Math.random() < 0.4;
      const resultState: CellState = isTree ? 'TREE' : 'ASH';
      return resultState;
    })
  })
  return rows;
}



