import { NovoLead } from "../types/usuario.js";

export function validaLeads(novoLead: NovoLead) {
  const { nome, email, telefone, empresa } = novoLead;

  if (typeof nome !== "string") {
    throw new Error("Nome inválido.");
  }
  if (typeof email !== "string") {
    throw new Error("E-mail inválido.");
  }
  if (typeof telefone !== "string") {
    throw new Error("Telefone inválido.");
  }
  if (typeof empresa !== "string") {
    throw new Error("Empresa inválida.");
  }

  if (!nome.trim()) {
    throw new Error("Nome é obrigatório.");
  }

  if (!email.trim()) {
    throw new Error("E-mail é obrigatório.");
  }

  if (!telefone.trim()) {
    throw new Error("Telefone é obrigatório.");
  }

  if (!empresa.trim()) {
    throw new Error("Empresa é obrigatória.");
  }

  const nomeLimpo = nome.trim();
  const telefoneLimpo = String(telefone).replace(/\D/g, "");
  const empresaLimpa = empresa.trim();

  const regexNome = /^[A-Za-zÀ-ÿ\s'-]{2,100}$/;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexTelefone = /^\d{10,11}$/;
  const regexEmpresa = /^[A-Za-zÀ-ÿ\s'-]{2,100}$/;

  if (!regexNome.test(nomeLimpo)) {
    throw new Error("Nome inválido.");
  }

  if (!regexEmail.test(email)) {
    throw new Error("E-mail inválido.");
  }

  if (!regexTelefone.test(telefoneLimpo)) {
    throw new Error("Telefone inválido.");
  }

  if (!regexEmpresa.test(empresaLimpa)) {
    throw new Error("Empresa inválida.");
  }
}
