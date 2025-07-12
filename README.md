# 🌐 Social Media Web Application

This is a full-stack **Social Media Web App** built with:

* 🧹 **Frontend**: React + Vite
* 🔧 **Backend**: Django REST Framework
* 📂 **Database**: PostgreSQL
* 🧪 **API Testing**: Postman
* 📧 **Email OTP (SMTP)**: Mailtrap

## ✨ Features

* 🔐 **User Signup with OTP verification** (via Email using SMTP)
* ✅ **JWT-based Login/Logout**
* ↻ **Forgot Password with OTP and secure reset**
* 📝 **Create, Read, Update, and Delete (CRUD)** posts/blogs
* 🗒️ **Each post includes title, content, tags, reactions, timestamp, and author**
* 🖼️ **Modern and responsive UI using Bootstrap**
* ⚙️ **Session handling & error management**
* 🛠️ Full integration with backend API (GET, POST, PUT, DELETE)

---

## 🚀 Tech Stack

| Layer       | Tech                           |
| ----------- | ------------------------------ |
| Frontend    | React + Vite + Bootstrap       |
| Backend     | Django + Django REST Framework |
| Database    | PostgreSQL                     |
| Auth        | JWT (Simple JWT)               |
| OTP Email   | Mailtrap SMTP                  |
| API Testing | Postman                        |

---

## 🔐 Authentication Flow

* User registers with First Name, Last Name, Email, Password.
* Backend validates email format using **regex** and sends a **6-digit OTP** (valid for 10 minutes).
* User submits the OTP to complete registration.
* On login, JWT token is issued and saved on frontend (in memory/localStorage).
* Forgot Password allows sending OTP to email and updating password securely.

---

## 📌 Post Functionality

* Authenticated users can:

  * ✍️ **Create new posts**
  * ↻ **Edit existing posts**
  * 🗑️ **Delete posts**
  * 📜 **View list of all posts**
* Each post is linked to its author and updates `created_at` & `updated_at` timestamps.
* All actions are synced with PostgreSQL DB.

---

## 📁 Folder Structure (Simplified)

```
Frontend/
├── components/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── CreatePost.jsx
│   ├── Post.jsx
│   ├── PostList.jsx
│   ├── OtpForm.jsx
│   ├── ForgotPassword.jsx
│   └── ResetPassword.jsx
├── App.jsx
├── store/
│   └── Post-list-store1.js
└── main.jsx

Backend/
├── api/
│   ├── views.py
│   ├── models.py
│   ├── serializers.py
│   └── urls.py
├── Social_Media/
│   ├── settings.py
│   └── urls.py
└── manage.py
```

---

## 🚠 Setup Instructions

### 1. Backend (Django + PostgreSQL)

```bash
cd Backend/Social_Media
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

> Make sure PostgreSQL is running and configured in `settings.py`

### 2. Frontend (React + Vite)

```bash
cd Frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Django `.env` or `settings.py`

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'sandbox.smtp.mailtrap.io'
EMAIL_PORT = 2525
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your_mailtrap_user'
EMAIL_HOST_PASSWORD = 'your_mailtrap_password'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'socialmedia',
        'USER': 'socialuser',
        'PASSWORD': 'yourpassword',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

---

## 🥺 API Testing (Postman)

* Test endpoints like:

  * `POST /api/request-signup/`
  * `POST /api/verify-otp/`
  * `POST /api/login/`
  * `POST /api/request-password-reset/`
  * `POST /api/reset-password/`
  * `GET/POST /api/posts/`

All endpoints return JSON responses and require Bearer tokens after login.

---

## 🧠 Learnings

* Integration of **email-based OTP verification**
* Handling **JWT tokens and protected routes** in React
* Secure password reset workflow
* Building reusable API endpoints with Django REST Framework
* Real-time state management with **React Context API**

---

## 📷 UI Preview

> *(Add screenshots here)*

---

## 📨 Contact

For feedback or queries:

* 🧑‍💻 Developer: **Pankaj Verma**
* 📧 Email: *[pankajv91505@gmail.com]

---

## 📄 License

This project is licensed under the MIT License.
