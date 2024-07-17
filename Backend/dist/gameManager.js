"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const game_1 = require("./game");
const messages_1 = require("./messages");
class GameManager {
    constructor() {
        this.games = [];
        this.pendindUser = null;
        this.users = [];
    }
    addUser(user) {
        this.users.push(user);
        this.addHandler(user);
    }
    removeUser(Socket) {
        this.users = this.users.filter((user) => {
            user !== Socket;
        });
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendindUser) {
                    let game = new game_1.Game(this.pendindUser, socket);
                    this.games.push(game);
                    this.pendindUser = null;
                }
                else {
                    this.pendindUser = socket;
                }
            }
            if (message.type === messages_1.MOVE) {
                const game = this.games.find((game) => {
                    return game.player1 === socket || game.player2 === socket;
                });
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
