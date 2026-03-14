# WalletAnalyser Admin

**WalletAnalyser Admin** is the administrative interface for managing portfolios, users, and platform data.  
The admin frontend provides full control over the system, enabling moderation, validation, and advanced management tools.

The admin frontend allows administrators to:

- 👤 Manage users (ban, role assignment, activity monitoring)  
- 📝 Review and validate user-submitted actions and ETFs  
- 🔧 Modify portfolio data, sectors, countries, and concentrations  
- 📊 Upload and manage CSV/JSON datasets for new financial instruments  
- 💳 Handle optional Stripe refunds and financial operations  
- ⚠️ Monitor critical thresholds and system alerts  
- 📈 Track crash reports and metrics for system performance  

The frontend admin is built with **React**, **Vite**, **TailwindCSS**, and **DaisyUI**, providing:

- 🏎️ A fast and responsive admin interface  
- 🧩 Modular components for easy feature expansion  
- ⚡ Optimized for efficient data management  
- 📦 CI/CD-ready architecture for Azure deployment

---

## 🏗️ Running the project locally

Install dependencies:

```shell
npm install
```

Start the development server:

```shell
npm run dev
```

The app will be available at:

```shell
http://localhost:5173
```

---

## 🧹 Linting & Formatting

ESLint (Flat Config) and Prettier are used to keep the codebase clean and consistent.

Run linting:

```shell
npm run lint
``````

Format the code before pushing:

```shell
npm run format
```

---

## 📦 Docker Support

Build the Docker image:

```shell
docker build -t walletanalyser-admin .
```

Run the container:

```shell
docker run -p 8080:8080 walletanalyser-admin
```

The production build is served via **Nginx** inside the container.

---

## ☁️ Azure Deployment (CI/CD)

The GitHub Actions workflow automatically:

1. Checks out the repository  
2. Logs into Azure  
3. Logs into the Azure Container Registry  
4. Builds the Docker image  
5. Pushes it to the registry  
6. Restarts the Azure App Service  

Terraform configuration ensures the App Service always pulls the latest image.

---

## 📄 Available Commands

`npm install`  
`npm run dev`  
`npm run build`  
`npm run preview`  
`npm run lint`  
`npm run format`
