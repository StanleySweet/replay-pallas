/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 * SPDX-FileCopyrightText: © 2024 Mentula
 */

import { useEffect, useState } from "react";
import { Line, } from "react-chartjs-2";
import { useAuth } from "../../../contexts/Models/IAuthContext";
import axios, { AxiosResponse } from "axios";
import { LocalRatingUser } from "../../../types/LocalRatingUser";
import { useTranslation as translate } from "../../../contexts/Models/useTranslation";
import { ChartData } from "chart.js";
import "chart.js/auto";
import { ITranslationDictionaryKey } from "../../../types/ITranslationDictionaryEntry";

interface EvolutionChartProps {
    user?: LocalRatingUser
}
interface SeriesData { x: number, y: number }
interface EvolutionChart {
    series: SeriesData[][]
    colors: string[];
    legends: string[];
}


const EvolutionChart = (props: EvolutionChartProps): JSX.Element => {
    const { token } = useAuth();
    const [data, setData] = useState<ChartData<'line', SeriesData[]>>()


    useEffect(() => {

        if (props.user)

            axios.post<LocalRatingUser, AxiosResponse<EvolutionChart>>(`${import.meta.env.VITE_API_URL}/local-ratings/evolution-data`, {
                player: props.user.user.nick,
                rank: props.user.rank,
                players: props.user.matches
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                if (response.data) {
                    const valueCount = response.data.series.map(a => a.length).sort((a, b) => b - a)[0];
                    setData({
                        labels: Array(valueCount).fill(undefined).map((_, index) => index + 1),
                        datasets: response.data.series.map((a) => {
                            return {
                                label: translate(response.data.legends[response.data.series.indexOf(a)] as ITranslationDictionaryKey),
                                data: a,
                                fill: false,
                                backgroundColor: 'rgb(' + response.data.colors[response.data.series.indexOf(a)].split(" ").slice(0, 3).join(",") + ')',
                                borderColor: 'rgb(' + response.data.colors[response.data.series.indexOf(a)].split(" ").slice(0, 3).join(",") + ')',
                                tension: 0.1
                            }
                        })
                    } as ChartData<'line', SeriesData[]>);
                }
            });
    }, [token, props])


    if (!props.user)
        return <>{translate("App.SelectAPlayer")}</>
    if (!data)
        return <>{translate("App.LoadingInProgress")}</>


    return (<><Line data={data} options={{responsive:true}}></Line></>);
}
export {
    EvolutionChart
}
