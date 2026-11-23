// SPDX-License-Identifier: GPL-3.0-or-later
import axios from "axios";
import { useEffect, useSyncExternalStore } from "react";
import { authHeaders } from "./utils";

// The 0 A.D. release the lists, ratings and charts are limited to, or null for every release. It is
// remembered in the browser and shared by every component, so changing it refetches what is on screen.
const STORAGE_KEY = "release";

interface ReleaseInfo {
    release: number
    replays: number
}

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

// The releases the API has replays for, fetched once per page load. The API keeps the list cached and
// refreshes it when a replay is added or removed, so a new release shows up here without a code change.
let known: ReleaseInfo[] = [];
let requested = false;

const loadReleases = (token: string | null) => {
    if (requested || !token)
        return;

    requested = true;
    axios.get<ReleaseInfo[]>(`${import.meta.env.VITE_API_URL}/replays/releases`, { headers: authHeaders(token) })
        .then(response => {
            known = response.data;
            listeners.forEach(listener => listener());
        })
        .catch(() => { requested = false; });
};

const useReleases = (token: string | null): ReleaseInfo[] => {
    useEffect(() => loadReleases(token), [token]);
    return useSyncExternalStore(subscribe, () => known);
};

// Adds ?release=N to an API url when a release is chosen.
const withRelease = (url: string): string =>
    current === null ? url : `${url}${url.includes("?") ? "&" : "?"}release=${current}`;

// 0.0.26 was Alpha 26, from 0.27 on they are releases.
const releaseLabel = (release: number): string => release <= 26 ? `A${release}` : `R${release}`;

export type { ReleaseInfo };
export { releaseLabel, setRelease, useRelease, useReleases, withRelease };
