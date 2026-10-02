import type { ReplayListItem } from "../types/Replay";

/**
 * Whether a replay falls inside an optional date range.
 *
 * `date` is the UTC calendar day the match started, as YYYY-MM-DD, which is why it is
 * compared as a plain string. The bounds come from <input type="date">, which is always
 * zero padded, so string comparison is exact and no parsing is needed. An empty bound
 * means "unbounded on that side".
 */
const isWithinDateRange = (replay: Pick<ReplayListItem, "date">, from?: string, to?: string): boolean => {
    if (from && replay.date < from)
        return false;

    if (to && replay.date > to)
        return false;

    return true;
};

export {
    isWithinDateRange
};
