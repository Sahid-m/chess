import { Chess } from 'chess.js';
import { WebSocket } from "ws";
import { User } from './gameManager';
import { GAME_OVER, MOVE, STARTED } from './messages';


export class Game{

    public player1: User;
    public player2: User;
    private board: Chess ;
    private startTime: Date;
    private MoveCounter = 0;



    constructor(player1 : User, player2: User) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.socket.send(JSON.stringify({
            type: STARTED,
            color: "white",
            name: this.player2.name
        }));
        this.player2.socket.send(JSON.stringify({
            type: STARTED,
            color: "black",
            name: this.player1.name
        }));
    }

    makeMove(socket: WebSocket, move: {
        from: string,
        to: string
    }) {
        // Check if valid player sends move
        if (this.MoveCounter % 2 === 0 && socket !== this.player1.socket) {
            return;
        };

        if (this.MoveCounter % 2 === 1 && socket !== this.player2.socket) {
            return;
        };

        // updates the board and add moves
        try {
            this.board.move(move);
        } catch (e) {
            console.log(e)
            return;
        }

        // Checks if game over
        if (this.board.isGameOver()) {
            this.player1.socket.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? this.player2.name : this.player1.name,
                }
            }));
            this.player2.socket.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? this.player2.name : this.player1.name,
                }
            }));
            return;
        }

        // Sends Move to users
        if (this.MoveCounter % 2 === 0) {
            this.player2.socket.send(JSON.stringify({
                type: MOVE,
                payload: {
                    move: move,
                    turn: true
                }
            }))
        } else {
             this.player1.socket.send(JSON.stringify({
                type: MOVE,
                payload: {
                    move: move,
                    turn: true
                }
            }))
        }

        this.MoveCounter++;
        
    }
}