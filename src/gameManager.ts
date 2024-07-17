import { WebSocket } from 'ws';

interface Game{
    gameId: string,
    moves: string[],
    player1: WebSocket,
    player2: WebSocket
}

export class GameManager{ 
    private game: Game[];
    private pendindUser: WebSocket | null;
    private users: WebSocket[];
    constructor() {
        this.game = [];
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
        
    }

}