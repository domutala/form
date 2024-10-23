import handler from "serve-handler";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  return handler(request, response, { public: "./.output/public" });
});

server.listen(process.env.SERVE_PORT, () => {
  console.log(`Running at http://localhost:${process.env.SERVE_PORT}`);
});
