# cPanel Deployment Guide - Doorsteps Website

## Quick Deploy Method (Build Locally → Copy to Server)

### What You Need to Copy

After building locally, you only need these files on cPanel:

```
doorsteps-app/
├── .next/               (entire folder from standalone build)
├── public/              (entire folder)
├── server.js           (custom server file)
├── package.json        (for dependencies)
└── .env                (your environment variables)
```

---

## Method 1: Automated Deployment (Recommended)

### One-Time Setup

1. **Make the deploy script executable:**
```bash
chmod +x .cpanel-deploy.sh
```

2. **Test SSH connection:**
```bash
ssh doorste2@192.250.235.30
```

3. **Ensure Node.js App is set up in cPanel:**
   - Login to cPanel web interface
   - Go to "Setup Node.js App"
   - Create app with folder name: `doorsteps-app`
   - Set startup file: `server.js`
   - Save and note the Node.js version path

### Deploy

Simply run:
```bash
./cpanel-deploy.sh
```

This will:
- Build your app locally
- Package only necessary files
- Upload to server
- Extract and set up
- Install dependencies
- Restart the app

---

## Method 2: Manual Deployment

### Step 1: Build Locally

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build
```

### Step 2: Prepare Deployment Files

The standalone build is located in `.next/standalone/`

### Step 3: Create Archive

```bash
# Create deployment package
tar -czf doorsteps-deploy.tar.gz \
  .next/standalone/* \
  .next/static \
  public \
  server.js \
  package.json
```

Or create it properly:
```bash
mkdir -p deploy-temp
cp -r .next/standalone/* deploy-temp/
mkdir -p deploy-temp/.next
cp -r .next/static deploy-temp/.next/
cp -r public deploy-temp/
cp server.js deploy-temp/
cp package.json deploy-temp/
cp .env.production deploy-temp/.env  # if exists

cd deploy-temp
tar -czf ../doorsteps-deploy.tar.gz .
cd ..
```

### Step 4: Upload to Server

```bash
scp doorsteps-deploy.tar.gz doorste2@192.250.235.30:~/doorsteps-app/
```

### Step 5: Extract on Server

```bash
ssh doorste2@192.250.235.30

cd doorsteps-app
tar -xzf doorsteps-deploy.tar.gz
rm doorsteps-deploy.tar.gz
```

### Step 6: Install Dependencies

```bash
# Activate Node.js environment (path from cPanel Node.js App)
source ~/nodevenv/doorsteps-app/18/bin/activate

# Install only production dependencies
npm install --production
```

### Step 7: Restart App

**Option A:** Via cPanel
- Go to "Setup Node.js App"
- Click "Restart" button

**Option B:** Via SSH
```bash
mkdir -p ~/doorsteps-app/tmp
touch ~/doorsteps-app/tmp/restart.txt
```

---

## Method 3: Using rsync (For Updates)

After initial setup, use rsync for faster updates:

```bash
# Build locally
pnpm build

# Sync files
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  .next/standalone/ doorste2@192.250.235.30:~/doorsteps-app/

rsync -avz .next/static/ doorste2@192.250.235.30:~/doorsteps-app/.next/static/
rsync -avz public/ doorste2@192.250.235.30:~/doorsteps-app/public/

# Restart
ssh doorste2@192.250.235.30 'touch ~/doorsteps-app/tmp/restart.txt'
```

---

## Environment Variables

Create `.env.production` locally with your production variables, or set them in cPanel:

**In cPanel Node.js App:**
1. Click "Edit" on your app
2. Scroll to "Environment Variables"
3. Add:
   - `NODE_ENV=production`
   - `NEXT_PUBLIC_API_URL=your_api_url`
   - etc.

---

## Troubleshooting

### Check App Status
```bash
ssh doorste2@192.250.235.30 'ps aux | grep node'
```

### View Logs
```bash
ssh doorste2@192.250.235.30 'tail -f ~/logs/*.log'
```

### Test Server Manually
```bash
ssh doorste2@192.250.235.30
cd doorsteps-app
source ~/nodevenv/doorsteps-app/18/bin/activate
node server.js
```

### Common Issues

**Port already in use:**
- Restart from cPanel interface
- Or: `killall node` (via SSH)

**Permission denied:**
```bash
chmod -R 755 ~/doorsteps-app
```

**Module not found:**
```bash
cd ~/doorsteps-app
npm install --production
```

---

## File Size Optimization

The `.next/standalone` folder contains only what's needed. To further reduce:

```bash
# Remove source maps in production
# In next.config.ts, add:
productionBrowserSourceMaps: false
```

---

## Quick Commands Reference

```bash
# Deploy
./cpanel-deploy.sh

# Check status
ssh doorste2@192.250.235.30 'pm2 status'  # if using PM2

# Restart
ssh doorste2@192.250.235.30 'touch ~/doorsteps-app/tmp/restart.txt'

# Logs
ssh doorste2@192.250.235.30 'tail -f ~/doorsteps-app/logs/*.log'

# SSH into server
ssh doorste2@192.250.235.30
```
