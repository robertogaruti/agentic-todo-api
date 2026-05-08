# Agentic Todo API

API REST in TypeScript per la gestione di task autenticati con categorie personalizzate, priorita e filtri combinati.

## Requisiti

- Node.js 20+
- npm 10+

## Avvio

```bash
npm install
npm run build
npm test
npm run dev
```

Per chiamare gli endpoint protetti serve configurare `JWT_SECRET` e inviare un JWT Bearer con claim `sub` valorizzato con l'UUID dell'utente. Il server verifica anche `issuer` e `audience` del token.

Esempio rapido per ambiente locale:

```bash
set JWT_SECRET=local-dev-secret-change-me
set JWT_ISSUER=agentic-todo-api
set JWT_AUDIENCE=agentic-todo-api-users
node -e "const jwt=require('jsonwebtoken'); console.log(jwt.sign({sub:'11111111-1111-4111-8111-111111111111'}, process.env.JWT_SECRET, {expiresIn:'1h', issuer: process.env.JWT_ISSUER, audience: process.env.JWT_AUDIENCE, algorithm:'HS256'}))"
```

## Endpoints

### Categorie

- `GET /api/categories` restituisce le categorie dell'utente autenticato.
- `POST /api/categories` crea una categoria personalizzata.
- `PATCH /api/categories/:id` rinomina una categoria esistente.
- `DELETE /api/categories/:id` elimina una categoria e scollega i task associati dell'utente.

Body esempio:

```json
{
  "name": "Lavoro"
}
```

### Todo

- `GET /api/todos` supporta i filtri opzionali `completed`, `priority`, `categoryId`.
- `POST /api/todos` crea un task con priorita opzionale e categoria opzionale.
- `PATCH /api/todos/:id` aggiorna titolo, descrizione, completamento, priorita o categoria.

Body esempio creazione:

```json
{
  "title": "Preparare la retro",
  "description": "Raccogliere feedback del team",
  "priority": "high",
  "categoryId": "33333333-3333-4333-8333-333333333333"
}
```

Esempio filtri combinati:

```text
GET /api/todos?completed=false&priority=high&categoryId=33333333-3333-4333-8333-333333333333
```

## Modello dati

### Category

```json
{
  "id": "0f9a78a7-9ec4-432d-bbe9-33b43f0aeed0",
  "name": "Lavoro",
  "createdAt": "2026-05-08T08:00:00.000Z",
  "updatedAt": "2026-05-08T08:00:00.000Z"
}
```

### Todo

```json
{
  "id": "34de02e2-9b57-48a1-a4b6-0b7e6a49dba5",
  "title": "Preparare la retro",
  "description": "Raccogliere feedback del team",
  "completed": false,
  "priority": "high",
  "categoryId": "33333333-3333-4333-8333-333333333333",
  "createdAt": "2026-05-08T08:00:00.000Z",
  "updatedAt": "2026-05-08T08:00:00.000Z"
}
```

## Errori principali

- `400` input, parametri o query invalidi
- `401` token mancante, non valido o scaduto
- `403` non usato: le risorse fuori scope utente vengono mascherate come non trovate
- `404` todo o categoria non trovati nel perimetro dell'utente autenticato
- `409` categoria duplicata per lo stesso utente

La specifica OpenAPI aggiornata e disponibile in `openapi.yaml`.
