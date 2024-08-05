import Document from "./Document.js";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import * as dotenv from "dotenv";

dotenv.config();

//connect to mongodb
// const mongoose = require("mongoose");
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

mongoose
  .connect(process.env.MONGODB_URL, clientOptions)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("Failed to connect to DB");
    console.error(err);
  });

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
httpServer.listen(3001);

const defaultValue = "";

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });
    socket.on("save-document", async (data) => {
      await Document.findById(documentId, { data });
    });
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;
  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
  console.log("create Id successfully");
}
