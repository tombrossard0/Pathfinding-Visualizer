const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

let start_dragged = false;
let target_dragged = false;

let columns = 0, rows = 0;

const wrapper = document.getElementById("tiles");

const createTile = index => {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.style.setProperty("--num", -1);

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

    if (columns % 2 == 0)
        columns--;
    if (rows % 2 == 0)
        rows--;

    wrapper.style.setProperty("--columns", columns);
    wrapper.style.setProperty("--rows", rows);

    createTiles(columns * rows);

    get_tile(1,1).classList.add("start");
    get_tile(columns-2,rows-2).classList.add("target");
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

function Clear() {
    const tiles = Array.from(document.getElementsByClassName("wall"));

    tiles.forEach((tile) => {
        tile.classList.remove("wall");
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function maze_not_finished () {
    var first = -1;

    for (var i = 0; i < columns; i++)
    {
        for (var j = 0; j < rows; j++)
        {
            var tile = get_tile(i,j);

            if (first == -1 && tile.style.getPropertyValue("--num") != -1)
                first = tile.style.getPropertyValue("--num");

            if (first != tile.style.getPropertyValue("--num") && tile.style.getPropertyValue("--num") != -1)
            {
                console.log("TEST : " + tile.style.getPropertyValue("--num").toString() + " | " + first.toString());
                return 1;
            }
        }
    }

    return 0;
}

function toColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = ( (num & 0xFF000000) >>> 24 ) / 255 ;
    return "rgba(" + [r, g, b, 1].join(",") + ")";
}

async function GenerateMaze() {

    for (var i = 0; i < columns; i+=2)
    {
        for (var j = 0; j < rows; j++)
        {
            var wall = get_tile(i, j);
            wall.classList.add("wall")
        }
    }

    for (var i = 0; i < columns; i++)
    {
        for (var j = 0; j < rows; j+=2)
        {
            var wall = get_tile(i, j);
            wall.classList.add("wall");
        }
    }

    var index = 1; // < to 1 if is a wall

    Array.from(document.getElementsByClassName("tile")).forEach((tile) => {
       if (!tile.classList.contains("wall"))
       {
            tile.style.setProperty("--num", index);
            index++;
       }
    });

    while (maze_not_finished() == 1)
    {
        var x = clamp(Math.floor(Math.random() * columns-2)+1, 1, columns-1);
        var y;
        
        if (x % 2 == 0)
            y = clamp(Math.floor(Math.random() * (rows-1)/2) * 2 + 1, 1, rows-2);
        else
            y = clamp(Math.floor(Math.random() * (rows-2)/2) * 2 + 2, 1, rows-2);
        
        var wall = get_tile(x, y);
        
        var c1;
        var c2;

        if (get_tile(x-1, y).style.getPropertyValue("--num") == -1)
        {
            c1 = get_tile(x, y-1).style.getPropertyValue("--num");
            c2 = get_tile(x, y+1).style.getPropertyValue("--num");
        }
        else
        {
            c1 = get_tile(x-1, y).style.getPropertyValue("--num");
            c2 = get_tile(x+1, y).style.getPropertyValue("--num");
        }
        
        if (c1 != c2)
        {
            wall.classList.remove("wall");
            wall.style.setProperty("--num", index);

            for (var i = 1; i < columns-1; i++)
            {
                for (var j = 1; j < rows-1; j++)
                {
                    var cur = get_tile(i, j).style.getPropertyValue("--num");
                    if (cur == c2)
                    {
                        get_tile(i, j).style.setProperty("--num", c1);
                    }
                }
            }
        }

        await sleep(0);
    }
}