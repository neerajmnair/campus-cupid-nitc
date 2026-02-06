from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "NITC Cupid Backend Running ❤️"}


