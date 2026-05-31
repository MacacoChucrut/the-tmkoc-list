import { generateLeaderboard } from "../utils.js";

export async function renderLeaderboard(content) {

    const listResponse = await fetch("./levels/_list.json");
    const levelNames = await listResponse.json();

    const responses = await Promise.all(
        levelNames.map(name =>
            fetch(`./levels/${name}.json`)
        )
    );

    const levels = await Promise.all(
        responses.map(r => r.json())
    );

    const ranking = generateLeaderboard(levels);

    // FULL LEADERBOARD -------------------------

    content.innerHTML = `
    <h2>- BEST TMKOC PLAYERS - </h2>
    <div class="leaderboard">
    
    <div class="leaderboard-left">
        <div id="leaderboard-list"></div>
    </div>

    <div class="leaderboard-right">
        <div id="player-info"></div>
    </div>

</div>
`;

    const leaderboardList =
        document.getElementById("leaderboard-list");

    const playerInfo =
        document.getElementById("player-info");

    ranking.forEach(([player, data], index) => {

        const div = document.createElement("div");

        div.className = "leaderboard-entry";

        // LEADERBOARD LIST -------------------------

        div.innerHTML = `
        <div class="player-card">
        <h3>#${index + 1} - ${data.points} - ${player}</h3></div>
        `;

        div.onclick = () => {
            
            // PLAYER INFO -------------------------
            
            playerInfo.innerHTML = `
            <h4>#${index + 1} - ${player}</h2>
            <h5>${data.points} points</h3>

            <h5>Verified (${data.verifications.length})</h3>

            <div id="player-verifications"></div>
            
            <h5>Completed (${data.completions.length})</h3>
            
            <div id="player-levels"></div>
            `;
            
            const levelsContainer =
            document.getElementById("player-levels");

            const verificationsContainer =
            document.getElementById("player-verifications");

            data.verifications.forEach(level => {
                
                const verificationDiv =
                document.createElement("div");
                verificationDiv.innerHTML = `

                <p><strong>#${level.position}</strong> - ${level.level} (+${level.points})</p>
                `;
                
                verificationsContainer.appendChild(
                    verificationDiv
                );
            });
            
            data.completions.forEach(level => {
                
                const levelDiv =
                document.createElement("div");
                
                levelDiv.innerHTML = `
                <p><strong>#${level.position}</strong> - ${level.level} (+${level.points})</p>
                `;
                
                levelsContainer.appendChild(levelDiv);
            });
        };
        leaderboardList.appendChild(div);
    });
}
