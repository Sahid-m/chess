import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function HomePage() {

    const router = useNavigate();

    return (
        <div className='w-screen h-screen'>
            <div className='flex justify-center py-20'>
                <div className='flex flex-col'>
                    <img alt='CHESS BOARD' src='/chessBoard.png' width="500px" height="500px" />
                    <div className='flex justify-center my-10'>

                        <Button text='Play' onClick={() => router('/game')} />
                    </div>
                </div>
            </div>
        </div>
    )
}
