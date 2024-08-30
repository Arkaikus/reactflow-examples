from pydantic import BaseModel
from models import DictMixin

class Node(DictMixin, BaseModel):
    id: str
    type: str
    data: dict
    position: dict  # x and y coordinates
    width: int
    height: int

    @classmethod
    def from_dict(cls, data: dict):
        return cls(
            id=str(data["_id"]),
            type=data["type"],
            data=data["data"],
            position=data["position"],
            width=data.get("width", 200),
            height=data.get("height", 100),
        )

