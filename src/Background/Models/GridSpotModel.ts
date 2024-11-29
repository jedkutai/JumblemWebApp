export interface GridSpotModel {
    id: string;             // Unique identifier for the grid spot
    letter: string        // Letter assigned to the grid spot
    north?: string | null;         // ID of the northern neighbor
    south?: string | null;         // ID of the southern neighbor
    east?: string | null;          // ID of the eastern neighbor
    west?: string | null;          // ID of the western neighbor
    northWest?: string | null;     // ID of the northwestern neighbor
    northEast?: string | null;     // ID of the northeastern neighbor
    southWest?: string | null;     // ID of the southwestern neighbor
    southEast?: string | null;     // ID of the southeastern neighbor
}