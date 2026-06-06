import { generateLeaderboard } from "../utils.js";

export async function renderLeaderboard(content) {
    
    const listResponse = await fetch("./levels/_list.json");

    const levelNames = await listResponse.json();

    const responses = await Promise.all(levelNames.map(name => fetch(`./levels/${name}.json`)));

    const levels = await Promise.all(responses.map(r => r.json()));

    const packsListResponse = await fetch("./packs/_list.json");

    const packNames = await packsListResponse.json();

    const packResponses = await Promise.all(packNames.map(name => fetch(`./packs/${name}.json`)));

    const packs = await Promise.all(packResponses.map(r => r.json()));

    const ranking = generateLeaderboard(levels, packs);

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
    
    const leaderboardList = document.getElementById("leaderboard-list");

    const playerInfo = document.getElementById("player-info");

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
            <h4>#${index + 1} - ${player}</h4>
            <h5>${data.points} points</h5>

            <h5>Packs (${data.packs.length})</h5>
            <div id="player-packs"></div>

            <h5>Verified (${data.verifications.length})</h5>
            <div id="player-verifications"></div>
            
            <h5>Completed (${data.completions.length})</h5>
            <div id="player-levels"></div>
            `;

            const packsContainer = document.getElementById("player-packs");
            
            const levelsContainer = document.getElementById("player-levels");

            const verificationsContainer = document.getElementById("player-verifications");

            data.verifications.forEach(level => {
                
                const verificationDiv = document.createElement("div");
                verificationDiv.innerHTML = `

                <p>#${level.position} - ${level.level} (+${level.points} pts.)</p>
                `;
                
                verificationsContainer.appendChild(
                    verificationDiv
                );
            });
            
            data.completions.forEach(level => {
                
                const levelDiv = document.createElement("div");
                levelDiv.innerHTML = `

                <p>#${level.position} - ${level.level} (+${level.points} pts.)</p>
                `;
                
                levelsContainer.appendChild(levelDiv);
            });

            data.packs.forEach(pack => {
                
                const packDiv = document.createElement("div");
                packDiv.innerHTML = `
                <p>- ${pack.name} (+${pack.points} pts.)</p>
                `;
                packsContainer.appendChild(packDiv);
            });
        };
        leaderboardList.appendChild(div);
    });
    
    if (leaderboardList.firstElementChild) {
        leaderboardList.firstElementChild.click();
    }
}