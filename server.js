import { Server } from 'socket.io';
import app from './app.js';
import database from './data-access/database.js';
import makeAssociations from './data-access/associations.js';
import { WebSockets } from './sockets/WebSockets.js';

const PORT = process.env.PORT ?? 8080;

/** Initialize the database and listen for connections. */
const httpServer = app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
(async () => {
    try {
        makeAssociations();
        await database.sync({
            // force: true,
            // alter: true,
            // ^ Uncomment whenever you update the schema
            // eg. when creating a new model, updating an old one.
        });
        const io = new Server(httpServer);
        WebSockets(io);
    } catch (err) {
        console.log(Error(err));
    }
})();

export default httpServer;
