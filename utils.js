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
