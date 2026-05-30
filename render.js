import { renderHome } from "./pages/home.js";
import { renderList } from "./pages/list.js";
import { renderPacks } from "./pages/packs.js";
import { renderLeaderboard } from "./pages/leaderboard.js";

import { fetchJSON } from "./fetch_json.js";

const content = document.getElementById("content");

function router() {
    const route = location.hash || "#home";

    if (route === "#list") {
        renderList(content);
        fetchJSON();

    } else if (route === "#packs") {
        renderPacks(content);

    } else if (route === "#leaderboard") {
        renderLeaderboard(content);

    } else {
        renderHome(content);
    }
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
