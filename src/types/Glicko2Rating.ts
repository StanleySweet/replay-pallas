class Glicko2Rating {
    static provisionalDeviation: number = 110;
    
    elo: number = 1500;
    deviation: number = 350;
    volatility: number = 0.09;
    preview_deviation: number = 0.09;

    intRating(): number {
        return Math.round(this.elo);
    }

    intDeviation(): number {
        return Math.round(this.deviation);
    }

    is_provisional(): boolean {
        return this.deviation >= Glicko2Rating.provisionalDeviation;
    }

    toString(): string {
        return `${this.intRating()}${this.is_provisional() ? "?" : ""} ± ${this.intDeviation()} (${this.volatility.toFixed(3)})`;
    }
}

export {
    Glicko2Rating
};