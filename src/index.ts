import express from "express";
import type { Response, Request } from "express";

const app = express();

app.get("/clientes", (req: Request, res: Response) => {
  res.send("ok");
});

app.listen(900, () => {
  console.log("Olá Arthur, servidor iniciado.");
});
