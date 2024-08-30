from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://mongo:27017/")
db = client["workflows"]

# Define the collection for nodes
node_collection = db["nodes"]
edge_collection = db["edges"]
