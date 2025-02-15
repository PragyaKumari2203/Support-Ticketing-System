# Support Ticket System

A role-based support ticket management system built using **React, Firebase Authentication, and Firestore**.

## 🚀 Live Demo

[\[[Click here to access the deployed app](https://support-ticketing-system-e0647.web.app/dashboard)\]]


## 🔑 Authentication Credentials

### Customer:

- ✉️ Email: `customer@support.com`
- 🔑 Password: `customer123`

### Agent:

- ✉️ Email: `agent@support.com`
- 🔑 Password: `agent123`

## 📌 Features

- 🔹 **Firebase Authentication** (Sign Up, Login, Logout)
- 🔹 **Role-Based Access**
  - Customers can **raise, view, and delete** their own tickets.
  - Support agents can **view all tickets, update status, and assign tickets.**
- 🔹 **Firestore Database Integration** (Real-time Ticket Storage)
- 🔹 **Responsive UI** 
- 🔹 **Form Validations** (Required Fields, Email & Phone Validation, File Upload)

## 📜 Project Structure

/support-ticket-system
│── public
│── src
│   ├── components
│   │   ├── ticketForm.js  
│   │   ├── dashboard.js  
│   │   ├── welcome.js    
│   │   ├── login.js        
│   ├── firebase.js     
│   ├── App.js            
│── package.json          
│── README.md  

## 🚀 Deployment

You can deploy the project using **Firebase Hosting, Vercel, or Netlify**.

### Deploy on Firebase

npm run build
firebase deploy

