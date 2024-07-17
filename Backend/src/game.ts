import { Chess } from 'chess.js';
import { WebSocket } from "ws";
import { MOVE } from '../src/messages';
import { GAME_OVER } from './messages';


export class Game{

    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess ;
    private startTime: Date;

    private MoveCounter = 0;

    constructor(player1 : WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
    }

    makeMove(socket: WebSocket, move: {
        from: string,
        to: string
    }) {
        // Check if valid player sends move
        if (this.MoveCounter % 2 === 0 && socket !== this.player1) return;

        if (this.MoveCounter % 2 === 1 && socket !== this.player2) return;

        // updates the board and add moves
        try {
        this.board.move(move);    
        } catch (e) {
            return;
        }

        // Checks if game over
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white',
                }
            }));
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white',
                }
            }));
        }

        // Sends Move to users
        if (this.MoveCounter % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        } else {
             this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }

        this.MoveCounter++;
        
    }
}