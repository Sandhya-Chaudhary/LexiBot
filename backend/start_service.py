import uvicorn
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

port = os.getenv("PORT", 9000)  # Default to port 8000 if not set

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=int(port), reload=True)
