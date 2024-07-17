import { WebSocket } from 'ws';
import { Game } from './game';
import { INIT_GAME, MOVE } from './messages';

export class GameManager{ 
    private games: Game[];
    private pendindUser: WebSocket | null;
    private users: WebSocket[];
    constructor() {
        this.games = [];
        this.pendindUser = null;
        this.users = [];
    }

    addUser(user: WebSocket) {
        this.users.push(user);
        this.addHandler(user);
    }

    removeUser(Socket: WebSocket) {
        this.users = this.users.filter((user) => {
            user !== Socket;
        })
    }

    private addHandler(socket: WebSocket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());

            if (message.type === INIT_GAME) {
                if (this.pendindUser) {
                    let game = new Game(this.pendindUser, socket);
                    this.games.push(game);
                    this.pendindUser = null;
                } else {
                    this.pendindUser = socket;
                }
            }

            if (message.type === MOVE) {
                const game = this.games.find((game) => {
                    return game.player1 === socket || game.player2 === socket; 
                })

                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
        })
    }

}