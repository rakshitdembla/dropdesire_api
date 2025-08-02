import dotenv from "dotenv";
import os from "os";
import cluster from "cluster";
import connectMongo from "./src/db/connection.db.js";
import app from "./app.js";

(async () => {
  try {
    dotenv.config();

    // Clustering -->
    if (cluster.isPrimary) {
      // No. of CPUs
      const numCPUs = os.cpus().length;

      // Create Workers
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      // On Worker Exit/Die
      cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Forking a new one.`);
        cluster.fork();
      });
    } else {
      // Workers Proccess -->

      // Initialize PORT
      const port = process.env.PORT || 3000;

      // Connect to MongoDatabase
      await connectMongo();

      // Run Server
      app.listen(port, "0.0.0.0", () => {
        console.log(`Server running at ${port}`);
      });
    }
  } catch (e) {
    console.log(`Error in starting server ${e.toString()}`);
    throw e;
  }
})();
