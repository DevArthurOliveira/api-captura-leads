export type Leads = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  criado_em: Date;
  atualizado_em: Date;
};

export type NovoLead = Omit<Leads, "id" | "criado_em" | "atualizado_em">;
