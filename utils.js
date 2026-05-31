export function getThumbnailFromId(urlOrId) {

    if (!urlOrId) return '';

    const input = String(urlOrId).trim();

    if (!input.includes("youtube") && !input.includes("youtu.be")) {
        return `https://img.youtube.com/vi/${input}/mqdefault.jpg`;
    }

    const match = input.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/ 
    );

    if (!match) return '';

    return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
}

export function getEmbedUrl(url) {

    const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
    );

    if (!match) return "";

    return `https://www.youtube.com/embed/${match[1]}`;
}

// POINTS SYSTEM ----------------------------------------------------------------------------------------------------

export function getLevelPoints(position, totalLevels) {

    const maxPoints = 100;
    const minPoints = 10;

    const ratio = (position - 1) / (totalLevels - 1);

    return Math.round(
        maxPoints * Math.pow(minPoints / maxPoints, ratio)
    );
}

// LEADERBOARD ----------------------------------------------------------------------------------------------------

export function generateLeaderboard(levels) {

    const leaderboard = {};

    levels.forEach((level, index) => {

    const points = getLevelPoints(
        index + 1,
        levels.length
    );

    // COMPLETIONSS -------------------------

    level.records.forEach(record => {

        const player = record.player;
        if (!leaderboard[player]) {
            leaderboard[player] = {
                points: 0,
                completions: [],
                verifications: []
            };
        }

        leaderboard[player].points += points;
        leaderboard[player].completions.push({
            level: level.name,
            points,
            position: index + 1
        });
    });

    // VERIFICATIONS -------------------------

    if (level.verifier) {
        
        const player = level.verifier;
        if (!leaderboard[player]) {
            leaderboard[player] = {
                points: 0,
                completions: [],
                verifications: []
            };
        }
        
        leaderboard[player].points += points;
        leaderboard[player].verifications.push({
            level: level.name,
            points,
            position: index + 1
        });
    }
});

    return Object.entries(leaderboard)
        .sort((a, b) =>
            b[1].points - a[1].points
        );
}
