import { io } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_API_URL as string);

socket.on('connect', () => {
  console.log('Socket connected', socket.id);
});

socket.on('connect_error', (err) => {
  console.log('Socket connection error: ', err);
});