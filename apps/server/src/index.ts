import http from 'http';
import SocketService from './services/socket';


async function init() {

    const socketService = new SocketService(); // instantiate the socket service

    const server = http.createServer();
    const PORT = process.env.SOCKET_PORT || 8000;

    socketService.io.attach(server); // attach the socket service to the server


    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    socketService.initListeners(); // initialize the socket listeners
}

init();