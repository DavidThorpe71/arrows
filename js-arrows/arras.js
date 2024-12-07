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
]

var gridHeight = 3;
var gridWidth = 3;

var point_values = [
    "point_left",
    "point_right",
    "point_up",
    "point_down",
]

var mode = "random";

var lastToChange = "";

let matrices = []

function init() {
    post("init...")
    matrices = [];
    userList.map((name) => {
        matrices = [...matrices, createRandomMatrix(name)];
    });

    const valsArray = getValsArray();

    post(" ");
    outlet(0, valsArray);
}

function initBFP() {
    post("init Ben Fletcher Paradox...")
    matrices = [];
    matrices = createBFPMatrix();

    const valsArray = getValsArray();

    post(" ");
    outlet(0, valsArray);
}

function initIdentical() {
    post("init identical...")
    matrices = [];
    userList.map((name) => {
        matrices = [...matrices, createIdenticalMatrix(name)];
    });

    const valsArray = getValsArray();

    post(" ");
    outlet(0, valsArray);
}

function addSeed(name, value) {
    matrices = updateValue(name, value, matrices);

    const valsArray = getValsArray();
    lastToChange = name;

    post(" ");
    outlet(0, valsArray);
}

function setMode(newMode) {
    if (newMode === "random" || newMode === "sequential") {
        mode = newMode;
    } else {
        mode = "random";
    }
}

exports.setMode = setMode;

var prevValsArray = [...Array(81).fill(0)];

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

var log = post

function setLogFunction(newLog) {
    log = newLog;
}

exports.setLogFunction = setLogFunction;

function bang() {
    for (let i = 0; i < matrices.length; i++) {
        const matrix = matrices[i];
        const {ownerPosition, ownerValue} = getOwnerPositionAndValue(matrix);

        const shouldUpdateOwner = shouldWeUpdateOwner(matrix, ownerPosition);

        if (shouldUpdateOwner) {
            matrices = updateValue(matrix.owner, ownerValue, matrices);
        }
    }

    const valsArray = getValsArray();

    if (valsArray.toString() === prevValsArray.toString()) {
        post("stable state reached");
    }

    post(" ");
    outlet(0, valsArray);
}

function createRandomMatrix(owner) {
    const array = [...userList];
    let currentIndex = array.length;

    // Do the Fisher–Yates shuffle...
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return {
        owner,
        matrix: [
            [{name: array[0], value: ""}, {name: array[1], value: ""}, {name: array[2], value: ""}],
            [{name: array[3], value: ""}, {name: array[4], value: ""}, {name: array[5], value: ""}],
            [{name: array[6], value: ""}, {name: array[7], value: ""}, {name: array[8], value: ""}],
        ]
    }
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

function createIdenticalMatrix(owner) {
    const array = [...userList];
    return {
        owner,
        matrix: [
            [{name: array[0], value: ""}, {name: array[1], value: ""}, {name: array[2], value: ""}],
            [{name: array[3], value: ""}, {name: array[4], value: ""}, {name: array[5], value: ""}],
            [{name: array[6], value: ""}, {name: array[7], value: ""}, {name: array[8], value: ""}],
        ]
    }
}

function updateValue(name, value, matrices) {
    let newCellValue = getCellValue(value)

    return matrices.map((matrix) => {
        matrix.matrix.map((row) => {
            row.map((cell) => {
                if (cell.name === name) {
                    cell.value = newCellValue
                }
                return cell
            })
            return row;
        });
        return matrix;
    });
}

exports.updateValue = updateValue;

function getCellValue(value) {
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

function getOwnerPositionAndValue(matrix) {
    let ri = 0, ci = 0, value = "";
    matrix.matrix.map((row, rowIndex) => {
        row.map((cell, cellIndex) => {
            if (cell.name === matrix.owner) {
                ri = rowIndex
                ci = cellIndex;
                value = cell.value
            }
        });
    });

    return {
        ownerPosition: [ri, ci],
        ownerValue: value
    };
}

function shouldWeUpdateOwner(matrix, ownerPosition) {
    const adjacentCells = listAdjacentCells(ownerPosition);

    for (let i = 0; i < adjacentCells.length; i++) {
        if (toTheLeftPointingAtYou(adjacentCells[i], ownerPosition, matrix)) {
            return true
        }

        if (toTheRightPointingAtYou(adjacentCells[i], ownerPosition, matrix)) {
            return true
        }

        if (abovePointingAtYou(adjacentCells[i], ownerPosition, matrix)) {
            return true
        }

        if (belowPointingAtYou(adjacentCells[i], ownerPosition, matrix)) {
            return true
        }
    }

    return false;
}

function listAdjacentCells(ownerPosition) {
    return [
        [ownerPosition[0] - 1, ownerPosition[1]],
        [ownerPosition[0] + 1, ownerPosition[1]],
        [ownerPosition[0], ownerPosition[1] - 1],
        [ownerPosition[0], ownerPosition[1] + 1],
    ].filter((cell) => {
        return cell[0] >= 0 && cell[0] < gridHeight && cell[1] >= 0 && cell[1] < gridWidth;
    });
}

function toTheLeftPointingAtYou(cell, ownerPosition, matrix) {
    return cell[0] === ownerPosition[0] - 1 &&
        cell[1] === ownerPosition[1] &&
        matrix.matrix[cell[0]][cell[1]].value === "point_right";
}

function toTheRightPointingAtYou(cell, ownerPosition, matrix) {
    return cell[0] === ownerPosition[0] + 1 &&
        cell[1] === ownerPosition[1] &&
        matrix.matrix[cell[0]][cell[1]].value === "point_left";
}

function abovePointingAtYou(cell, ownerPosition, matrix) {
    return cell[0] === ownerPosition[0] &&
        cell[1] === ownerPosition[1] - 1 &&
        matrix.matrix[cell[0]][cell[1]].value === "point_down";
}

function belowPointingAtYou(cell, ownerPosition, matrix) {
    return cell[0] === ownerPosition[0] &&
        cell[1] === ownerPosition[1] + 1 &&
        matrix.matrix[cell[0]][cell[1]].value === "point_up";
}
