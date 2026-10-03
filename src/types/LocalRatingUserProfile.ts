import { LocalRatingRank } from "./LocalRatingRank";

interface LocalRatingUserProfile {
    "rankText": LocalRatingRank,
    "currentRatingText": string,
    "highestRatingText": string,
    "lowestRatingText": string,
    "averageRatingText": string,
    "ratingAverageDeviationText": string,
    "ratingStandardDeviationText": string,
    "lastPerformanceText": string,
    "bestPerformanceText": string,
    "worstPerformanceText": string,
    "averagePerformanceText": string,
    "performanceAverageDeviationText": string,
    "performanceStandardDeviationText": string,
    "glickoElo": number | null,
    "glickoDeviation": number | null,
    "glickoMatchCount": number | null,
    "gameElo": number | null,
}

export type  {
    LocalRatingUserProfile
};
