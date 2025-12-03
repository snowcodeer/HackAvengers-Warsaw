from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import conversation, quest

app = FastAPI(title="Mówka Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(conversation.router)
app.include_router(quest.router)

@app.get("/")
async def root():
    return {"message": "Mówka Backend is running"}
