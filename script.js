const factorial = (n) => {
    return (n > 1) ? n * factorial(n-1) : 1;
}

const getAllIndexes = (arr, val) => {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}

const gameboard = (() => {
    let grid = [['','',''],['','',''],['','','']],
        turnOfPlayer = 0,
        thereIsAWinner = false,
        turn = 0;


    const spaces = document.querySelectorAll(".space");

    const _changePlayer = () => {
        turnOfPlayer = turnOfPlayer ? 0 : 1;
    }

    const checkIfTurnOfCPU = () => {
        if (turnOfPlayer === 0 && game.player1.isCPU) {
            setTimeout(_cpuPlays,1000)
        } else if (turnOfPlayer === 1 && game.player2.isCPU) {
            setTimeout(_cpuPlays,1000)
        }
    }

    const checkIfSpaceIsMarked = ([row,column]) => {
        return grid[row][column] ? true : false;
    }

    const _play = (event) => {
        let row = +event.composedPath()[0].getAttribute("row"),
            column = +event.composedPath()[0].getAttribute("column");
        if (!(grid[row][column])) {
            grid[row][column] = turnOfPlayer ? "O" : "X";
            spaces[row*3+column].textContent = turnOfPlayer ? "⭕" : "❌";
            spaces[row*3+column].classList.add('marked');
            turn++;
        }
        
        thereIsAWinner = checkWinner.checkIfWinner(grid,turnOfPlayer);
        if (!thereIsAWinner && !checkIfFull()) {
            _changePlayer();
            checkIfTurnOfCPU();
        }
    }

    const _cpuPlays = () => {
        if (!thereIsAWinner) {
            let [row, column] = ai.cpuPlays(turnOfPlayer, turn);
            if (!(grid[row][column])) {
                grid[row][column] = turnOfPlayer ? "O" : "X";
                spaces[row*3+column].textContent = turnOfPlayer ? "⭕" : "❌";
                spaces[row*3+column].classList.add('marked');
                turn++
            }
            
            thereIsAWinner = checkWinner.checkIfWinner(grid,turnOfPlayer);
            if (!thereIsAWinner && !checkIfFull()) {
                _changePlayer();
                checkIfTurnOfCPU();
            }
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
        grid = [['','',''],['','',''],['','','']];
        turnOfPlayer = 0;
        for (let space = 0; space < 9; space++) {
            spaces[space].classList.remove("won");
            spaces[space].textContent='';
            spaces[space].classList.remove("marked");
        }
        _addClickListeners();
        thereIsAWinner = false;
    }

    const returnGrid = () => {
        return grid;
    }

    const checkIfFull = () => {
        let isFull = true;

        for (let space = 0; space < 9; space++) {
            let column = space % 3,
                row = (space - column)/3;
            if (grid[row][column] === '') {
                isFull = false;
            }
        }

        return isFull;
    }

    return {markWinningSpaces, removeClickListeners, restartGrid, checkIfTurnOfCPU, checkIfSpaceIsMarked, returnGrid, checkIfFull};
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
        if (!gameboard.checkIfFull()) {
            gameboard.checkIfTurnOfCPU()
        }
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
        _setNewPlayersNames();
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

    const cpuPlays = (turnOfPlayer, turn) => {
        let [possibleDecisions, decisionsDamage, decisionsAdvantage] =  ai.weightPossibleMoves(Array.from(gameboard.returnGrid()),turnOfPlayer,turnOfPlayer,turn),
            [possibleDecisions2, decisionsDamage2] =  ai.weightPossibleMoves2(Array.from(gameboard.returnGrid()),turnOfPlayer,turnOfPlayer,turn),
            min2 = Math.min(...decisionsDamage2),
            goodDecisions2 = getAllIndexes(decisionsDamage2, min2),
            goodDecisionsDamage = goodDecisions2.map(i => decisionsDamage[i]),
            min1 = Math.min(...goodDecisionsDamage),
            bestDecisions = getAllIndexes(decisionsDamage,min1);
            bestDecisionsAdvantage = bestDecisions.map(i => decisionsAdvantage[i]),
            bestPossibleDecisions = bestDecisions.map(i => possibleDecisions[i]),
            space = bestPossibleDecisions[bestDecisionsAdvantage.indexOf(Math.max(...bestDecisionsAdvantage))],
        // ******* Old code where the CPU plays assuming the opponent plays random*******
        // let [possibleDecisions, decisionsDamage] =  ai.weightPossibleMoves(Array.from(gameboard.returnGrid()),turnOfPlayer,turnOfPlayer,turn),
        // space = possibleDecisions[decisionsDamage.indexOf(Math.min(...decisionsDamage))],
        // **********************************************************
            column = space % 3;
            row = (space - column) / 3;

        return [row, column];
        // ******* Old code where the CPU plays a random move*******
        // let cpuPlaysIn = _randomSpace(),
        //     column = cpuPlaysIn % 3,
        //     row = (cpuPlaysIn - column) / 3;
        // while (gameboard.checkIfSpaceIsMarked([row,column])) {
        //     cpuPlaysIn = _randomSpace();
        //     column = cpuPlaysIn % 3;
        //     row = (cpuPlaysIn - column) / 3;
        // }
        // return [row,column];
        // **********************************************************
    }

    let thereIsAPhantomWinner = false,
        turnOfPhantomPlayer = 0;

    const phantomGridProto = {
        phantomDepth : 0,
        
        setDepth() {
            for (let space = 0; space < 9; space++) {
                let column = space % 3,
                    row = (space - column)/3;
                if (this.grid[row][column]) {
                    this.phantomDepth++;
                }
            }
        },

        phantomPlay ([row, column]) {
            this.grid[row][column] = this.phantomTurnOfPlayer ? "O" : "X";
            this.phantomTurnOfPlayer = this.phantomTurnOfPlayer ? 0 : 1;
        },

        checkIfPhantomWinner () {
            for (let i = 0; i < 3; i++) {
                if (this.grid[i][0]) {
                    if ((this.grid[i][0] === this.grid[i][1]) && (this.grid[i][0] === this.grid[i][2])) {
                        this.winnerIs = this.phantomTurnOfPlayer ? 0 : 1;
                        return true;
                    }
                }
            }
            for (let j = 0; j < 3; j++) {
                if (this.grid[0][j]) {
                    if ((this.grid[0][j] === this.grid[1][j]) && (this.grid[0][j] === this.grid[2][j])) {
                        this.winnerIs = this.phantomTurnOfPlayer ? 0 : 1;
                        return true;
                    }
                }
            }
            if (this.grid[0][0]) {
                if ((this.grid[0][0] === this.grid[1][1]) && (this.grid[0][0] === this.grid[2][2])) {
                    this.winnerIs = this.phantomTurnOfPlayer ? 0 : 1;
                    return true;
                }
            }
            if (this.grid[0][2]) {
                if ((this.grid[0][2] === this.grid[1][1]) && (this.grid[0][2] === this.grid[2][0])) {
                    this.winnerIs = this.phantomTurnOfPlayer ? 0 : 1;
                    return true;
                }
            }
            return false;
        },

        checkIfFull () {
            let isFull = true;

            for (let space = 0; space < 9; space++) {
                let column = space % 3,
                    row = (space - column)/3;
                if (this.grid[row][column] === '') {
                    isFull = false;
                }
            }

            return isFull;
        }
    };

    const phantomPlays = (grid, requester, phantomTurnOfPlayer) => {
        let children = [];
        
        for (let space = 0; space < 9; space++) {
            let column = space % 3,
                row = (space - column)/3;
            if (!(grid[row][column])) {
                let newPhantomGrid = [];
                for (let i = 0; i < 3; i++) {
                    newPhantomGrid.push(Array.from(grid[i]))
                }
                const phantomGrid = Object.assign({}, phantomGridProto, {grid: newPhantomGrid, requester, phantomTurnOfPlayer});
                phantomGrid.phantomPlay([row,column]);
                phantomGrid.setDepth();
                if (!phantomGrid.checkIfPhantomWinner() && !phantomGrid.checkIfFull()) {
                    children = children.concat(phantomPlays(phantomGrid.grid, requester, phantomGrid.phantomTurnOfPlayer));
                } else {
                    children = children.concat([phantomGrid]);
                }
            }
        }
        
        return children;
    }

    const weightPossibleMoves = (grid, requester, phantomTurnOfPlayer, turnNumber) => {
        let possibleDecisions = [],
            decisionsDamage = [],
            decisionsAdvantage = [];

        for (let space = 0; space < 9; space++) {
            let column = space % 3,
                row = (space - column)/3;
            if (!(grid[row][column])) {
                possibleDecisions.push(space);
            }
        }

        for (let space of possibleDecisions) {
            let column = space % 3,
                row = (space - column)/3,
                newPhantomGrid = [];
            for (let i = 0; i < 3; i++) {
                newPhantomGrid.push(Array.from(grid[i]))
            }
            const phantomGrid = Object.assign({}, phantomGridProto, {grid: newPhantomGrid, requester, phantomTurnOfPlayer});
            phantomGrid.phantomPlay([row,column]);
            let damage = 0,
                advantage = 0;
            if (phantomGrid.checkIfPhantomWinner()){
                damage = -1;
                advantage = 1;
            } else {
                let consequences = phantomPlays(phantomGrid.grid, requester, phantomGrid.phantomTurnOfPlayer),
                    opponent = phantomTurnOfPlayer ? 0 : 1;
                let loosingPhantomGrids = Array(9).fill(0),
                    winningPhantomGrids = Array(9).fill(0);
                // for (let phantom of consequences) {
                //     if (phantom.winnerIs === opponent) {
                //         loosingPhantomGrids[phantom.phantomDepth-1]++
                //     } else if (phantom.winnerIs === phantomTurnOfPlayer) {
                //         winningPhantomGrids[phantom.phantomDepth-1]++
                //     }
                // }
                // console.log(loosingPhantomGrids);
                // console.log(winningPhantomGrids);
                for (let phantom of consequences) {
                    damage += phantom.winnerIs === opponent ? factorial(9-phantom.phantomDepth)/factorial(9) : 0;
                    advantage += phantom.winnerIs === phantomTurnOfPlayer ? factorial(9-phantom.phantomDepth)/factorial(9) : 0;
                    // damage += phantom.winnerIs == opponent ? 1/loosingPhantomGrids[phantom.phantomDepth-1]*(1/2)**(phantom.phantomDepth-turnNumber) : 0;
                }
            }
            decisionsDamage.push(damage);
            decisionsAdvantage.push(advantage);
        }
        return [possibleDecisions, decisionsDamage, decisionsAdvantage];
    }

    const weightPossibleMoves2 = (grid, requester, phantomTurnOfPlayer, turnNumber) => {
        let possibleDecisions = [],
            decisionsDamage = [],
            opponent = phantomTurnOfPlayer ? 0 : 1;

        for (let space = 0; space < 9; space++) {
            let column = space % 3,
                row = (space - column)/3;
            if (!(grid[row][column])) {
                possibleDecisions.push(space);
            }
        }

        for (let space of possibleDecisions) {
            let column = space % 3,
                row = (space - column)/3,
                newPhantomGrid = [];
            for (let i = 0; i < 3; i++) {
                newPhantomGrid.push(Array.from(grid[i]))
            }
            const phantomGrid = Object.assign({}, phantomGridProto, {grid: newPhantomGrid, requester, phantomTurnOfPlayer});
            phantomGrid.phantomPlay([row,column]);
            let damage = 0;
            if (phantomGrid.checkIfPhantomWinner()){
                damage = -1;
            } else {
                while (!phantomGrid.checkIfPhantomWinner() && !phantomGrid.checkIfFull()) {
                    let [possibleDecisions, decisionsDamage, decisionsAdvantage] =  weightPossibleMoves(Array.from(phantomGrid.grid),requester,phantomGrid.phantomTurnOfPlayer,turnNumber),
                        min1 = Math.min(...decisionsDamage),
                        bestDecisions = getAllIndexes(decisionsDamage,min1),
                        bestPossibleDecisions = bestDecisions.map(i => possibleDecisions[i]),
                        bestDecisionsAdvantage = bestDecisions.map(i => decisionsAdvantage[i]),
                        space = bestPossibleDecisions[bestDecisionsAdvantage.indexOf(Math.max(...bestDecisionsAdvantage))],
                        space2 = possibleDecisions[decisionsDamage.indexOf(Math.min(...decisionsDamage))],
                        // space = possibleDecisions[decisionsDamage.indexOf(Math.min(...decisionsDamage))],
                        phantomColumn = space % 3,
                        phantomRow = (space - phantomColumn) / 3;
                        phantomGrid.phantomPlay([phantomRow,phantomColumn]);
                }
                phantomGrid.setDepth();
                damage = phantomGrid.winnerIs === opponent ? 1 : 0;
            }
            decisionsDamage.push(damage);
        }

        return [possibleDecisions, decisionsDamage];
    }

    return {cpuPlays, phantomPlays, weightPossibleMoves, weightPossibleMoves2};
})()

const game = ( () => {
    const player1 = playerFactory("Player 1");
    const player2 = playerFactory("Player 2");

    const init = () => {
        checkWinner.restartWinner();
        gameboard.restartGrid();
        display.resetDisplay();
    }

    const stop = () => {
        gameboard.removeClickListeners();
    }

    return {init, stop, player1, player2};
})();

const startButton = document.querySelector("button");

startButton.addEventListener("click", game.init);
