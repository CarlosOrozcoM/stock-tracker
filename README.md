# 🌸 Kawaii Stock Tracker 🌸

A charming and cute application to track your favorite stock prices in real-time! 📈✨

<img width="1278" height="791" alt="image" src="https://github.com/user-attachments/assets/5e7c97b7-3917-478b-a0bf-3163a72ea6fb" />

[🔴 Live Demo / Portfolio] (https://carlosorozcom.github.io/stock-tracker/)

## ✨ Features
- **Real-time Pricing:** Uses the Finnhub API to fetch live stock prices.
- **Custom Limits:** Set minimum and maximum limits so the app can alert you with notifications.
- **Kawaii Design:** A friendly, colorful, and easy-to-use interface powered by TailwindCSS and kawaii animations.
- **Local Storage:** Your saved stocks aren't lost when you reload the page.

## 🛠 Tech Stack
- [React (Vite)](https://vitejs.dev/) - fast frontend framework.
- [TypeScript](https://www.typescriptlang.org/) - Strongly typed JavaScript.
- [TailwindCSS v4](https://tailwindcss.com/) - Utility-first CSS framework for responsive design.
- [Motion (Framer Motion)](https://motion.dev/) - Fluid and delightful animations.
- [Finnhub API](https://finnhub.io/) - Real-time financial data.

## 🚀 Running Locally

**Prerequisites:** Node.js (v18+)

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Run the application:
   ```bash
   npm run dev
   ```

*Note: The application uses a public API key for demonstration purposes. For real-world usage, it is recommended to create your own API key at [finnhub.io](https://finnhub.io).*

## 🌐 Deployment

### Vercel (Recommended)
Vercel has "Zero-config" support for Vite and React projects.
1. Push this repository to your GitHub account.
2. Log in to [Vercel](https://vercel.com/) and import your repository.
3. The `Framework Preset` will be automatically detected as **Vite**.
4. Click **Deploy**. You're done! 🚀

### GitHub Pages
To deploy on GitHub Pages, you'll need one additional step:
1. Install `gh-pages` if you haven't already: `npm install -D gh-pages`
2. In `package.json`, add `"homepage": "https://<your-username>.github.io/<your-repo-name>"`
3. Modify your `vite.config.ts` file to add a `base` parameter:
   ```ts
   export default defineConfig(({mode}) => {
     return {
       // This base path must exactly match your GitHub repository name:
       base: '/stock-tracker/', 
       plugins: [react(), tailwindcss()],
       // ...
     };
   });
   ```
4. Commit and push your changes, then enable GitHub Pages in your repository settings using the branch where your static files are built, or by using GitHub Actions (Vite provides a [quick guide for GitHub Actions](https://vitejs.dev/guide/static-deploy.html#github-pages)).


## 📬 Contact
- **Name:** Carlos Orozco
- **Role:** Front-End Developer
- [LinkedIn](https://www.linkedin.com/in/alberto-orozco-m/)
- [Github](https://github.com/CarlosOrozcoM)

