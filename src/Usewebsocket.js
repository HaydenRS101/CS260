import { useEffect, useRef, useCallback } from 'react';


//connects to the backend and calls onMessage whenever there is a message.

export function useWebSocket(onMessage) {
    const wsRef = useRef(null);
    const reconnectTimer = useRef(null);
    const onMessageRef = useRef(onMessage);
}