/**
 * Utilitários de Formatação
 * SaaS Multi-negócios - Tem no Entorno Sul
 * Desenvolvido por: Renato Asse
 */

// =====================================================
// FORMATAÇÃO DE DATAS
// =====================================================

/**
 * Formata data para o padrão brasileiro
 * @param {string|Date} data - Data a ser formatada
 * @param {boolean} incluirHoras - Se deve incluir horas
 * @returns {string} Data formatada
 */
function formatarData(data, incluirHoras = false) {
    if (!data) return '';
    
    const date = new Date(data);
    if (isNaN(date.getTime())) return '';
    
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const ano = date.getFullYear();
    
    if (!incluirHoras) {
        return `${dia}/${mes}/${ano}`;
    }
    
    const horas = date.getHours().toString().padStart(2, '0');
    const minutos = date.getMinutes().toString().padStart(2, '0');
    
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}

/**
 * Formata data relativa (ex: "há 2 dias")
 * @param {string|Date} data - Data a ser formatada
 * @returns {string} Data relativa
 */
function formatarDataRelativa(data) {
    if (!data) return '';
    
    const date = new Date(data);
    const agora = new Date();
    const diferenca = Math.floor((agora - date) / 1000); // em segundos
    
    if (diferenca < 60) return 'agora mesmo';
    if (diferenca < 3600) return `há ${Math.floor(diferenca / 60)} minutos`;
    if (diferenca < 86400) return `há ${Math.floor(diferenca / 3600)} horas`;
    if (diferenca < 2592000) return `há ${Math.floor(diferenca / 86400)} dias`;
    if (diferenca < 31536000) return `há ${Math.floor(diferenca / 2592000)} meses`;
    
    return `há ${Math.floor(diferenca / 31536000)} anos`;
}

// =====================================================
// FORMATAÇÃO DE MOEDA
// =====================================================

/**
 * Formata valor para Real brasileiro
 * @param {number} valor - Valor a ser formatado
 * @returns {string} Valor formatado
 */
function formatarMoeda(valor) {
    if (valor === null || valor === undefined) return '';
    
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// =====================================================
// FORMATAÇÃO DE TELEFONE
// =====================================================

/**
 * Formata telefone para padrão brasileiro
 * @param {string} telefone - Telefone a ser formatado
 * @returns {string} Telefone formatado
 */
function formatarTelefone(telefone) {
    if (!telefone) return '';
    
    // Remove tudo que não é número
    const numeros = telefone.replace(/\D/g, '');
    
    if (numeros.length === 10) {
        // Telefone fixo: (XX) XXXX-XXXX
        return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (numeros.length === 11) {
        // Celular: (XX) 9XXXX-XXXX
        return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    return telefone;
}

// =====================================================
// FORMATAÇÃO DE CNPJ/CPF
// =====================================================

/**
 * Formata CNPJ
 * @param {string} cnpj - CNPJ a ser formatado
 * @returns {string} CNPJ formatado
 */
function formatarCNPJ(cnpj) {
    if (!cnpj) return '';
    
    const numeros = cnpj.replace(/\D/g, '');
    if (numeros.length !== 14) return cnpj;
    
    return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata CPF
 * @param {string} cpf - CPF a ser formatado
 * @returns {string} CPF formatado
 */
function formatarCPF(cpf) {
    if (!cpf) return '';
    
    const numeros = cpf.replace(/\D/g, '');
    if (numeros.length !== 11) return cpf;
    
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// =====================================================
// FORMATAÇÃO DE CEP
// =====================================================

/**
 * Formata CEP
 * @param {string} cep - CEP a ser formatado
 * @returns {string} CEP formatado
 */
function formatarCEP(cep) {
    if (!cep) return '';
    
    const numeros = cep.replace(/\D/g, '');
    if (numeros.length !== 8) return cep;
    
    return numeros.replace(/(\d{5})(\d{3})/, '$1-$2');
}

// =====================================================