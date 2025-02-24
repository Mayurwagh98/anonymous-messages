import mongoose from "mongoose";

/**
 * Mongoose connection state tracking object.
 * Used to maintain a singleton connection across the application.
 */
type ConnectionObject = {
  /** Represents the current MongoDB connection state (0: disconnected, 1: connected) */
  isConnected?: number;
};

/** Singleton object to track the database connection state */
const connection: ConnectionObject = {};

/**
 * Establishes and manages a connection to MongoDB using Mongoose.
 * Implements a singleton pattern to reuse existing connections.
 *
 * @returns {Promise<void>} A promise that resolves when the connection is established
 * @throws {Error} If the database connection fails
 */

async function dbConnect() {
  // Return early if we already have an active connection
  if (connection.isConnected) {
    console.log("Db already connected");
    return;
  }

  try {
    // Attempt to establish a new connection using the MongoDB URI from environment variables
    const db = await mongoose.connect(process.env.MONGO_URI!);
    console.log("db:", db);

    // Store the connection state (1 if connected)
    connection.isConnected = db.connections[0].readyState;
    console.log("connection:", connection);

    console.log("Db connected");
  } catch (error) {
    // Log any connection errors and terminate the process
    console.log("error:", error);

    process.exit(1);
  }
}

export default dbConnect;
