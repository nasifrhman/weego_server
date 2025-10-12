const socketAuthMiddleware = require("./auth");
const {notificationHandler} = require("./features/socketNotification");

const connectedUsers = new Map();

const socketIO = (io) => {
  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log(`User ID: ${socket?.decodedToken?._id} just connected`);
    const userId = socket?.decodedToken?._id;
    if (userId) connectedUsers.set(userId.toString(), socket.id);


    notificationHandler(io, socket);

    socket.on("disconnect", () => {
      console.log(`User ID: ${socket?.decodedToken?._id} just disconnected`);
      connectedUsers.delete(userId);
    });
  });
};

module.exports = {
  socketIO,
  connectedUsers,
};

