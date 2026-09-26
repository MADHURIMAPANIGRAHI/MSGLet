import secrets
from passlib.context import CryptContext
import uuid
from datetime import datetime
from Database import DataBaseManager

db=DataBaseManager()
pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")

class Api_Key_Manager:
    def hash_api_key(self,api_Key:str):  #hashes api key
        return pwd_context.hash(api_Key)
    
    def verify_api_key(self,gmail,plain_api_Key:str)->bool:
        query={"gmail":gmail,"is_Active":True}
        hashed_Api_Key=db.fetch_all("api_keys_storage",query,{"_id":0,"api_Key_Hashed":1,"project_Id":1,"usage_Left":1})
        for api_Key in hashed_Api_Key:
            current_Api_key=api_Key["api_Key_Hashed"]
            currnet_Project_Id=api_Key["project_Id"]
            usage=api_Key["usage_Left"]
            if pwd_context.verify(plain_api_Key,current_Api_key) and usage>0:  #verifies if api key matches with any and usage left
                return True,currnet_Project_Id
        return False,None
    
    def generate_api_key(self,username,gmail,keyName):
        api_key=secrets.token_hex(32)
        hashed_api_key=self.hash_api_key(api_key)
        data={"gmail":gmail,
              "username":username,
              "keyName":keyName,
              "api_Key_Hashed":hashed_api_key,
              "created_at": datetime.now(),
              "last_Used": None,
              "usage_Left":50000,
              "is_Active":True,
              "id":uuid.uuid4().hex,
              "project_Id":uuid.uuid4().hex 
              }
        db.store_data("api_keys_storage",data)
        return {"Api_key":api_key}

    def get_api_keys(self,gmail):
        query={"gmail":gmail,"is_Active":True}
        Active_Api_Keys=db.fetch_all("api_keys_storage",query,{"_id":0,"api_Key_Hashed":0})
        return {"Active_Api_Keys":Active_Api_Keys}
    
    def regenerate_api_key(self,gmail,api_Key_Id):
        query={"gmail":gmail,"id":api_Key_Id}
        Active_Api_Keys=db.fetch("api_keys_storage",query,{"_id":0,"api_Key_Hashed":0})
        self.delete_api_key(gmail,api_Key_Id)
        api_Key=secrets.token_hex(32)
        hashed_api_key=self.hash_api_key(api_Key)
        Active_Api_Keys.pop("id",None)
        Active_Api_Keys.pop("created_at",None)
        Active_Api_Keys.pop("last_Used",None)
        Active_Api_Keys.update({
            "api_Key_Hashed":hashed_api_key,
            "created_at": datetime.now(),
            "last_Used": None,
            "id":uuid.uuid4().hex,   
        })
        db.store_data("api_keys_storage",Active_Api_Keys)
        return {"New_key":api_Key}

    def delete_api_key(self,gmail,api_Key_Id):
        query={"gmail":gmail,"id":api_Key_Id}
        update_Field={"is_Active":False}
        db.update_field("api_keys_storage",query,update_Field)
        return {"message":"Removed api key successfully"}