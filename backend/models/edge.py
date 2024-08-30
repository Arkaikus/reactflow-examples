from pydantic import BaseModel, Field
from models import DictMixin
from typing import Optional


class Edge(DictMixin, BaseModel):
    id: Optional[str] = Field(None)
    type: str = Field(..., description="Type of the edge", pattern="^(default|straight|step|smoothstep|simplebezier)$")
    source: str  # node id
    target: str  # node id

    @classmethod
    def from_dict(cls, data: dict):
        return cls(
            id=str(data["_id"]),
            type=data["type"],
            source=data["source"],
            target=data["target"],
        )
