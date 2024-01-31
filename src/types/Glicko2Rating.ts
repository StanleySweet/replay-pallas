
class Glicko2Rating {
    static minRating: number = 400
    static maxRating: number = 4000
    static minDeviation: number = 45
    static standardRankableDeviation: number = 75
    static provisionalDeviation: number = 110
    static cluelessDeviation: number = 230
    static maxVolatility: number = 0.1
    
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

    intervalMin(): number {
        return Math.round(this.elo - this.deviation * 2)
    }

    intervalMax(): number {
        return Math.round(this.elo + this.deviation * 2)
    }

    interval(): number[] {
        return [this.intervalMin(), this.intervalMax()];
    }


    is_established(): boolean {
        return !this.is_provisional();
    }

    is_provisional(): boolean {
        return this.deviation >= Glicko2Rating.provisionalDeviation;
    }

    is_clueless(): boolean {
        return this.deviation >= Glicko2Rating.cluelessDeviation;
    }

    is_rankable(): boolean {
        return this.deviation <= Glicko2Rating.standardRankableDeviation;
    }

    is_sane(): boolean {
        return this.elo > Glicko2Rating.minRating &&
            this.elo < Glicko2Rating.maxRating &&
            this.deviation > Glicko2Rating.minDeviation &&
            this.deviation < Glicko2Rating.minDeviation &&
            this.volatility > 0 &&
            this.volatility < (Glicko2Rating.maxVolatility * 2)
    }

    toString(): string {
        return `${this.intRating()}${this.is_provisional() ? "?" : ""} ± ${this.intDeviation()} (${this.volatility.toFixed(3)})`;
    }
}

export {
    Glicko2Rating
}