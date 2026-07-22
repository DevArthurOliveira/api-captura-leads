import { ResultSetHeader } from "mysql2";
import pool from "../database/conexao.js";
import { Leads, NovoLead } from "../types/usuario.js";

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

export async function retornaLeadsNome(nome: string): Promise<Leads[]> {
  const query = "SELECT * FROM leads WHERE nome LIKE ?";
  const valores = `%${nome}%`;
  const lead = await retornaQuery<Leads[]>(query, [valores]);

  return lead;
}

export async function retornaLeadsId(id: number): Promise<Leads | null> {
  const query = "SELECT * FROM leads WHERE id = ?";
  const valores = id;

  const leads = await retornaQuery<Leads[]>(query, [valores]);

  return leads[0] ?? null;
}

export async function cadastraLead(
  novoLead: NovoLead,
): Promise<ResultSetHeader> {
  const query =
    "INSERT INTO leads (nome,email,telefone,empresa) VALUES (?,?,?,?)";

  const { nome, email, telefone, empresa } = novoLead;
  const cadastro = await retornaQuery<ResultSetHeader>(query, [
    nome,
    email,
    telefone,
    empresa,
  ]);

  return cadastro;
}

export async function atualizaLeads(
  novoLead: NovoLead,
  id: number,
): Promise<ResultSetHeader> {
  const query =
    "UPDATE leads SET nome = ?, email = ?, telefone = ?, empresa = ? WHERE id = ?";
  const { nome, email, telefone, empresa } = novoLead;

  const leadAtualizado = await retornaQuery<ResultSetHeader>(query, [
    nome,
    email,
    telefone,
    empresa,
    id,
  ]);
  return leadAtualizado;
}

export async function deletaLeadId(id: number): Promise<ResultSetHeader> {
  const query = "DELETE FROM leads WHERE id = ?";

  const leadDeletado = await retornaQuery<ResultSetHeader>(query, [id]);
  return leadDeletado;
}
