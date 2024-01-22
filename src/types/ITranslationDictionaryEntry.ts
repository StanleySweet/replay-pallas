/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import translationsRaw from "../translations.json"

type ITranslationDictionary = typeof translationsRaw;
type ITranslationDictionaryKey = keyof ITranslationDictionary;
type ITranslationEntry = typeof translationsRaw[ITranslationDictionaryKey];
type ITranslationEntryKey = keyof ITranslationEntry;

export type {
    ITranslationDictionary,
    ITranslationDictionaryKey,
    ITranslationEntry,
    ITranslationEntryKey
}
