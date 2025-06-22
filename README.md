# Taskify.nt 🗂️📝

**Taskify.nt** is a modern and lightweight task and notes manager built with **React.js** and **TypeScript**. It helps users create, organize, and manage tasks and notes efficiently, storing all data locally in the browser using `localStorage`.

---

## 🚀 Features

- 📁 Folder-based organization for tasks and notes
- ✅ Create, update, delete, and mark tasks as complete
- 🗒️ Rich-text notes editor powered by **Quill.js**
- 📅 Integrated calendar with **react-calendar**
- 📊 Visual analytics using **Recharts**
- 🔔 Toast notifications for actions using **react-hot-toast**
- 🔀 Page navigation with **React Router v7**
- 💾 Persistent data using browser `localStorage`
- 🧩 Unique IDs with **uuid**
- 🎨 Custom SCSS styling

### 📦 Packages Used

| Package            | Description                          |
| ------------------ | ------------------------------------ |
| `react`            | Core React library                   |
| `react-dom`        | DOM bindings for React               |
| `react-router-dom` | Routing library (v7)                 |
| `react-calendar`   | Calendar component                   |
| `react-hot-toast`  | Beautiful toast notifications        |
| `recharts`         | Charting library for visual insights |
| `quill`            | Rich-text editor                     |
| `uuid`             | Unique ID generation                 |
| `sass`             | CSS preprocessor                     |

---

## 📂 Project Structures

```bash
src/
├── assets/
├── components/
├── constants/
├── context/
├── interface/
├── pages/
├── styles/
├── index.css
├── App.tsx
└── main.tsx
```

## 💾 Data Persistence

All user data—tasks, notes, folders—is saved in the browser via `localStorage`. No backend or external APIs are used.

> 🛑 Clearing browser storage will remove all saved data.

---

## 🧪 Getting Started

### 📥 Install

```bash
git clone https://github.com/Mahmoud46/taskify-note.git
cd taskify-note
npm install
```

### 🚀 Run in Dev Mode

```bash
npm run dev
```

## Demo

[Demo](https://taskify-note.vercel.app/)

## 👨‍💻 Author

Made with ❤️ by Mahmoud Zakaria
