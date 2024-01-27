/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 * SPDX-FileCopyrightText: © 2024 Mentula
 */

import { ChangeEventHandler, ReactNode } from "react";
import { useTranslation as translate } from "../../contexts/Models/useTranslation";
interface ISearchPlayerBarProps {
    onChange?: ChangeEventHandler<HTMLInputElement>
}

const SearchReplayBar = (props: ISearchPlayerBarProps): ReactNode => {
    return (<>
        <div className="mb-2 rounded relative text-sm bg-transparent" >
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
            </div>
            <input type="search" onChange={props.onChange}  className="flex border-radius-2 bg-white w-full p-2 ps-10  border border-gray-700 rounded-sm" placeholder={translate("SearchReplayBar.LookForAReplay")} required />
        </div>
    </>);
}

export {
    SearchReplayBar
}
