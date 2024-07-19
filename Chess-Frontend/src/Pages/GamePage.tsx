import { Chess } from 'chess.js';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import ChessBoard from '../components/ChessBoard';
import { INIT_GAME } from '../components/messages';
import useSocket from '../hooks/useSocket';

export default function GamePage() {

    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.onmessage = (event) => {
            // const message = JSON.parse(event.data);
            console.log(event.data);
        }
    }, [socket])

    if (!socket) return <div>Connecting...</div>

    return (
        <div className='w-screen h-screen'>
            <div className='flex justify-center py-20'>
                <div className='grid grid-cols-6 gap-4 align-middle'>
                    <div className='col-span-4'><ChessBoard /></div>
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
