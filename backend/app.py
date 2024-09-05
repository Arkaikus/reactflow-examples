from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.nodes import node_router
from routes.edges import edge_router

app = FastAPI(root_path="/api")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(node_router)
app.include_router(edge_router)