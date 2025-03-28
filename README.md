# CESIUM_CJS-Emissions-Calculator Setup Guide

Follow the steps below to set up the CESIUM_CJS-Emissions-Calculator project in your local environment.

---

## 1. Install **nvm** for Windows
- **Windows Only**  
  - Download and install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases).

*If you are on Linux/macOS, install Node.js via your system’s package manager or via [nvm](https://github.com/nvm-sh/nvm).*

---

## 2. Install and Activate Node.js
- **Windows**  
  ```powershell
  nvm install node
  nvm on
  ```
- **Linux/macOS***
  if using **nvm** (recommended):
  ```powershell
  nvm install node
  nvm use node
  ```

---

## 3. Clone the Repository
  ```powershell
  git clone https://github.com/OET-RUMI/CESIUM_CJS-Emissions-Calculator.git
  cd CESIUM_CJS-Emissions-Calculator
  ```

---

## 4. Install Dependencies
  ```powershell
  npm install
  ```

---

## 5. Set Up Environment Variables
1. Locate the `.env.example` file in the root of the project.
2. Copy or rename it to `.env`
3. Update the environment variables with the values required for your setup

---

## 6. Start the Application
```powershell
npm run start
```
