/**
 * ==========================================================================
 * 🎛️ GOOGLE APPS SCRIPT - CONEXÃO DO CATÁLOGO COM A PLANILHA HÚNGARA
 * ==========================================================================
 * 
 * Este script automatiza o recebimento de pedidos vindos do seu Catálogo Web.
 * Quando um cliente finaliza um pedido:
 * 1. Ele faz uma cópia da planilha original (seu modelo estruturado).
 * 2. Renomeia essa nova aba com o nome do cliente e a data (ex: "Pedido - Padaria Silva - 25/05/2026").
 * 3. Preenche a coluna D (Quantidade) exatamente nas linhas corretas de cada produto solicitado.
 * 4. Mantém toda a formatação, cores e categorias originais intactas!
 * 
 * --- 🛠️ COMO INSTALAR NA SUA PLANILHA: ---
 * 
 * 1. Abra sua planilha Google Sheets (a planilha "planilha_hungara_final_testada_quantidade_editavel").
 * 2. No menu superior, clique em "Extensões" > "Apps Script".
 * 3. Apague qualquer código que estiver lá e cole todo este arquivo de código abaixo.
 * 4. Certifique-se de que a sua aba de produtos principal (o modelo) se chama "Modelo". 
 *    (Se tiver outro nome, mude o nome da aba na planilha para "Modelo" ou edite a variável TEMPLATE_SHEET_NAME abaixo).
 * 5. No canto superior direito, clique no botão azul "Implantar" > "Nova implantação".
 * 6. Em "Selecione o tipo", clique no ícone da engrenagem e selecione "App da Web".
 * 7. Configure os campos assim:
 *    - Descrição: "API de Pedidos do Catálogo"
 *    - Executar como: "Você (seu-email@gmail.com)"
 *    - Quem tem acesso: "Qualquer pessoa" (Isso é obrigatório para o site conseguir enviar dados sem exigir login).
 * 8. Clique em "Implantar". O Google vai pedir autorização de acesso. Dê todas as permissões necessárias.
 * 9. O Google gerará uma URL chamada "App da Web" (uma URL longa terminando em "/exec").
 * 10. Copie essa URL e cole no seu arquivo "script.js" na linha 14 dentro de `API_SHEET_URL: "SUA_URL_AQUI"`.
 * 
 */

// --- Configurações do Script ---
const TEMPLATE_SHEET_NAME = "Modelo"; // Nome da aba modelo de produtos. Renomeie a aba original para isso!
const START_DATA_ROW = 5;            // Linha inicial onde começam os produtos na planilha
const CODE_COLUMN = 3;               // Coluna C (Código do produto)
const QTY_COLUMN = 4;                // Coluna D (Quantidade que o cliente preenche)

/**
 * Recebe a requisição POST enviada pelo site com os dados do cliente e do pedido
 */
function doPost(e) {
  try {
    // 1. Processar dados recebidos
    const requestData = JSON.parse(e.postData.contents);
    
    // Abrir a planilha ativa
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // --- Ação de Aprovação do Gerente Geral ---
    if (requestData.action === "approve") {
      const sheetName = requestData.sheetName;
      if (!sheetName) {
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          message: "Nome da aba não especificado." 
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const targetSheet = spreadsheet.getSheetByName(sheetName);
      if (!targetSheet) {
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          message: "Aba do pedido não encontrada." 
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Registrar aprovação
      targetSheet.getRange("A3").setValue("APROVAÇÃO GERAL:");
      targetSheet.getRange("B3").setValue("✓ APROVADO PELO GERENTE GERAL");
      targetSheet.getRange("B3").setFontColor("#10b981").setFontWeight("bold");
      
      const formattedDate = Utilities.formatDate(new Date(), "GMT-3", "dd/MM/yyyy HH:mm");
      targetSheet.getRange("A4").setValue("Data da Aprovação:");
      targetSheet.getRange("B4").setValue(formattedDate);
      
      return ContentService.createTextOutput(JSON.stringify({ 
        success: true, 
        message: "Pedido aprovado com sucesso na planilha!" 
      }))
      .setHeaders({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
      })
      .setMimeType(ContentService.MimeType.JSON);
    }
    
    const clientName = requestData.cliente;
    const orderItems = requestData.pedido; // Array de { codigo, produto, quantidade }
    
    if (!clientName || !orderItems || orderItems.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        message: "Dados incompletos recebidos." 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 2. Abrir a planilha ativa (já declarada acima, remover reduntante)
    
    // 3. Buscar a aba modelo (template)
    let templateSheet = spreadsheet.getSheetByName(TEMPLATE_SHEET_NAME);
    if (!templateSheet) {
      // Se não achar a aba "Modelo", tenta usar a primeira aba ativa
      templateSheet = spreadsheet.getSheets()[0];
    }
    
    // 4. Gerar data e hora formatadas para o nome da aba
    const formattedDate = Utilities.formatDate(new Date(), "GMT-3", "dd/MM/yyyy HH:mm");
    const newSheetName = "Pedido - " + clientName.substring(0, 15) + " (" + Utilities.formatDate(new Date(), "GMT-3", "dd/MM HH:mm") + ")";
    
    // 5. Verificar se já existe uma aba com o mesmo nome e deletar para não dar erro
    let existingSheet = spreadsheet.getSheetByName(newSheetName);
    if (existingSheet) {
      spreadsheet.deleteSheet(existingSheet);
    }
    
    // 6. Duplicar a aba modelo para criar a aba do pedido individual
    const newSheet = templateSheet.copyTo(spreadsheet).setName(newSheetName);
    
    // 7. Limpar a coluna de Quantidade (Coluna D) do novo pedido para iniciar zerada
    const lastRow = newSheet.getLastRow();
    if (lastRow >= START_DATA_ROW) {
      newSheet.getRange(START_DATA_ROW, QTY_COLUMN, lastRow - START_DATA_ROW + 1, 1).clearContent();
    }
    
    // Helper para normalizar códigos (remove zeros à esquerda e caracteres especiais)
    const normalizeCode = function(code) {
      if (!code) return "";
      return code.toString()
                 .trim()
                 .toLowerCase()
                 .replace(/^0+/, "")          // Remove zeros à esquerda
                 .replace(/[^a-z0-9]/g, "");  // Remove hifens, espaços, etc.
    };

    // 8. Mapear o pedido recebido pelo código do produto para busca rápida (Duplo mapeamento)
    const orderMap = {};
    const normalizedOrderMap = {};
    orderItems.forEach(item => {
      const origCode = item.codigo.toString().trim();
      const normCode = normalizeCode(item.codigo);
      
      orderMap[origCode] = item.quantidade;
      if (normCode) {
        normalizedOrderMap[normCode] = item.quantidade;
      }
    });
    
    // 9. Percorrer a planilha e injetar as quantidades corretas nas células
    const dataRange = newSheet.getRange(START_DATA_ROW, CODE_COLUMN, lastRow - START_DATA_ROW + 1, 2); // Pega códigos (C) e quantidades (D)
    const dataValues = dataRange.getValues(); // Array bidimensional [[codigo, qty], [codigo, qty], ...]
    
    let totalItemsAdded = 0;
    
    // Varre cada linha
    for (let i = 0; i < dataValues.length; i++) {
      const codeInRow = dataValues[i][0].toString().trim();
      const normCodeInRow = normalizeCode(codeInRow);
      
      let quantity = null;
      
      // Tentativa 1: Casamento exato de código
      if (orderMap.hasOwnProperty(codeInRow)) {
        quantity = orderMap[codeInRow];
      } 
      // Tentativa 2: Casamento flexível/normalizado (contorna formatações ou zeros perdidos)
      else if (normCodeInRow && normalizedOrderMap.hasOwnProperty(normCodeInRow)) {
        quantity = normalizedOrderMap[normCodeInRow];
      }
      
      if (quantity !== null) {
        // i + START_DATA_ROW é a linha real na planilha (1-indexada)
        // QTY_COLUMN é a coluna D
        newSheet.getRange(i + START_DATA_ROW, QTY_COLUMN).setValue(quantity);
        totalItemsAdded++;
      }
    }
    
    // 10. Atualizar o título superior da planilha informando o nome do cliente e a data
    newSheet.getRange("A1").setValue("PEDIDO DO CLIENTE: " + clientName.toUpperCase());
    newSheet.getRange("B1").setValue(requestData.empresa || "");
    newSheet.getRange("A2").setValue("Gerado automaticamente via Catálogo Web em " + formattedDate);
    
    // 11. Retornar resposta de sucesso
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      sheetName: newSheetName,
      message: "Pedido inserido com sucesso!",
      itemsMatched: totalItemsAdded
    }))
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
    })
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Retornar resposta de erro amigável
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      message: "Erro no servidor: " + error.toString() 
    }))
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
    })
    .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Retorna a lista de todos os pedidos salvos como abas no Google Sheets
 */
function doGet(e) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = spreadsheet.getSheets();
    const orders = [];
    
    for (let i = 0; i < sheets.length; i++) {
      const sheet = sheets[i];
      const name = sheet.getName();
      
      // Processar apenas abas que começam com "Pedido - "
      if (name.indexOf("Pedido - ") === 0) {
        // Obter nome do cliente e empresa
        const clientVal = sheet.getRange("A1").getValue().toString();
        const clientName = clientVal.replace("PEDIDO DO CLIENTE: ", "").trim();
        const companyName = sheet.getRange("B1").getValue().toString().trim();
        
        // Obter status e data
        const statusVal = sheet.getRange("B3").getValue().toString();
        const isApproved = statusVal.includes("APROVADO PELO GERENTE GERAL");
        
        let dateVal = "";
        if (isApproved) {
          dateVal = sheet.getRange("B4").getValue().toString();
        } else {
          const dateCellVal = sheet.getRange("A2").getValue().toString();
          dateVal = dateCellVal.replace("Gerado automaticamente via Catálogo Web em ", "").trim();
        }
        
        // Obter itens do pedido
        const lastRow = sheet.getLastRow();
        const items = [];
        let totalQty = 0;
        
        if (lastRow >= START_DATA_ROW) {
          const rowsCount = lastRow - START_DATA_ROW + 1;
          const nameValues = sheet.getRange(START_DATA_ROW, 2, rowsCount, 1).getValues();
          const codeValues = sheet.getRange(START_DATA_ROW, 3, rowsCount, 1).getValues();
          const qtyValues = sheet.getRange(START_DATA_ROW, 4, rowsCount, 1).getValues();
          
          for (let r = 0; r < rowsCount; r++) {
            const qty = parseInt(qtyValues[r][0], 10) || 0;
            if (qty > 0) {
              const code = codeValues[r][0].toString().trim();
              const nameProd = nameValues[r][0].toString().trim();
              items.push({
                codigo: code,
                produto: nameProd,
                quantidade: qty
              });
              totalQty += qty;
            }
          }
        }
        
        orders.push({
          sheetName: name,
          cliente: clientName || name.replace("Pedido - ", ""),
          empresa: companyName || "Geral",
          status: isApproved ? "Aprovado" : "Pendente",
          dataAprovacao: isApproved ? dateVal : "",
          dataCriacao: dateVal,
          totalItens: totalQty,
          itens: items
        });
      }
    }
    
    // Inverter para mostrar os mais novos primeiro
    orders.reverse();
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      orders: orders
    }))
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS"
    })
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Erro ao listar pedidos: " + error.toString()
    }))
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS"
    })
    .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Trata requisições OPTIONS prévias (CORS) necessárias para navegadores modernos
 */
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    })
    .setMimeType(ContentService.MimeType.TEXT);
}
