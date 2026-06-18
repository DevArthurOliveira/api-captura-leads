import pool from "../database/conexao.js";
import { Leads } from "../types/usuario.js";

export async function retornaQuery(query: string, valores: unknown[] = []) {
  const conexao = await pool.getConnection();
  try {
    const [clientes] = await conexao.query(query, valores);
    return clientes;
  } finally {
    conexao.release();
  }
}

export async function retornaClientes(): Promise<Leads[]> {
  const query = "SELECT * FROM leads";
  const clientes = await retornaQuery(query);

  return clientes as Leads[];
}
