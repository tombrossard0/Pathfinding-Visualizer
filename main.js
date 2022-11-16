const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

let start_dragged = false;
let target_dragged = false;

let columns = Math.floor(document.body.clientWidth / 50),
    rows = Math.floor(document.body.clientHeight / 50);

const wrapper = document.getElementById("tiles");

const createTile = index => {
    const tile = document.createElement("div");

    tile.onmousedown = function() {
        if (!tile.classList.contains("start") && !tile.classList.contains("target"))
            tile.classList.toggle("wall");

        if (tile.classList.contains("start"))
        {
            start_dragged = true;
        }
        else if (tile.classList.contains("target"))
        {
            target_dragged = true;
        }
    }

    tile.onmouseenter = function() {
        if (start_dragged && !tile.classList.contains("target") && !tile.classList.contains("wall"))
        {
            tile.classList.toggle("start");
        }
        else if (target_dragged && !tile.classList.contains("start") && !tile.classList.contains("wall"))
        {
            tile.classList.toggle("target");
        }
    }

    tile.onmouseleave = function() {
        if (start_dragged && !tile.classList.contains("target") && !tile.classList.contains("wall"))
        {
            tile.classList.toggle("start");
        }
        else if (target_dragged && !tile.classList.contains("start") && !tile.classList.contains("wall"))
        {
            tile.classList.toggle("target");
        }
    }

    tile.onmouseup = function() {
        if (start_dragged && !tile.classList.contains("target") && !tile.classList.contains("wall"))
        {
            start_dragged = false;
        } 
        else if (target_dragged && !tile.classList.contains("start") && !tile.classList.contains("wall"))
        {
            target_dragged = false;
        }
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

function Run() {
    console.log("Run!");
}