import colors from 'tailwindcss/colors';

const authHeaders = (token: string | null, contentType: string = 'application/json') => ({
    'Content-Type': contentType,
    'Authorization': `Bearer ${token}`
});

const toHHMMSS = function (s: string) {
    const sec_num : number = parseInt(s, 10);
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    const seconds = sec_num - (hours * 3600) - (minutes * 60);

    return [hours, minutes, seconds]
        .map(a => String(a).padStart(2, '0'))
        .join(':');
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
];

const tailWindColorsTransparent = tailWindColors.map(a => a + "33");

export {
    authHeaders,
    toHHMMSS,
    tailWindColors,
    tailWindColorsTransparent
};
