
const arras = require("./arras");

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

describe("arras.updateValue()", () => {
    it("should correctly update all owner cells", () => {
        arras.setMode("sequential");
        const stubMatrix = [
            {
                owner: "Mark",
                matrix: [
                    [{name: "Mark", value: ""}, {name: "Rian", value: ""}],
                    [{name: "David", value: ""}, {name: "Lavender", value: ""}],
                ]
            },
            {
                owner: "Rian",
                matrix: [
                    [{name: "Mark", value: ""}, {name: "Rian", value: ""}],
                    [{name: "David", value: ""}, {name: "Lavender", value: ""}],
                ]
            },
            {
                owner: "David",
                matrix: [
                    [{name: "Mark", value: ""}, {name: "Rian", value: ""}],
                    [{name: "David", value: ""}, {name: "Lavender", value: ""}],
                ]
            },
            {
                owner: "Lavender",
                matrix: [
                    [{name: "Mark", value: ""}, {name: "Rian", value: ""}],
                    [{name: "David", value: ""}, {name: "Lavender", value: ""}],
                ]
            },
        ]

        const expectedMatrix = [
            {
                owner: "Mark",
                matrix: [
                    [{name: "Mark", value: "point_right"}, {name: "Rian", value: ""}],
                    [{name: "David", value: ""}, {name: "Lavender", value: ""}],
                ]
            },
            {
                owner: "Rian",
                matrix: [
                    [{name: "Mark", value: "point_right"}, {name: "Rian", value: ""}],
                    [{name: "David", value: ""}, {name: "Lavender", value: ""}],
                ]
            },
            {
                owner: "David",
                matrix: [
                    [{name: "Mark", value: "point_right"}, {name: "Rian", value: ""}],
                    [{name: "David", value: ""}, {name: "Lavender", value: ""}],
                ]
            },
            {
                owner: "Lavender",
                matrix: [
                    [{name: "Mark", value: "point_right"}, {name: "Rian", value: ""}],
                    [{name: "David", value: ""}, {name: "Lavender", value: ""}],
                ]
            },
        ]
        expect(arras.updateValue("Mark", "point_left", stubMatrix)).toStrictEqual(expectedMatrix);
    })

    it("should correctly update all owner cells when cells randomly positioned", () => {
        arras.setMode("sequential");
        const stubMatrix =[
            {
                owner: "Mark",
                matrix: [
                    [{name: "Mark", value: ""}, {name: "Rian", value: ""}],
                    [{name: "Lavender", value: ""}, {name: "David", value: ""}],
                ]
            },
            {
                owner: "Rian",
                matrix: [
                    [{name: "Mark", value: ""}, {name: "Rian", value: ""}],
                    [{name: "David", value: ""}, {name: "Lavender", value: ""}],
                ]
            },
            {
                owner: "David",
                matrix: [
                    [{name: "Rian", value: ""}, {name: "Mark", value: ""}],
                    [{name: "David", value: ""}, {name: "Lavender", value: ""}],
                ]
            },
            {
                owner: "Lavender",
                matrix: [
                    [{name: "David", value: ""}, {name: "Lavender", value: ""}],
                    [{name: "Mark", value: ""}, {name: "Rian", value: ""}],
                ]
            },
        ]

        const expectedMatrix = [
            {
                owner: "Mark",
                matrix: [
                    [{name: "Mark", value: ""}, {name: "Rian", value: "point_up"}],
                    [{name: "Lavender", value: ""}, {name: "David", value: ""}],
                ]
            },
            {
                owner: "Rian",
                matrix: [
                    [{name: "Mark", value: ""}, {name: "Rian", value: "point_up"}],
                    [{name: "David", value: ""}, {name: "Lavender", value: ""}],
                ]
            },
            {
                owner: "David",
                matrix: [
                    [{name: "Rian", value: "point_up"}, {name: "Mark", value: ""}],
                    [{name: "David", value: ""}, {name: "Lavender", value: ""}],
                ]
            },
            {
                owner: "Lavender",
                matrix: [
                    [{name: "David", value: ""}, {name: "Lavender", value: ""}],
                    [{name: "Mark", value: ""}, {name: "Rian", value: "point_up"}],
                ]
            },
        ]

        expect(arras.updateValue("Rian", "point_right", stubMatrix)).toStrictEqual(expectedMatrix);
    })
})

describe("arras.bang()", () => {
  it("should do good things", () => {
    arras.setLogFunction(console.log);
    arras.setMode("sequential");


  })
})