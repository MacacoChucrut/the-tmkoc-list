import { getLevelPoints } from "../utils.js";

export async function renderPacks(content) {
    
    const packsListResponse = await fetch("./packs/_list.json");

    const packNames = await packsListResponse.json();

    const packResponses = await Promise.all(packNames.map(name => fetch(`./packs/${name}.json`)));

    const packs = await Promise.all(packResponses.map(r => r.json()));
    
    const levelsListResponse = await fetch("./levels/_list.json");
    
    const levelNames = await levelsListResponse.json();

    const levelResponses = await Promise.all(levelNames.map(name => fetch(`./levels/${name}.json`)));

    const levels = await Promise.all(levelResponses.map(r => r.json()));
    
    content.innerHTML = `
    <h2>- TMKOC PACKS -</h2>

    <div class="packs">

    <div class="packs-left">
    <div id="packs-list"></div>
    </div>

    <div class="packs-right">
    <div id="pack-info"></div>
    </div>
    
    </div>
    `;
    
    const packsList = document.getElementById("packs-list");

    const packInfo = document.getElementById("pack-info");
    
    packs.forEach(pack => {
        
        const packPoints = Math.round(
            pack.levels.reduce((sum, levelId) => {
                
                const levelIndex = levels.findIndex(level => String(level.id) === String(levelId));
                
                if (levelIndex === -1) return sum;

                return sum + getLevelPoints(
                    levelIndex + 1,
                    levels.length
                );
            }, 0) * 0.5
        );
        
        const div = document.createElement("div");

        div.className = "pack-card";
        div.innerHTML = `
        <h3>- ${pack.name}</h3>
        `;

        div.onclick = () => {
        
            packInfo.innerHTML = `
            <h4>- ${pack.name}</h4>
            <h5>+${packPoints} points</h5>

            <p>- ${pack.description}</p>

            <h5>Levels (${pack.levels.length})</h5>

            <div class="pack-levels"></div>
            `;

            const levelsContainer = packInfo.querySelector(".pack-levels");

            pack.levels.forEach(levelId => {

                const level = levels.find(
                    level => String(level.id) === String(levelId)
                );

                if (!level) return;

                const levelIndex = levels.findIndex(level => String(level.id) === String(levelId));

                const p = document.createElement("p");

                p.innerHTML = `#${levelIndex + 1} - ${level.name}`;

                levelsContainer.appendChild(p);
            });
        };

        packsList.appendChild(div);
    });

    if (packsList.firstElementChild) {
        packsList.firstElementChild.click();
    }
}