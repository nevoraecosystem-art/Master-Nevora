# Autenticação

## POST /api/auth/register
Cria um usuário e carteira inicial.

**Body**
```json
{
  "email": "user@example.com",
  "password": "SenhaForte123",
  "name": "Nome Opcional",
  "role": "CLIENT" | "PRODUCER" | "AMBASSADOR"
}
```

**Resposta**
```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "user": { "id": "...", "email": "...", "role": "CLIENT" }
  }
}
```

## POST /api/auth/login
Autentica e retorna um JWT.

**Body**
```json
{
  "email": "user@example.com",
  "password": "SenhaForte123"
}
```

**Resposta** igual ao register.

## Formato do JWT
Header `Authorization: Bearer <token>`

Payload exemplo:
```json
{
  "id": "user-id",
  "role": "CLIENT",
  "iat": 1710000000,
  "exp": 1710600000
}
```
