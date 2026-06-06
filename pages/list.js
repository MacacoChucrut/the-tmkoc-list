import { getThumbnailFromId } from "../utils.js";

export async function renderList(content) {

    content.innerHTML = `
    <div class="list">
    
    <h2>- THE TMKOC LIST -</h2>
    
    <div id="list"></div>

    </div>
    `;

    const list = document.getElementById("list");

    const listResponse =
        await fetch("./levels/_list.json");

    const levelNames =
        await listResponse.json();

    const responses = await Promise.all(
        levelNames.map(id =>
            fetch(`./levels/${id}.json`)
        )
    );

    const data = await Promise.all(
        responses.map(r => r.json())
    );

    data.forEach((item, index) => {

        const card = document.createElement("div");

        card.className = "card";

        card.onclick = () => {
            location.hash =
                `#level/${item.id}`;
        };

        card.innerHTML = `
            <a href="${item.verification}"
               target="_blank">

                <img src="${getThumbnailFromId(
                    item.verification
                )}">
            </a>

            <div class="card-text">
                <h3>#${index + 1} - ${item.name}</h3>
                <h4>Creator(s): ${item.creator}</h4>
                <h4>Verifier: ${item.verifier}</h4>
            </div>
        `;

        const link =
            card.querySelector("a");

        link.addEventListener(
            "click",
            (event) => {
                event.stopPropagation();
            }
        );

        list.appendChild(card);
    });
}