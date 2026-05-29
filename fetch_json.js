import { getThumbnailFromId } from "./utils.js";

const files = [
    "./levels/tmkocx.json",
    "./levels/tmkoc.json",
    "./levels/tmkoc_og.json",
];

export async function fetchJSON() {

    const list = document.getElementById("list");

    if (!list) {
        console.error("list element not found");
        return;
    }

    const responses = await Promise.all(
        files.map(file => fetch(file))
    );

    const data = await Promise.all(
        responses.map(r => r.json())
    );

    const positions = await fetchList();
    return await Promise.all(
        list.map(async (path, rank) => {
            const fetchJSON = await fetch(`./levels/${path}.json`);
            try {
                const level = await fetchList();

    data.forEach(item => {

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `

            <img src="${getThumbnailFromId(item.verification)}">
        <div class="card-text">
            <h3>${rank} - ${item.name}</h3>
            <h4><strong>Creator:</strong> ${item.creator}</h4>
            <h4><strong>Verifier:</strong> ${item.verifier}</h4>
        </div>
        `;
        
        list.appendChild(card);
    });
}
