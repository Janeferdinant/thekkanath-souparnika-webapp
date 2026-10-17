# Deployment & Production Infrastructure Guide

> **Application:** Thekkanath Souparnika Auditorium Management Web App  
> **Target Framework:** Vite 6 + React 18 SPA  
> **Backend:** Supabase PostgreSQL

---

## 1. Prerequisites Checklist

Before proceeding to production deployment, ensure you possess:
- A GitHub repository containing this codebase.
- A free or paid Supabase account ([supabase.com](https://supabase.com)).
- A production hosting account on **Vercel**, **Netlify**, or a Linux VPS (Nginx).
- The registered venue domain (e.g. `thekkanathsouparnika.com`).

---

## 2. Supabase Backend Setup

1. **Create New Project:**
   - Log in to Supabase and click **New Project**.
   - Set Name to `thekkanath-souparnika`.
   - Select the closest AWS Region: **ap-south-1 (Mumbai)** for lowest latency to Kerala users.
   - Set a secure database password.

2. **Execute Database Migrations:**
   - In your Supabase Dashboard, navigate to the **SQL Editor**.
   - Click **New Query** and copy the complete contents of `supabase/migrations/20261017000000_init_schema.sql`.
   - Click **Run** to provision the 14 tables, PostgreSQL extensions, RLS policies, and conflict detection function.

3. **Execute Initial Data Seeds:**
   - Open a second query window in the SQL Editor.
   - Paste the contents of `supabase/seed.sql` and click **Run**.
   - Verify that the 4 verified halls appear under `Table Editor` -> `halls`.

4. **Obtain API Keys:**
   - Go to **Project Settings** -> **API**.
   - Note the **Project URL** (e.g. `https://xyzcompany.supabase.co`).
   - Note the **anon (public)** key.

---

## 3. Deploying to Vercel (Recommended)

1. **Connect Repository:**
   - Log in to [vercel.com](https://vercel.com) and click **Add New...** -> **Project**.
   - Select the repository `thekkanath-souparnika-webapp`.

2. **Configure Build Settings:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Set Environment Variables:**
   Add the following variables in the Vercel dashboard:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **SPA Rewrite Rules:**
   Ensure `vercel.json` exists in the project root with the following configuration:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

5. **Deploy & Custom Domain:**
   - Click **Deploy**.
   - Once complete, go to **Settings** -> **Domains** and map `thekkanathsouparnika.com`.

---

## 4. Deploying to Netlify

1. Connect the Git repository on [netlify.com](https://netlify.com).
2. Set Build Command: `npm run build`
3. Set Publish Directory: `dist`
4. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Ensure a `public/_redirects` file exists containing:
   ```
   /*    /index.html   200
   ```

---

## 5. Deploying via Docker / Nginx on Custom VPS

If self-hosting on a custom Linux server (e.g. Ubuntu 22.04 LTS):

### 5.1 Dockerfile
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 5.2 Nginx Configuration (`nginx.conf`)
```nginx
server {
    listen 80;
    server_name thekkanathsouparnika.com www.thekkanathsouparnika.com;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 6. Post-Deployment Verification Checklist

1. [ ] **Public Portal:** Verify homepage loads, responsive navigation functions on mobile and desktop, and all 4 halls display correct 100-person capacity limits.
2. [ ] **Acoustic Notice:** Confirm Open Hall detail page displays the disclaimer regarding 3 exhaust fans.
3. [ ] **Public Enquiry:** Submit a test enquiry form and confirm it displays the instant reference code and confirmation screen.
4. [ ] **Management Console:** Navigate to `/admin` and confirm the enquiries pipeline displays the newly submitted lead.
5. [ ] **Double-Booking Prevention:** Attempt to book an overlapping time slot for the same hall on the same date and verify that the system blocks it with a conflict warning.
6. [ ] **Data Persistence:** Reload the browser page and verify that state persists.
