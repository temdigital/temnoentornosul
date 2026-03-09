import { buscarComercios, inserirComercio } from "./api-comercios.js"

const container = document.getElementById("cards")

async function carregarComercios(){

  const comercios = await buscarComercios()

  container.innerHTML = ""

  comercios.forEach(c => {

    const card = document.createElement("div")
    card.className = "card"

    card.innerHTML = `
      <h3>${c.nome}</h3>
      <p><b>Cidade:</b> ${c.cidade || "-"}</p>
      <p><b>Categoria:</b> ${c.categoria || "-"}</p>
    `

    container.appendChild(card)

  })
}

carregarComercios()

// formulário

const form = document.getElementById("formEmpresa")

form.addEventListener("submit", async (e)=>{

  e.preventDefault()

  const nome = document.getElementById("nome").value
  const cidade = document.getElementById("cidade").value
  const categoria = document.getElementById("categoria").value

  const sucesso = await inserirComercio({
    nome,
    cidade,
    categoria
  })

  if(sucesso){

    alert("Empresa salva!")

    form.reset()

    carregarComercios()

  }else{

    alert("Erro ao salvar")

  }

})