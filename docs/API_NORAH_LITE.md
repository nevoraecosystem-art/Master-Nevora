# Norah Lite

JWT obrigatório.

## POST /api/norah/lite/chat
Envia prompt para a Norah Lite.

**Body**
```json
{
  "prompt": "Olá, Norah!"
}
```

**Resposta**
```json
{
  "success": true,
  "data": { "response": "Norah lite reply to <user>: ..." }
}
```
