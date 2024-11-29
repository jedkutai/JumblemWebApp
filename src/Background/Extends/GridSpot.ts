import { GridSpotModel } from "../Models/GridSpotModel";
import { GridFunctions } from "../Utils/GridFunctions";

export class GridSpot {
  static grid: GridSpotModel[][] = [
    Array.from({ length: 7 }, (_, col) => this.createGridSpot(0, col)),
    Array.from({ length: 7 }, (_, col) => this.createGridSpot(1, col)),
    Array.from({ length: 7 }, (_, col) => this.createGridSpot(2, col)),
    Array.from({ length: 7 }, (_, col) => this.createGridSpot(3, col)),
    Array.from({ length: 7 }, (_, col) => this.createGridSpot(4, col)),
    Array.from({ length: 7 }, (_, col) => this.createGridSpot(5, col)),
    Array.from({ length: 7 }, (_, col) => this.createGridSpot(6, col)),
  ];

  private static createGridSpot(row: number, col: number): GridSpotModel {
    const id = `${row},${col}`;
    return {
      id,
      letter: "", // Empty by default; can be set later
      north: GridFunctions.getNorth(id),
      south: GridFunctions.getSouth(id),
      east: GridFunctions.getEast(id),
      west: GridFunctions.getWest(id),
      northWest: GridFunctions.getNorthWest(id),
      northEast: GridFunctions.getNorthEast(id),
      southWest: GridFunctions.getSouthWest(id),
      southEast: GridFunctions.getSouthEast(id),
    };
  }
}
