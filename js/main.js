async function fetchAndCacheImage(url) {
    try {
        let response = await fetch(url);
        let header = {headers: {"date": Date.now()}}
        let responseNew = new Response(response.body, header);
        let cache = await caches.open("images");
        cache.put(url, responseNew);
        return responseNew;

    } catch {
        alert("Failed to get image.");
    }
};

async function getImage(url) {
    let expire = 7 * 24 * 60 * 60 * 1000;
    let cache = await caches.open("images");
    let response = await cache.match(url);
    let date = response?.headers.get('date');
    Date.now() - date < expire || (response = await fetchAndCacheImage(url));
    return response;
}

function createImage(blob) {
    let image = document.createElement("img");
    image.src = URL.createObjectURL(blob);
    return image;
}

(async () => {
    try {
        let response = await fetch("https://picsum.photos/v2/list")
        let data = await response.json();
        data.sort(() => 0.5 - Math.random());
        let images = new DocumentFragment();
        for (item of data) {
            let response = await getImage(item.download_url);
            let blob = await response.blob();
            images.append(createImage(blob));
        }
        document.body.appendChild(images);
    } catch {
        alert("Failed to get image list.");
    }
})();