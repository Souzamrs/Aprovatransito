export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  content: string;
  completed: boolean;
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  lessons: Lesson[];
  status: "completed" | "in-progress" | "locked";
}

export interface Question {
  id: string;
  moduleId: string;
  text: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  justification: string;
}

export const modules: Module[] = [
  {
    id: "legislacao",
    title: "Legislação de Trânsito",
    icon: "⚖️",
    status: "locked",
    lessons: [
      {
        id: "leg-1", title: "Código de Trânsito Brasileiro (CTB)", description: "Introdução ao CTB e seus princípios", duration: "10 min", completed: false,
        content: `O Código de Trânsito Brasileiro (CTB) foi instituído pela Lei nº 9.503, de 23 de setembro de 1997, e é o conjunto de normas que regulamenta o trânsito em todo o território nacional.

📌 Princípios Fundamentais:
• Todo cidadão tem direito a um trânsito em condições seguras (Art. 1º, §2º)
• O trânsito, em condições seguras, é um direito de todos e dever dos órgãos e entidades do Sistema Nacional de Trânsito
• Os órgãos do SNT são responsáveis por adotar medidas para assegurar esse direito
• A educação para o trânsito é direito de todos e constitui dever prioritário dos componentes do SNT

📌 Abrangência:
O CTB se aplica a qualquer veículo, pessoa ou animal que se encontre em vias terrestres abertas à circulação, sejam urbanas ou rurais.

📌 Competências:
• CONTRAN (Conselho Nacional de Trânsito): órgão máximo normativo e consultivo
• DENATRAN: órgão máximo executivo de trânsito da União
• DETRANs: órgãos executivos estaduais
• Municípios: podem exercer atividades de trânsito quando integrados ao SNT`,
      },
      {
        id: "leg-2", title: "Documentos de Habilitação", description: "CNH, categorias e processo", duration: "12 min", completed: false,
        content: `A Carteira Nacional de Habilitação (CNH) é o documento obrigatório para conduzir veículos automotores e elétricos em vias abertas à circulação.

📌 Categorias da CNH:
• Categoria A: Motocicletas, motonetas e ciclomotores
• Categoria B: Automóveis e caminhonetes (até 3.500 kg e até 8 passageiros)
• Categoria C: Veículos de carga acima de 3.500 kg
• Categoria D: Veículos de transporte de passageiros (acima de 8 lugares)
• Categoria E: Combinação de veículos com unidade tratora nas categorias B, C ou D

📌 Processo de Habilitação:
1. Exame de aptidão física e mental
2. Exame psicológico (avaliação psicológica)
3. Curso teórico-técnico (45 horas/aula)
4. Prova teórica (mínimo 70% de acertos — 21 de 30 questões)
5. Curso de prática veicular (mínimo 20 horas/aula no simulador + via pública)
6. Exame de direção veicular

📌 Permissão para Dirigir (PPD):
O condutor recém-habilitado recebe a PPD válida por 1 ano. Se não cometer infração grave ou gravíssima, nem ser reincidente em infração média, receberá a CNH definitiva.

📌 Validade da CNH:
• Até 49 anos: 10 anos
• De 50 a 69 anos: 5 anos
• 70 anos ou mais: 3 anos`,
      },
      {
        id: "leg-3", title: "Normas de Circulação e Conduta", description: "Regras gerais de circulação", duration: "15 min", completed: false,
        content: `As normas de circulação estabelecem como veículos e pedestres devem se comportar no trânsito.

📌 Regras Gerais:
• Circular pela faixa da direita e usar a esquerda apenas para ultrapassagem
• Antes de mudar de faixa, o condutor deve sinalizar com antecedência
• Em rotatórias, a preferência é de quem já está circulando nela
• O condutor deve manter distância segura (lateral e frontal) de outros veículos

📌 Velocidades Máximas (sem sinalização):
🏙️ Vias Urbanas:
• Via de trânsito rápido: 80 km/h
• Via arterial: 60 km/h
• Via coletora: 40 km/h
• Via local: 30 km/h

🛣️ Rodovias:
• Automóveis e camionetas: 110 km/h
• Ônibus e micro-ônibus: 90 km/h
• Demais veículos: 90 km/h

📌 Preferência de Passagem:
• Veículos que transitam por via preferencial têm preferência sobre os de vias secundárias
• Pedestres na faixa de travessia SEMPRE têm preferência
• Veículos de emergência com sirene e luzes acionadas têm prioridade absoluta

📌 Ultrapassagem:
• Sempre pela esquerda
• Proibida em curvas, aclives, pontes e passagens de nível
• O veículo que será ultrapassado deve facilitar a manobra`,
      },
      {
        id: "leg-4", title: "Penalidades e Medidas Administrativas", description: "Sistema de pontuação e multas", duration: "15 min", completed: false,
        content: `O CTB estabelece penalidades para infrações cometidas pelos condutores, classificadas por gravidade.

📌 Classificação das Infrações:
• Infração Leve: 3 pontos — valor base da multa: R$ 88,38
• Infração Média: 4 pontos — valor base da multa: R$ 130,16
• Infração Grave: 5 pontos — valor base da multa: R$ 195,23
• Infração Gravíssima: 7 pontos — valor base da multa: R$ 293,47

📌 Suspensão do Direito de Dirigir:
O condutor terá a CNH suspensa quando atingir 40 pontos em 12 meses.
Exceção: Condutores que exercem atividade remunerada (profissionais) — limite de 40 pontos mantido, mas com regras específicas.

📌 Medidas Administrativas:
• Retenção do veículo: até regularização (ex: sem extintor)
• Remoção do veículo: quando não pode circular (ex: sem licenciamento)
• Apreensão do veículo: infrações específicas (ex: adulteração)
• Recolhimento da CNH: quando há suspensão ou cassação
• Cassação da CNH: reincidência em 12 meses de suspensão, ou condenação judicial

📌 Fator Multiplicador:
Algumas infrações gravíssimas possuem fator multiplicador:
• Dirigir sob influência de álcool: multa x 10
• Disputar corrida (racha): multa x 10
• Dirigir sem CNH: multa x 3`,
      },
      {
        id: "leg-5", title: "Crimes de Trânsito", description: "Tipificação penal no trânsito", duration: "12 min", completed: false,
        content: `O CTB tipifica crimes de trânsito nos artigos 302 a 312.

📌 Principais Crimes de Trânsito:
• Homicídio culposo (Art. 302): Detenção de 2 a 4 anos + suspensão da CNH
• Lesão corporal culposa (Art. 303): Detenção de 6 meses a 2 anos + suspensão
• Embriaguez ao volante (Art. 306): Detenção de 6 meses a 3 anos + multa + suspensão
• Racha/corrida não autorizada (Art. 308): Detenção de 6 meses a 3 anos + multa + suspensão
• Direção sem habilitação gerando perigo (Art. 309): Detenção de 6 meses a 1 ano
• Entrega de veículo a pessoa não habilitada (Art. 310): Detenção de 6 meses a 1 ano
• Excesso de velocidade em locais específicos (Art. 311): Detenção de 6 meses a 1 ano
• Fraude processual (Art. 312): Detenção de 6 meses a 1 ano

📌 Agravantes:
A pena é aumentada de 1/3 à metade quando o condutor:
• Não possuir CNH
• Praticá-lo na faixa de pedestre ou calçada
• Deixar de prestar socorro à vítima
• Estiver sob influência de álcool ou drogas`,
      },
    ],
  },
  {
    id: "defensiva",
    title: "Direção Defensiva",
    icon: "🛡️",
    status: "locked",
    lessons: [
      {
        id: "def-1", title: "Conceitos de Direção Defensiva", description: "Pilares da condução segura", duration: "10 min", completed: false,
        content: `Direção defensiva é a forma de dirigir que permite reconhecer antecipadamente situações de perigo e prever o que pode acontecer com você, com os outros e com o ambiente.

📌 Os 5 Elementos da Direção Defensiva (CAPHA):
1. Conhecimento: Saber as leis, o veículo e as condições da via
2. Atenção: Manter-se concentrado 100% do tempo ao dirigir
3. Previsão: Antecipar situações de perigo antes que aconteçam
4. Habilidade: Saber manusear os comandos do veículo com destreza
5. Ação: Tomar atitudes corretas no momento certo

📌 Tipos de Direção Defensiva:
• Preventiva: Quando o condutor age antes do perigo se concretizar
• Corretiva: Quando o condutor reage a um perigo já existente

📌 Condições Adversas:
São fatores que prejudicam a segurança:
• Luz (ofuscamento, baixa visibilidade)
• Tempo (chuva, neblina, vento forte)
• Via (buracos, pista molhada, obras)
• Trânsito (congestionamento, veículos lentos)
• Veículo (pneus gastos, freios ruins)
• Condutor (sono, estresse, uso de medicamentos)`,
      },
      {
        id: "def-2", title: "Colisões e Como Evitá-las", description: "Tipos de acidentes e prevenção", duration: "12 min", completed: false,
        content: `Conhecer os tipos de colisão ajuda a preveni-las.

📌 Tipos de Colisão:
• Colisão frontal: Mais perigosa, ocorre quando dois veículos se chocam de frente
• Colisão traseira: Ocorre por falta de distância segura ou distração
• Colisão lateral: Comum em cruzamentos e mudanças de faixa
• Colisão transversal: Quando um veículo atinge a lateral do outro em cruzamento

📌 Como Evitar Cada Tipo:
🔹 Frontal: Nunca ultrapassar em locais proibidos; manter-se na faixa correta
🔹 Traseira: Manter distância segura de 2 segundos (regra dos 2 segundos)
🔹 Lateral: Olhar os retrovisores antes de mudar de faixa; sinalizar
🔹 Transversal: Reduzir velocidade em cruzamentos, mesmo com preferência

📌 Regra dos 2 Segundos:
Escolha um ponto fixo na via. Quando o veículo da frente passar por ele, conte "dois segundos". Se você passar pelo ponto antes de terminar a contagem, aumente a distância.

📌 Em Pista Molhada:
A distância deve ser o DOBRO — use a regra dos 4 segundos.`,
      },
      {
        id: "def-3", title: "Estado Físico e Mental do Condutor", description: "Fadiga, sono e substâncias", duration: "12 min", completed: false,
        content: `O estado físico e mental do condutor é o fator mais determinante para a segurança no trânsito.

📌 Fadiga e Sono:
• A fadiga reduz reflexos, atenção e capacidade de julgamento
• Sinais de alerta: bocejar frequente, olhos pesados, dificuldade de concentração
• A cada 2 horas de direção, faça pausa de pelo menos 15 minutos
• Em viagens longas, evite dirigir entre 2h e 6h da manhã (pico de sono)

📌 Álcool e Direção:
• Qualquer quantidade de álcool compromete a capacidade de dirigir
• O álcool reduz reflexos, coordenação motora e julgamento
• A Lei Seca (Lei 11.705/2008) estabelece tolerância ZERO para álcool
• Recusar o teste do etilômetro gera multa e suspensão da CNH

📌 Medicamentos:
• Anti-histamínicos, calmantes e relaxantes musculares causam sonolência
• NUNCA dirija sem saber os efeitos colaterais do medicamento
• Consulte sempre o médico sobre a possibilidade de dirigir

📌 Emoções:
• Raiva, ansiedade e euforia prejudicam a atenção
• Evite dirigir em estados emocionais extremos
• Pratique paciência e cortesia no trânsito`,
      },
    ],
  },
  {
    id: "sinalizacao",
    title: "Sinalização de Trânsito",
    icon: "🪧",
    status: "locked",
    lessons: [
      {
        id: "sin-1", title: "Placas de Regulamentação", description: "Obrigações, proibições e restrições", duration: "12 min", completed: false,
        content: `Placas de regulamentação informam ao condutor sobre obrigações, proibições, restrições ou limitações de uso da via.

📌 Características:
• Formato: Circular
• Cor: Fundo branco, orla vermelha, símbolo preto
• Exceções: R-1 (Parada obrigatória) é octogonal; R-2 (Dê a preferência) é triangular invertida

📌 Principais Placas:
🔴 R-1 — Parada Obrigatória (PARE): O condutor deve parar completamente antes de prosseguir
🔺 R-2 — Dê a Preferência: Reduza e dê passagem a quem tem preferência
⛔ R-3 — Sentido Proibido: Via de mão única no sentido contrário
🚫 R-6a — Proibido Estacionar: Não é permitido parar o veículo
🔄 R-15 — Rotatória: Indica sentido de circulação obrigatório
⬆️ R-24 — Sentido de Circulação: Indica o sentido obrigatório da via
🚗 R-19 — Velocidade Máxima Permitida: Indica o limite de velocidade

📌 Importante:
• Placas de regulamentação têm FORÇA DE LEI
• Desrespeitá-las constitui infração de trânsito
• Elas prevalecem sobre a sinalização horizontal quando houver conflito`,
      },
      {
        id: "sin-2", title: "Placas de Advertência", description: "Alertas e perigos", duration: "10 min", completed: false,
        content: `Placas de advertência alertam os condutores sobre condições perigosas na via.

📌 Características:
• Formato: Losangular (quadrado apoiado no vértice)
• Cor: Fundo amarelo, símbolo preto
• Exceção: Placas de obras têm fundo LARANJA

📌 Principais Placas:
⚠️ A-1a — Curva acentuada à esquerda
⚠️ A-2a — Curva à esquerda
⚠️ A-5 — Pista sinuosa à esquerda
⚠️ A-7 — Via lateral à esquerda
⚠️ A-12 — Interseção em "T"
⚠️ A-14 — Semáforo à frente
⚠️ A-17 — Lombada
⚠️ A-18 — Depressão
⚠️ A-20a — Declive acentuado
⚠️ A-26a — Sentido duplo adiante
⚠️ A-30a — Passagem de pedestres
⚠️ A-33a — Área escolar
⚠️ A-42 — Pista escorregadia

📌 Importante:
• São sinais de ALERTA, não de proibição
• Devem ser instaladas antes do trecho perigoso
• O condutor deve reduzir velocidade e aumentar atenção`,
      },
      {
        id: "sin-3", title: "Placas de Indicação", description: "Orientação, destinos e serviços", duration: "10 min", completed: false,
        content: `Placas de indicação orientam os condutores sobre destinos, distâncias, serviços e pontos de interesse.

📌 Tipos de Placas de Indicação:
1. Placas de Identificação: Indicam rodovias, cidades, ruas (fundo verde, texto branco)
2. Placas de Orientação de Destino: Indicam direção e distância (fundo verde)
3. Placas Educativas: Mensagens educativas (fundo branco, texto preto)
4. Placas de Serviços Auxiliares: Hospitais, postos, restaurantes (fundo azul)
5. Placas de Atrativos Turísticos: Pontos turísticos (fundo marrom)

📌 Cores por Tipo:
🟢 Verde: Identificação e orientação de destinos
🔵 Azul: Serviços auxiliares (hospital, abastecimento, borracharia)
🟤 Marrom: Atrativos turísticos
⚪ Branco: Placas educativas

📌 Exemplos Práticos:
• "São Paulo — 120 km" (verde) = orientação de destino
• Hospital com símbolo "H" (azul) = serviço auxiliar
• "Use o cinto de segurança" (branco) = placa educativa
• Parque Nacional (marrom) = atrativo turístico`,
      },
      {
        id: "sin-4", title: "Sinalização Horizontal", description: "Marcas no pavimento", duration: "10 min", completed: false,
        content: `A sinalização horizontal são marcas pintadas ou apostas sobre o pavimento.

📌 Cores da Sinalização Horizontal:
• Amarela: Regula fluxos em sentidos opostos (contramão)
• Branca: Regula fluxos no mesmo sentido
• Vermelha: Áreas especiais (ciclofaixas, ônibus)
• Azul: Estacionamento regulamentado (idosos, deficientes)

📌 Tipos de Linhas:
— Linha contínua: PROIBIDO ultrapassar/transpor
- - Linha tracejada: PERMITIDO ultrapassar/transpor
—  - - Linha mista: Permitida para quem está do lado tracejado; proibida para o lado contínuo

📌 Principais Marcas:
• Faixa de pedestre: Linhas brancas paralelas na via
• Linha de retenção: Linha branca antes do cruzamento (onde parar)
• Setas de direção: Indicam sentido obrigatório na faixa
• Marcação de área de conflito: Linhas diagonais (não pare nessas áreas)

📌 Importante:
• A sinalização horizontal complementa a vertical (placas)
• Em caso de conflito, a sinalização mais restritiva prevalece
• Agente de trânsito > semáforo > sinalização vertical > sinalização horizontal`,
      },
    ],
  },
  {
    id: "infracoes",
    title: "Infrações e Penalidades",
    icon: "🚨",
    status: "locked",
    lessons: [
      {
        id: "inf-1", title: "Tipos de Infrações", description: "Classificação completa", duration: "12 min", completed: false,
        content: `As infrações de trânsito são ações ou omissões contrárias às normas do CTB.

📌 Classificação por Gravidade:
• LEVE — 3 pontos | Multa: R$ 88,38
  Ex: Estacionar em desacordo com regulamentação
• MÉDIA — 4 pontos | Multa: R$ 130,16
  Ex: Usar veículo com equipamento obrigatório inoperante
• GRAVE — 5 pontos | Multa: R$ 195,23
  Ex: Transitar com CNH vencida há mais de 30 dias
• GRAVÍSSIMA — 7 pontos | Multa: R$ 293,47
  Ex: Dirigir sob influência de álcool, avançar sinal vermelho

📌 Exemplos por Gravidade:
🟢 Leve: Estacionar no acostamento; não atualizar endereço da CNH em 30 dias
🟡 Média: Dirigir com apenas uma mão (fora manobra); buzinar prolongadamente
🟠 Grave: Ultrapassar pela direita; transportar passageiro em compartimento de carga
🔴 Gravíssima: Dirigir sem CNH; racha; uso de celular ao volante; não usar cinto

📌 Reincidência:
Se o condutor comete a mesma infração dentro de 12 meses, a multa é aplicada em dobro.`,
      },
      {
        id: "inf-2", title: "Sistema de Pontuação", description: "Como funciona a contagem de pontos", duration: "10 min", completed: false,
        content: `O sistema de pontuação da CNH funciona como um controle da quantidade de infrações cometidas pelo condutor.

📌 Pontuação por Infração:
• Leve: 3 pontos
• Média: 4 pontos
• Grave: 5 pontos
• Gravíssima: 7 pontos

📌 Limite para Suspensão:
O condutor terá a CNH SUSPENSA quando atingir 40 pontos no período de 12 meses.

📌 Regras Importantes:
• Os pontos prescrevem após 12 meses da data da infração
• A suspensão pode variar de 6 meses a 1 ano
• Na primeira suspensão: obrigatório curso de reciclagem
• Na reincidência em 12 meses após suspensão: CASSAÇÃO

📌 Cassação da CNH:
Ocorre quando o condutor:
• É suspenso e reincide em infração grave/gravíssima em 12 meses
• É condenado por crime de trânsito
• O prazo de cassação é de 2 anos
• Após a cassação, deve refazer TODO o processo de habilitação

📌 Condutor com PPD (Permissão para Dirigir):
Se cometer infração grave ou gravíssima, ou for reincidente em infração média, NÃO receberá a CNH definitiva.`,
      },
      {
        id: "inf-3", title: "Medidas Administrativas", description: "Retenção, remoção e apreensão", duration: "10 min", completed: false,
        content: `Medidas administrativas são ações aplicadas pela autoridade de trânsito independentemente das penalidades.

📌 Tipos de Medidas Administrativas:
1. Retenção do Veículo: O veículo fica retido até a regularização da irregularidade
   Ex: Falta de documento obrigatório, pneu careca
   
2. Remoção do Veículo: O veículo é levado ao pátio do órgão de trânsito
   Ex: Estacionado em local proibido causando risco; sem licenciamento
   
3. Apreensão do Veículo: Similar à remoção, mas por motivos mais graves
   Ex: Veículo com chassi adulterado; produto de furto/roubo

4. Recolhimento da CNH: Quando a habilitação precisa ser entregue
   Ex: Suspensão ou cassação do direito de dirigir

5. Recolhimento do CRLV: Quando o documento do veículo deve ser entregue
   Ex: Licenciamento vencido

📌 Importante:
• A retenção é temporária — o veículo é liberado no local após regularização
• A remoção envolve levar o veículo ao depósito
• A apreensão exige processo administrativo para liberação`,
      },
    ],
  },
  {
    id: "meioambiente",
    title: "Meio Ambiente e Cidadania",
    icon: "🌿",
    status: "locked",
    lessons: [
      {
        id: "amb-1", title: "Poluição e Trânsito", description: "Impactos ambientais dos veículos", duration: "10 min", completed: false,
        content: `O trânsito é uma das principais fontes de poluição ambiental nas cidades.

📌 Tipos de Poluição Veicular:
• Poluição atmosférica: Gases como CO, CO2, NOx e material particulado
• Poluição sonora: Buzinas, escapamentos, motores barulhentos
• Poluição do solo e água: Vazamento de óleo, pneus descartados, peças

📌 Efeitos na Saúde:
• Doenças respiratórias (asma, bronquite)
• Problemas cardiovasculares
• Estresse causado pelo barulho
• Aquecimento global (efeito estufa)

📌 Como Reduzir a Poluição:
• Manter o veículo regulado e com manutenção em dia
• Utilizar combustíveis de qualidade
• Preferir transporte público ou carona solidária
• Evitar acelerações e frenagens bruscas (eco-driving)
• Desligar o motor em paradas prolongadas
• Manter o escapamento em boas condições

📌 Inspeção Veicular:
Em algumas cidades, é obrigatória a inspeção de emissão de gases. Veículos reprovados devem ser reparados para circular.`,
      },
      {
        id: "amb-2", title: "Cidadania no Trânsito", description: "Convivência e responsabilidade social", duration: "10 min", completed: false,
        content: `Cidadania no trânsito é o exercício de direitos e deveres no espaço público compartilhado.

📌 Princípios da Cidadania no Trânsito:
• Respeito mútuo entre motoristas, pedestres e ciclistas
• Cumprimento das leis de trânsito como ato de civilidade
• Solidariedade: parar para pedestres, dar passagem a ambulâncias
• Paciência: evitar agressividade e disputas no trânsito

📌 Pedestres e Ciclistas:
• Pedestres são os mais vulneráveis no trânsito
• Ciclistas têm direito a circular nas vias e devem ser respeitados
• O condutor deve manter distância mínima de 1,5 metro ao ultrapassar ciclistas
• Em faixas de travessia, o pedestre SEMPRE tem preferência

📌 Acessibilidade:
• Vagas reservadas para idosos e pessoas com deficiência devem ser respeitadas
• Calçadas e faixas de pedestre devem estar sempre livres
• Parar sobre a faixa de pedestre é infração e atitude de desrespeito

📌 Responsabilidade Social:
• Não use celular ao dirigir
• Não dirija após consumir álcool
• Use sempre o cinto de segurança (motorista e passageiros)
• Crianças até 10 anos devem usar dispositivo de retenção adequado (cadeirinha, assento elevado)`,
      },
    ],
  },
  {
    id: "primeiros-socorros",
    title: "Primeiros Socorros",
    icon: "🚑",
    status: "locked",
    lessons: [
      {
        id: "ps-1", title: "Procedimentos em Acidentes", description: "O que fazer ao presenciar um acidente", duration: "12 min", completed: false,
        content: `Saber agir corretamente em um acidente de trânsito pode salvar vidas.

📌 Sequência de Ações (PAS):
1. PROTEGER: Sinalizar o local para evitar novos acidentes
   • Ligar pisca-alerta, colocar triângulo a 30 metros
   • Usar lanternas ou objetos visíveis à noite
   
2. AVISAR: Ligar para o atendimento de emergência
   • SAMU: 192
   • Bombeiros: 193
   • PRF: 191
   • Polícia Militar: 190
   
3. SOCORRER: Prestar os primeiros socorros DENTRO dos seus limites

📌 O Que NÃO Fazer:
❌ NÃO remova a vítima (risco de lesão na coluna)
❌ NÃO ofereça água ou alimentos
❌ NÃO tente "colocar ossos no lugar"
❌ NÃO retire capacete de motociclistas
❌ NÃO movimente a cabeça da vítima

📌 O Que Fazer:
✅ Verifique se a vítima está consciente (chame, toque no ombro)
✅ Verifique a respiração (ver, ouvir, sentir)
✅ Estanque hemorragias com pano limpo, fazendo pressão
✅ Mantenha a vítima aquecida e calma
✅ Aguarde o socorro especializado`,
      },
      {
        id: "ps-2", title: "Hemorragias e Fraturas", description: "Como agir em casos específicos", duration: "10 min", completed: false,
        content: `Em acidentes de trânsito, hemorragias e fraturas são as lesões mais comuns.

📌 Hemorragias:
Tipos:
• Externa: Sangramento visível — aplique pressão direta com pano limpo
• Interna: Sinais como palidez, suor frio, fraqueza — NÃO há como tratar no local

Procedimento para hemorragia externa:
1. Pressionar o local com pano limpo
2. NÃO remover o pano se encharcar — colocar outro por cima
3. Elevar o membro se possível
4. Manter pressão constante até o socorro chegar

📌 Fraturas:
Tipos:
• Fechada: Osso quebrado sem exposição
• Exposta: Osso visível — muito grave, risco de infecção

Procedimento:
1. NÃO tente alinhar ou movimentar o membro
2. Imobilize na posição encontrada usando talas improvisadas
3. Em fratura exposta, cubra com pano limpo sem tocar no osso
4. Aguarde socorro especializado

📌 Estado de Choque:
Sinais: Pele pálida e fria, respiração rápida, confusão mental
• Deite a vítima e eleve as pernas (se não houver fratura)
• Mantenha-a aquecida
• NÃO ofereça líquidos`,
      },
    ],
  },
  {
    id: "mecanica",
    title: "Mecânica e Manutenção",
    icon: "🔧",
    status: "locked",
    lessons: [
      {
        id: "mec-1", title: "Funcionamento do Veículo", description: "Sistemas básicos do automóvel", duration: "12 min", completed: false,
        content: `Conhecer o funcionamento básico do veículo é essencial para segurança e manutenção.

📌 Principais Sistemas do Veículo:

🔹 Motor:
• Transforma energia do combustível em movimento
• Tipos: Gasolina, etanol, diesel, flex (gasolina + etanol)
• O motor precisa de combustível, ar e faísca (ignição) para funcionar

🔹 Sistema de Freios:
• Freio a disco: Mais eficiente, usado nas rodas dianteiras
• Freio a tambor: Usado nas rodas traseiras de veículos mais simples
• ABS (Anti-lock Braking System): Impede o travamento das rodas na frenagem
• Freio de estacionamento (mão): Usado para manter o veículo parado

🔹 Sistema de Suspensão:
• Absorve impactos e irregularidades da via
• Molas, amortecedores e coxins são os principais componentes
• Suspensão ruim = instabilidade e desgaste irregular dos pneus

🔹 Sistema Elétrico:
• Bateria: Armazena e fornece energia elétrica
• Alternador: Recarrega a bateria enquanto o motor funciona
• Faróis, lanternas e setas fazem parte do sistema elétrico
• Fusíveis protegem o sistema contra curtos-circuitos`,
      },
      {
        id: "mec-2", title: "Manutenção Preventiva", description: "Cuidados essenciais com o veículo", duration: "10 min", completed: false,
        content: `A manutenção preventiva evita problemas mecânicos e garante segurança.

📌 Verificações Diárias (antes de sair):
• Nível do óleo do motor (vareta)
• Nível da água do radiador (motor frio)
• Calibragem e estado dos pneus
• Funcionamento de faróis, lanternas e setas
• Limpadores de para-brisa

📌 Verificações Periódicas:
• Troca de óleo: A cada 5.000 a 10.000 km (conforme manual)
• Filtros (ar, óleo, combustível): Trocar junto com o óleo
• Correia dentada: Trocar conforme quilometragem do manual
• Fluido de freio: Trocar a cada 10.000 km ou 1 ano
• Alinhamento e balanceamento: A cada 10.000 km ou quando notar vibração

📌 Pneus:
• A profundidade mínima legal dos sulcos é 1,6 mm
• Pneus "carecas" são INFRAÇÃO GRAVE e causa de aquaplanagem
• O estepe deve estar sempre calibrado e em boas condições
• Rodízio de pneus a cada 10.000 km

📌 Equipamentos Obrigatórios:
• Estepe, macaco e chave de roda
• Triângulo de sinalização
• Extintor de incêndio (onde exigido)
• Cinto de segurança para todos os ocupantes`,
      },
    ],
  },
];

export const questions: Question[] = [
  // === LEGISLAÇÃO ===
  { id: "q1", moduleId: "legislacao", text: "De acordo com o CTB, qual é o limite de pontos na CNH para suspensão do direito de dirigir em 12 meses?", options: [{ label: "A", text: "20 pontos" }, { label: "B", text: "30 pontos" }, { label: "C", text: "40 pontos" }, { label: "D", text: "50 pontos" }], correctAnswer: "C", justification: "Conforme o Art. 261 do CTB, a CNH será suspensa quando o infrator atingir 40 pontos no período de 12 meses." },
  { id: "q2", moduleId: "legislacao", text: "Uma infração gravíssima adiciona quantos pontos à CNH?", options: [{ label: "A", text: "3 pontos" }, { label: "B", text: "5 pontos" }, { label: "C", text: "6 pontos" }, { label: "D", text: "7 pontos" }], correctAnswer: "D", justification: "Infrações gravíssimas computam 7 pontos na CNH do condutor, conforme Art. 259 do CTB." },
  { id: "q3", moduleId: "legislacao", text: "Qual categoria da CNH permite conduzir veículos de transporte de passageiros com mais de 8 lugares?", options: [{ label: "A", text: "Categoria B" }, { label: "B", text: "Categoria C" }, { label: "C", text: "Categoria D" }, { label: "D", text: "Categoria E" }], correctAnswer: "C", justification: "A Categoria D habilita o condutor a dirigir veículos de transporte de passageiros com mais de 8 lugares." },
  { id: "q4", moduleId: "legislacao", text: "Dirigir sob influência de álcool é considerada infração de qual natureza?", options: [{ label: "A", text: "Média" }, { label: "B", text: "Grave" }, { label: "C", text: "Gravíssima" }, { label: "D", text: "Leve" }], correctAnswer: "C", justification: "Dirigir sob influência de álcool é infração gravíssima (Art. 165 do CTB), com multa multiplicada por 10 e suspensão do direito de dirigir." },
  { id: "q5", moduleId: "legislacao", text: "Qual a velocidade máxima em via arterial urbana sem sinalização?", options: [{ label: "A", text: "30 km/h" }, { label: "B", text: "40 km/h" }, { label: "C", text: "60 km/h" }, { label: "D", text: "80 km/h" }], correctAnswer: "C", justification: "Em vias arteriais urbanas sem sinalização, o limite é 60 km/h conforme Art. 61 do CTB." },
  { id: "q6", moduleId: "legislacao", text: "Qual a validade da CNH para condutores com menos de 50 anos?", options: [{ label: "A", text: "3 anos" }, { label: "B", text: "5 anos" }, { label: "C", text: "8 anos" }, { label: "D", text: "10 anos" }], correctAnswer: "D", justification: "Desde a Lei 14.071/2020, a CNH tem validade de 10 anos para condutores com menos de 50 anos." },
  { id: "q7", moduleId: "legislacao", text: "O condutor que pratica homicídio culposo no trânsito está sujeito a:", options: [{ label: "A", text: "Multa apenas" }, { label: "B", text: "Detenção de 2 a 4 anos + suspensão da CNH" }, { label: "C", text: "Detenção de 6 meses a 1 ano" }, { label: "D", text: "Advertência por escrito" }], correctAnswer: "B", justification: "O Art. 302 do CTB prevê detenção de 2 a 4 anos e suspensão ou proibição de se obter a CNH para homicídio culposo na direção de veículo." },
  { id: "q8", moduleId: "legislacao", text: "A Permissão para Dirigir (PPD) tem validade de:", options: [{ label: "A", text: "6 meses" }, { label: "B", text: "1 ano" }, { label: "C", text: "2 anos" }, { label: "D", text: "3 anos" }], correctAnswer: "B", justification: "A PPD tem validade de 1 ano. Se o condutor não cometer infração grave ou gravíssima, ou não for reincidente em infração média, receberá a CNH definitiva." },
  
  // === DIREÇÃO DEFENSIVA ===
  { id: "q9", moduleId: "defensiva", text: "Quais são os 5 elementos fundamentais da direção defensiva?", options: [{ label: "A", text: "Velocidade, frenagem, aceleração, curva, reta" }, { label: "B", text: "Conhecimento, atenção, previsão, habilidade e ação" }, { label: "C", text: "Visão, audição, tato, equilíbrio e reflexo" }, { label: "D", text: "Motor, freio, embreagem, volante e câmbio" }], correctAnswer: "B", justification: "Os 5 elementos da direção defensiva são: Conhecimento, Atenção, Previsão, Habilidade e Ação (CAPHA)." },
  { id: "q10", moduleId: "defensiva", text: "A 'regra dos 2 segundos' serve para:", options: [{ label: "A", text: "Calcular o tempo de frenagem" }, { label: "B", text: "Manter distância segura do veículo à frente" }, { label: "C", text: "Saber quando trocar de marcha" }, { label: "D", text: "Calcular velocidade média" }], correctAnswer: "B", justification: "A regra dos 2 segundos é uma técnica para manter distância segura do veículo da frente em condições normais." },
  { id: "q11", moduleId: "defensiva", text: "Em pista molhada, a distância de seguimento deve ser:", options: [{ label: "A", text: "A mesma de pista seca" }, { label: "B", text: "O dobro da distância normal" }, { label: "C", text: "Metade da distância normal" }, { label: "D", text: "Não há diferença" }], correctAnswer: "B", justification: "Em pista molhada, a distância deve ser o dobro — deve-se aplicar a regra dos 4 segundos ao invés de 2 segundos." },
  { id: "q12", moduleId: "defensiva", text: "Qual é a principal causa de acidentes de trânsito?", options: [{ label: "A", text: "Falha mecânica" }, { label: "B", text: "Condições da via" }, { label: "C", text: "Fator humano (imprudência)" }, { label: "D", text: "Condições climáticas" }], correctAnswer: "C", justification: "O fator humano, incluindo imprudência, negligência e imperícia, é responsável pela grande maioria dos acidentes de trânsito." },
  { id: "q13", moduleId: "defensiva", text: "Qual tipo de colisão é considerado o mais perigoso?", options: [{ label: "A", text: "Colisão traseira" }, { label: "B", text: "Colisão lateral" }, { label: "C", text: "Colisão frontal" }, { label: "D", text: "Colisão transversal" }], correctAnswer: "C", justification: "A colisão frontal é a mais perigosa pois as velocidades dos veículos se somam, gerando impacto muito maior." },
  { id: "q14", moduleId: "defensiva", text: "Ao sentir sono ao dirigir, o condutor deve:", options: [{ label: "A", text: "Ligar o rádio alto e continuar" }, { label: "B", text: "Abrir a janela para tomar ar" }, { label: "C", text: "Parar em local seguro e descansar" }, { label: "D", text: "Tomar café e seguir viagem" }], correctAnswer: "C", justification: "A única medida eficaz contra o sono é parar em local seguro e descansar. Medidas paliativas como rádio alto ou café não eliminam o sono." },

  // === SINALIZAÇÃO ===
  { id: "q15", moduleId: "sinalizacao", text: "Qual é o formato das placas de regulamentação?", options: [{ label: "A", text: "Quadrado" }, { label: "B", text: "Circular" }, { label: "C", text: "Triangular" }, { label: "D", text: "Losangular" }], correctAnswer: "B", justification: "Placas de regulamentação têm formato circular, com fundo branco e orla vermelha (exceto R-1 e R-2)." },
  { id: "q16", moduleId: "sinalizacao", text: "Qual é a cor de fundo das placas de advertência?", options: [{ label: "A", text: "Branco" }, { label: "B", text: "Azul" }, { label: "C", text: "Amarelo" }, { label: "D", text: "Verde" }], correctAnswer: "C", justification: "Placas de advertência possuem fundo amarelo e formato losangular." },
  { id: "q17", moduleId: "sinalizacao", text: "A linha contínua amarela no pavimento indica:", options: [{ label: "A", text: "Ultrapassagem permitida" }, { label: "B", text: "Proibição de ultrapassagem em sentido oposto" }, { label: "C", text: "Estacionamento permitido" }, { label: "D", text: "Faixa exclusiva de ônibus" }], correctAnswer: "B", justification: "A linha contínua amarela indica proibição de ultrapassagem em vias de sentido oposto. Amarelo sempre regula fluxos opostos." },
  { id: "q18", moduleId: "sinalizacao", text: "Placas com fundo azul indicam:", options: [{ label: "A", text: "Regulamentação" }, { label: "B", text: "Advertência" }, { label: "C", text: "Serviços auxiliares" }, { label: "D", text: "Atrativos turísticos" }], correctAnswer: "C", justification: "Placas com fundo azul são de indicação de serviços auxiliares (hospitais, postos de combustível, borracharia, etc.)." },
  { id: "q19", moduleId: "sinalizacao", text: "A placa R-1 (PARE) tem qual formato?", options: [{ label: "A", text: "Circular" }, { label: "B", text: "Losangular" }, { label: "C", text: "Hexagonal" }, { label: "D", text: "Octogonal" }], correctAnswer: "D", justification: "A placa R-1 (Parada Obrigatória — PARE) é a única placa de regulamentação com formato octogonal (8 lados)." },
  { id: "q20", moduleId: "sinalizacao", text: "Na hierarquia de sinalização, quem prevalece sobre todos?", options: [{ label: "A", text: "Semáforo" }, { label: "B", text: "Placa de regulamentação" }, { label: "C", text: "Agente de trânsito" }, { label: "D", text: "Sinalização horizontal" }], correctAnswer: "C", justification: "A ordem de prevalência é: Agente de trânsito > Semáforo > Sinalização vertical (placas) > Sinalização horizontal." },

  // === INFRAÇÕES ===
  { id: "q21", moduleId: "infracoes", text: "Uma infração leve adiciona quantos pontos na CNH?", options: [{ label: "A", text: "2 pontos" }, { label: "B", text: "3 pontos" }, { label: "C", text: "4 pontos" }, { label: "D", text: "5 pontos" }], correctAnswer: "B", justification: "Infrações leves computam 3 pontos na CNH, conforme Art. 259 do CTB." },
  { id: "q22", moduleId: "infracoes", text: "Usar celular ao volante é infração de qual natureza?", options: [{ label: "A", text: "Leve" }, { label: "B", text: "Média" }, { label: "C", text: "Grave" }, { label: "D", text: "Gravíssima" }], correctAnswer: "D", justification: "Usar celular ao volante é infração gravíssima (Art. 252, VI do CTB), com 7 pontos na CNH." },
  { id: "q23", moduleId: "infracoes", text: "A cassação da CNH tem duração mínima de:", options: [{ label: "A", text: "6 meses" }, { label: "B", text: "1 ano" }, { label: "C", text: "2 anos" }, { label: "D", text: "5 anos" }], correctAnswer: "C", justification: "A cassação da CNH tem prazo de 2 anos. Após esse período, o condutor deve refazer todo o processo de habilitação." },
  { id: "q24", moduleId: "infracoes", text: "Qual a penalidade para quem dirige sem possuir CNH?", options: [{ label: "A", text: "Multa leve" }, { label: "B", text: "Multa gravíssima multiplicada por 3" }, { label: "C", text: "Apenas advertência" }, { label: "D", text: "Multa grave" }], correctAnswer: "B", justification: "Dirigir sem possuir CNH ou permissão é infração gravíssima com fator multiplicador de 3, conforme Art. 162, I do CTB." },
  { id: "q25", moduleId: "infracoes", text: "A retenção do veículo ocorre quando:", options: [{ label: "A", text: "O veículo tem chassi adulterado" }, { label: "B", text: "O veículo pode ser regularizado no local" }, { label: "C", text: "O condutor está embriagado" }, { label: "D", text: "O veículo foi roubado" }], correctAnswer: "B", justification: "A retenção é uma medida temporária: o veículo fica retido até que a irregularidade seja sanada no próprio local." },

  // === MEIO AMBIENTE ===
  { id: "q26", moduleId: "meioambiente", text: "Qual o principal poluente emitido pelos veículos?", options: [{ label: "A", text: "Oxigênio" }, { label: "B", text: "Monóxido de carbono (CO)" }, { label: "C", text: "Nitrogênio puro" }, { label: "D", text: "Vapor de água" }], correctAnswer: "B", justification: "O monóxido de carbono (CO) é o principal poluente emitido pela queima incompleta de combustíveis fósseis nos motores dos veículos." },
  { id: "q27", moduleId: "meioambiente", text: "A distância mínima para ultrapassar um ciclista é de:", options: [{ label: "A", text: "0,5 metro" }, { label: "B", text: "1,0 metro" }, { label: "C", text: "1,5 metro" }, { label: "D", text: "2,0 metros" }], correctAnswer: "C", justification: "O CTB determina distância lateral mínima de 1,5 metro ao ultrapassar ciclistas." },
  { id: "q28", moduleId: "meioambiente", text: "Crianças com até 10 anos devem ser transportadas:", options: [{ label: "A", text: "No banco da frente com cinto" }, { label: "B", text: "No banco traseiro com dispositivo de retenção adequado" }, { label: "C", text: "Em qualquer banco" }, { label: "D", text: "No colo de um adulto" }], correctAnswer: "B", justification: "Crianças com até 10 anos devem ser transportadas no banco traseiro com dispositivo de retenção adequado à sua idade e peso." },
  { id: "q29", moduleId: "meioambiente", text: "Uma forma eficaz de reduzir a poluição veicular é:", options: [{ label: "A", text: "Acelerar bruscamente" }, { label: "B", text: "Usar combustível adulterado" }, { label: "C", text: "Manter o motor regulado e manutenção em dia" }, { label: "D", text: "Remover o catalisador" }], correctAnswer: "C", justification: "Manter o motor regulado e a manutenção em dia é a forma mais eficaz de reduzir emissões de poluentes." },

  // === PRIMEIROS SOCORROS ===
  { id: "q30", moduleId: "primeiros-socorros", text: "Ao presenciar um acidente, a primeira ação deve ser:", options: [{ label: "A", text: "Remover a vítima do veículo" }, { label: "B", text: "Sinalizar o local para proteger a cena" }, { label: "C", text: "Dar água à vítima" }, { label: "D", text: "Transportar a vítima ao hospital" }], correctAnswer: "B", justification: "A primeira ação é PROTEGER: sinalizar o local para evitar novos acidentes (triângulo, pisca-alerta). Sequência PAS: Proteger, Avisar, Socorrer." },
  { id: "q31", moduleId: "primeiros-socorros", text: "O número do SAMU é:", options: [{ label: "A", text: "190" }, { label: "B", text: "191" }, { label: "C", text: "192" }, { label: "D", text: "193" }], correctAnswer: "C", justification: "O SAMU atende pelo número 192. Bombeiros: 193, PRF: 191, Polícia Militar: 190." },
  { id: "q32", moduleId: "primeiros-socorros", text: "Em caso de hemorragia externa, deve-se:", options: [{ label: "A", text: "Aplicar torniquete imediatamente" }, { label: "B", text: "Pressionar o local com pano limpo" }, { label: "C", text: "Lavar com água corrente" }, { label: "D", text: "Remover objetos encravados" }], correctAnswer: "B", justification: "A ação correta é pressionar o local com pano limpo e manter a pressão constante até a chegada do socorro." },
  { id: "q33", moduleId: "primeiros-socorros", text: "Por que NÃO se deve remover o capacete de um motociclista acidentado?", options: [{ label: "A", text: "Porque é propriedade dele" }, { label: "B", text: "Porque pode agravar lesão cervical" }, { label: "C", text: "Porque é muito difícil de remover" }, { label: "D", text: "Porque não há necessidade" }], correctAnswer: "B", justification: "Remover o capacete pode agravar uma possível lesão na coluna cervical. Apenas profissionais treinados devem fazer isso." },
  { id: "q34", moduleId: "primeiros-socorros", text: "O estado de choque se caracteriza por:", options: [{ label: "A", text: "Pele vermelha e quente" }, { label: "B", text: "Pele pálida e fria, suor, respiração rápida" }, { label: "C", text: "Febre alta" }, { label: "D", text: "Dor de cabeça intensa" }], correctAnswer: "B", justification: "O estado de choque apresenta pele pálida e fria, sudorese, respiração rápida e superficial, e confusão mental." },

  // === MECÂNICA ===
  { id: "q35", moduleId: "mecanica", text: "A profundidade mínima legal dos sulcos dos pneus é:", options: [{ label: "A", text: "0,8 mm" }, { label: "B", text: "1,0 mm" }, { label: "C", text: "1,6 mm" }, { label: "D", text: "2,0 mm" }], correctAnswer: "C", justification: "A profundidade mínima legal dos sulcos dos pneus é de 1,6 mm. Abaixo disso, o pneu é considerado 'careca' e constitui infração grave." },
  { id: "q36", moduleId: "mecanica", text: "O sistema ABS tem a função de:", options: [{ label: "A", text: "Aumentar a potência do motor" }, { label: "B", text: "Impedir o travamento das rodas na frenagem" }, { label: "C", text: "Reduzir o consumo de combustível" }, { label: "D", text: "Melhorar a suspensão" }], correctAnswer: "B", justification: "O ABS (Anti-lock Braking System) impede que as rodas travem durante uma frenagem brusca, mantendo a capacidade de esterçar o veículo." },
  { id: "q37", moduleId: "mecanica", text: "Com que frequência deve-se verificar o nível de óleo do motor?", options: [{ label: "A", text: "Uma vez por ano" }, { label: "B", text: "A cada 6 meses" }, { label: "C", text: "Semanalmente ou antes de viagens" }, { label: "D", text: "Apenas nas revisões" }], correctAnswer: "C", justification: "O nível de óleo deve ser verificado regularmente, semanalmente ou antes de viagens longas, com o motor frio e o veículo em superfície plana." },
  { id: "q38", moduleId: "mecanica", text: "Aquaplanagem ocorre quando:", options: [{ label: "A", text: "O motor superaquece" }, { label: "B", text: "Os pneus perdem contato com o solo por camada de água" }, { label: "C", text: "Os freios falham" }, { label: "D", text: "A bateria descarrega" }], correctAnswer: "B", justification: "Aquaplanagem (hidroplanagem) ocorre quando uma camada de água se forma entre os pneus e o pavimento, fazendo o veículo perder aderência e controle." },
];

