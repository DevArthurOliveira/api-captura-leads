import dotenv from "dotenv";

dotenv.config();

import express from "express";
import type { Response, Request } from "express";
import pool from "./database/conexao.js";
import {
  cadastraLead,
  retornaLeads,
  retornaLeadsId,
} from "./services/clientesServices.js";
import { error } from "node:console";

const app = express();
app.use(express.json());

app.get("/leads", async (req: Request, res: Response) => {
  try {
    const clientes = await retornaLeads();

    return res.status(200).json(clientes);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json("Erro: erro interno do servidor");
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

app.post("/leads", async (req: Request, res: Response) => {
  const { nome, email, telefone, empresa } = req.body;

  if (!nome.trim()) {
    return res.status(400).json({ error: "Insira um nome" });
  }

  if (!email.trim()) {
    return res.status(400).json({ error: "Insira um email" });
  }

  if (!telefone.trim()) {
    return res.status(400).json({ error: "Insira um telefone" });
  }
  if (!empresa.trim()) {
    return res.status(400).json({ error: "Insira uma empresa" });
  }
  const novoLead = { nome, email, telefone, empresa };

  try {
    await cadastraLead(novoLead);
    return res.status(201).json({ mensagem: "Cadastro feito com sucesso." });
  } catch (erro) {
    console.error({ erro: erro });
    return res.status(500).json({ error: "erro interno no servidor" });
  }
});

app.listen(3000, () => {
  console.log("Olá Arthur, servidor iniciado.");
});
