import pool from "../database/conexao.js";
import { Leads } from "../types/usuario.js";

export async function retornaQuery<T>(query: string, valores: unknown[] = []) {
  const conexao = await pool.getConnection();
  try {
    const [clientes] = await conexao.query(query, valores);
    return clientes as T;
  } finally {
    conexao.release();
  }
}

export async function retornaLeads(): Promise<Leads[]> {
  const query = "SELECT * FROM leads";
  const leads = await retornaQuery<Leads[]>(query);

  return leads as Leads[];
}

export async function retornaLeadsId(id: number): Promise<Leads> {
  const query = "SELECT * FROM leads WHERE id = ?";
  const valores = id;

  const leads = await retornaQuery<Leads[]>(query, [valores]);

  return leads[0];
}
