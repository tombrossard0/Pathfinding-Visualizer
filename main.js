const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

let columns = Math.floor(document.body.clientWidth / 50),
    rows = Math.floor(document.body.clientHeight / 50);

const wrapper = document.getElementById("tiles");

const createTile = index => {
    const tile = document.createElement("div");

    tile.onclick = function() {
        if (!tile.classList.contains("start") && !tile.classList.contains("target"))
            tile.classList.toggle("wall");
    }

    tile.style.setProperty("--x", Math.floor((index) % columns));
    tile.style.setProperty("--y", Math.floor((index) / columns));

    if (tile.style.getPropertyValue("--x") % 2 === tile.style.getPropertyValue("--y") % 2)
        tile.classList.add("gray");
    else
        tile.classList.add("white");

    return tile;
}

const createTiles = quantity => {
    Array.from(Array(quantity)).map((tile, index) => {
        tile = createTile(index);
        wrapper.appendChild(tile);
    })
}

const createGrid = () => {
    wrapper.innerHTML = "";

    columns = Math.floor(document.body.clientWidth / 50);
    rows = Math.floor(document.body.clientHeight / 50);

    wrapper.style.setProperty("--columns", columns);
    wrapper.style.setProperty("--rows", rows);

    createTiles(columns * rows);

    get_tile(5,10).classList.add("start");
    get_tile(25,10).classList.add("target");
}

const get_tile = (x, y) => {
    x = clamp(x, 0, columns-1);
    y = clamp(y, 0, rows-1);

    const index = y * columns + x;
    return wrapper.children[index];
}

window.onresize = () => createGrid();

createGrid();