import dotenv from "dotenv";

dotenv.config();

import express from "express";
import jwt from "jsonwebtoken";
import type { Response, Request } from "express";
import {
  atualizaLeads,
  cadastraLead,
  deletaLeadId,
  retornaLeads,
  retornaLeadsId,
  retornaLeadsNome,
} from "./services/clientesServices.js";
import { validaLeads } from "./validators/leadValidator.js";
import { autenticaToken } from "./middleware/middleware.js";
import { users } from "./database/data.js";
import { login } from "./services/authServices.js";
import { SECRET } from "./config/auth.js";

const app = express();
app.use(express.json());

app.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  const secret = process.env.SECRET_KEY;

  if (!SECRET) {
    return res.status(500).json({
      error: "Erro de configuração.",
    });
  }

  const user = login(username, password);

  if (!user) {
    return res.status(403).json({ mensagem: "Usuário ou senha inválidos" });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json(token);
});

app.get("/leads", autenticaToken, async (req: Request, res: Response) => {
  const nome = req.query.nome;

  try {
    if (typeof nome !== "string") {
      const clientes = await retornaLeads();
      return res.status(200).json(clientes);
    }

    const clientes = await retornaLeadsNome(nome);
    if (clientes.length === 0) {
      return res.status(404).json({ error: "Lead não encontrado" });
    }
    return res.status(200).json(clientes);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({ error: "erro interno no servidor" });
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

  const novoLead = { nome, email, telefone, empresa };

  try {
    validaLeads(novoLead);
    await cadastraLead(novoLead);
    return res.status(201).json({ mensagem: "Cadastro feito com sucesso." });
  } catch (erro) {
    if (erro instanceof Error) {
      return res.status(400).json({
        error: erro.message,
      });
    }

    return res.status(500).json({
      error: "Erro interno no servidor.",
    });
  }
});

app.put("/leads/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "ID deve ser um número" });
  }

  if (id <= 0) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const { nome, email, telefone, empresa } = req.body;

  const novoLead = { nome, email, telefone, empresa };

  try {
    validaLeads(novoLead);
    const lead = await retornaLeadsId(id);

    if (!lead) {
      return res.status(404).json({ error: "Lead não encontrado" });
    }

    await atualizaLeads(novoLead, id);

    return res.status(200).json({ mensagem: "Lead atualizado com sucesso." });
  } catch (erro) {
    if (erro instanceof Error) {
      return res.status(400).json({
        error: erro.message,
      });
    }
    return res.status(500).json({
      error: "Erro interno no servidor.",
    });
  }
});

app.delete("/leads/:id", async (req: Request, res: Response) => {
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

    await deletaLeadId(id);
    return res.status(200).json({ mensagem: "Lead deletado com sucesso." });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ error: "erro interno no servidor" });
  }
});

app.listen(3000, () => {
  console.log("Olá Arthur, servidor iniciado.");
});
