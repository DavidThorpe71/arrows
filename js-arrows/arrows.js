const userList = [
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

function createUser(name) {
    return {
        name,
        value: 0,
    }
}

function updateValue(name, value, users, matrices) {
    const u = users.map((user) => {
        if (user.name === name) {
            user.value = value ?? point_values[Math.floor(Math.random() * point_values.length)];
        }
        return user;
    });

    const m = matrices.map((matrix) => {
        matrix.matrix.map((row) => {
            row.map((cell) => {
                if (cell.name === name) {
                    cell.value = value ?? point_values[Math.floor(Math.random() * point_values.length)];
                }
                return cell
            })
            return row;
        });
        return matrix;
    });

    return [u, m];
}

let users = [];
let matrices = []

function run() {
    userList.map((name) => {
        users = [...users, createUser(name)];
        matrices = [...matrices, createRandomMatrix(name)];
    });
}

function addSeed(seed) {
    const seedResponse = updateValue(seed.name, seed.value, users, matrices);
    users = seedResponse[0];
    matrices = seedResponse[1];
}


function getOwnerPosition(matrix) {
    let ri = 0, ci = 0;
    matrix.matrix.map((row, rowIndex) => {
        row.map((cell, cellIndex) => {
            if (cell.name === matrix.owner) {
                ri = rowIndex
                ci = cellIndex;
            }
        });
    });

    return [ri, ci];
}

const gridHeight = 3;
const gridWidth = 3;

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

const point_values = [
    "point_left",
    "point_right",
    "point_up",
    "point_down",
]

function updateMatrices(matrices) {
    for (let i = 0; i < matrices.length; i++) {
        const matrix = matrices[i];
        const ownerPosition = getOwnerPosition(matrix);

        const shouldUpdateOwner = shouldWeUpdateOwner(matrix, ownerPosition);

        if (shouldUpdateOwner) {
            const newMatrices = updateValue(matrix.owner, null, users, matrices);
            users = newMatrices[0];
            matrices = newMatrices[1];
        }
    }
}

run();
console.log("init: ");
console.log(matrices[0].owner, matrices[0].matrix);
console.log(matrices[1].owner, matrices[1].matrix);
console.log(matrices[2].owner, matrices[2].matrix);
console.log(matrices[3].owner, matrices[3].matrix);
console.log(matrices[4].owner, matrices[4].matrix);
console.log(matrices[5].owner, matrices[5].matrix);
console.log(matrices[6].owner, matrices[6].matrix);
console.log(matrices[7].owner, matrices[7].matrix);
console.log(matrices[8].owner, matrices[8].matrix);

addSeed({name: "Mark", value: "point_right"});

console.log("seed: ");
console.log(matrices[0].owner, matrices[0].matrix);
console.log(matrices[1].owner, matrices[1].matrix);
console.log(matrices[2].owner, matrices[2].matrix);
console.log(matrices[3].owner, matrices[3].matrix);
console.log(matrices[4].owner, matrices[4].matrix);
console.log(matrices[5].owner, matrices[5].matrix);
console.log(matrices[6].owner, matrices[6].matrix);
console.log(matrices[7].owner, matrices[7].matrix);
console.log(matrices[8].owner, matrices[8].matrix);

updateMatrices(matrices);
console.log("first iteration: ");
console.log(matrices[0].owner, matrices[0].matrix);
console.log(matrices[1].owner, matrices[1].matrix);
console.log(matrices[2].owner, matrices[2].matrix);
console.log(matrices[3].owner, matrices[3].matrix);
console.log(matrices[4].owner, matrices[4].matrix);
console.log(matrices[5].owner, matrices[5].matrix);
console.log(matrices[6].owner, matrices[6].matrix);
console.log(matrices[7].owner, matrices[7].matrix);
console.log(matrices[8].owner, matrices[8].matrix);

updateMatrices(matrices);
console.log("second iteration: ");
console.log(matrices[0].owner, matrices[0].matrix);
console.log(matrices[1].owner, matrices[1].matrix);
console.log(matrices[2].owner, matrices[2].matrix);
console.log(matrices[3].owner, matrices[3].matrix);
console.log(matrices[4].owner, matrices[4].matrix);
console.log(matrices[5].owner, matrices[5].matrix);
console.log(matrices[6].owner, matrices[6].matrix);
console.log(matrices[7].owner, matrices[7].matrix);
console.log(matrices[8].owner, matrices[8].matrix);

const everything = {
    run,
    updateMatrices,
    userList,
    users,
    matrices,
    createUser,
    createRandomMatrix,
    createFixedMatrix,
    updateValue,
    getOwnerPosition,
    listAdjacentCells,
    toTheLeftPointingAtYou,
    toTheRightPointingAtYou,
    abovePointingAtYou,
    belowPointingAtYou,
    shouldWeUpdateOwner,
    point_values,
}
exports.everything = everything;