# Vision API

Protegida por rate limit simples.

## POST /api/vision/frame
Envia quadro em base64 para análise.

**Body**
```json
{
  "imageBase64": "<dados-base64>"
}
```

**Resposta**
```json
{
  "success": true,
  "data": {
    "summary": "Vision core placeholder response. Future headset stream will be analyzed here.",
    "received": "<primeiros 32 chars>"
  }
}
```
