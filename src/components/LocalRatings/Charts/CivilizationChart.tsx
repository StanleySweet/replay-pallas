/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 * SPDX-FileCopyrightText: © 2024 Mentula
 */

import { Bar, } from "react-chartjs-2";
import { useTranslation as translate } from "../../../contexts/Models/useTranslation";
import { useAuth } from "../../../contexts/Models/IAuthContext";
import { ChartData, ChartDataset } from "chart.js";
import { LocalRatingUser } from "../../../types/LocalRatingUser";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import "chart.js/auto";
import { tailWindColors, tailWindColorsTransparent } from "../../../utils";

type CivilizationChartProps = {
    user?: LocalRatingUser
}

type CivilizationChartData ={
    "civKeys": string[],
    "civRatings": (number)[]
    "civMatches": (number)[]
    "advantages": (number)[]
};

const CivilizationChart = (props : CivilizationChartProps): JSX.Element => {
    const { token } = useAuth();
    const [data, setData] = useState<ChartData<'bar', number[]>>();

    useEffect(() => {
        if (props.user)
            axios.post<LocalRatingUser, AxiosResponse<CivilizationChartData>>(`${import.meta.env.VITE_API_URL}/local-ratings/civilization-data`, {
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
                    const labels = response.data.civKeys;
                    setData({
                        labels: labels,
                        datasets: [
                            {
                                label: 'Rating per Civilization / Total Matches',
                                data: response.data.civRatings,
                                backgroundColor: tailWindColorsTransparent,
                                borderColor: tailWindColors,
                                borderWidth: 1,
                            } as ChartDataset<'bar', number[]>
                        ]
                    });
                }
            });
    }, [token, props]);


    if (!props.user)
        return <>{translate("App.SelectAPlayer")}</>;
    if (!data)
        return <>{translate("App.LoadingInProgress")}</>;


    return (<><Bar data={data} options={{responsive:true}}/></>);
};
export {
    CivilizationChart
};
