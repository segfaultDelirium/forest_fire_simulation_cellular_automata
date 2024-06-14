import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CellState, SimulationParameters } from './types';
import {
  INITIAL_PROBABILITY_OF_RANDOM_FIRE,
  INITIAL_PROBABILITY_OF_RANDOM_TREE,
  PROBABILITY_OF_RANDOM_FIRE_STEP,
  PROBABILITY_OF_RANDOM_TREE_STEP,
} from './consts';
import {
  calculateFireSpreadProbabilityForWindInfluenceGrid,
  createInitialChart,
  drawGrid,
  generateInitialRows,
  generateInitialWindInfluenceGrid,
  generateNewRows,
  getCellClassName,
  getCurrentAshPercentage,
  getCurrentFirePercentage,
  getCurrentTreePercentage,
  updateChartData,
} from './helpers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { interval, Subscription } from 'rxjs';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'forest_fire_simulation';
  currentStep = 0;
  animationFrameDelay = 500;
  // isStopped = false;

  rows: CellState[][] = generateInitialRows();

  windInfluenceGrid: CellState[][] = generateInitialWindInfluenceGrid();

  parameters: SimulationParameters = {
    windSpeed: 0,
    windDirection: 0,
    probabilityOfRandomTree: INITIAL_PROBABILITY_OF_RANDOM_TREE,
    probabilityOfRandomFire: INITIAL_PROBABILITY_OF_RANDOM_FIRE,
  };

  historicalStepNumbers: number[] = [];
  historicalAshPercentages: number[] = [];
  historicalTreePercentages: number[] = [];
  historicalFirePercentages: number[] = [];
  programRunSubscription?: Subscription;
  chart?: Chart<'line', number[], number>;
  protected readonly getCurrentAshPercentage = getCurrentAshPercentage;
  protected readonly getCurrentTreePercentage = getCurrentTreePercentage;
  protected readonly getCurrentFirePercentage = getCurrentFirePercentage;
  protected readonly getCellClassName = getCellClassName;
  protected readonly calculateFireSpreadProbabilityForWindInfluenceGrid =
    calculateFireSpreadProbabilityForWindInfluenceGrid;

  ngOnInit() {
    const parameters = this.parameters;
    document
      .getElementById('windSelector')
      ?.addEventListener('click', function (event) {
        const rect = this.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(
          event.clientY - centerY,
          event.clientX - centerX,
        );
        const degrees = angle * (180 / Math.PI) + 90; // Normalize angle to make 0 degrees point upwards
        parameters.windDirection = Math.round(degrees);
        document.getElementById('arrow')!.style.transform =
          `rotate(${degrees}deg)`;
      });

    this.chart = createInitialChart();
    // drawWindInfluenceGrid(this.windInfluenceGrid);

    this.run();
  }

  rotateArrow(){
    const degrees = this.parameters.windDirection; // Normalize angle to make 0 degrees point upwards
    document.getElementById('arrow')!.style.transform =
      `rotate(${degrees}deg)`;
  }

  run() {
    const source = interval(this.animationFrameDelay);
    this.programRunSubscription = source.subscribe((_i) => {
      this.step();
    });
  }

  reRunAnimation() {
    this.pause();
    this.start();
  }

  step() {
    this.currentStep += 1;
    this.rows = generateNewRows(this.rows, this.parameters);
    drawGrid(this.rows);

    const ashCellPercentage = getCurrentAshPercentage(this.rows);
    const treeCellPercentage = getCurrentTreePercentage(this.rows);
    const fireCellPercentage = getCurrentFirePercentage(this.rows);
    this.historicalStepNumbers = [
      ...this.historicalStepNumbers,
      this.currentStep,
    ];
    this.historicalAshPercentages = [
      ...this.historicalAshPercentages,
      ashCellPercentage,
    ];
    this.historicalTreePercentages = [
      ...this.historicalTreePercentages,
      treeCellPercentage,
    ];
    this.historicalFirePercentages = [
      ...this.historicalFirePercentages,
      fireCellPercentage,
    ];
    // debugger;
    updateChartData(
      this.chart!,
      this.historicalStepNumbers,
      this.historicalAshPercentages,
      this.historicalTreePercentages,
      this.historicalFirePercentages,
    );
  }

  reset() {
    console.log('reset');
    this.programRunSubscription?.unsubscribe();
    this.rows = generateInitialRows();
    this.currentStep = 0;
    drawGrid(this.rows);
  }

  start() {
    console.log('start');
    this.run();
  }

  pause() {
    console.log('pause');
    this.programRunSubscription?.unsubscribe();
  }

  increaseProbabilityOfRandomFire() {
    this.parameters.probabilityOfRandomFire = roundTo6SignificantDigits(
      this.parameters.probabilityOfRandomFire + PROBABILITY_OF_RANDOM_FIRE_STEP,
    );
  }

  decreaseProbabilityOfRandomFire() {
    this.parameters.probabilityOfRandomFire = roundTo6SignificantDigits(
      this.parameters.probabilityOfRandomFire -
        +PROBABILITY_OF_RANDOM_FIRE_STEP,
    );
  }

  increaseProbabilityOfRandomTree() {
    this.parameters.probabilityOfRandomTree = roundTo6SignificantDigits(
      this.parameters.probabilityOfRandomTree + PROBABILITY_OF_RANDOM_TREE_STEP,
    );
  }

  decreaseProbabilityOfRandomTree() {
    this.parameters.probabilityOfRandomTree = roundTo6SignificantDigits(
      this.parameters.probabilityOfRandomTree - PROBABILITY_OF_RANDOM_TREE_STEP,
    );
  }
}

function roundTo6SignificantDigits(x: number): number {
  return Number(x.toFixed(5));
}
