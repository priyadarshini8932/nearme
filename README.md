# NearMe Restaurant

Next.js + Tailwind frontend, Node/Express backend, MongoDB Atlas.

## Run locally
```bash
# 1. backend
cd backend
copy .env.example .env      # Mac/Linux: cp .env.example .env  -> then put your MONGO_URI in .env
npm install
npm run seed
npm run dev                 # http://localhost:5000

# 2. frontend (second terminal)
cd frontend
copy .env.local.example .env.local
npm install
npm run dev                 # http://localhost:3000
```


