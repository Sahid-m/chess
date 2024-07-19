import React from 'react';

export default function Button({ text, onClick }: { text: string, onClick: React.MouseEventHandler<HTMLButtonElement>; }) {
    return (
        <>
            <button className='px-5 py-2 rounded-md hover:bg-green bg-cgreen w-52' onClick={onClick} >{text}</button>
        </>
    )
}