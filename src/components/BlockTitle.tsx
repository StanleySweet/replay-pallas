/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { ITranslationDictionaryKey } from "../types/ITranslationDictionaryEntry";

interface IBlockTitleProps {
    "titleKey": ITranslationDictionaryKey;
}

const BlockTitle = (props: IBlockTitleProps): JSX.Element => {
    return (
        <div className="flex relative font-roboto select-none text-center pb-6"
            style={{
                "fontSize": "18px",
                "fontWeight": "700",
                "textTransform": "uppercase",
                "lineHeight": "21px",
            }}>
            {translate(props.titleKey)}
        </div>
    );
};
export {
    BlockTitle
};
