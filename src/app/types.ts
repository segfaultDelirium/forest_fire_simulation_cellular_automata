export type CellState = 'FIRE' | 'ASH' | 'TREE'

export type SimulationParameters = {
  windSpeed: number,
  windDirection: number,
  probabilityOfRandomTree: number,
  probabilityOfRandomFire: number,

}
