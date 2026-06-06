import { renderHome } from "./pages/home.js";
import { renderLevel } from "./pages/level.js";
import { renderList } from "./pages/list.js";
import { renderPacks } from "./pages/packs.js";
import { renderLeaderboard } from "./pages/leaderboard.js";

const content = document.getElementById("content");

function router() {
    const route = location.hash || "#home";

    if (route === "#list") {
        renderList(content);
    }

    else if (route.startsWith("#level/")) {
        const id = route.split("/")[1];
        renderLevel(content, id);

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