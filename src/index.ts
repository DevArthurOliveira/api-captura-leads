import dotenv from "dotenv";

dotenv.config();

import express from "express";
import type { Response, Request } from "express";
import pool from "./database/conexao.js";

const app = express();

app.get("/clientes", async (req: Request, res: Response) => {
  let conexao;

  try {
    conexao = await pool.getConnection();

    console.log("Conexão realizada com sucesso");
    res.status(200).send("Conexão criada com sucesso");
  } catch (erro) {
    console.error(erro);
    res.status(500).send("Erro ao conectar banco");
  } finally {
    conexao?.release();
  }
});

app.listen(900, () => {
  console.log("Olá Arthur, servidor iniciado.");
});
