<div align="center">
  <h1>🚀 DevOra</h1>
  <p><strong>A modern, fully-featured tech problem asking community platform built with Next.js and Appwrite.</strong></p>

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://appwrite.io/"><img src="https://img.shields.io/badge/Appwrite-25.2-FD366E?style=for-the-badge&logo=appwrite&logoColor=white" alt="Appwrite" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  </p>
</div>

<br />

Welcome to **DevOra**, a highly interactive and responsive Question & Answer platform inspired by StackOverflow. This project leverages the power of Next.js for seamless server-side rendering and static generation, paired with Appwrite for a robust, secure, and scalable backend.

## ✨ Features

- 🔐 **Secure Authentication**: User sign-up, log-in, and session management powered by Appwrite Auth.
- 📝 **Rich Text Markdown**: Ask and answer questions with full Markdown support using `@uiw/react-md-editor`.
- 🗳️ **Voting System**: Upvote and downvote questions and answers just like the real deal.
- 💬 **Interactive Comments**: Engage in discussions with threaded comments.
- 🔍 **Search & Filtering**: Easily find the answers you're looking for.
- 🎨 **Beautiful UI**: Designed with Tailwind CSS, Framer Motion, and MagicUI for a modern, responsive, and animated user experience.
- 🌗 **Dark Mode**: Built-in support for dark and light themes.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), [Tabler Icons](https://tabler-icons.io/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/), [Tailwindcss Animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)

### Backend (BaaS)
- **Database & Auth**: [Appwrite](https://appwrite.io/) (Node & Web SDKs)

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/en/download/) (v16.14.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- An [Appwrite](https://appwrite.io/) instance (Cloud or Self-Hosted)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/DevOra-appwrite.git
cd DevOra-appwrite
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up Environment Variables

Create a `.env` file in the root directory based on the provided `.env.sample` file:

```env
NEXT_PUBLIC_APPWRITE_HOST_URL=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
```

*Note: You will need to create a project in your Appwrite console and generate an API key with the necessary scopes (Database, Users, Storage).*

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🏗️ Extending the Project

This platform is designed to be easily extensible. You can:
- Add new Appwrite collections for tags, badges, or user reputations.
- Implement real-time updates using Appwrite's Realtime API.
- Add AI-powered features like auto-tagging or answer summaries.

The codebase is well-commented and structured logically to help you customize it to your needs!

## 🎓 Acknowledgements

- Inspiration drawn from [StackOverflow](https://stackoverflow.com/).
- Check out the full YouTube tutorial for building this project by [Hitesh Choudhary](https://www.youtube.com/@HiteshChoudharydotcom).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.