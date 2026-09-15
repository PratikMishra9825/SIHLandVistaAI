import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('⚡ Socket connected to LandVista AI server:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('⚡ Socket disconnected:', reason);
    });
  }

  return socket;
}

export function joinUserRoom(userId: string) {
  const s = getSocket();
  if (s && userId) {
    s.emit('join_user', userId);
  }
}

export function joinExpertRoom(expertId: string) {
  const s = getSocket();
  if (s && expertId) {
    s.emit('join_expert', expertId);
  }
}

export function joinBookingRoom(bookingId: string) {
  const s = getSocket();
  if (s && bookingId) {
    s.emit('join_booking', bookingId);
  }
}
