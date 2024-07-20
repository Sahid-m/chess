import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "./messages";


export default function ChessBoard({ board, socket, setBoard, chess }: {
    chess: Chess;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
    setBoard: React.Dispatch<React.SetStateAction<({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]>>;
}) {
    const [from, setFrom] = useState<null | Square>(null);


    return (
        <div className="text-white">
            {board.map((row, i) => {
                return <div key={i} className="flex">
                    {
                        row.map((col, j) => {

                            const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;

                            return <div onClick={() => {
                                if (!from) {
                                    setFrom(squareRepresentation);
                                } else {
                                    socket.send(JSON.stringify({
                                        type: MOVE,
                                        move: {
                                            from: from,
                                            to: squareRepresentation
                                        }
                                    }))

                                    setFrom(null);

                                    chess.move({
                                        from: from,
                                        to: squareRepresentation
                                    })


                                    setBoard(chess.board());


                                }

                            }} key={j} className={`w-16 h-16 ${(i + j) % 2 === 0 ? 'bg-white' : 'bg-tahiti'}`}>
                                <div className="flex justify-center w-full h-full align-middle">
                                    <div className="flex flex-col justify-center h-full align-middle">

                                        {col ? <img className={`w-8 ${col.color === "b" ? 'stroke-white' : 'stroke-black'}`} src={`/${col?.color === "b" ? col?.type : `${col?.type?.toUpperCase()} copy`}.png`} /> : null}
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>

            })}
        </div>
    )
}
