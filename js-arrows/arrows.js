// Start of stuff for testing
var post = null;

var outlet = (num, valsArray) => {
    return valsArray;
};

function getMatrices() {
    return matrices;
}

function setMatrices(newMatrices) {
    matrices = newMatrices;
}

function setLogFunction(newLog) {
    post = newLog;
}

exports.outlet = outlet;
exports.initRandomWithSize = initRandomWithSize;
exports.initWithSize = initWithSize;
exports.addSeed = addSeed;
exports.setMode = setMode;
exports.getMatrices = getMatrices;
exports.getValsArray = getValsArray;
exports.setLogFunction = setLogFunction;
exports.bang = bang;
exports.createIdenticalMatrix = createMatrix;
exports.createMatrix = createMatrix;
exports.setMatrices = setMatrices;
exports.updateValue = updateNamedUserCellValue;
exports.toTheLeftPointingAtYou = toTheLeftPointingAtYou;
// End of testing stuff


var userList = [
    "Mark",
    "David",
    "Rian",
    "Lavender",
    "Guillaume",
    "Aidan",
    "Aleksi",
    "Camp Helper",
    "Ben",
    "Giacomo",
    "Anton",
    "John",
    "Yasunao",
    "Keith",
    "Roland",
    "Max",
]

var gridHeight = 0;
var gridWidth = 0;

var point_values = [
    "point_left",
    "point_right",
    "point_up",
    "point_down",
]

var mode = "random";

var matrices = []

var prevValsArray = [];

var usersUpdatedOnPreviousBang = [];

function initRandomWithSize(size) {
    post("init with size: "+size+" * "+size+"...")

    matrices = [];

    gridWidth = size;
    gridHeight = size;

    prevValsArray = [...Array(gridWidth*gridHeight).fill(0)];

    const userListSlice = userList.slice(0, size*size);

    userListSlice.map((name) => {
        post(name)
        matrices = [...matrices, createRandomMatrix(name, userListSlice, gridWidth, gridHeight)];
    });

    const valsArray = getValsArray();

    outlet(0, valsArray);
}

function initWithSize(size) {
    post("init with size: "+size+" * "+size+"...")

    matrices = [];

    gridWidth = size;
    gridHeight = size;

    prevValsArray = [...Array(gridWidth*gridHeight).fill(0)];

    const userListSlice = userList.slice(0, size*size);

    userListSlice.map((name) => {
        matrices = [...matrices, createMatrix(name, userListSlice, gridWidth, gridHeight)];
    });

    usersUpdatedOnPreviousBang = [...Array(matrices.length).fill(false)]

    const valsArray = getValsArray();

    outlet(0, valsArray);
}

function initBFP() {
    post("init Ben Fletcher Paradox...")
    matrices = [];
    matrices = createBFPMatrix();

    const valsArray = getValsArray();

    outlet(0, valsArray);
}

function addSeed(name, value) {
    matrices = updateNamedUserCellValue(name, value, matrices);

    const seededUserIndex = matrices.map(m => m.owner).indexOf(name)
    post(seededUserIndex)
    usersUpdatedOnPreviousBang[seededUserIndex] = true;

    const valsArray = getValsArray();

    outlet(0, valsArray);
}

function setMode(newMode) {
    if (newMode === "random" || newMode === "sequential") {
        mode = newMode;
    } else {
        mode = "random";
    }
}

function getValsArray() {
    return matrices.flatMap((matrix) => {
        return matrix.matrix.flatMap((row) => {
            return row.flatMap((cell) => {
                switch (cell.value) {
                    case "point_left":
                        return 1;
                    case "point_right":
                        return 2;
                    case "point_up":
                        return 3;
                    case "point_down":
                        return 4;
                    default:
                        return 0;
                }
            });
        });
    });
}

var steadyState = false;

function bang() {
    let usersToUpdate = [...Array(matrices.length).fill(false)];

    if (!steadyState) {
        let anyoneUpdated = false;

        for (let i = 0; i < matrices.length - 1; i++) {
            const matrix = matrices[i];

            const shouldUpdateOwner = shouldWeUpdateOwner(matrix);

            if (shouldUpdateOwner) {
                usersToUpdate[i] = true;
                anyoneUpdated = true;
            }
        }

        if (anyoneUpdated) {
            usersUpdatedOnPreviousBang = [...usersToUpdate];
        }
    } else {
        usersToUpdate = [...usersUpdatedOnPreviousBang];
    }

    for (let i = 0; i < matrices.length; i++) {
        if (usersToUpdate[i]) {
            const matrix = matrices[i];
            const { owner } = matrix;
            let { value } = matrix;

            const newValue = calculateNewValue(value);

            matrices = updateNamedUserCellValue(owner, newValue, matrices);
            value = newValue;
        }
    }
    const valsArray = getValsArray();

    if (valsArray.toString() === prevValsArray.toString()) {
        steadyState = true;
        post("stable state reached");
    }
    prevValsArray = valsArray;
    outlet(0, valsArray);
}

function createRandomMatrix(owner, users, gridWidth, gridHeight) {
    let currentIndex = users.length;

    // Do the Fisher–Yates shuffle...
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [users[currentIndex], users[randomIndex]] = [
            users[randomIndex], users[currentIndex]];
    }

    return createMatrix(owner, users, gridWidth, gridHeight);
}

function createBFPMatrix() {
    return [
        {
            owner: "Mark",
            matrix: [
                [{name: "Mark", value: ""}, {name: "Rian", value: ""}, {name: "David", value: ""}],
                [{name: "Lavender", value: ""}, {name: "Guillaume", value: ""}, {name: "Aidan", value: ""}],
                [{name: "Aleksi", value: ""}, {name: "Camp Helper", value: ""}, {name: "Ben", value: ""}],
            ]
        },
        {
            owner: "Rian",
            matrix: [
                [{name: "Guillaume", value: ""}, {name: "Rian", value: ""}, {name: "David", value: ""}],
                [{name: "Lavender", value: ""}, {name: "Mark", value: ""}, {name: "Ben", value: ""}],
                [{name: "Aleksi", value: ""}, {name: "Camp Helper", value: ""}, {name: "Aidan", value: ""}],
            ]
        },
        {
            owner: "David",
            matrix: [
                [{name: "Mark", value: ""}, {name: "Rian", value: ""}, {name: "David", value: ""}],
                [{name: "Aleksi", value: ""}, {name: "Ben", value: ""}, {name: "Camp Helper", value: ""}],
                [{name: "Lavender", value: ""}, {name: "Guillaume", value: ""}, {name: "Aidan", value: ""}],
            ]
        },
        {
            owner: "Lavender",
            matrix: [
                [{name: "Aleksi", value: ""}, {name: "Rian", value: ""}, {name: "Ben", value: ""}],
                [{name: "Guillaume", value: ""}, {name: "Lavender", value: ""}, {name: "Aidan", value: ""}],
                [{name: "Mark", value: ""}, {name: "Camp Helper", value: ""}, {name: "David", value: ""}],
            ]
        },
        {
            owner: "Guillaume",
            matrix: [
                [{name: "Lavender", value: ""}, {name: "Guillaume", value: ""}, {name: "Aidan", value: ""}],
                [{name: "Ben", value: ""}, {name: "Aleksi", value: ""}, {name: "Camp Helper", value: ""}, ],
                [{name: "Rian", value: ""}, {name: "Mark", value: ""}, {name: "David", value: ""}],
            ]
        },
        {
            owner: "Aidan",
            matrix: [
                [{name: "David", value: ""}, {name: "Ben", value: ""}, {name: "Lavender", value: ""}],
                [{name: "Aidan", value: ""}, {name: "Guillaume", value: ""}, {name: "Mark", value: ""}],
                [{name: "Aleksi", value: ""}, {name: "Camp Helper", value: ""}, {name: "Rian", value: ""}],
            ]
        },
        {
            owner: "Aleksi",
            matrix: [
                [{name: "Ben", value: ""}, {name: "Rian", value: ""}, {name: "David", value: ""}],
                [{name: "Lavender", value: ""}, {name: "Guillaume", value: ""}, {name: "Aidan", value: ""}],
                [{name: "Aleksi", value: ""}, {name: "Camp Helper", value: ""}, {name: "Mark", value: ""}],
            ]
        },
        {
            owner: "Camp Helper",
            matrix: [
                [{name: "Camp Helper", value: ""}, {name: "Rian", value: ""}, {name: "David", value: ""}],
                [{name: "Lavender", value: ""}, {name: "Guillaume", value: ""}, {name: "Aidan", value: ""}],
                [{name: "Ben", value: ""}, {name: "Aleksi", value: ""}, {name: "Mark", value: ""}],
            ]
        },
        {
            owner: "Ben",
            matrix: [
                [{name: "Mark", value: ""}, {name: "Rian", value: ""}, {name: "David", value: ""}],
                [{name: "Aleksi", value: ""}, {name: "Camp Helper", value: ""}, {name: "Guillaume", value: ""}],
                [{name: "Lavender", value: ""}, {name: "Ben", value: ""}, {name: "Aidan", value: ""}],
            ]
        },
    ];
}

function createMatrix(owner, userList, gridWidth, gridHeight) {
    let matrix = [];
    let x, y;
    for (let i = 0; i < gridHeight; i++) {
        let row = [];
        for(let j = 0; j < gridWidth; j++) {
            if (userList[(i*gridWidth)+j] === owner) {
                x = i
                y = j
            }

            row.push({
                name: userList[(i*gridWidth)+j],
                value: ""
            });
        }
        matrix.push(row);
    }

    const adjacentCells = setAdjacentCells([x,y]);

    return {
        owner,
        position: [x, y],
        value: "",
        adjacentCells,
        currentlyPointingAtYou: [...Array(adjacentCells.length).fill(false)],
        matrix
    }
}

function setAdjacentCells(ownerPosition) {
    return [
        [ownerPosition[0] - 1, ownerPosition[1]],
        [ownerPosition[0] + 1, ownerPosition[1]],
        [ownerPosition[0], ownerPosition[1] - 1],
        [ownerPosition[0], ownerPosition[1] + 1],
    ].filter((cell) => {
        return cell[0] >= 0 && cell[0] < gridHeight && cell[1] >= 0 && cell[1] < gridWidth;
    })
}

function updateNamedUserCellValue(name, value, matrices) {
    return matrices.map((matrix) => {
        matrix.matrix.map((row) => {
            row.map((cell) => {
                if (cell.name === name) {
                    cell.value = value
                }
                return cell
            })
            return row;
        });
        return matrix;
    });
}

function calculateNewValue(value) {
    if (mode === "random") {
        const filteredList = point_values.filter((pv) => pv !== value);
        return filteredList[Math.floor(Math.random() * filteredList.length)];
    }

    if (mode === "sequential") {
        const currentIndex = point_values.indexOf(value);
        if (currentIndex === 3) {
            return point_values[0];
        }
        return point_values[currentIndex + 1];
    }
}

function hasThereBeenAChange(preUpdatePointingAtYou, currentlyPointingAtYou) {
    for (let i = 0; i < preUpdatePointingAtYou.length; i++) {
        if (preUpdatePointingAtYou[i] !== currentlyPointingAtYou[i]
            && currentlyPointingAtYou[i] === true) {
            return true;
        }
    }

    return false;
}

function shouldWeUpdateOwner(matrix) {
    const { adjacentCells } = matrix;
    const preUpdatePointingAtYou = [...matrix.currentlyPointingAtYou];

    for (let i = 0; i < adjacentCells.length; i++) {
        if (toTheLeftPointingAtYou(adjacentCells[i], matrix)) {
            matrix.currentlyPointingAtYou[i] = true;
        }

        if (toTheRightPointingAtYou(adjacentCells[i], matrix)) {
            matrix.currentlyPointingAtYou[i] = true;
        }

        if (abovePointingAtYou(adjacentCells[i], matrix)) {
            matrix.currentlyPointingAtYou[i] = true;
        }

        if (belowPointingAtYou(adjacentCells[i], matrix)) {
            matrix.currentlyPointingAtYou[i] = true;
        }
    }

    return hasThereBeenAChange(preUpdatePointingAtYou, matrix.currentlyPointingAtYou);
}

function abovePointingAtYou(cell, matrix) {
    return cell[0] === matrix.position[0] - 1 &&
        cell[1] === matrix.position[1] &&
        matrix.matrix[cell[0]][cell[1]].value === "point_down";
}

function belowPointingAtYou(cell, matrix) {
    return cell[0] === matrix.position[0] + 1 &&
        cell[1] === matrix.position[1] &&
        matrix.matrix[cell[0]][cell[1]].value === "point_up";
}

function toTheLeftPointingAtYou(cell, matrix) {
    return cell[0] === matrix.position[0] &&
        cell[1] === matrix.position[1] - 1 &&
        matrix.matrix[cell[0]][cell[1]].value === "point_right";
}

function toTheRightPointingAtYou(cell, matrix) {
    return cell[0] === matrix.position[0] &&
        cell[1] === matrix.position[1] + 1 &&
        matrix.matrix[cell[0]][cell[1]].value === "point_left";
}
