import { Chess } from 'chess.js';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import ChessBoard from '../components/ChessBoard';
import { GAME_OVER, INIT_GAME, MOVE, STARTED, WAITING } from '../components/messages';
import useSocket from '../hooks/useSocket';

export default function GamePage() {

    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false);
    const [color, setColor] = useState<string>();

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            switch (message.type) {
                case WAITING: {
                    alert("Waiting For a Player to start Game!");
                    break;
                }
                case STARTED: {
                    alert("Game Started with player! Check Your Color and make a move");
                    setColor(message.color);
                    if (message.color === "white") {
                        alert("You are going to make a move first!");
                    } else {
                        alert("White Will make a move! Wait for it")
                    }
                    break;
                }
                case MOVE: {
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    break;
                }
                case GAME_OVER: {
                    alert("Game Over");
                    break;
                }
            }
        }
    }, [socket])

    if (!socket) return <div>Connecting...</div>

    return (
        <div className='w-screen h-screen'>
            <div className='flex justify-center py-20'>
                <div className='grid grid-cols-6 gap-4 align-middle'>
                    <div className='text-white'>YOUR COLOR : {color ? color : <></>}</div>
                    <div className='col-span-4'><ChessBoard chess={chess} board={board} socket={socket} setBoard={setBoard} /></div>
                    {started ? <></> : <Button text='Play' onClick={() => {

                        socket.send(JSON.stringify({
                            type: INIT_GAME
                        }))

                        setStarted(true);
                    }} />}
                </div>
            </div>
        </div>
    )
}
