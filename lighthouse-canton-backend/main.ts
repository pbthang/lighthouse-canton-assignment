import express from "express";

const app = express();

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World");
});

app.listen(8000);
console.log(`Server is running on http://localhost:8000`);
