class DictMixin:

    def to_dict(self):
        return {f: getattr(self, f) for f in self.model_fields if f != "id"}
