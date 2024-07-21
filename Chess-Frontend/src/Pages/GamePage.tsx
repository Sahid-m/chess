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
    const [turn, setTurn] = useState(false);
    const [color, setColor] = useState<string>();
    const [opponent, setOpponent] = useState<string | null>(null);
    const [name, setName] = useState<string>();
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [winner, setWinner] = useState<string | null>(null);

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
                    setOpponent(message.name);
                    alert("Game Started with player! Check Your Color and make a move");
                    setColor(message.color);
                    if (message.color === "white") {
                        setTurn(true);
                        alert("You are going to make a move first!");
                    } else {
                        alert("White Will make a move! Wait for it")
                    }
                    break;
                }
                case MOVE: {
                    const move = message.payload.move;
                    chess.move(move);
                    setBoard(chess.board());
                    setTurn(message.payload.turn);
                    break;
                }
                case GAME_OVER: {
                    setWinner(message.payload.winner);
                    alert("Game Over " + winner + " won");
                    setGameOver(true);
                    break;
                }
            }
        }
    }, [socket])

    if (!socket) return <div>Connecting...</div>

    return (
        <div className='w-screen h-screen'>
            <div className='flex justify-center py-20'>
                <div className='flex-row px-10'>
                    {started ? <div className='py-10 text-white'>YOUR COLOR : {color ? color : "waiting"}</div> : <></>}
                    {started ? <div className='text-white'>PLAYING : {opponent ? opponent : "waiting"}</div> : <></>}
                </div>
                <div className='grid grid-cols-6 gap-4 '>

                    <div className='col-span-4'><ChessBoard gameOver={gameOver} winner={winner} setTurn={setTurn} turn={turn} chess={chess} board={board} socket={socket} setBoard={setBoard} /></div>
                    <div className='flex flex-col col-span-2'>

                        {started ? <></> : <>
                            <label className='text-white'>Your Name: </label>
                            <input type='text'
                                placeholder='Name'
                                value={name}
                                onChange={(event) => {
                                    setName(event.target.value);
                                }}
                                className='text-black' />
                            <Button text='Play' onClick={() => {
                                if (!name || name?.length != 5) {
                                    alert("Please Input Name! (min 5 chars)")
                                    return;
                                }
                                socket.send(JSON.stringify({
                                    type: INIT_GAME,
                                    payload: {
                                        name: name
                                    }
                                }))
                                setStarted(true);
                            }} />
                        </>}
                    </div>

                </div>
            </div>
        </div>
    )
}
