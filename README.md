# AutoMatch

Buscador inteligente de veículos que transforma uma busca sem correspondência exata em uma decisão possível.

**Aplicação publicada:** [buscadordecar.netlify.app](https://buscadordecar.netlify.app/)

Para o racional do case, pesquisa, escopo e decisões de arquitetura, consulte a [documentação completa](documentacao.md).

## Executar

O projeto não tem dependências. Inicie um servidor estático na raiz:

```bash
npx serve .
```

Abra a URL exibida. O servidor é necessário porque o catálogo é carregado de `data/cars.json` via `fetch`.

## O que foi implementado

- Busca por modelo, localização e teto de preço, inclusive por linguagem natural.
- Preferência editável de ranking: equilíbrio, modelo, menor preço ou localização.
- Interpretação de intenções como `elétrico`, `SUV`, cidades e valores em `mil`/`k`.
- Motor de Match Score que pondera modelo/tipo, preço e localização e mantém todos os veículos elegíveis ao ranking.
- Três recomendações explicáveis: melhor correspondência, opção econômica e opção próxima.
- Ações rápidas para aumentar o orçamento, ampliar a região ou explorar alternativas.
- Página de detalhes em modal, com os motivos da recomendação.
- Comparador de até três veículos.
- Layout responsivo, sem dependências externas além das fontes.

## Dados e confiança

Os preços e a disponibilidade do JSON são demonstrativos. A interface diferencia esses anúncios de dados técnicos do modelo e aponta a fonte oficial quando ela está verificada. A proposta de modelo para integrar estoque real está na [documentação completa](documentacao.md#dados-e-modelo-de-confiança).

## Cenários para testar

| Busca | Resultado esperado |
| --- | --- |
| `BYD Dolphin em São Paulo até 100 mil` | Dolphin recebe a maior compatibilidade e aparece como match principal. |
| `Toyota Corolla até 100 mil` | Corolla permanece visível, com explicação de orçamento excedido. |
| `Honda Civic em São Paulo` | Civic é recomendado mesmo estando no Rio; alternativas de São Paulo continuam disponíveis. |
| `elétrico perto de São Paulo por 100 mil` | O motor considera os elétricos disponíveis e explica preço/localização. |
