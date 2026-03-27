import { useEffect, useRef, useCallback } from 'react';


//connects to the backend and calls onMessage whenever there is a message.

export function useWebSocket(onMessage) {
    const wsRef = useRef(null);
    const reconnectTimer = useRef(null);
    const onMessageRef = useRef(onMessage);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);


    const connect = useCallback(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const url = `${protocol}://${window.location.host}/ws`;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('Websocket connected');

            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current);
                reconnectTimer.current = null;
            }
        };


        


    })

}