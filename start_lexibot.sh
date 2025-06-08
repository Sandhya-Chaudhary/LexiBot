#!/bin/bash

# Start backend
echo "Starting LexiBot Backend..."
cd backend || { echo "Backend folder not found!"; exit 1; }
# Windows virtualenv activation (Git Bash or WSL)
source test/Scripts/activate || (echo "environment nhi chal rha"; exit 1)
python start_service.py &
BACKEND_PID=$!
cd ..

# Start frontend
echo "Starting LexiBot Frontend..."
cd frontend || { echo "Frontend folder not found!"; exit 1; }
npm run start &
FRONTEND_PID=$!
cd ..

# Trap Ctrl+C and clean up
trap "echo -e '\nStopping both services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Wait for both processes
wait $BACKEND_PID
wait $FRONTEND_PID
