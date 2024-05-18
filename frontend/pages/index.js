import { useEffect, useState } from 'react';
import Link from 'next/link';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function Home() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [usernameConfirmed, setUsernameConfirmed] = useState(false);

  useEffect(() => {
    socket.on('room_list', (availableRooms) => {
      console.log('Received room list:', availableRooms);
      setRooms(availableRooms);
    });

    socket.on('username_taken', (message) => {
        setError(message);
        setUsernameConfirmed(false);  // Ensure username is not confirmed if taken
    });

    socket.on('username_set', (username) => {
        console.log(`Confirmed username: ${username}`);
        setError('');
        setUsernameConfirmed(true);  // Confirm username to enable room selection
    });

    // Emit a request to get the room list when component mounts
    socket.emit('get_room_list');
    console.log('Requested room list');

    return () => {
      socket.off('room_list');
      socket.off('username_taken');
      socket.off('username_set');
    };
  }, []);

  const handleSetUsername = () => {
    if (username) {
        socket.emit('set_username', username);
    }
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">Join a Chat Room</h1>
      <input
        className="p-2 border border-gray-300 rounded mb-4 w-full"
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onBlur={handleSetUsername}  // Optionally use onBlur to set username when user exits the input
      />
      <p className="text-red-500">{error}</p>
      <input
        className="p-2 border border-gray-300 rounded mb-4 w-full"
        type="text"
        placeholder="Enter room name or select below"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        disabled={!usernameConfirmed}
      />
      <ul>
        {rooms.length > 0 ? rooms.map((r, index) => (
          <li key={index} onClick={() => setRoom(r)} style={{ cursor: 'pointer' }}>
            {r}
          </li>
        )) : <p>No rooms available.</p>}
      </ul>
      {usernameConfirmed && room && (
        <Link 
          href={`/chat?username=${encodeURIComponent(username)}&room=${encodeURIComponent(room)}`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block text-center"
        >
          Join Room
        </Link>
      )}
    </div>
  );
}
