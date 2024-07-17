"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.moves = [];
        this.board = "";
        this.startTime = new Date();
    }
    makeMove(socket, move) {
        // TODO
    }
}
exports.Game = Game;
