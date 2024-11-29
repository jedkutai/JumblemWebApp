export class WinLossDrawTracker {
    win: number;
    loss: number;
    draw: number;

    constructor(win = 0, loss = 0, draw = 0) {
        this.win = win;
        this.loss = loss;
        this.draw = draw;
    }

    total(): number {
        return this.win + this.loss + this.draw;
    }

    reset(): void {
        this.win = 0;
        this.loss = 0;
        this.draw = 0;
    }
}
