import { createServer } from "node:http";
import { createApplication } from "./app";

async function main() {
  try {
    const server = createServer(createApplication()); // createApplication() is handler which handle my express routes
    const PORT: number = 8080;

    server.listen(PORT, () => {
      console.log(`HTTP server is running on PORT : ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting HTTP Server");
  }
}
main();
