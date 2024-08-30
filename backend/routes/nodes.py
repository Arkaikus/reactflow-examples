from fastapi import APIRouter, HTTPException
from bson.objectid import ObjectId

from models.node import Node
from data.db import node_collection

node_router = APIRouter()


@node_router.get("/nodes/")
async def read_nodes():
    nodes = [Node.from_dict(w) for w in node_collection.find()]
    return nodes


@node_router.post("/nodes/")
async def create_node(node: Node):
    result = node_collection.insert_one(node.model_dump())
    if result.inserted_id:
        return {"message": "node created successfully", "id": str(result.inserted_id)}
    else:
        raise HTTPException(status_code=400, detail="Failed to create node")


@node_router.get("/nodes/{node_id}")
async def read_node(node_id: str):
    node = node_collection.find_one({"_id": ObjectId(node_id)})
    if not node:
        raise HTTPException(status_code=404, detail="node not found")
    return Node.from_dict(node)


@node_router.put("/nodes/{node_id}")
async def update_node(node_id: str, node: Node):
    result = node_collection.update_one(
        {"_id": ObjectId(node_id)},
        {"$set": node.to_dict()},
    )
    if result.modified_count:
        return {"message": "node updated successfully"}
    else:
        raise HTTPException(status_code=400, detail="Failed to update node")


@node_router.delete("/nodes/{node_id}")
async def delete_node(node_id: str):
    result = node_collection.delete_one({"_id": ObjectId(node_id)})
    if result.deleted_count == 1:
        return {"message": "node deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="node not found")
