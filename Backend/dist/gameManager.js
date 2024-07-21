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
        this.users.push({ socket: user.socket });
        this.addHandler(user);
    }
    removeUser(Socket) {
        this.users = this.users.filter((user) => {
            user.socket !== Socket.socket;
        });
    }
    addHandler(user) {
        user.socket.on("message", (data) => {
            var _a;
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (user.socket === ((_a = this.pendindUser) === null || _a === void 0 ? void 0 : _a.socket)) {
                    user.socket.send(JSON.stringify({
                        "type": messages_1.WAITING
                    }));
                }
                else {
                    if (this.pendindUser) {
                        user.name = message.payload.name;
                        let game = new game_1.Game(this.pendindUser, user);
                        this.games.push(game);
                        this.pendindUser = null;
                    }
                    else {
                        this.pendindUser = { socket: user.socket, name: message.payload.name };
                        user.socket.send(JSON.stringify({
                            "type": messages_1.WAITING
                        }));
                    }
                }
            }
            if (message.type === messages_1.MOVE) {
                const game = this.games.find((game) => {
                    return game.player1.socket === user.socket || game.player2.socket === user.socket;
                });
                if (game) {
                    game.makeMove(user.socket, message.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
