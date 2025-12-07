# Founder Mode

Rota protegida por token especial.

## POST /api/founder/command

Header obrigatório:
```
x-founder-token: "SOU FUNDADOR <token>"
```

**Body**
```json
{
  "command": "iniciar-scan"
}
```

**Resposta**
```json
{
  "success": true,
  "data": { "accepted": true, "command": "iniciar-scan" }
}
```
