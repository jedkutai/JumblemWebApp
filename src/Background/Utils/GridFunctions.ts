export class GridFunctions {
    static withinBounds(number: number): boolean {
      return number >= 0 && number <= 6;
    }
  
    static getNorth(coordinates: string): string | null {
      const [r, c] = this.parseCoordinates(coordinates);
      if (r === null || c === null) return null;
  
      const newR = r - 1;
      return this.withinBounds(newR) ? `${newR},${c}` : null;
    }
  
    static getSouth(coordinates: string): string | null {
      const [r, c] = this.parseCoordinates(coordinates);
      if (r === null || c === null) return null;
  
      const newR = r + 1;
      return this.withinBounds(newR) ? `${newR},${c}` : null;
    }
  
    static getEast(coordinates: string): string | null {
      const [r, c] = this.parseCoordinates(coordinates);
      if (r === null || c === null) return null;
  
      const newC = c + 1;
      return this.withinBounds(newC) ? `${r},${newC}` : null;
    }
  
    static getWest(coordinates: string): string | null {
      const [r, c] = this.parseCoordinates(coordinates);
      if (r === null || c === null) return null;
  
      const newC = c - 1;
      return this.withinBounds(newC) ? `${r},${newC}` : null;
    }
  
    static getNorthEast(coordinates: string): string | null {
      const [r, c] = this.parseCoordinates(coordinates);
      if (r === null || c === null) return null;
  
      const newR = r - 1;
      const newC = c + 1;
      return this.withinBounds(newR) && this.withinBounds(newC) ? `${newR},${newC}` : null;
    }
  
    static getNorthWest(coordinates: string): string | null {
      const [r, c] = this.parseCoordinates(coordinates);
      if (r === null || c === null) return null;
  
      const newR = r - 1;
      const newC = c - 1;
      return this.withinBounds(newR) && this.withinBounds(newC) ? `${newR},${newC}` : null;
    }
  
    static getSouthEast(coordinates: string): string | null {
      const [r, c] = this.parseCoordinates(coordinates);
      if (r === null || c === null) return null;
  
      const newR = r + 1;
      const newC = c + 1;
      return this.withinBounds(newR) && this.withinBounds(newC) ? `${newR},${newC}` : null;
    }
  
    static getSouthWest(coordinates: string): string | null {
      const [r, c] = this.parseCoordinates(coordinates);
      if (r === null || c === null) return null;
  
      const newR = r + 1;
      const newC = c - 1;
      return this.withinBounds(newR) && this.withinBounds(newC) ? `${newR},${newC}` : null;
    }
  
    private static parseCoordinates(coordinates: string): [number | null, number | null] {
      const [r, c] = coordinates.split(",").map((value) => parseInt(value, 10));
      return [isNaN(r) ? null : r, isNaN(c) ? null : c];
    }
  }
  