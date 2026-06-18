import dotenv from "dotenv";

dotenv.config();

import express from "express";
import type { Response, Request } from "express";
import pool from "./database/conexao.js";
import { retornaClientes } from "./services/clientesServices.js";

const app = express();

app.get("/leads", async (req: Request, res: Response) => {
  try {
    const clientes = await retornaClientes();
    res.json(clientes);
  } catch (erro) {
    res.status(500).json("Erro: erro interno do servidor");
  }
});

app.listen(900, () => {
  console.log("Olá Arthur, servidor iniciado.");
});
