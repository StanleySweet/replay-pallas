// SPDX-License-Identifier: GPL-3.0-or-later
import { useSyncExternalStore } from "react";

// The 0 A.D. release the lists, ratings and charts are limited to, or null for every release. It is
// remembered in the browser and shared by every component, so changing it refetches what is on screen.
const STORAGE_KEY = "release";

// Releases the API holds replays for. A new one needs adding here to show up in the selector.
const RELEASES = [28, 27, 26, 25, 23];

const read = (): number | null => {
    try {
        const value = Number(localStorage.getItem(STORAGE_KEY));
        return Number.isInteger(value) && value > 0 ? value : null;
    }
    catch {
        return null;
    }
};

let current = read();
const listeners = new Set<() => void>();

const setRelease = (release: number | null) => {
    current = release;
    try {
        if (release === null)
            localStorage.removeItem(STORAGE_KEY);
        else
            localStorage.setItem(STORAGE_KEY, String(release));
    }
    catch {
        // Private browsing: the choice just lasts until the page is closed.
    }
    listeners.forEach(listener => listener());
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
};

const useRelease = (): number | null => useSyncExternalStore(subscribe, () => current);

// Adds ?release=N to an API url when a release is chosen.
const withRelease = (url: string): string =>
    current === null ? url : `${url}${url.includes("?") ? "&" : "?"}release=${current}`;

// 0.0.26 was Alpha 26, from 0.27 on they are releases.
const releaseLabel = (release: number): string => release <= 26 ? `A${release}` : `R${release}`;

export { RELEASES, releaseLabel, setRelease, useRelease, withRelease };
