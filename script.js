const gameboard = (() => {
    const grid = [[,,],[,,],[,,]],
          spaces = document.querySelectorAll(".space");
          turnOfPlayer = 0;

    const changePlayer = () => {
        turnOfPlayer = turnOfPlayer ? 0 : 1;
    }

    const updateGrid = (space) => {
        let row = space[0],
            column = space[1];
        if (!(!!(grid[row][column]))) {
            grid[row][column] = turnOfPlayer ? "O" : "X";
            spaces[row*3+column].textContent = turnOfPlayer ? "O" : "X";
        }
        changePlayer();
    }

    const addClickListeners = () => {
        for (let space = 0; space < 9; space++) {
            let column = space % 3,
                row = (space - column)/3;
            spaces[space].addEventListener("click", () => updateGrid([row,column]));
        }
    }

    return {addClickListeners, grid};
})();

const checkWinner = (() =>  {

})();

const Player = (player) => {
    const getPlayer = () => player;

    return {getPlayer};
};

