# Modelo de dados para um catálogo automotivo confiável

O preço, a disponibilidade e os equipamentos pertencem ao **anúncio**. Autonomia, porta-malas, motorização e segurança pertencem à **versão do veículo**. Essas duas fontes não devem ser misturadas.

```json
{
  "listingId": "uuid",
  "status": "available",
  "updatedAt": "2026-09-28T12:00:00Z",
  "seller": {
    "name": "Concessionária Exemplo",
    "type": "dealer",
    "website": "https://..."
  },
  "offer": {
    "cashPrice": 99990,
    "currency": "BRL",
    "city": "São Paulo",
    "state": "SP",
    "availability": "ready_delivery"
  },
  "vehicle": {
    "make": "BYD",
    "model": "Dolphin",
    "modelYear": 2025,
    "version": "GS",
    "mileageKm": 0,
    "vinLast6": "XXXXXX"
  },
  "specification": {
    "source": "manufacturer",
    "sourceUrl": "https://...",
    "verifiedAt": "2026-09-28",
    "rangePbevKm": 291,
    "batteryKwh": 44.9,
    "trunkLiters": null,
    "safetyFeatures": []
  },
  "media": {
    "images": [],
    "videoUrls": []
  }
}
```

## Regras de produto

1. Só exibir uma especificação quando `modelYear`, `version`, fonte e data de verificação estiverem presentes.
2. Sempre separar “preço anunciado” de “preço público sugerido” e expor a data de atualização.
3. Para usados, incluir quilometragem, histórico, laudo, proprietários e situação documental com origem verificável.
4. Não inferir equipamentos pela marca ou pelo modelo: eles variam por versão e ano.
5. O Match Score é explicável e não substitui ficha, vistoria, simulação de financiamento ou confirmação de estoque.

## Fontes prioritárias

1. Estoque/API da loja para preço e disponibilidade.
2. Ficha técnica oficial do fabricante para versão e ano.
3. Inmetro para consumo/autonomia quando aplicável.
4. Laudo e histórico veicular para veículos usados.

O catálogo atual é demonstrativo; por isso, a interface mostra a fonte oficial apenas para dados de modelo que foram verificados e sinaliza quando a versão precisa ser confirmada.
