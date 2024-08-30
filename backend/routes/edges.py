from fastapi import APIRouter, HTTPException
from bson.objectid import ObjectId

from models.edge import Edge
from data.db import edge_collection

edge_router = APIRouter()


@edge_router.get("/edges/")
async def read_edges():
    edges = [Edge.from_dict(w) for w in edge_collection.find()]
    return edges


@edge_router.post("/edges/")
async def create_edge(edge: Edge):
    result = edge_collection.insert_one(edge.model_dump())
    if result.inserted_id:
        return {"message": "edge created successfully", "id": str(result.inserted_id)}
    else:
        raise HTTPException(status_code=400, detail="Failed to create edge")


@edge_router.get("/edges/{edge_id}")
async def read_edge(edge_id: str):
    edge = edge_collection.find_one({"_id": ObjectId(edge_id)})
    if not edge:
        raise HTTPException(status_code=404, detail="edge not found")
    return Edge.from_dict(edge)


@edge_router.put("/edges/{edge_id}")
async def update_edge(edge_id: str, edge: Edge):
    result = edge_collection.update_one(
        {"_id": ObjectId(edge_id)},
        {"$set": edge.to_dict()},
    )
    if result.modified_count:
        return {"message": "edge updated successfully"}
    else:
        raise HTTPException(status_code=400, detail="Failed to update edge")


@edge_router.delete("/edges/{edge_id}")
async def delete_edge(edge_id: str):
    result = edge_collection.delete_one({"_id": ObjectId(edge_id)})
    if result.deleted_count == 1:
        return {"message": "edge deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="edge not found")
