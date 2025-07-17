# Welcome to your Dev&Code project

## Project info

**URL**:

## How can I edit this code?

There are several ways of editing your application.

**Use Dev&Code**

Simply visit the [Dev&Code Project] and start prompting.

Changes made via Dev&Code will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Dev&Code.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev

```

## Environment Variables

Create a `.env` file in the `frontend` directory with the following content:

```
VITE_API_URL=http://localhost:3000
```

This is used for axios requests to the backend API. Change the URL as needed for your environment.
