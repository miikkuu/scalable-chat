import {Server} from 'socket.io';

import Redis from 'ioredis';

const pub= new Redis(
    {
        host: process.env.REDIS_HOST,
        port: (process.env.REDIS_PORT)? parseInt(process.env.REDIS_PORT): 6379,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD
    }
)
const sub= new Redis( {
    host: process.env.REDIS_HOST,
    port: (process.env.REDIS_PORT)? parseInt(process.env.REDIS_PORT): 6379,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
}
)


class SocketService{
    private _io: Server;

    constructor(){
        console.log('init socket server')
    
        this._io = new Server({
           cors: {
                origin: 'http://localhost:3000' ,
                allowedHeaders : ['Access-Control-Allow-Origin'],
            }  });

        sub.subscribe('MESSAGES');

    }

    public initListeners(){
        const io=this._io;

        console.log('init socket listeners')

        io.on('connect', (socket) => {
        console.log('a user connected with  id - ',socket.id);

        socket.on('event:message', async ({message} : {message:string} )  => {
            console.log('message from client:', message);
            //publish to redis
            await pub.publish('MESSAGES' , JSON.stringify({message , socketID : socket.id}))

        });

     

            });
        sub.on('message', (channel, message) => {

            if(channel === 'MESSAGES' )
                console.log('message from redis:', message);
                io.emit('message', message);
            });

    }

    get io(){
        return this._io;
    }

}

export default SocketService;