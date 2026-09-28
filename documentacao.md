# AutoMatch — documentação do case

## 1. Visão geral

O **AutoMatch** é um protótipo de busca e recomendação de veículos. Ele foi desenhado para ajudar uma pessoa que quer comprar ou trocar de carro, mas encontra uma busca imperfeita: o modelo desejado pode estar fora do orçamento, indisponível na cidade ou não ser a opção mais adequada para a rotina.

Em vez de devolver uma lista vazia ou esconder os conflitos, o produto transforma a busca em uma decisão comparável. Para cada recomendação, deixa claros o ajuste com o modelo ou categoria desejados, o impacto no orçamento e a localização do veículo.

> **Princípio do produto:** uma recomendação é apoio à decisão, não uma garantia de estoque, preço, financiamento ou qualidade mecânica.

O catálogo, os preços e a disponibilidade usados nesta entrega são demonstrativos. A aplicação sinaliza essa condição na interface e orienta a confirmação com a loja.

## 2. Problema do case

A compra de um carro combina restrições objetivas — preço, localização e disponibilidade — com necessidades difíceis de transformar em filtros, como economia, conforto, família e segurança. Catálogos convencionais são eficientes quando a pessoa já sabe exatamente qual veículo quer e há uma oferta compatível; eles ajudam menos quando algum critério não fecha.

O problema tratado é: **como ajudar a pessoa a sair de uma busca sem combinação exata e chegar a uma alternativa possível, sem ocultar os trade-offs envolvidos?**

### Objetivos da solução

- Permitir começar por uma busca livre, por filtros ou por uma jornada orientada.
- Manter a intenção da busca quando não existe correspondência perfeita.
- Mostrar uma lista curta, explicável e comparável, em vez de uma resposta binária.
- Preparar o usuário para uma conversa mais segura com a loja.
- Distinguir informação demonstrativa, atributo técnico e condição comercial.

### Fora do escopo do protótipo

- Estoque e preços em tempo real.
- Pagamento, financiamento, aprovação de crédito ou contratação.
- Inspeção mecânica, laudo veicular ou validação documental.
- Recomendação baseada em dados pessoais, histórico de navegação ou IA generativa.

Esses limites são intencionais: evitam que a experiência prometa uma precisão que os dados da demonstração não sustentam.

## 3. Pesquisa e direcionamento de UX

### Hipóteses de usuário

O produto parte de três situações principais, documentadas em mais detalhe em [docs/pesquisa-publico-alvo-automatch.md](docs/pesquisa-publico-alvo-automatch.md):

| Situação | Dor principal | Resposta no produto |
| --- | --- | --- |
| Pessoa com orçamento definido e modelo flexível | A busca não cabe no plano e não explica o que pode mudar | Ranking, diferença de preço explícita e alternativa econômica |
| Primeiro carro ou mudança de rotina | Pouca referência técnica e medo de errar | Jornada guiada com perguntas de uso, orçamento, região e prioridade |
| Pessoa interessada em elétrico | Dúvida sobre autonomia, recarga e adequação à rotina | Intenção “elétrico”, pergunta sobre recarga e fontes técnicas quando verificadas |

O público prioritário é o comprador digital de seminovo ou usado em momento ativo de compra/troca, com teto de investimento e abertura para alternativas justificadas. O recorte inicial recomendado é a região metropolitana de São Paulo, onde o catálogo de demonstração já possui maior presença e a experiência de localização pode ser validada de forma focada.

### Evidências que orientaram a experiência

A pesquisa secundária reunida no repositório aponta um mercado amplo de usados e seminovos, alta presença de internet e celular no Brasil e uma preocupação relevante com os custos de ter um carro. Isso torna importante uma experiência direta, compatível com telas menores e cuidadosa com orçamento. As fontes, datas e ressalvas estão no documento de pesquisa: [FENAUTO](https://www.fenauto.org.br/news/mercado-de-veiculos-usados-bate-recorde-historico-de-vendas), [IBGE](https://agenciadenoticias.ibge.gov.br/agencia-detalhe-de-midia.html?catid=2103&id=8205&view=mediaibge), [Serasa/Zapay](https://www.serasa.com.br/imprensa/mesmo-com-transformacoes-digitais-e-custos-crescentes-o-carro-ainda-vale-a-pena-para-dos-brasileiros-revela-pesquisa/) e [ABVE](https://abve.org.br/eletrificados-crescem-dez-vezes-mais-do-que-conjunto-do-mercado-em-2025-com-224-mil-veiculos-vendidos/).

Essas evidências não validam o produto por si só. Elas servem para formular hipóteses que devem ser testadas com pessoas compradoras reais.

### Decisões de UX e justificativas

| Decisão | Justificativa |
| --- | --- |
| Busca em linguagem natural e campos explícitos | Atende tanto quem sabe o modelo quanto quem começa por uma necessidade, sem obrigar o uso de filtros técnicos. |
| Jornada em quatro perguntas | Reduz carga cognitiva para quem não conhece veículos e permite uma orientação progressiva. |
| Três recomendações com papéis distintos | “Melhor match”, opção econômica e opção próxima evitam uma lista longa e deixam a escolha mais comparável. |
| Critérios e alertas visíveis no card | Mostram, por exemplo, se o veículo está acima do orçamento ou fora da região, preservando a autonomia do usuário. |
| Ações para ajustar a busca | Tornam explícita a concessão: aumentar o teto, ampliar região ou ver modelos semelhantes. |
| Comparação de até três veículos | Mantém o foco e permite avaliar preço, localização e compatibilidade lado a lado. |
| Fontes técnicas e checklist antes do contato | Aumentam a confiança sem tratar o protótipo como fonte definitiva de dados comerciais ou técnicos. |

### Jornada prevista

```text
Explorar catálogo ou descrever necessidade
                ↓
Informar modelo/tipo, orçamento, região e prioridade
                ↓
Ver recomendações e trade-offs explicados
                ↓
Abrir detalhes, comparar até três opções e consultar fontes
                ↓
Preparar contato com a loja com checklist de confirmação
```

### Acessibilidade e linguagem

A interface usa elementos semânticos de formulário, rótulos associados aos campos, botões com `type`, diálogos nativos e textos de apoio. O tom evita promessas como “melhor oferta” ou “pronta entrega” quando o dado não está confirmado; a comunicação preferida é concreta, como “R$ 5 mil acima do seu orçamento” e “disponibilidade a confirmar”.

## 4. Pesquisa de negócio

### Tese

O AutoMatch não pretende ser apenas outra vitrine de anúncios. Sua proposta de valor é reduzir a insegurança entre o desejo inicial e uma opção financeiramente e logisticamente possível.

O modelo inicial é **B2C de apoio à decisão**: a experiência de busca e comparação deve ser gratuita para o consumidor. Uma evolução viável é B2B para revendas, com inventário atualizado e leads consentidos, desde que a remuneração não altere a ordem de uma recomendação orgânica.

### Segmentos e prioridade

| Segmento | Valor entregue | Prioridade |
| --- | --- | --- |
| Comprador com orçamento definido e modelo flexível | Alternativas transparentes para não encerrar a busca em uma lista vazia | P0 |
| Primeiro carro ou troca por nova rotina | Tradução de necessidades em opções simples de comparar | P0 |
| Interessado em eletrificação urbana | Contexto de recarga, autonomia e fonte técnica por versão | P1 |
| Comprador já decidido por marca/modelo | Confirmação de anúncio, versão e procedência | P1 |
| Revendas e concessionárias | Leads com intenção, restrições e consentimento claros | P2 |

### Estratégia de validação

Antes de ampliar catálogo ou construir integrações, o objetivo é validar se a solução aumenta a clareza e o avanço consciente da jornada. A proposta é conduzir 12 a 15 entrevistas e pelo menos 5 testes de usabilidade com pessoas que compraram, estão comprando ou pretendem comprar um carro nos próximos seis meses.

| Hipótese | Teste | Sinal de aprendizado positivo |
| --- | --- | --- |
| Explicação gera mais valor que uma lista extensa | Comparar vitrine convencional e recomendações explicadas | Mais comparações concluídas e maior clareza declarada |
| Orçamento é a principal tensão | Testar buscas acima e abaixo do teto | Ajuste consciente de orçamento, modelo ou região |
| Jornada orientada ajuda iniciantes | Teste moderado com baixa familiaridade automotiva | Pessoa chega a uma lista curta sem ajuda externa |
| Transparência aumenta confiança | Exibir origem e data do anúncio | Aumento de confiança sem queda material no avanço |

### Métricas iniciais

- **Ativação:** sessões que concluem uma busca com pelo menos um critério.
- **Qualidade de decisão:** abertura de detalhes, comparação de dois ou três veículos e opção salva.
- **Transparência:** visualização de origem/data do anúncio antes do contato, quando esses dados existirem.
- **Conversão responsável:** contatos, visitas ou test drives confirmados sem divergência relevante de anúncio.
- **Saúde do catálogo:** taxa de anúncios atualizados, tempo de resposta da loja e divergência de preço/estoque.

## 5. Escopo implementado

O protótipo implementa:

- Catálogo de 10 veículos demonstrativos distribuídos por cidades brasileiras.
- Busca por modelo, marca, categoria, cidade e teto de preço.
- Interpretação de frases simples, como “elétrico em São Paulo até 100 mil”.
- Prioridade ajustável: equilíbrio, modelo, menor preço ou localização.
- Jornada guiada por tipo, orçamento, região, prioridade e necessidades de rotina.
- Ranking com Match Score explicável e ações de ajuste de busca.
- Filtros de catálogo por marca, tipo, localização, preço e ordenação.
- Detalhes, fontes técnicas selecionadas, comparação de até três veículos e preparação de contato por e-mail/WhatsApp.

## 6. Definição técnica

### Arquitetura escolhida

Trata-se de uma aplicação estática, sem dependências de build ou framework:

```text
index.html                 estrutura e componentes estáticos
assets/css/styles.css      apresentação visual
assets/js/app.js           interação, ranking e renderização
data/cars.json             catálogo demonstrativo
assets/images/             imagens dos veículos e da assistente
docs/                      pesquisa, decisões e evolução de dados
```

O `index.html` referencia o JavaScript e o CSS; ao iniciar, o navegador carrega `data/cars.json` com `fetch`. Por isso a aplicação deve ser executada em servidor estático, e não aberta diretamente pelo sistema de arquivos.

### Por que JavaScript puro?

Para o escopo de um case, JavaScript puro oferece a melhor relação entre entrega, legibilidade e custo operacional:

- Não exige instalação de pacotes, configuração de build ou conhecimento prévio do avaliador para executar.
- Mantém a lógica do ranking inspecionável, importante para um produto que precisa explicar recomendações.
- Separa dados, comportamento e apresentação em diretórios próprios.
- Evita introduzir complexidade de estado, roteamento e infraestrutura que não é necessária para validar a hipótese central.

Essa decisão não significa que uma aplicação de produção deva permanecer em um único arquivo JavaScript. O arquivo atual concentra cerca de 1.100 linhas; isso é aceitável para um protótipo funcional, mas seria dividido à medida que o domínio e a equipe crescessem.

### Organização e evolução de código

Em uma próxima etapa, a divisão recomendada seria:

```text
assets/js/
  data/catalog.js          carregamento e normalização do catálogo
  domain/search.js         interpretação de intenção e filtros
  domain/ranking.js        score, critérios e justificativas
  domain/vehicle.js        categorias e informações derivadas
  ui/catalog.js            cards, filtros e resultados
  ui/dialogs.js            detalhes, comparação e contato
  ui/onboarding.js         jornada guiada
  app.js                   inicialização e composição
```

Não foi feita essa fragmentação no case para evitar abstração prematura e manter a entrega direta de revisar. O limite para executá-la é o surgimento de novas fontes de dados, testes automatizados, novas telas ou múltiplas pessoas alterando o mesmo comportamento.

### Dados e modelo de confiança

O catálogo atual usa apenas `Name`, `Model`, `Image`, `Price` e `Location`. Ele é suficiente para demonstrar pesquisa, ranking e comparação, mas não é suficiente para publicar anúncios reais.

Em produção, oferta e especificação técnica devem ser entidades distintas:

| Domínio | Exemplos | Fonte preferencial |
| --- | --- | --- |
| Anúncio/oferta | preço, cidade, disponibilidade, vendedor, data de atualização | API ou estoque da loja |
| Veículo/versão | ano-modelo, versão, quilometragem, VIN parcial | fonte do anúncio e documentação verificável |
| Especificação | autonomia, bateria, consumo, porta-malas, itens de segurança | fabricante, Inmetro e fontes técnicas verificadas |

O modelo detalhado, os campos sugeridos e as regras de publicação estão em [docs/modelo-de-dados-producao.md](docs/modelo-de-dados-producao.md). A regra essencial é não inferir equipamentos pelo modelo ou marca, porque versões e anos variam.

### Busca, ranking e explicabilidade

A busca normaliza texto para lidar com acentos e interpreta modelo/marca, cidade, preço em `mil` ou `k` e categorias como elétrico, SUV, sedã e hatch. A prioridade escolhida altera o peso de intenção, localização e preço.

O Match Score é limitado entre 45 e 100 e combina:

```text
compatibilidade = intenção de modelo/tipo
                + aderência à localização
                + aderência ao orçamento
                + necessidades de rotina informadas
```

O score é uma conveniência de ordenação, não uma medida de qualidade objetiva do veículo. A interface acompanha o número com motivos legíveis, como “Modelo solicitado”, “Dentro do seu orçamento” ou “Fora da região desejada”. Quando não há match perfeito, os veículos continuam no ranking para que a pessoa enxergue e escolha conscientemente os trade-offs.

### Limitações técnicas conhecidas

- A interpretação de linguagem natural é baseada em regras simples e no catálogo carregado; não cobre sinônimos, erros complexos ou conversas abertas.
- Categorias e atributos de uso são mapeados manualmente para o catálogo demonstrativo.
- Não há persistência de preferências, sessão, comparação ou leads.
- Não há API, autenticação, observabilidade, testes automatizados ou pipeline de deploy.
- Links externos e preços devem ser revisados antes de uma publicação real.

Essas limitações são apropriadas à demonstração e deixam claro o que precisaria mudar para o produto se tornar operacional.

## 7. Como executar

Na raiz do projeto, inicie um servidor estático:

```bash
npx serve .
```

Em seguida, abra a URL exibida pelo comando. O servidor é necessário para que o navegador possa carregar `data/cars.json` via `fetch`.

## 8. Próximos passos recomendados

1. Validar a jornada com compradores reais e medir clareza, comparação e intenção de contato.
2. Substituir o catálogo demonstrativo por um modelo de anúncio com origem, data de atualização, versão, ano e dados de usados.
3. Integrar inventário de uma região piloto e estabelecer regras de qualidade de anúncio.
4. Modularizar o JavaScript e incluir testes para parser de busca, ranking e estados principais da interface.
5. Criar consentimento explícito, rastreio responsável e canal de contato com lojas.

## Referências internas

- [README.md](README.md): instruções rápidas, funcionalidades e cenários de teste.
- [docs/pesquisa-publico-alvo-automatch.md](docs/pesquisa-publico-alvo-automatch.md): pesquisa de público, negócio, hipóteses e fontes externas.
- [docs/decisoes-tecnicas.md](docs/decisoes-tecnicas.md): resumo das decisões de implementação.
- [docs/modelo-de-dados-producao.md](docs/modelo-de-dados-producao.md): evolução recomendada para dados confiáveis de catálogo.
