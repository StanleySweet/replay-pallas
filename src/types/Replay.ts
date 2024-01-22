/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */


export interface Replay {
    match_id: number
    metadata: ReplayMetadata
}

export interface Mod {
    name: number
    mod: string
    version: string
    ignoreInCompatibilityChecks: boolean
}

export interface ReplayMetadata {
    timestamp: number
    mapPreview: string
    playerStates: any[]
    mods: Mod[]
    settings: MetadataSettings
    engine_version: string
    previewImage: string
}

export interface MetadataSettings {
    MatchDuration: number
    Biome: string
    RatingEnabled: boolean
    LockTeams: boolean
    Seed: string
    StartingResources: any
    PopulationCap: number
    Size: number
    Name: string | undefined,
    mapName: string,
    PlayerData: PlayerData[]
}

export interface PlayerData {
    Name: string
    NameWithoutRating: string
    LobbyUserId: number
    Color: any
    Team: number
    Civ: string
    AverageCPM: number
    State: string
    Commands: any[]
    SecondMostUsedCmd: string
    MostUsedCmd: string;
}
