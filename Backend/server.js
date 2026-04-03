const app = require("./src/app");

const DEFAULT_PORT = Number(process.env.PORT || 5000);
const MAX_PORT_ATTEMPTS = 10;

function startServer(port, attemptsLeft) {
  const server = app
    .listen(port, () => {
      console.log(`Backend running on port ${port}`);
    })
    .on("error", (error) => {
      if (error.code === "EADDRINUSE" && attemptsLeft > 0) {
        const nextPort = port + 1;
        console.warn(`Port ${port} is in use. Retrying on port ${nextPort}...`);
        startServer(nextPort, attemptsLeft - 1);
        return;
      }

      console.error("Failed to start backend server:", error.message);
      process.exit(1);
    });

  return server;
}

startServer(DEFAULT_PORT, MAX_PORT_ATTEMPTS);
