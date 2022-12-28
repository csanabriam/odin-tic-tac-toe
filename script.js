const tictactoe = (() => {
    // Contains all submodules and functions to control the game and returns the function to initialize it.

    const factorial = (n) => {
        // return n!
        return (n > 1) ? n * factorial(n-1) : 1;
    }

    const getAllIndexes = (arr, val) => {
        // return all the indexes of arr where val appears
        var indexes = [], i;
        for(i = 0; i < arr.length; i++)
            if (arr[i] === val)
                indexes.push(i);
        return indexes;
    }

    const gameboard = (() => {
        // Contains the functions to control the gameboard. 
        let grid = [['','',''],['','',''],['','','']], //the gameboard is a 3x3 matrix
            turnOfPlayer = 0, //0 for player1 and 1 for player2
            thereIsAWinner = false,
            turn = 0;

        //Array 'spaces' contains the html elements to mark the gameboard
        const spaces = document.querySelectorAll(".space");

        const _changePlayer = () => {
            // Change the turn counter.
            // This function is called after a player plays.
            turnOfPlayer = turnOfPlayer ? 0 : 1;
        }

        const checkIfTurnOfCPU = () => {
            // Determine whether it's the CPU turn to play and if so calls the function to make the CPU play.
            if (turnOfPlayer === 0 && game.player1.isCPU) {
                setTimeout(_cpuPlays,1000)
            } else if (turnOfPlayer === 1 && game.player2.isCPU) {
                setTimeout(_cpuPlays,1000)
            }
        }

        const _play = (event) => {
            // Mark an empty space with O or X and, if there is no winner, hands the turn to the other player.
            // This function is called when a player clicks in his turn on an empty space.
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
            // Mark an empty space with O or X, based on the AI strategy, and, if there is no winner, hands the turn to the other player.
            // This function is called to make the CPU play in its turn.
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
            // Add click listener to the gameboard spaces
            for (let space = 0; space < 9; space++) {
                let column = space % 3,
                    row = (space - column)/3;
                spaces[space].setAttribute("row",row);
                spaces[space].setAttribute("column",column);
                spaces[space].addEventListener("click", _play);
            }
        }

        const markWinningSpaces = (toMark) => {
            // Add the class 'won' to an html element in the gameboard.
            // This function is called when a space is part of a three in line.
            for (let [row,column] of toMark) {
                spaces[row*3+column].classList.toggle('won');
            }
        }

        const removeClickListeners = () => {
            // Remove the click listeners to the gameboard spaces.
            for (let space = 0; space < 9; space++) {
                let column = space % 3,
                    row = (space - column)/3;
                spaces[space].removeEventListener("click", _play);
            }
        }

        const restartGrid = () => {
            // Erase marks in the gameboard, and restart the html elements of the gameboard spaces 
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
            // Return the gameboard to be read by other modules.
            return grid;
        }

        const checkIfFull = () => {
            // Check if the gameboard is full.
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

        return {markWinningSpaces, removeClickListeners, restartGrid, checkIfTurnOfCPU, returnGrid, checkIfFull};
    })();

    const checkWinner = (() =>  {
        // This module contains the functions to determine whether there is a winner.
        let winner = 0; //0 for no winner, 1 if player1 is the winner, 2 if it's player2

        const _checkRows = (grid, turnOfPlayer) => {
            // Check if there are 3 of the same kind in a single row.
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
            // Check if there are 3 of the same kind in a single column.
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
            // Check if there are 3 of the same kind in a single diagonal.
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
            // Check if there is a winner
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
            // Reset the winner counter.
            winner = 0;
        }

        return {checkIfWinner, restartWinner};
    })();

    const display = (() => {
        // Contains the functions to controls the html elements of the display: the names of the players and the sign announcing the winner.
        const headerForm = document.querySelector(".header");
        const player1Name = document.querySelector("#player1");
        const player2Name = document.querySelector("#player2");
        const display = document.querySelector(".display");

        const _setPlayersNames = () => {
            // Initialize the display containing the names of the players and add listeners to it.
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
            // Read the names of the players, determine whether one of them is the CPU and if so set the difficulty level.
            const names = new FormData(headerForm);
            game.player1.name = names.get("player1");
            game.player2.name = names.get("player2");
            player1Name.value = game.player1.name;
            player2Name.value = game.player2.name;
            if (game.player1.name.toLowerCase() === "cpu") {
                game.player1.isCPU = true;
                game.player1.CPUlevel = 2;
            } else if (game.player1.name.toLowerCase() === "rndcpu") {
                game.player1.isCPU = true;
                game.player1.CPUlevel = 1;
            } else if (game.player1.name.toLowerCase() === "optcpu") {
                game.player1.isCPU = true;
                game.player1.CPUlevel = 3;
            } else {
                game.player1.isCPU = false
            }
            if (game.player2.name.toLowerCase() === "cpu") {
                game.player2.isCPU = true
                game.player2.CPUlevel = 2
            } else if (game.player2.name.toLowerCase() === "rndcpu") {
                game.player2.isCPU = true;
                game.player2.CPUlevel = 1;
            } else if (game.player2.name.toLowerCase() === "optcpu") {
                game.player2.isCPU = true;
                game.player2.CPUlevel = 3;
            } else {
                game.player2.isCPU = false
            }
            if (!gameboard.checkIfFull()) {
                gameboard.checkIfTurnOfCPU()
            }
        }

        const displayWinner = (winner) => {
            // Display the winner's name.
            if (winner === 1) {
                display.textContent = `${game.player1.name} wins!`
            } else {
                display.textContent = `${game.player2.name} wins!`
            }
        }

        const resetDisplay = () => {
            // Reset the display.
            display.textContent = '';
            _setPlayersNames();
            _setNewPlayersNames();
        }

        return {displayWinner, resetDisplay};
    })();

    const playerFactory = (name) => {
        // Create a player object.
        let isCPU = false,
            CPUlevel = 0;
        return {name, isCPU, CPUlevel};
    };

    const ai = ( () => {
        // Contains the AI for CPU.

        const cpuPlays = (turnOfPlayer, turn) => {
            // Make the CPU play based on whether it's playing randomly, optimally or in default mode.
            let player = turnOfPlayer? 'player2' : 'player1';
            switch (game[player].CPUlevel) {
                case 1:
                    // The CPU plays randomly except when he can make a winning choice.
                    let possibleRandomDecisions = [],
                        copyOfGrid = Array.from(gameboard.returnGrid());

                    for (let space = 0; space < 9; space++) {
                        let column = space % 3,
                            row = (space - column)/3;
                        if (!(copyOfGrid[row][column])) {
                            possibleRandomDecisions.push(space);
                        }
                    }

                    for (let space of possibleRandomDecisions) {
                        // Checks if there is a winning choice and if so, chooses it.
                        let column = space % 3,
                            row = (space - column)/3,
                            newPhantomGrid = [];
                        for (let i = 0; i < 3; i++) {
                            newPhantomGrid.push(Array.from(copyOfGrid[i]))
                        }
                        const phantomGrid = Object.assign({}, phantomGridProto, {grid: newPhantomGrid, phantomTurnOfPlayer: turnOfPlayer});
                        phantomGrid.phantomPlay([row,column]);
                        if (phantomGrid.checkIfPhantomWinner()){
                            return [row,column];
                        }
                    }
                    cpuChooses = Math.floor((possibleRandomDecisions.length)*Math.random());
                    cpuPlaysIn = possibleRandomDecisions[cpuChooses];
                    randomColumn = cpuPlaysIn % 3;
                    randomRow = (cpuPlaysIn - randomColumn) / 3;
                    return [randomRow,randomColumn];
                break;
                case 3:
                    // The CPU plays so that it minimizes the chances of loosing according to the weights assigned to each possible choice by the function weightPossibleMoves2. It's an optimal choice.
                    let [possibleDecisions1, decisionsDamage1, decisionsAdvantage1] =  ai.weightPossibleMoves(Array.from(gameboard.returnGrid()),turnOfPlayer,turnOfPlayer,turn),
                        [possibleDecisions2, decisionsDamage2] =  ai.weightPossibleMoves2(Array.from(gameboard.returnGrid()),turnOfPlayer,turnOfPlayer,turn),
                        min2 = Math.min(...decisionsDamage2),
                        goodDecisions2 = getAllIndexes(decisionsDamage2, min2),
                        goodDecisionsDamage = goodDecisions2.map(i => decisionsDamage1[i]),
                        min1 = Math.min(...goodDecisionsDamage),
                        bestDecisions1 = getAllIndexes(decisionsDamage1,min1);
                        bestDecisionsAdvantage1 = bestDecisions1.map(i => decisionsAdvantage1[i]),
                        bestPossibleDecisions1 = bestDecisions1.map(i => possibleDecisions1[i]),
                        optimalSpace = bestPossibleDecisions1[bestDecisionsAdvantage1.indexOf(Math.max(...bestDecisionsAdvantage1))],
                        optimalColumn = optimalSpace % 3;
                        optimalRow = (optimalSpace - optimalColumn) / 3;

                    return [optimalRow, optimalColumn];
                    break;
                default:
                    //  The CPU plays so that it minimizes the chances of loosing according to the weights assigned to each possible choice by the function weightPossibleMoves.
                    let [possibleDecisions, decisionsDamage, decisionsAdvantage] =  ai.weightPossibleMoves(Array.from(gameboard.returnGrid()),turnOfPlayer,turnOfPlayer,turn),
                        min = Math.min(...decisionsDamage),
                        bestDecisions = getAllIndexes(decisionsDamage,min),
                        bestPossibleDecisions = bestDecisions.map(i => possibleDecisions[i]),
                        bestDecisionsAdvantage = bestDecisions.map(i => decisionsAdvantage[i]),
                        space = bestPossibleDecisions[bestDecisionsAdvantage.indexOf(Math.max(...bestDecisionsAdvantage))],
                        column = space % 3,
                        row = (space - column) / 3;
                    return [row, column];
            }
        }

        const phantomGridProto = {
            // Create a phantom gameboard to use in making possible scenarios. 
            phantomDepth : 0, // Keep a count of the turn in which the possible scenario happens.
            
            setDepth() {
                // Count in which turn the possible scenario is.
                for (let space = 0; space < 9; space++) {
                    let column = space % 3,
                        row = (space - column)/3;
                    if (this.grid[row][column]) {
                        this.phantomDepth++;
                    }
                }
            },

            phantomPlay ([row, column]) {
                // Mark a space in the phantom gameboard and changes player.
                this.grid[row][column] = this.phantomTurnOfPlayer ? "O" : "X";
                this.phantomTurnOfPlayer = this.phantomTurnOfPlayer ? 0 : 1;
            },

            checkIfPhantomWinner () {
                // Check whether there is a winner in the phantom gameboard.
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
                // Check whether the phantom gameboard is full.
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
            // Get all possible ramifications from a given phantom gameboard. It's an inductive function that calls itself after making a choice to get all possible ramification from it.
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
            // Calculate how likely is that you could loose or win for each single choice available in a phantom gameboard.
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
                    for (let phantom of consequences) {
                        damage += phantom.winnerIs === opponent ? factorial(9-phantom.phantomDepth)/factorial(9-turnNumber) : 0;
                        advantage += phantom.winnerIs === phantomTurnOfPlayer ? factorial(9-phantom.phantomDepth)/factorial(9) : 0;
                    }
                }
                decisionsDamage.push(damage);
                decisionsAdvantage.push(advantage);
            }
            return [possibleDecisions, decisionsDamage, decisionsAdvantage];
        }

        const weightPossibleMoves2 = (grid, requester, phantomTurnOfPlayer, turnNumber) => {
            // Calculate how likely is that you could loose for each single choice available in a given scenario, assuming that after this choice each player minimizing his chances of loosing and then maximizes his chances of winning according to the weights assigned in weightPossible Moves.
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
        // Contains the game controls: create the players and starts and stops the game.
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

    const init = () => {
        game.init()
    }

    return {init};
})()
const startButton = document.querySelector("button");

startButton.addEventListener("click", tictactoe.init);
