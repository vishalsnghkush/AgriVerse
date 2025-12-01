#!/bin/bash
# Install Python dependencies
pip install -r requirements.txt

# Build Frontend
cd frontend
npm install
npm run build
cd ..
