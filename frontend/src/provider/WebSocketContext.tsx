import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { WEB_SOCKET_URL } from '../utils/api_routes';

interface WebSocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

interface WebSocketProviderProps {
    readonly children: ReactNode;
}

const WebSocketContext = createContext<WebSocketContextType>({ socket: null, isConnected: false });

export const useWebSocket = () => useContext(WebSocketContext);

export function WebSocketProvider({ children }: WebSocketProviderProps) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const newSocket = io(WEB_SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => setIsConnected(true));
        newSocket.on('disconnect', () => setIsConnected(false));

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
}