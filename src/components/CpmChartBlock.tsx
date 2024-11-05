import 'chartjs-adapter-moment';
import "chart.js/auto";
import { ChartData, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";
import { ReplayDetails } from "../types/Replay";
import { tailWindColors } from "../utils";

interface IReplayBlockProps {
    replay: ReplayDetails;
}

const CPMChartBlock = (props: IReplayBlockProps): JSX.Element => {
    const replay: ReplayDetails = props.replay;
    const options = {
        type: 'line',
        spanGaps: true,
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second',
                    displayFormats: {
                        second: 'HH:mm:ss'
                    },
                    tooltipFormat: 'HH:mm:ss'
                },
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Commands Per Minute',
                font: {
                    size: 18
                },
                padding: {
                    top: 10,
                    bottom: 10
                }
            }
        }
    } as ChartOptions<'line'>;
    let data: ChartData<'line', number[]> | undefined = undefined;
    const offset = 5 * 30;
    const commandsPerMinuteTurns: number[] = [];
    for (let i = 0; i < replay.command_statistics.turns.length; i += offset) {
        if (i % offset === 0)
            commandsPerMinuteTurns[i / offset] = replay.command_statistics.turns[i] * 200;
    }

    if (replay.command_statistics) {
        data = {
            datasets: [
            ],
            labels: commandsPerMinuteTurns,
        } as ChartData<'line', number[]>;

        for (const playerData of replay.command_statistics.playerCommandDatas) {
            const cmpData: number[] = [];
            for (let i = offset; i < playerData.playerCommands.length; i += offset) {
                if (i % offset === 0) {
                    cmpData[i / offset] = 0;
                    for (let j = 0; j < offset; j++) {
                        cmpData[i / offset] += (playerData.playerCommands[i - j] ?? 0);
                    }
                }
            }


            data.datasets.push({
                label: playerData.playerName,
                data: cmpData,
                fill: false,
                backgroundColor: tailWindColors[data.datasets.length * 2],
                borderColor: tailWindColors[data.datasets.length * 2],
            });
        }
    }

    return (data ?
            <article className="font-sans" >
                <div className="flex" >
                    <Line data={data} options={options} />
                </div>
            </article>
        :
        <></>);

};
export {
    CPMChartBlock
};
