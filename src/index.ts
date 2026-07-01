import dotenv from "dotenv";

dotenv.config();

import express from "express";
import type { Response, Request } from "express";
import pool from "./database/conexao.js";
import { retornaLeads, retornaLeadsId } from "./services/clientesServices.js";

const app = express();

app.get("/leads", async (req: Request, res: Response) => {
  try {
    const clientes = await retornaLeads();
    res.json(clientes);
  } catch (erro) {
    res.status(500).json("Erro: erro interno do servidor");
  }
});

app.get("/leads/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID deve ser um número" });
  }

  if (id <= 0) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const lead = await retornaLeadsId(id);

    if (!lead) {
      return res.status(404).json({ error: "Lead não encontrado" });
    }
    return res.status(200).json(lead);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ error: "erro interno no servidor" });
  }
});

app.listen(3000, () => {
  console.log("Olá Arthur, servidor iniciado.");
});
