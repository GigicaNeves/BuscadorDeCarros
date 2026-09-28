# Decisões técnicas

O projeto é uma aplicação estática em HTML, CSS e JavaScript puro. Essa escolha torna a entrega leve, direta de executar e suficiente para a experiência proposta, sem exigir instalação de pacotes.

Os dados são carregados de `data/cars.json`; assim, a busca sempre usa a base fornecida e o front-end não replica a fonte de verdade. A imagem de apresentação fica em `assets/images/` e o estilo e o comportamento ficam separados em `assets/css/` e `assets/js/`.

## Busca e recomendações

A interface aceita filtros explícitos de veículo, cidade e valor, além de frases simples como “BYD Dolphin em São Paulo até 100 mil”. Quando não há uma combinação exata, a aplicação preserva a intenção da pessoa: mostra o mesmo modelo em outra cidade, o modelo um pouco acima do teto informado, ou alternativas da mesma região e faixa de preço.
