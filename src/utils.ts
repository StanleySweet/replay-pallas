import colors from 'tailwindcss/colors'

const toHHMMSS = function (s: string) {
    const sec_num : number = parseInt(s, 10); // don't forget the second param
    let hours: any = Math.floor(sec_num / 3600);
    let minutes: any = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds: any = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
};

const tailWindColors = [
    colors.red['500'],
    colors.orange['500'],
    colors.amber['500'],
    colors.yellow['500'],
    colors.lime['500'],
    colors.green['500'],
    colors.emerald['500'],
    colors.teal['500'],
    colors.cyan['500'],
    colors.sky['500'],
    colors.blue['500'],
    colors.indigo['500'],
    colors.violet['500'],
    colors.purple['500'],
    colors.fuchsia['500'],
    colors.pink['500'],
    colors.rose['500']
]

const tailWindColorsTransparent = tailWindColors.map(a => a + "33");

export {
    toHHMMSS,
    tailWindColors,
    tailWindColorsTransparent
}
