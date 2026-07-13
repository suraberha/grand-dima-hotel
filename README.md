# Grand Dima Hotel — Full Website (Frontend + Backend + Owner Dashboard)

Hi! This README walks you through running your project like a tutorial —
step by step, no assumptions.

## What you got

- **`frontend/`** — the public website (Home, Menu, About, Reservation, Contact)
- **`backend/`** — the Node.js server that stores reservations, orders, and messages
- **`admin/`** — the owner's private dashboard (protected by login)

The frontend talks to the backend using `fetch()` calls to a small API
(e.g. `POST /api/reservations`). The backend saves everything into simple
`.json` files inside `backend/data/` — open them anytime in a text editor
to see the raw data.

## 1. Install Node.js (skip if you already have it)

Download and install from https://nodejs.org (the LTS version). To check
it worked, open a terminal and run:

```bash
node -v
npm -v
```

## 2. Install the backend's packages

```bash
cd grand-dima-hotel/backend
npm install
```

This reads `package.json` and downloads Express and the other small
libraries the server needs, into a `node_modules` folder.

## 3. Create your `.env` file

The server reads secret settings (like the admin password) from a file
called `.env`, which is NOT included on purpose (so you never accidentally
share your real password). Copy the example:

```bash
cp .env.example .env
```

Then open `.env` in your editor and set your own admin username/password.

## 4. Start the server

```bash
npm start
```

You should see:

```
Grand Dima Hotel server running!
Website:  http://localhost:3000
Admin:    http://localhost:3000/admin/login.html
```

- Visit **http://localhost:3000** → the guest-facing website
- Visit **http://localhost:3000/admin/login.html** → the owner dashboard
  (log in with the username/password you set in `.env`)

That's it — one server, serving both the website and the dashboard.

## 5. Add real photos

Right now the site uses stock photos from Unsplash (linked directly, so
they load automatically). To use your own:

1. Save your photos into `frontend/images/`
2. In `backend/data/menu.json`, change each `"image"` value to
   `"images/your-photo.jpg"`
3. Do the same for the room photos inside `frontend/index.html`

## 6. How each page talks to the backend

| Page | Sends data to | What happens |
|---|---|---|
| Menu (order) | `POST /api/orders` | Saves the order, returns an order ID |
| Reservation | `POST /api/reservations` | Saves the booking, returns a `GD-XXXXXX` reference ID |
| Contact | `POST /api/contact` | Saves the message |
| Admin Dashboard | `GET /api/reservations`, `/api/orders`, `/api/contact` | Only works if logged in as admin |

## 7. Editing the menu

Open `backend/data/menu.json` — it's a plain list. Add, remove, or edit
items directly; the Menu page reloads them automatically, no code changes
needed.

## 8. Putting this online (when you're ready)

This currently only runs on your own computer (`localhost`). To make it
public, you'd deploy the `backend` folder (which also serves the frontend
and admin folders) to a Node.js hosting service — for example Render,
Railway, or a VPS. That's a bigger step, so ask me when you're ready and
I'll walk you through it too.

## Troubleshooting

- **"Cannot find module 'express'"** → you skipped `npm install`, run it inside `backend/`.
- **Page loads but forms don't work** → the backend server isn't running, or you opened the HTML file directly (double-clicked it) instead of visiting `http://localhost:3000`. The website MUST be visited through the server URL, not opened as a local file, or the `fetch()` calls will fail.
- **Admin login says "incorrect password"** → check `backend/.env` matches what you're typing.
