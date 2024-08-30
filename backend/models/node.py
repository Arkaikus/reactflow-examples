
from pydantic import BaseModel

class Node(BaseModel):
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

    def to_dict(self):
        return {f: getattr(self, f) for f in self.model_fields if f != "id"}