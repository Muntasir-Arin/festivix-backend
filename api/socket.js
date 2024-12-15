module.exports = (server) => {
    const socketIo = require('socket.io');
    const io = socketIo(server);  // Bind Socket.IO to the server
  
    // Handle Socket.IO events
    io.on('connection', (socket) => {
      console.log('A user connected');
  
      // Listen for a message from the client
      socket.on('sendMessage', (message) => {
        console.log('Message received:', message);
  
        // Broadcast the message to all connected clients
        io.emit('receiveMessage', message);
      });
  
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  
    return io;  // Optionally return io if needed elsewhere
  };
  