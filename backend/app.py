from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI()


class Workflow(BaseModel):
    id: int
    type: str
    data: dict
    position: dict  # x and y coordinates
    edges: List[int]


# In-memory storage for demonstration purposes only!
workflows = [
    {
        "id": 1,
        "type": "simple",
        "data": {"name": "John", "job": "Software Engineer"},
        "position": {"x": 10, "y": 20},
        "edges": [2, 3],
    },
    {
        "id": 2,
        "type": "complex",
        "data": {"name": "Alice", "job": "Data Scientist"},
        "position": {"x": 30, "y": 40},
        "edges": [1, 4],
    },
]

# Define the API endpoints


@app.get("/workflows/")
async def read_workflows():
    return workflows


@app.post("/workflows/")
async def create_workflow(workflow: Workflow):
    new_id = max([w["id"] for w in workflows]) + 1
    workflow.id = new_id
    workflows.append(workflow.dict())
    return {"message": "Workflow created successfully"}


@app.get("/workflows/{workflow_id}")
async def read_workflow(workflow_id: int):
    workflow = next((w for w in workflows if w["id"] == workflow_id), None)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return workflow


@app.put("/workflows/{workflow_id}")
async def update_workflow(workflow_id: int, new_data: Workflow):
    workflow = next((w for w in workflows if w["id"] == workflow_id), None)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    workflow.update(new_data.dict(exclude_unset=True))
    return {"message": "Workflow updated successfully"}


@app.delete("/workflows/{workflow_id}")
async def delete_workflow(workflow_id: int):
    workflow = next((w for w in workflows if w["id"] == workflow_id), None)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    workflows.remove(workflow)
    return {"message": "Workflow deleted successfully"}
