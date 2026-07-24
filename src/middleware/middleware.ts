import { NextFunction } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET } from "../config/auth.js";

export const autenticaToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];

  if (!SECRET) {
    return res.status(500).json({
      error: "Erro de configuração do servidor.",
    });
  }

  if (!authHeader) {
    return res.status(401).json({
      error: "Token não fornecido.",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Formato do token inválido.",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err, usuario) => {
    if (err) return res.status(401).json({ error: "Token inválido" });
    req.user = usuario;

    next();
  });
};
