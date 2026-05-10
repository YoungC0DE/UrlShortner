# 🔗 Encurtador de URL (uLnk)

<img width="720" height="684" alt="image" src="https://github.com/user-attachments/assets/9b289422-cfd1-4c37-9945-6af5b69181a3" />

Projeto simples: uma **API em Node** (Fastify + MongoDB) e uma **página estática** para encurtar links.

---

## ✨ O que você ganha

- 🚀 **API em produção:** [https://ulnk.com.br](https://ulnk.com.br)
- 📱 **Frontend leve:** HTML, CSS e JS — sem bundler
- 🔒 URLs válidas só com **http** ou **https** (parâmetros de query, tipo UTM, são mantidos)

---

## 📋 Pré-requisitos

| Item | Para quê |
|------|-----------|
| [Node.js](https://nodejs.org/) | Rodar o backend |
| [MongoDB](https://www.mongodb.com/) | Armazenar os links (local ou Atlas) |

---

## 🖥️ Backend

📂 Pasta: **`Backend`**

### ⚙️ Configuração rápida

1. Copie o exemplo de ambiente:
   - PowerShell: `Copy-Item Backend\.env-example Backend\.env`
2. Ajuste **`Backend/.env`** (porta, MongoDB, limites).

### 🔑 Variáveis principais

| Variável | O que faz |
|----------|-----------|
| `PORT` | Porta HTTP (padrão: `3000`) |
| `MONGO_URL` | URI de conexão do MongoDB |
| `MONGO_DATABASE` | Nome do banco |
| `TRUST_PROXY` | `true` atrás de proxy reverso (IP correto no rate limit) |
| `RATE_LIMIT_MAX` | Máx. de `POST /shorten` por IP na janela |
| `RATE_LIMIT_TIME_WINDOW_MS` | Tamanho da janela em ms |
| `CORS_ENABLED` | `false` desliga CORS (`true` se o front for de outra origem) |

### ▶️ Rodar em desenvolvimento

```bash
cd Backend
npm install
npm run dev
```

### 🚢 Produção

```bash
npm run build
npm start
```

### 📡 Endpoints

| Método | Caminho | Descrição |
|--------|---------|-----------|
| `POST` | `/shorten` | Body JSON: `{ "url": "https://..." }` → resposta: `{ "code", "short_url" }` |
| `GET` | `/:code` | Redireciona para a URL original |

**Erros comuns:** corpo ou URL inválidos (`400`), código desconhecido (`404`), rate limit (`429`).

---

## 🌐 Frontend

📂 Pasta: **`Frontend`**

O app já usa a API oficial **`https://ulnk.com.br`** (meta `api-base` em `Frontend/index.html`).

Para testar **só o front** contra produção, basta abrir a pasta com um servidor estático:

```bash
npx --yes serve Frontend -l 5173
```

Abra no navegador a URL que o comando mostrar (ex.: `http://localhost:5173`).

### 🔧 API local durante o desenvolvimento

Se o backend estiver em outra URL (ex.: `http://localhost:3000`), altere o atributo em `Frontend/index.html`:

```html
<meta name="api-base" content="http://localhost:3000" />
```

Com origens diferentes (front na porta 5173, API na 3000), mantenha **`CORS_ENABLED=true`** no backend.

---

## 📄 Licença / uso

Use e adapte como preferir no seu projeto pessoal.
