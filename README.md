# Netflix Redesign Prototype
CEN 4721 — Human-Computer Interaction

## Deploy on Vercel
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in this folder and follow the prompts
   — OR —
   Drag and drop this folder into vercel.com/new


## Run Locally
Open the Terminal and clone the repo into a folder. Then, within the same terminal, run the following:

```
cd [file path where you downloaded & extracted the zip file - if it is not the same file path you are currently in]
npm ci
npm run dev
```

Then click on the link displayed to open your browser onto https://localhost:5173/

## Local Media Strategy
Local `.mp4` assets are no longer bundled into the production build.

- In local development, the app can read videos directly from `src/Assets`.
- In production, local-asset cards only appear if you set `VITE_LOCAL_MEDIA_BASE_URL` to a separately hosted media path such as a CDN, object storage bucket, or static file server.
- Add that variable in `.env.local` or your Vercel project settings if you want the local asset row enabled outside development.
