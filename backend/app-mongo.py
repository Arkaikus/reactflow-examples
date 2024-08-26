from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from typing import List

app = FastAPI()

class Workflow(BaseModel):
    id: int
    type: str
    data: dict
    position: dict  # x and y coordinates
    edges: List[int]

# Connect to MongoDB
client = MongoClient("mongodb://mongo:27017/")
db = client["workflows"]

# Define the collection for workflows
workflow_collection = db["workflows"]

# Define a helper function to convert workflow dictionaries to Workflow objects
def dict_to_workflow(d):
    return Workflow(id=d["id"], type=d["type"], data=d["data"], position=d["position"], edges=d["edges"])

# Define the API endpoints

@app.get("/workflows/")
async def read_workflows():
    workflows = [dict_to_workflow(w) for w in workflow_collection.find()]
    return workflows

@app.post("/workflows/")
async def create_workflow(workflow: Workflow):
    result = workflow_collection.insert_one({
        "id": workflow.id,
        "type": workflow.type,
        "data": workflow.data,
        "position": workflow.position,
        "edges": workflow.edges
    })
    if result.inserted_id:
        return {"message": "Workflow created successfully"}
    else:
        raise HTTPException(status_code=400, detail="Failed to create workflow")

@app.get("/workflows/{workflow_id}")
async def read_workflow(workflow_id: int):
    workflow = workflow_collection.find_one({"id": workflow_id})
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return dict_to_workflow(workflow)

@app.put("/workflows/{workflow_id}")
async def update_workflow(workflow_id: int, new_data: Workflow):
    result = workflow_collection.update_one({"id": workflow_id}, {
        "$set": {
            "type": new_data.type,
            "data": new_data.data,
            "position": new_data.position,
            "edges": new_data.edges
        }
    })
    if result.modified_count:
        return {"message": "Workflow updated successfully"}
    else:
        raise HTTPException(status_code=400, detail="Failed to update workflow")

@app.delete("/workflows/{workflow_id}")
async def delete_workflow(workflow_id: int):
    result = workflow_collection.delete_one({"id": workflow_id})
    if result.deleted_count == 1:
        return {"message": "Workflow deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Workflow not found")
