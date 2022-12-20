const gameboard = (() => {
    let grid = [[,,],[,,],[,,]],
        turnOfPlayer = 0,
        thereIsAWinner = false;


    const spaces = document.querySelectorAll(".space");

    const _changePlayer = () => {
        turnOfPlayer = turnOfPlayer ? 0 : 1;
    }

    const checkIfTurnOfCPU = () => {
        if (turnOfPlayer === 0 && game.player1.isCPU) {
            _cpuPlays()
        } else if (turnOfPlayer === 1 && game.player2.isCPU) {
            _cpuPlays()
        }
    }

    const checkIfSpaceIsMarked = ([row,column]) => {
        return grid[row][column] ? true : false;
    }

    const _play = (event) => {
        let row = +event.path[0].getAttribute("row"),
            column = +event.path[0].getAttribute("column");
        if (!(grid[row][column])) {
            grid[row][column] = turnOfPlayer ? "O" : "X";
            spaces[row*3+column].textContent = turnOfPlayer ? "⭕" : "❌";
        }
        
        thereIsAWinner = checkWinner.checkIfWinner(grid,turnOfPlayer);
        if (!thereIsAWinner) {
            _changePlayer();
            checkIfTurnOfCPU();
        }
    }

    const _cpuPlays = () => {
        let [row, column] = ai.cpuPlays();
        if (!(grid[row][column])) {
            grid[row][column] = turnOfPlayer ? "O" : "X";
            spaces[row*3+column].textContent = turnOfPlayer ? "⭕" : "❌";
        }
        
        thereIsAWinner = checkWinner.checkIfWinner(grid,turnOfPlayer);
        if (!thereIsAWinner) {
            _changePlayer();
            checkIfTurnOfCPU();
        }
    }

    const _addClickListeners = () => {
        for (let space = 0; space < 9; space++) {
            let column = space % 3,
                row = (space - column)/3;
            spaces[space].setAttribute("row",row);
            spaces[space].setAttribute("column",column);
            spaces[space].addEventListener("click", _play);
        }
    }

    const markWinningSpaces = (toMark) => {
        for (let [row,column] of toMark) {
            spaces[row*3+column].classList.toggle('won');
        }
    }

    const removeClickListeners = () => {
        for (let space = 0; space < 9; space++) {
            let column = space % 3,
                row = (space - column)/3;
            spaces[space].removeEventListener("click", _play);
        }
    }

    const restartGrid = () => {
        grid = [[,,],[,,],[,,]];
        turnOfPlayer = 0;
        for (let space = 0; space < 9; space++) {
            spaces[space].classList.remove("won");
            spaces[space].textContent='';
        }
        _addClickListeners();
    }

    return {markWinningSpaces, removeClickListeners, restartGrid, checkIfTurnOfCPU, checkIfSpaceIsMarked};
})();

const checkWinner = (() =>  {
    let winner = 0; 

    const _checkRows = (grid, turnOfPlayer) => {
        for (let i = 0; i < 3; i++) {
            if (grid[i][0]) {
                if ((grid[i][0] === grid[i][1]) && (grid[i][0] === grid[i][2])) {
                    winner = turnOfPlayer+1;
                    gameboard.markWinningSpaces([[i,0],[i,1],[i,2]]);
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
                    gameboard.markWinningSpaces([[0,j],[1,j],[2,j]]);
                    break;
                }
            }
        }
    }

    const _checkDiagonals = (grid, turnOfPlayer) => {
        if (grid[0][0]) {
            if ((grid[0][0] === grid[1][1]) && (grid[0][0] === grid[2][2])) {
                winner = turnOfPlayer+1;
                gameboard.markWinningSpaces([[0,0],[1,1],[2,2]]);
            }
        }
        if (grid[0][2]) {
            if ((grid[0][2] === grid[1][1]) && (grid[0][2] === grid[2][0])) {
                winner = turnOfPlayer+1;
                gameboard.markWinningSpaces([[0,2],[1,1],[2,0]]);
            }
        }
    }

    const checkIfWinner = (grid, turnOfPlayer) => {
        if (!winner) {
            _checkRows(grid, turnOfPlayer);
        };
        if (!winner) {
            _checkColumns(grid, turnOfPlayer);
        };
        if (!winner) {
            _checkDiagonals(grid, turnOfPlayer);
        };
        if (winner) {
            display.displayWinner(winner);
            game.stop();
            return true;
        } else {
            return false;
        };
    }

    const restartWinner = () => {
        winner = 0;
    }

    return {checkIfWinner, restartWinner};
})();

const display = (() => {
    const headerForm = document.querySelector(".header");
    const player1Name = document.querySelector("#player1");
    const player2Name = document.querySelector("#player2");
    const display = document.querySelector(".display");

    const _setPlayersNames = () => {
        player1Name.value = game.player1.name;
        player2Name.value = game.player2.name;
        headerForm.onkeydown = (event) => {
            if (event.keyCode == 13) {
                _setNewPlayersNames();
            }
        }
        headerForm.addEventListener("focusout", _setNewPlayersNames);
    }

    const _setNewPlayersNames = () => {
        const names = new FormData(headerForm);
        game.player1.name = names.get("player1");
        game.player2.name = names.get("player2");
        player1Name.value = game.player1.name;
        player2Name.value = game.player2.name;
        if (game.player1.name.toLowerCase() === "cpu") {
            game.player1.isCPU = true
        } else {
            game.player1.isCPU = false
        }
        if (game.player2.name.toLowerCase() === "cpu") {
            game.player2.isCPU = true
        } else {
            game.player2.isCPU = false
        }
        gameboard.checkIfTurnOfCPU();
    }

    const displayWinner = (winner) => {
        if (winner === 1) {
            display.textContent = `${game.player1.name} wins!`
        } else {
            display.textContent = `${game.player2.name} wins!`
        }
    }

    const resetDisplay = () => {
        display.textContent = '';
        _setPlayersNames();
    }

    return {displayWinner, resetDisplay};
})();

const playerFactory = (name) => {
    let isCPU = false
    return {name, isCPU};
};

const ai = ( () => {

    const _randomSpace = () => {
        return Math.floor(9*Math.random());
    }

    const cpuPlays = () => {
        let cpuPlaysIn = _randomSpace(),
            column = cpuPlaysIn % 3,
            row = (cpuPlaysIn - column) / 3;
        while (gameboard.checkIfSpaceIsMarked([row,column])) {
            cpuPlaysIn = _randomSpace();
            column = cpuPlaysIn % 3;
            row = (cpuPlaysIn - column) / 3;
        }
        console.log([row,column]);
        return [row,column];
    }

    return {cpuPlays};
})()

const game = ( () => {
    const player1 = playerFactory("Player 1");
    const player2 = playerFactory("Player 2");

    const init = () => {
        display.resetDisplay();
        checkWinner.restartWinner();
        gameboard.restartGrid();
        gameboard.checkIfTurnOfCPU();
    }

    const stop = () => {
        gameboard.removeClickListeners();
    }

    return {init, stop, player1, player2};
})();

const startButton = document.querySelector("button");

startButton.addEventListener("click", game.init);
