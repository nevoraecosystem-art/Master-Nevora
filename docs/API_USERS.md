# Usuários

Autenticação necessária (JWT).

## GET /api/users/me
Retorna perfil e carteira resumida do usuário logado.

**Resposta**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "...",
    "role": "CLIENT",
    "wallet": { "id": "...", "balanceNEV": 0 }
  }
}
```

## GET /api/users/me/wallet
Detalhes completos da carteira e transações.

**Resposta**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "balanceNEV": 0,
    "transactions": [
      { "id": "...", "amount": 10, "type": "CREDIT", "description": "Recebimento" }
    ]
  }
}
```
