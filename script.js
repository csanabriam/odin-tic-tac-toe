const gameboard = (()=>{
    const board = [[,,],[,,],[,,]];

    const displayBoard = (board) => {
        // draw the board
    }

    const play = (player, space) => {
        // mark play
    }

    return {play};
})();

const Player = (player) => {
    const getPlayer = () => player;

    return {getPlayer};
};

const spaces = document.querySelectorAll(".space");

for (let i = 0; i < 9; i++) {
    spaces[i].addEventListener("click", () => console.log(i))
}