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

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessageRef.current(data);
            }
            catch (e) {
                console.error('Failed to parse the Websocket message: ', e);
            }
        };

        ws.onclose = () =>  {
            console.log('Websocket disconnected - reconnecting in 3 seconds');
            reconnectTimer.current = setTimeout(connect, 3000);
        };

        ws.oneerror = (err) => {
            console.error('Websocket error: ', err);
            ws.close();
        };

    }, []);


    useEffect(() => {
        connect();
        return () => {
            if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
            if (wsRef.current) wsRef.current.close();
        };
    }, [connect]);

    const sendMessage = useCallback((data) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            ws.Ref.current.send(JSON.stringify(data));
        }
    }, []);

    return sendMessage;

}