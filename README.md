# 📊 Excel Data Analyzer

_A full-stack web application that allows users to upload Excel files, analyze data through dynamic charts, and manage their analysis history. The app includes secure authentication with email verification and password reset, along with a dedicated admin dashboard._

---
## 🚀 Features

- 🗂 _Upload `.xls` or `.xlsx` Excel files_ 
- 📈 _Generate interactive 2D charts (Bar, Line, Pie, Doughnut)_  
- 📥 _Download charts as PNG or PDF_  
- 📂 _Preview uploaded file data_  
- 📌 _Maintain history of uploads and saved charts_  
- 🧑‍💼 _Admin dashboard to manage all users, charts, and files_  
- 🔒 _Email verification & OTP-based password reset_  
- 🧹 _Auto-delete associated charts if a file is deleted_ 

---

## 🔧 Tools and Technologies

**_Frontend_**
- _React.js + Vite_  
- _Tailwind CSS_  
- _Chart.js_  
- _React Toastify_  
- _Axios_  

**_Backend_**
- _Node.js + Express.js_  
- _MongoDB + Mongoose_  
- _Nodemailer (Brevo SMTP for email)_  
- _JWT Authentication_  
- _Multer for file uploads_  

---
## 📁 Project Structure

**_Client (Frontend)_**  
- `src/` — _React components, pages, context API, and styling_  
- `public/` — _Public assets and index.html_  
- `.env` — _Frontend environment variables_  
- `package.json` — _Frontend dependencies and scripts_  

**Server (Backend)_**  
- `controller/` — _Route handlers for auth, charts, excel operations_  
- `middleware/` — _Authentication, Upload middlewares_  
- `models/` — _Mongoose models (User, File, Chart)_  
- `routes/` — _API routes definitions_  
- `uploads/` — _Temporarily stored uploaded Excel files_  
- `.env` — _Backend environment variables (Mongo URI, SMTP, JWT secret)_  
- `server.js` — _Entry point of backend_  
---


## 🌱Enviroment variable
_Set up the following .env files in your project before running it locally._

### 🔐 Backend .env (/server/.env)
```bash
PORT=4001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/
JWT_SECRET=<your_jwt_secret>
NODE_ENV=development

# SMTP (for email verification & password reset)
SMTP_USER=<your_brevo_smtp_user>
SMTP_PASS=<your_brevo_smtp_password>
SENDER_EMAIL=<your_verified_email@example.com>
```


### 🌐 Frontend .env (/client/.env)
```bash
VITE_BACKEND_URL=http://localhost:4001
```
## 🧪 How to Run the Project Locally

_Follow these steps to get the project up and running on your local machine._

### ✅ Prerequisites

_Make sure the following are installed:_

- _**Node.js** (v16 or later)_
- _**MongoDB** (Atlas or local instance)_
- _**VS Code** (or any preferred editor)_

---

## 🔧 Setup Backend

_**Navigate to the backend folder:**_

```bash
cd server
```


_**Install backend dependencies:**_
```bash
npm install
```


 _**Create a .env file inside /server and add the environment variables as mentioned above.**_

**_Start the backend server:_**
```bash
npm run server
```
_The backend will run on http://localhost:4001._




## 💻 Setup Frontend

_**Open a new terminal and navigate to the frontend folder:**_
```bash
cd client
```

**_Install frontend dependencies:_**
``` bash 
npm install
```


**_Create a .env file inside /client and add:_**
```bash
VITE_BACKEND_URL=http://localhost:4001
```

**_Start the frontend:_**
```bash
npm run dev
```
_The frontend will run on http://localhost:5173._


### ✅ _Now visit http://localhost:5173 to explore the Excel Data Analyzer app!_
## 🙌 Contributions
_This project is open to improvements. If you'd like to contribute, feel free to fork it and raise a PR._

