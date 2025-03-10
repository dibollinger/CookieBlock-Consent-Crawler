function getAltText(tag) {
    const obj = arguments[0];

    let altText = "";
    for (let e of [obj, ...obj.children]) {
        if (e.hasAttribute("alt")) {
            altText += " " + e.getAttribute("alt");
        }
        if (e.hasAttribute("title")) {
            altText += " " + e.getAttribute("title");
        }
    }
    return altText;
}

const links = {};
const candidates = document.links;
for (let link of candidates) {
    const href = link.getAttribute("href");
    if (!(href in links)) {
        links[href] = {
            href: href,
            text: link.textContent,
            alt_text: getAltText(link)
        };
    } else {
        links[href].text += " " + link.textContent;
        links[href].alt_text += " " + getAltText(link);
    }
}

// noinspection JSAnnotator
return Object.values(links);
