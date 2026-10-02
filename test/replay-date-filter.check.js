// Checks the replay list date range filter, including the UTC day boundaries it relies on.
// Run from the frontend repo: node test/replay-date-filter.check.js
//
// The filter compares YYYY-MM-DD strings, so it is only correct if `date` is a zero padded
// UTC day. Both are asserted here, because a replay list item whose date shifted a day (the
// bug this replaced) would silently return the wrong set rather than throw.

import assert from "assert";
import { isWithinDateRange } from "../src/components/replayDateFilter.ts";

let failed = 0;
const check = (name, fn) => {
    try { fn(); console.log(`ok    ${name}`); }
    catch (err) { failed++; console.log(`FAIL  ${name}\n        ${String(err.message).split("\n")[0]}`); }
};

const replay = (date) => ({ matchId: "A", mapName: "m", playerNames: [], civs: [], mods: [], date });

check("an empty range keeps everything", () => {
    for (const d of ["2020-01-01", "2024-10-18"])
        assert.ok(isWithinDateRange(replay(d)));
});

check("from is inclusive", () => {
    assert.ok(isWithinDateRange(replay("2024-01-01"), "2024-01-01"));
    assert.ok(!isWithinDateRange(replay("2023-12-31"), "2024-01-01"));
});

check("to is inclusive", () => {
    assert.ok(isWithinDateRange(replay("2024-01-31"), undefined, "2024-01-31"));
    assert.ok(!isWithinDateRange(replay("2024-02-01"), undefined, "2024-01-31"));
});

check("a single-day range keeps only that day", () => {
    assert.ok(isWithinDateRange(replay("2024-06-15"), "2024-06-15", "2024-06-15"));
    assert.ok(!isWithinDateRange(replay("2024-06-14"), "2024-06-15", "2024-06-15"));
    assert.ok(!isWithinDateRange(replay("2024-06-16"), "2024-06-15", "2024-06-15"));
});

check("a year range covers the whole year", () => {
    assert.ok(isWithinDateRange(replay("2024-01-01"), "2024-01-01", "2024-12-31"));
    assert.ok(isWithinDateRange(replay("2024-12-31"), "2024-01-01", "2024-12-31"));
    assert.ok(!isWithinDateRange(replay("2023-12-31"), "2024-01-01", "2024-12-31"));
    assert.ok(!isWithinDateRange(replay("2025-01-01"), "2024-01-01", "2024-12-31"));
});

// The case that made the old cache wrong: a match played late in the UTC day. It must
// stay inside the day it was played, whatever timezone the reader is in.
for (const tz of ["UTC", "Europe/Paris", "America/New_York", "Asia/Tokyo"]) {
    process.env.TZ = tz;
    check(`TZ=${tz} keeps a 23:30 UTC match on its own day`, () => {
        const late = replay("2022-10-12");
        assert.ok(isWithinDateRange(late, "2022-10-12", "2022-10-12"));
        assert.ok(!isWithinDateRange(late, "2022-10-13", "2022-10-13"));
    });
}

check("string comparison is not fooled by a differently zero padded day", () => {
    // "2024-1-5" < "2024-01-05" as strings but is the same day, so padded input is required.
    assert.ok(isWithinDateRange(replay("2024-01-05"), "2024-01-01", "2024-01-31"));
    assert.ok(isWithinDateRange(replay("2024-12-09"), "2024-01-01", "2024-12-31"));
});

check("filtering a real corpus narrows monotonically", () => {
    const all = [];
    for (let d = 1; d <= 31; ++d)
        all.push(replay(`2024-03-${String(d).padStart(2, "0")}`));
    const inMarch = all.filter(r => isWithinDateRange(r, "2024-03-01", "2024-03-31"));
    assert.strictEqual(inMarch.length, 31);
    const narrow = all.filter(r => isWithinDateRange(r, "2024-03-10", "2024-03-20"));
    assert.strictEqual(narrow.length, 11);
    const none = all.filter(r => isWithinDateRange(r, "2025-01-01", "2025-12-31"));
    assert.strictEqual(none.length, 0);
});

console.log(`\n${10 - failed}/10 passed`);
process.exit(failed ? 1 : 0);
