# Campus Lost & Found

A simple 3-tier web app where students can post items they've **lost** or **found**
on campus, browse open posts, and mark them as **claimed** once resolved.

---

## Project spec (the "prompt")

If you ever want to regenerate or extend this with an AI tool, here's the
complete spec to give it:

> Build a 3-tier "Campus Lost & Found" web application.
>
> **Frontend:** React (Vite), with React Router. Three pages:
> 1. Item List — shows all posts, filterable by Lost / Found / All. Each card
>    shows title, type badge, category, location, date, and (if open) buttons
>    to mark as claimed or delete.
> 2. Add Item — a form to post a new lost or found item: type, title,
>    description, category, location, contact info.
> 3. Item Detail — full view of a single item with the same actions.
>
> All API calls go through axios to a `/api` base path.
>
> **Backend:** Node.js + Express REST API with 5 routes under `/api/items`:
> `GET /` (list, supports `?type=` and `?status=` filters), `GET /:id`,
> `POST /`, `PUT /:id`, `DELETE /:id`. Plus a `GET /api/health` route.
> Uses `mysql2` with a connection pool, config via environment variables.
>
> **Database:** MySQL, single `items` table: id, type (enum lost/found),
> title, description, category, location, contact_info,
> status (enum open/claimed, default open), created_at.

---

## Folder structure

```
lostfound-app/
├── backend/
│   ├── src/
│   │   ├── db.js              # MySQL connection pool
│   │   ├── index.js           # Express app entrypoint
│   │   └── routes/
│   │       └── items.js       # All 5 REST routes
│   ├── package.json
│   ├── .gitignore
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── items.js       # All axios calls in one place
│   │   ├── pages/
│   │   │   ├── ItemList.jsx
│   │   │   ├── AddItem.jsx
│   │   │   └── ItemDetail.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js         # dev proxy: /api -> localhost:5000
│   └── .gitignore
├── db/
│   └── schema.sql              # CREATE TABLE + sample rows
├── .gitignore
└── README.md
```

---

## Run it locally

**1. Database**
```bash
mysql -u root -p < db/schema.sql
```

**2. Backend**
```bash
cd backend
cp .env.example .env     # edit DB_PASSWORD to match your MySQL setup
npm install
npm run dev
# -> Lost & Found API running on port 5000
curl http://localhost:5000/api/health   # {"status":"ok"}
```

**3. Frontend**
```bash
cd frontend
npm install
npm run dev
# -> open http://localhost:5173
```

That's it — browse, post, claim, and delete items at `http://localhost:5173`.
