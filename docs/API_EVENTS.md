# Eventos

Todas as rotas requerem JWT.

## POST /api/events
Cria evento (apenas PRODUCER ou FOUNDER).

**Body**
```json
{
  "title": "Show Nevora",
  "description": "Experiência imersiva",
  "basePrice": 150
}
```

## GET /api/events
Lista eventos com produtor e analytics básicos.

## GET /api/events/:id
Detalhes de um evento específico.

## POST /api/events/:id/buy
Compra um ticket usando o usuário autenticado.

**Resposta**
```json
{
  "success": true,
  "data": { "id": "ticket-id", "eventId": "...", "buyerId": "...", "pricePaid": 150 }
}
```

## GET /api/events/:id/analytics
Apenas produtor do evento ou fundador.

**Resposta**
```json
{
  "success": true,
  "data": { "views": 0, "ticketsSold": 1, "revenue": 150 }
}
```
