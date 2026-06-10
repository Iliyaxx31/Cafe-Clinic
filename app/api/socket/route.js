import { Server } from "socket.io";

let io = null;

export async function GET(req) {
  if (!io) {
    const res = new Response();
    const socketServer = res.socket?.server;
    
    if (socketServer) {
      io = new Server(socketServer, {
        path: "/api/socket",
        addTrailingSlash: false,
      });
      
      io.on("connection", (socket) => {
        console.log("✅ Socket connected:", socket.id);
        socket.on("disconnect", () => {
          console.log("❌ Socket disconnected:", socket.id);
        });
      });
    }
  }
  
  global.io = io;
  
  // Socket.io için doğru yanıt
  return new Response(null, { status: 200 });
}