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

export function generateLeaderboard(levels, packs = []) {

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
                verifications: [],
                packs: []
            };
        }

        leaderboard[player].points += points;
        leaderboard[player].completions.push({
            id: level.id,
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
                verifications: [],
                packs: []
            };
        }
        
        leaderboard[player].points += points;
        leaderboard[player].verifications.push({
            id: level.id,
            level: level.name,
            points,
            position: index + 1
        });
    }
});

// PACKS ---------------------------------------------------------

packs.forEach(pack => {
    
    const packPoints = Math.round(
        
        pack.levels.reduce(

            (sum, levelId) => {
                const levelIndex =
                levels.findIndex(level => String(level.id) === String(levelId));

                if (levelIndex === -1) return sum;
                
                return sum +
                getLevelPoints(levelIndex + 1, levels.length);
            }, 0) * 0.5
        );
        
        Object.keys(leaderboard)
        .forEach(player => {
            
            const completedPack = pack.levels.every(levelId => {
                
                const completed = leaderboard[player]
                .completions
                .some(completion => String(completion.id) === String(levelId));
                
                const verified = leaderboard[player]
                .verifications
                .some(verification => String(verification.id) === String(levelId));
                
                return completed || verified;
            });
            
            if (!completedPack) return;
            
            leaderboard[player]
            .points += packPoints;
                
            leaderboard[player]
            .packs.push({
                name: pack.name,
                description: pack.description,
                points: packPoints,
                levels: pack.levels.length
            });
        });
    });

    return Object.entries(leaderboard)
        .sort((a, b) =>
            b[1].points - a[1].points
        );
}