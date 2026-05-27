/* ==========================================================================
   📦 PRODUCTS DATABASE - HÚNGARA WEB ORDER CATALOG
   ========================================================================== */

const PRODUCTS = [
    // 1. LIMPEZA | Produtos Líquidos
    { id: 1, category: "LIMPEZA | Produtos Líquidos", name: "Álcool Vetex 70 1L", code: "004281-1" },
    { id: 2, category: "LIMPEZA | Produtos Líquidos", name: "Álcool Vetex Gel 5L", code: "004280-3" },
    { id: 3, category: "LIMPEZA | Produtos Líquidos", name: "Cloro Cordex 2,5% 5L", code: "000491-0" },
    { id: 4, category: "LIMPEZA | Produtos Líquidos", name: "Desengordurante Cordex 5L", code: "000679-3" },
    { id: 5, category: "LIMPEZA | Produtos Líquidos", name: "Desincrustante AL 2050 Becker 5L", code: "000698-0" },
    { id: 6, category: "LIMPEZA | Produtos Líquidos", name: "Desinfetante Cordex Eucalipto 5L", code: "000733-1" },
    { id: 7, category: "LIMPEZA | Produtos Líquidos", name: "Detergente ODD Neutro 500ml", code: "000852-4" },
    { id: 8, category: "LIMPEZA | Produtos Líquidos", name: "Detergente Versátil Clorado Becker 5L", code: "00859-1 V" },
    { id: 9, category: "LIMPEZA | Produtos Líquidos", name: "Essência Ubon Eucalipto 140ml", code: "001029-4" },
    { id: 10, category: "LIMPEZA | Produtos Líquidos", name: "Hipoclorito Saponi 5% 5L", code: "004445-8" },
    { id: 11, category: "LIMPEZA | Produtos Líquidos", name: "Inseticida SBT 380ml", code: "001264-5" },
    { id: 12, category: "LIMPEZA | Produtos Líquidos", name: "Limpa Forno Força Azul 230g", code: "001349-8" },
    { id: 13, category: "LIMPEZA | Produtos Líquidos", name: "Limpa Vidros Veja Vidrex 500ml", code: "001372-2" },
    { id: 14, category: "LIMPEZA | Produtos Líquidos", name: "Limpador Peroxy Becker 5L", code: "001413-3 V" },
    { id: 15, category: "LIMPEZA | Produtos Líquidos", name: "Limpador Veja Desengordurante Cozinha 500ml", code: "001415-9" },
    { id: 16, category: "LIMPEZA | Produtos Líquidos", name: "Limpador Veja Multiuso Original 500ml", code: "001420-6" },
    { id: 17, category: "LIMPEZA | Produtos Líquidos", name: "Lustra Móveis Poliflor Lavanda 200ml", code: "001503-2" },
    { id: 18, category: "LIMPEZA | Produtos Líquidos", name: "Odorizador Bom Ar Lavanda 360ml", code: "001935-6" },
    { id: 19, category: "LIMPEZA | Produtos Líquidos", name: "Pastilha Adesiva Qodor Lavanda c/3", code: "002264-0" },
    { id: 20, category: "LIMPEZA | Produtos Líquidos", name: "Sabonete Topbel Antisséptico 5L", code: "002610-7" },
    { id: 21, category: "LIMPEZA | Produtos Líquidos", name: "Sapólio Cremoso Cif Original 450ml", code: "002953-0" },

    // 2. UTENSÍLIOS DE LIMPEZA
    { id: 22, category: "UTENSÍLIOS DE LIMPEZA", name: "Balde Arqplast 15L", code: "003478-9" },
    { id: 23, category: "UTENSÍLIOS DE LIMPEZA", name: "Conjunto de Mop Giratório Nobre", code: "000535-5" },
    { id: 24, category: "UTENSÍLIOS DE LIMPEZA", name: "Escova Sanitária TOQ c/ Estojo", code: "003340-5" },
    { id: 25, category: "UTENSÍLIOS DE LIMPEZA", name: "Esponja Dupla Face Maxx c/10", code: "003848-2" },
    { id: 26, category: "UTENSÍLIOS DE LIMPEZA", name: "Luva Descartável Nobre c/100", code: "Não Informado" },
    { id: 27, category: "UTENSÍLIOS DE LIMPEZA", name: "Luva Látex Mucambo Amarela M", code: "001537-7" },
    { id: 28, category: "UTENSÍLIOS DE LIMPEZA", name: "Luva de Vinil Medix sem Pó G c/100", code: "001514-8" },
    { id: 29, category: "UTENSÍLIOS DE LIMPEZA", name: "Mopinho de Rosca Brusmop 190g", code: "001704-3" },
    { id: 30, category: "UTENSÍLIOS DE LIMPEZA", name: "Pá de Lixo Galvanizada Cabo Longo", code: "001973-9" },
    { id: 31, category: "UTENSÍLIOS DE LIMPEZA", name: "Pá de Lixo TOQ Colet", code: "003344-8" },
    { id: 32, category: "UTENSÍLIOS DE LIMPEZA", name: "Pano de Chão Padrão", code: "001997-6" },
    { id: 33, category: "UTENSÍLIOS DE LIMPEZA", name: "Pano Multiuso Medix Verde 28x300m", code: "003496-7" },
    { id: 34, category: "UTENSÍLIOS DE LIMPEZA", name: "Pulverizador Contecom Transparente 500ml", code: "003776-1" },
    { id: 35, category: "UTENSÍLIOS DE LIMPEZA", name: "Rede Polisul Laranja c/50", code: "004003-7" },
    { id: 36, category: "UTENSÍLIOS DE LIMPEZA", name: "Refil Mop Giratório Nobre de Microfibra", code: "002431-7" },
    { id: 37, category: "UTENSÍLIOS DE LIMPEZA", name: "Rodo Plástico de Pia", code: "002494-5" },
    { id: 38, category: "UTENSÍLIOS DE LIMPEZA", name: "Touca Descartável Nobre c/100", code: "003073-2" },
    { id: 39, category: "UTENSÍLIOS DE LIMPEZA", name: "Vassoura Toq Pluri Plus", code: "003336-7" },

    // 3. PAPEL
    { id: 40, category: "PAPEL", name: "Guardanapo de Estojo 14x14 c/2000", code: "001221-1" },
    { id: 41, category: "PAPEL", name: "Guardanapo Domus 20x18 c/100", code: "001222-0" },
    { id: 42, category: "PAPEL", name: "Papel Higiênico Folha Dupla Deluxe 20m c/12", code: "002048-6" },
    { id: 43, category: "PAPEL", name: "Papel Toalha Silvestre Branco 20x21", code: "002200-4" },

    // 4. SACOS, SACOLAS E BOBINAS
    { id: 44, category: "SACOS, SACOLAS E BOBINAS", name: "Bobina Picotada Vertex 19x30", code: "000225-9" },
    { id: 45, category: "SACOS, SACOLAS E BOBINAS", name: "Bobina Picotada Vertex 20x30", code: "000225-9" },
    { id: 46, category: "SACOS, SACOLAS E BOBINAS", name: "Bobina Picotada Vertex 25x35", code: "000226-7" },
    { id: 47, category: "SACOS, SACOLAS E BOBINAS", name: "Bobina Picotada Vertex 30x40", code: "000227-5" },
    { id: 48, category: "SACOS, SACOLAS E BOBINAS", name: "Bobina Picotada Vertex 40x60", code: "003213-1" },
    { id: 49, category: "SACOS, SACOLAS E BOBINAS", name: "Saco de Alta 6x25 c/1000", code: "003233-6" },
    { id: 50, category: "SACOS, SACOLAS E BOBINAS", name: "Saco de Lixo Preto 60L", code: "002668-9" },
    { id: 51, category: "SACOS, SACOLAS E BOBINAS", name: "Saco de Lixo Preto 100L Ali c/100", code: "002682-4" },
    { id: 52, category: "SACOS, SACOLAS E BOBINAS", name: "Saco de Lixo Preto 200L Ali c/100", code: "003528-9" },
    { id: 53, category: "SACOS, SACOLAS E BOBINAS", name: "Saco de Lixo Transparente 60L Ali c/100", code: "002667-0" },
    { id: 54, category: "SACOS, SACOLAS E BOBINAS", name: "Saco de Lixo Transparente 240L M.A c/100", code: "003032-5" },
    { id: 55, category: "SACOS, SACOLAS E BOBINAS", name: "Saco para Talher 6x24 c/1000", code: "002910-6" },
    { id: 56, category: "SACOS, SACOLAS E BOBINAS", name: "Sacola 29x44 Branca RioPlastic c/1000", code: "004002-9" },
    { id: 57, category: "SACOS, SACOLAS E BOBINAS", name: "Sacola 30x45 Branca 2kg", code: "Não Informado" },
    { id: 58, category: "SACOS, SACOLAS E BOBINAS", name: "Sacola 40x50 Reforçada 3kg", code: "002927-0" },

    // 5. DESCARTÁVEIS
    { id: 59, category: "DESCARTÁVEIS", name: "Canudo Embalado c/500", code: "003966-7" },
    { id: 60, category: "DESCARTÁVEIS", name: "Canudo Embalado Strawplast c/100", code: "003992-6" },
    { id: 61, category: "DESCARTÁVEIS", name: "Canudo Kanudex Shake 8mm c/100", code: "000349-2" },
    { id: 62, category: "DESCARTÁVEIS", name: "Colher de Refeição Bello Branca c/50", code: "003236-0" },
    { id: 63, category: "DESCARTÁVEIS", name: "Colher de Sobremesa Bello Branca c/50", code: "003237-9" },
    { id: 64, category: "DESCARTÁVEIS", name: "Copo Copobom Branco 200ml c/100", code: "Não Informado" },
    { id: 65, category: "DESCARTÁVEIS", name: "Copo Térmico de Isopor Ultra 120ml c/25", code: "004032-0" },
    { id: 66, category: "DESCARTÁVEIS", name: "Copo Térmico 180ml", code: "003244-1" },
    { id: 67, category: "DESCARTÁVEIS", name: "Copo Térmico de Isopor Ultra 240ml c/25", code: "00596-7" },
    { id: 70, category: "DESCARTÁVEIS", name: "Filme de PVC Vabene 28x300m", code: "001093-6" },
    { id: 71, category: "DESCARTÁVEIS", name: "Filme de PVC Vabene 38x300m", code: "001094-4" },
    { id: 72, category: "DESCARTÁVEIS", name: "Garfo de Refeição Bello Branca c/50", code: "003242-5" },
    { id: 73, category: "DESCARTÁVEIS", name: "Mexedor de Café Bello c/500", code: "003244-1" },

    // 6. ALIMENTOS E BEBIDAS
    { id: 74, category: "ALIMENTOS E BEBIDAS", name: "Açúcar União 1kg", code: "000312-3" },
    { id: 75, category: "ALIMENTOS E BEBIDAS", name: "Adoçante Zero Cal", code: "00031-0" },
    { id: 76, category: "ALIMENTOS E BEBIDAS", name: "Café Evolutto Tradicional 500g", code: "000303-4" },

    // 7. CONTÊINERES
    { id: 77, category: "CONTÊINERES", name: "Contêiner 240L", code: "000542-8" },
    { id: 78, category: "CONTÊINERES", name: "Contêiner 1000L", code: "000038-8" },
    { id: 79, category: "CONTÊINERES", name: "Contêiner 1200L", code: "004126-2" }
];
