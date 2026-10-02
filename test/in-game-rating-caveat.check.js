// Checks that the "this is not a win rate" caveat stays attached to the in-game rating.
//
// The two numbers on the player page come from different systems:
//   current_game_elo    <- lobby_ranking_history.elo, the LocalRatings mod rating parsed out
//                          of the player name in the replay ("Nick(1234)"). Built from
//                          performance graphs; the match outcome is never an input.
//   current_glicko_elo  <- glicko2_rankings.elo, Glicko 2 over 1v1 wins and losses.
// So the caveat is only true of the first one. A blanket note across the block would be a
// false statement about the Glicko column, which is exactly the kind of edit that is easy to
// make later without noticing.
//
// Run from the frontend repo: node test/in-game-rating-caveat.check.js

import assert from "assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const SRC = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src");
const read = (rel) => fs.readFileSync(path.join(SRC, rel), "utf8");

const translations = JSON.parse(read("translations.json"));
const ratingBlock = read("components/UserRatingBlock.tsx");
const playerList = read("components/LocalRatings/PlayerList.tsx");

let passed = 0;
const check = (name, fn) => {
    try {
        fn();
        passed++;
        console.log("  ok  " + name);
    } catch (e) {
        console.log("FAIL  " + name + "\n      " + e.message);
        process.exitCode = 1;
    }
};

const KEY = "UserDetails.InGameRatingCaveat";

check("the caveat key exists in both languages", () => {
    assert.ok(translations[KEY], "no such translation key");
    for (const lang of ["fr-FR", "EN"]) {
        assert.ok(translations[KEY][lang], `missing ${lang}`);
        assert.ok(translations[KEY][lang].trim().length > 20, `${lang} is suspiciously short`);
    }
});

check("the caveat says the outcome is not an input, in both languages", () => {
    assert.match(translations[KEY].EN, /does not use the match outcome/i);
    assert.match(translations[KEY].EN, /does not predict/i);
    assert.match(translations[KEY]["fr-FR"], /n'utilise pas le résultat/i);
    assert.match(translations[KEY]["fr-FR"], /ne prédit/i);
});

check("the player page renders the caveat", () => {
    assert.ok(ratingBlock.includes(`translate("${KEY}")`), "caveat is not rendered on the player page");
});

check("the leaderboard renders the same caveat, since it shows the same rating", () => {
    assert.ok(playerList.includes(`translate("${KEY}")`), "leaderboard has no caveat");
});

check("the caveat is NOT scoped to the Glicko rating", () => {
    // The Glicko number is built from wins and losses, so claiming it does not use the
    // outcome would be false. Guard against someone wrapping the wrong span later.
    const glickoLine = ratingBlock.split("\n").find((l) => l.includes("GlickoRating"));
    assert.ok(glickoLine, "cannot find the Glicko label");
    assert.ok(
        !glickoLine.includes("InGameRatingCaveat"),
        "the caveat was attached to the Glicko rating, which is outcome-based"
    );
});

check("the caveat lives inside the rating grid, after the two numbers", () => {
    const grid = ratingBlock.slice(
        ratingBlock.indexOf('className="grid grid-cols-2 gap-y-1"'),
        ratingBlock.indexOf("ProvisionalNotice")
    );
    assert.ok(grid.includes(`translate("${KEY}")`), "caveat is not in the rating grid");
    // col-span-2 keeps it from squeezing the second column.
    assert.match(grid, /col-span-2[^\n]*InGameRatingCaveat/, "caveat should span both columns");
});

check("both ratings are still labelled distinctly", () => {
    // The caveat only means anything if the reader can tell the two numbers apart.
    assert.ok(ratingBlock.includes('translate("UserDetails.RatingInGame")'));
    assert.ok(ratingBlock.includes('translate("UserDetails.GlickoRating")'));
});

console.log(`\n${passed} passed, ${process.exitCode ? "1 FAILED" : "all green"}`);
