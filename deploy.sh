#!/bin/bash

# Pull the latest changes from the repository
git pull origin main

# Install dependencies
npm install

# Restart the application
pm2 restart app

echo "Deployment completed successfully!"

