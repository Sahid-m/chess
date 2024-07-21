import { WebSocket } from 'ws';
import { Game } from './game';
import { INIT_GAME, MOVE, WAITING } from './messages';

export interface User{
    socket: WebSocket;
    name?: string;
}

export class GameManager{ 
    private games: Game[];
    private pendindUser: User | null;
    private users: User[];
    constructor() {
        this.games = [];
        this.pendindUser = null;
        this.users = [];
    }

    addUser(user: User) {
        this.users.push({ socket: user.socket});
        this.addHandler(user);
    }

    removeUser(Socket: User) {
        this.users = this.users.filter((user) => {
            user.socket !== Socket.socket;
        })
    }

    private addHandler(user: User) {
        user.socket.on("message", (data) => {
            const message = JSON.parse(data.toString());

            if (message.type === INIT_GAME) {

                if (user.socket === this.pendindUser?.socket) {
                    user.socket.send(JSON.stringify({
                        "type": WAITING
                    }))
                } else {
                    if (this.pendindUser) {
                        user.name = message.payload.name;
                    let game = new Game(this.pendindUser, user);
                    this.games.push(game);
                    this.pendindUser = null;
                } else {
                    this.pendindUser = {socket: user.socket,name: message.payload.name};
                    user.socket.send(JSON.stringify({
                        "type": WAITING
                    }))
                }
                }

                
            }

            if (message.type === MOVE) {
                const game = this.games.find((game) => {
                    return game.player1.socket === user.socket || game.player2.socket === user.socket; 
                })

                if (game) {
                    game.makeMove(user.socket, message.move);
                }
            }
        })
    }

}