/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 * SPDX-FileCopyrightText: © 2024 Mentula
 */

import { CivilizationChart } from "./Charts/CivilizationChart"
import { DistributionChart } from "./Charts/DistributionChart"
import { EvolutionChart } from "./Charts/EvolutionChart"

const ChartFrame = (): JSX.Element => {
    return (

        <>
            <div className="grid grid-cols-3 gap-x-1 ">
                <div className="flex justify-center cursor-pointer bg-white py-2 px-4 hover:bg-gray-50 focus:outline-none peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-indigo-500 transition-all duration-500 ease-in-out wfg-tab" >Civilization</div>
                <div className="flex justify-center cursor-pointer bg-white py-2 px-4 hover:bg-gray-50 focus:outline-none peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-indigo-500 transition-all duration-500 ease-in-out wfg-tab" >Distribution</div>
                <div className="flex justify-center cursor-pointer bg-white py-2 px-4 hover:bg-gray-50 focus:outline-none peer-checked:border-transparent peer-checked:ring-2 peer-checked:ring-indigo-500 transition-all duration-500 ease-in-out wfg-tab" >Evolution</div>
            </div>
            <div className="text-sm p-6 bg-white shadow-md col-span-4 wfg-chart-tab">
                <ul className="mx-auto grid grid-cols-3 gap-x-5 px-8">
                    <CivilizationChart  />
                    <DistributionChart  />
                    <EvolutionChart />
                </ul>
            </div>

        </>
    )
}

export {
    ChartFrame
}
