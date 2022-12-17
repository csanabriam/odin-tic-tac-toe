const gameboard = (() => {
    const grid = [[,,],[,,],[,,]],
          spaces = document.querySelectorAll(".space");
          turnOfPlayer = 0;

    const _changePlayer = () => {
        turnOfPlayer = turnOfPlayer ? 0 : 1;
    }

    const _updateGrid = (space) => {
        let row = space[0],
            column = space[1];
        if (!(!!(grid[row][column]))) {
            grid[row][column] = turnOfPlayer ? "O" : "X";
            spaces[row*3+column].textContent = turnOfPlayer ? "⭕" : "❌";
        }
        
        checkWinner.checkIfWinner(grid,turnOfPlayer);
        _changePlayer();
    }

    const _addClickListeners = () => {
        for (let space = 0; space < 9; space++) {
            let column = space % 3,
                row = (space - column)/3;
            spaces[space].addEventListener("click", () => _updateGrid([row,column]));
        }
    }

    return {_addClickListeners};
})();

const checkWinner = (() =>  {
    let winner = 0; 

    const _checkRows = (grid, turnOfPlayer) => {
        for (let i = 0; i < 3; i++) {
            if (grid[i][0]) {
                if ((grid[i][0] === grid[i][1]) && (grid[i][0] === grid[i][2])) {
                    winner = gameboard.turnOfPlayer+1;
                    break;
                }
            }
        }
    }
    
    const _checkColumns = (grid, turnOfPlayer) => {
        for (let j = 0; j < 3; j++) {
            if (grid[0][j]) {
                if ((grid[0][j] === grid[1][j]) && (grid[0][j] === grid[2][j])) {
                    winner = turnOfPlayer+1;
                    break;
                }
            }
        }
    }

    const _checkDiagonals = (grid, turnOfPlayer) => {
        if (grid[0][0]) {
            if ((grid[0][0] === grid[1][1]) && (grid[0][0] === grid[2][2])) {
                winner = turnOfPlayer+1;
            }
        }
        if (grid[0][2]) {
            if ((grid[0][2] === grid[1][1]) && (grid[0][2] === grid[2][0])) {
                winner = turnOfPlayer+1;
            }
        }
    }

    const checkIfWinner = (grid, turnOfPlayer) => {
        if (!winner) {_checkRows(grid, turnOfPlayer)};
        if (!winner) {_checkColumns(grid, turnOfPlayer)};
        if (!winner) {_checkDiagonals(grid, turnOfPlayer)};
        console.log(winner);
    }

    return {checkIfWinner, winner};
})();

const Player = (player) => {
    const getPlayer = () => player;

    return {getPlayer};
};

