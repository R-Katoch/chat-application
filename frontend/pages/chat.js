import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

const socket = io('https://chat-application-yug1.onrender.com'); // Adjust this URL to your server address

export default function Chat() {
  const { query } = useRouter();
  const { username, room } = query;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (room) {
      socket.emit('join_room', room);
    }

    socket.on('message', (message) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Handle loading of message history
    socket.on('load_history', (history) => {
      console.log('Received history:', history);
      setMessages(history);  // Set the messages state to the loaded history
    });

    return () => {
      if (room) {
        socket.emit('leave_room', room);
      }
      socket.off();
    };
  }, [room]);

  const sendMessage = () => {
    if (message) {
      console.log('Sending message:', { room, message, username }); // Debug log
      socket.emit('message', { room, message, username });
      setMessage('');
    }
  };

  const leaveRoom = () => {
    if (room) {
      console.log(`Leaving room: ${room}`);
      socket.emit('leave_room', room);
      router.push('/'); // Redirect to the homepage or any other page
    }
  };

  // Sort messages by timestamp before rendering
  const sortedMessages = messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">Room: {room}</h1>
      <div className="messages mb-4">
        {sortedMessages.map((msg) => (
          <p key={msg.timestamp} className="message">{msg.username}: {msg.message}</p>
        ))}
      </div>
      <input
        className="p-2 border border-gray-300 rounded mb-4 w-full"
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(event) => event.key === 'Enter' ? sendMessage() : null}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={sendMessage}>
        Send
      </button>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={leaveRoom}>
        Leave Room
      </button>
    </div>
  );
}
