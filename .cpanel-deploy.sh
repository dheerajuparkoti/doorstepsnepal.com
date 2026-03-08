#!/bin/bash

# cPanel Deployment Script for Next.js
# Usage: ./cpanel-deploy.sh

set -e

echo "🚀 Starting cPanel deployment process..."

# Configuration
CPANEL_USER="doorste2"
CPANEL_HOST="192.250.235.30"
REMOTE_DIR="doorsteps-app"
DEPLOY_ARCHIVE="doorsteps-deploy.tar.gz"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Building Next.js application...${NC}"
pnpm install
pnpm build

echo -e "${BLUE}Step 2: Creating deployment package...${NC}"
# Create a temporary directory for deployment files
rm -rf .deploy-temp
mkdir -p .deploy-temp

# Copy necessary files for standalone deployment
echo "Copying .next/standalone..."
cp -r .next/standalone/* .deploy-temp/

echo "Copying .next/static..."
mkdir -p .deploy-temp/.next
cp -r .next/static .deploy-temp/.next/

echo "Copying public..."
cp -r public .deploy-temp/

echo "Copying server.js..."
cp server.js .deploy-temp/

echo "Copying package.json..."
cp package.json .deploy-temp/

# Create .env.production if it exists
if [ -f .env.production ]; then
    echo "Copying .env.production..."
    cp .env.production .deploy-temp/.env
elif [ -f .env.local ]; then
    echo "Copying .env.local as .env..."
    cp .env.local .deploy-temp/.env
fi

# Create archive
echo -e "${BLUE}Step 3: Creating archive...${NC}"
cd .deploy-temp
tar -czf ../${DEPLOY_ARCHIVE} .
cd ..

echo -e "${GREEN}✓ Deployment package created: ${DEPLOY_ARCHIVE}${NC}"
echo -e "Package size: $(du -h ${DEPLOY_ARCHIVE} | cut -f1)"

echo -e "${BLUE}Step 4: Uploading to cPanel...${NC}"
scp ${DEPLOY_ARCHIVE} ${CPANEL_USER}@${CPANEL_HOST}:~/${REMOTE_DIR}/

echo -e "${BLUE}Step 5: Extracting on server...${NC}"
ssh ${CPANEL_USER}@${CPANEL_HOST} << 'ENDSSH'
cd doorsteps-app
echo "Backing up old deployment..."
if [ -d ".next" ]; then
    rm -rf .next.backup
    mv .next .next.backup 2>/dev/null || true
fi
echo "Extracting new deployment..."
tar -xzf doorsteps-deploy.tar.gz
rm doorsteps-deploy.tar.gz
echo "Setting permissions..."
chmod -R 755 .
echo "✓ Extraction complete"
ENDSSH

echo -e "${BLUE}Step 6: Installing dependencies on server...${NC}"
ssh ${CPANEL_USER}@${CPANEL_HOST} << 'ENDSSH'
cd doorsteps-app
# Activate Node.js environment (adjust path based on your cPanel setup)
source ~/nodevenv/doorsteps-app/18/bin/activate 2>/dev/null || source ~/nodevenv/doorsteps-app/20/bin/activate 2>/dev/null || echo "Node env not found, using system node"
npm install --production
echo "✓ Dependencies installed"
ENDSSH

echo -e "${GREEN}Step 7: Restarting application...${NC}"
echo "Please restart the Node.js app from cPanel interface"
echo "Or run: touch ~/doorsteps-app/tmp/restart.txt"

ssh ${CPANEL_USER}@${CPANEL_HOST} << 'ENDSSH'
mkdir -p ~/doorsteps-app/tmp
touch ~/doorsteps-app/tmp/restart.txt
echo "✓ Restart triggered"
ENDSSH

# Cleanup
echo -e "${BLUE}Cleaning up local files...${NC}"
rm -rf .deploy-temp
rm ${DEPLOY_ARCHIVE}

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${BLUE}Your app should now be running on your cPanel server.${NC}"
echo ""
echo "To check logs, run:"
echo "  ssh ${CPANEL_USER}@${CPANEL_HOST} 'tail -f ~/logs/*.log'"
