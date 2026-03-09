import { supabase } from "./supabase.js"

// buscar comercios
export async function buscarComercios() {

  const { data, error } = await supabase
    .from("comercios")
    .select("*")
    .order("id", { ascending: false })

  if (error) {
    console.error("Erro ao buscar:", error)
    return []
  }

  return data
}

// inserir empresa
export async function inserirComercio(comercio) {

  const { data, error } = await supabase
    .from("comercios")
    .insert([comercio])

  if (error) {
    console.error("Erro ao salvar:", error)
    return false
  }

  return true
}