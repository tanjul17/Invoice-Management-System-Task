# Invoice-Management-System

A full-stack Invoice Management System with a Django REST Framework backend and
React frontend.

## Routes
```
GET - /api/invoices/
PUT - /api/invoices/:id
POST -/api/invoices/
DELETE - /api/invoices/:id
```

# Frontend

```
npm create vite@latest frontend -- --template react
cd frontend
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Configure the template in tailwind.config.js

```
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Add the Tailwind directives to your CSS

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Run the Frontend Server
```
npm run dev
```

## For Deploying, Add vercel.json in frontend folder

```
{
    "routes":[
        {
            "src":"/[^.]+",
            "dest":"/"
        }
    ]
}
```

# Backend


## Setup the backend file

### Setup the virtual environment
```
python -m venv env
.\env\scripts\activate
pip install -r requirements.txt
django-admin startproject backend
```

### Create invoices application in backend folder

```
cd backend
python manage.py startapp invoices
```
### Perform Migrations
```
python manage.py makemigrations
python manage.py migrate
```
## .ENV

### Database PostgreSQL
<p>Go to aiven Setup a free tier PostgreSQL Database -> https://aiven.io/ </p>

```
DB_NAME=""
DB_USER=""
DB_PWD=""
DB_HOST=""
DB_PORT=1212
```

### Run the local server 
```
python manage.py runserver

```
### For Deploying backend 

### Add vercel.json in backend folder
```
{
    "builds":[{
        "src":"backend/wsgi.py",
        "use":"@vercel/python",
        "config":{"maxLambda":"15mb","runtime":"python3.10.4"}
    }],
    "routes":[
        {
            "src":"/(.*)",
            "dest":"backend/wsgi.py"
        }
    ]
}
```

