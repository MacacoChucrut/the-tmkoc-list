import { getEmbedUrl } from "../utils.js";

export async function renderLevel(content, id) {

    const listResponse = await fetch("./levels/_list.json");
    const levelNames = await listResponse.json();

    const responses = await Promise.all(
        levelNames.map(id =>
            fetch(`./levels/${id}.json`)
        )
    );

    const levels = await Promise.all(
        responses.map(r => r.json())
    );

    const item = levels.find(
        level => level.id === id
    );

    if (!item) {
        content.innerHTML = `
            <h1>level not found :((( talk to a mod pls so we can solve ts</h1>
        `;
        return;
    }

    content.innerHTML = `
    <h2>- ${item.name} -</h2>
    <div class="level">
    
    <div class="level-info">
    <iframe src="${getEmbedUrl(item.verification)}" allowfullscreen></iframe>
    
    <div class="level-text">
    <h3><strong>Creator(s):</strong> ${item.creator}</h3>
    <h3><strong>Verifier:</strong> ${item.verifier}</h3>
    <h3><strong>ID:</strong> ${item.id}</h3>
    <h3><strong>Description:</strong> ${item.description}</h3></div>
    </div>
    
    <h2>- RECORDS -</h2>

    <hr>
    <div id="records"></div>
    </div>
    `;
    
    const recordsContainer = document.getElementById("records");
    
    item.records.forEach(record => {
        
        const div = document.createElement("div");
        
        div.className = "record";
        
        div.innerHTML = `
        <div class="record-player">
        <h4>${record.player}</h4>
        <h4>${record.mobile ? "📱" : "🖥️"}</h4>
        <a href="${record.video}" target="_blank"><h4>VIDEO</h4></a>
        </div>
        <hr>
        `;
        
        recordsContainer.appendChild(div);
    });
}
