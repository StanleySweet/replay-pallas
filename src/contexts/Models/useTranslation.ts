/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import translationsRaw from "../../translations.json";
import { ITranslationDictionaryKey, ITranslationDictionary, ITranslationEntryKey } from "../../types/ITranslationDictionaryEntry";

const translations : ITranslationDictionary = translationsRaw;

/**
 * Gets the matching translation for the given key.
 * @returns the translation.
 */
const useTranslation = (key: ITranslationDictionaryKey): string | undefined => {
    const translation = translations[key];
    let languageKey : ITranslationEntryKey;
    switch(navigator.language)
    {
        case "fr-FR":
            languageKey = navigator.language;
            break;
        default:
            languageKey = "EN";
            break;
    }

    return translation[languageKey];
};

export {
    useTranslation
};
