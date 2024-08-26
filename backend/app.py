from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from bson.objectid import ObjectId

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)


class Node(BaseModel):
    id: str
    type: str
    data: dict
    position: dict  # x and y coordinates

    @classmethod
    def from_dict(cls, data):
        return cls(
            id=str(data["_id"]),
            type=data["type"],
            data=data["data"],
            position=data["position"],
        )


# Connect to MongoDB
client = MongoClient("mongodb://mongo:27017/")
db = client["workflows"]

# Define the collection for nodes
node_collection = db["nodes"]


@app.get("/nodes/")
async def read_nodes():
    nodes = [Node.from_dict(w) for w in node_collection.find()]
    return nodes


@app.post("/nodes/")
async def create_node(node: Node):
    result = node_collection.insert_one(node.model_dump())
    if result.inserted_id:
        return {"message": "node created successfully", "id": str(result.inserted_id)}
    else:
        raise HTTPException(status_code=400, detail="Failed to create node")


@app.get("/nodes/{node_id}")
async def read_node(node_id: str):
    node = node_collection.find_one({"_id": ObjectId(node_id)})
    if not node:
        raise HTTPException(status_code=404, detail="node not found")
    return Node.from_dict(node)


@app.put("/nodes/{node_id}")
async def update_node(node_id: str, new_data: Node):
    result = node_collection.update_one(
        {"_id": ObjectId(node_id)},
        {
            "$set": {
                "type": new_data.type,
                "data": new_data.data,
                "position": new_data.position,
            }
        },
    )
    if result.modified_count:
        return {"message": "node updated successfully"}
    else:
        raise HTTPException(status_code=400, detail="Failed to update node")


@app.delete("/nodes/{node_id}")
async def delete_node(node_id: str):
    result = node_collection.delete_one({"_id": ObjectId(node_id)})
    if result.deleted_count == 1:
        return {"message": "node deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="node not found")
