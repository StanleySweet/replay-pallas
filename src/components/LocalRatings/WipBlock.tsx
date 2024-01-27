/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 * SPDX-FileCopyrightText: © 2024 Mentula
 */

import WorksIcon from "../../icons/WorksIcon"

const WipBlock = (): JSX.Element => {
    return <div className="mt-10">
        <div className="h-40 w-40" >
            <WorksIcon />
        </div>
        <div className="mx-auto d-block relative font-roboto select-none text-center m-6"
            style={{
                "fontSize": "18px",
                "fontWeight": "700",
                "textTransform": "uppercase",
            }}>
            Work in Progress
        </div>
    </div>
}

export {
    WipBlock
}
