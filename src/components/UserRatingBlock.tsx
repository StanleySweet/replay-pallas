import { Line } from "react-chartjs-2"
import { User } from "../types/User"
import { BlockTitle } from "./BlockTitle"
import { tailWindColors } from "../utils"
import { ChartData, ChartOptions } from "chart.js";
import 'chartjs-adapter-moment'
import "chart.js/auto";
import { Glicko2Rating } from "../types/Glicko2Rating";

interface SeriesData { x: string, y: number }

interface IUserRatingBlockProps {
    user: User
}

const sort_by_date = function (a: SeriesData, b: SeriesData) {
    return new Date(a.x).getTime() - new Date(b.x).getTime();
};

const UserRatingBlock: React.FC<IUserRatingBlockProps> = (props: IUserRatingBlockProps) => {
    const user = props.user;
    const options = {
        responsive: true,
        scales: {
            x: {
                type: 'time',
            },
        }
    } as ChartOptions<'line'>;

    const data: ChartData<'line', SeriesData[]> = {
        datasets: [
            {
                label: "Game Rating",
                data: user.graph.game_series.sort(sort_by_date),
                fill: false,
                tension: 0.1,
                backgroundColor: tailWindColors[0],
                borderColor: tailWindColors[0],
            },
            {
                label: "Game Rating AVG",
                data: user.graph.game_series_avg.sort(sort_by_date),
                fill: false,
                tension: 0.1,
                backgroundColor: tailWindColors[3],
                borderColor: tailWindColors[3],
            },
            {
                label: "Glicko 2 Rating",
                data: user.graph.glicko_series.sort(sort_by_date),
                fill: false,

                tension: 0.1,
                backgroundColor: tailWindColors[6],
                borderColor: tailWindColors[6],
            },
            {
                label: "Glicko 2 Rating AVG",
                data: user.graph.glicko_series_avg.sort(sort_by_date),
                fill: false,
                tension: 0.1,
                backgroundColor: tailWindColors[9],
                borderColor: tailWindColors[9],
            }
        ]
    } as ChartData<'line', SeriesData[]>

    const glicko : Glicko2Rating = Object.assign(new Glicko2Rating(), props.user.graph.current_glicko_elo)

    return (
        <div id="user-rating-container" className="text-sm p-6 mt-4 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
            <BlockTitle titleKey="UserDetails.Title" />
            <article className="mb-[1em] pt-3" style={{ borderTop: "1px solid #C7CCD9" }} >
                <div className="grid grid-cols-2">
                    <span className="text-sm">Rating in game:&nbsp;<b>{props.user.graph.current_game_elo}</b></span>
                    <span className="text-sm">Glicko 2 rating for 1v1:&nbsp;<b>{glicko.toString()}</b></span>
                    <span className="text-sm">Projected deviation:&nbsp;<b>{Math.round(glicko.preview_deviation)} </b></span>
                </div>
            </article>
            {
                props.user.graph ? <Line data={data} options={options} /> : <></>
            }
        </div>
    )
}

export {
    UserRatingBlock
}