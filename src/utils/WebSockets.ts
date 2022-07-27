class WebSockets {
  users = [];

  constructor() {
    this.subscribeUser = this.subscribeUser.bind(this);
  }

  connection = (socket) => {
    socket.on("hello", (arg) => {
      //console.log("Client connected:", client);
      console.log(arg);
    });

    socket.on("log", (roomId) => {
      console.log("THIS?", this);
      console.log("SOCKET?", socket);

      const rooms = socket.adapter.rooms;
      if (rooms.has(roomId)) {
        const set = rooms.get(roomId);
        console.log(`${roomId} contains:`, [...set.keys()]);
        global.io.emit("log", {
          room: [...set.keys()],
        });
      }
    });

    socket.on("clear", (roomId) => {
      global.io.disconnectSockets();
      console.log("THIS?", this);
      console.log("SOCKET?", socket);
      //global.io.sockets.in(roomId).emit("log", { log });
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    // event fired when the chat room is disconnected
    socket.on("disconnect", () => {
      this.users = this.users.filter((user) => user.socketId !== socket.id);
    });

    // add identity of user mapped to the socket id
    socket.on("identity", (userId) => {
      //console.log("THIS?", this);
      //console.log("SOCKET?", socket);
      this.users.push({
        socketId: socket.id,
        userId: userId,
      });
    });

    // subscribe a list of users to a room
    socket.on("subscribe", (room, userIds = []) => {
      for (const userId of userIds) {
        this.subscribeUser(room, userId);
      }
    });

    // mute a chat room
    socket.on("unsubscribe", (room) => {
      socket.leave(room);
    });

    socket.on("new message", (roomId, message) => {
      socket.to(roomId).emit("new message", { message });
    });
  };

  subscribeUser(room, userId) {
    const userSockets = this.users.filter((user) => user.userId === userId);
    userSockets.map((userInfo) => {
      const socket = global.io.sockets.sockets.get(userInfo.socketId);
      if (socket) {
        socket.join(room);
      }
    });
  }
}

export default new WebSockets();
