import { useEffect, useState } from 'react';

export default function useSocket() {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const URL = "ws://localhost:8080";

    useEffect(() => {

        const ws = new WebSocket(URL);

        ws.onopen = () => {
            setSocket(ws)
        }

        ws.onclose = () => {
            setSocket(null);
        }

        return () => {
            ws.close();
        }
    },[])

    return socket;
}
