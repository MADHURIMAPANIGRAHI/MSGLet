from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from urllib.parse import quote_plus
from dotenv import load_dotenv
import os
from datetime import datetime
load_dotenv()

username = os.getenv("MONGODB_USER")
password = os.getenv("MONGODB_PASS")
cluster = os.getenv("MONGODB_CLUSTER")
db_name = os.getenv("MONGODB_DB2")
app_name = os.getenv("APP_NAME")

# Crash early with a clear message if anything is missing
if not all([username, password, cluster, db_name, app_name]):
    raise RuntimeError("Missing required database environment variables")

username = quote_plus(username)
password = quote_plus(password)

uri=f"mongodb+srv://{username}:{password}@{cluster}.nlnjtju.mongodb.net/?retryWrites=true&w=majority&appName={app_name}"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

class DataBaseManager:
    def store(self,collection:str,gmail:str,token:str,expire:datetime):
        try:
            db=client[db_name]
            collection_name=db[collection]
            collection_name.update_one(
                {"gmail":gmail},
                {"$set":{"refresh_token":token,"created_at":datetime.utcnow(),"exp": expire.timestamp()}},
                upsert=True
            )
        except Exception as e:
            return e
    
    def store_data(self,collection:str,data):
        try:
            db=client[db_name]
            collection_name=db[collection]
            if isinstance(data,dict):
                collection_name.insert_one(data)
            elif isinstance(data,list):
                collection_name.insert_many(data)
            else:
                raise TypeError("Data must be dict or list")
        except Exception as e:
            return e

    def if_exists_data(self,collection:str,query):
        try:
            db=client[db_name]
            collection_name=db[collection]
            return collection_name.count_documents(query,limit=1)>0
        except Exception as e:
            return e

    def fetch(self,collection:str,query=None,projection={"_id":0}):
        try:
            db=client[db_name]
            collection_name=db[collection]
            data=collection_name.find_one(query,projection)
            return data
        except Exception as e:
            return e
        
    def fetch_all(self,collection:str,query=None,projection={"_id":0}):
        try:
            db=client[db_name]
            collection_name=db[collection]
            data=list(collection_name.find(query,projection))
            return data
        except Exception as e:
            return e
        
    def delete(self,collection:str,query=None):
        try:
            db=client[db_name]
            collection_name=db[collection]
            collection_name.delete_one(query)
        except Exception as e:
            return e 
    def update_field(self,collection:str,query,update_field):
        try:
            db=client[db_name]
            collection_name=db[collection]
            return collection_name.update_one(query,{"$set":update_field})
        except Exception as e:
            return e 
        
    def update_db(self,collection:str,query,update):
        try:
            db=client[db_name]
            collection_name=db[collection]
            collection_name.update_one(query,update)
        except Exception as e:
            return e 
    
    def delete_many(self, collection: str, query=None):
        try:
            db = client[db_name]
            collection_name = db[collection]
            collection_name.delete_many(query)
        except Exception as e:
            return e