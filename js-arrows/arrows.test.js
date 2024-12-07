const arrows = require("./arrows");

// describe("listAdjacentCells", () => {
//     it("should list adjacent cells, when owner on the top row", () => {
//         expect(arrows.listAdjacentCells([0,1])).toStrictEqual([[1,1], [0,0], [0,2]]);
//     });
//
//     it("should list adjacent cells, when owner on the middle row", () => {
//         expect(arrows.listAdjacentCells([1,2])).toStrictEqual([[0,2], [2,2], [1,1]]);
//     });
//
//     it("should list adjacent cells, when owner in the middle", () => {
//         console.log(arrows.listAdjacentCells([1,1]));
//         expect(arrows.listAdjacentCells([1,1])).toStrictEqual([[ 0, 1 ], [ 2, 1 ], [ 1, 0 ], [ 1, 2 ]]);
//     });
// })

describe("toTheLeftPointingAtYou", () => {
    it("should return true, when the cell to the left is pointing at you", () => {
        const matrix = {
            matrix: [
                [{value: "point_right"}, {value: ""},{value: ""}],
                [{value: ""}, {value: ""},{value: ""}],
                [{value: ""}, {value: ""},{value: ""}],
            ]
        }
        expect(arrows.everything.toTheLeftPointingAtYou([0,0], [1,0], matrix)).toBe(true);
    });
})