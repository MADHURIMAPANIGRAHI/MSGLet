from datetime import datetime,timedelta
from fastapi import HTTPException,Response
from jose import jwt,JWTError,ExpiredSignatureError
from dotenv import load_dotenv
import os
from passlib.context import CryptContext
from Database import DataBaseManager

load_dotenv()
SECRET_KEY=os.getenv("SECRET_KEY")
ENV=os.getenv("ENV", "local")
ALGORITHM="HS256"
IS_PROD=ENV=="prod"
pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")

db=DataBaseManager()

class Authentication:
    def hash_password(self,password:str):  #hashes password
        return pwd_context.hash(password)
    
    def verify_password(self,plain_password:str,hashed_password:str)->bool:
        return pwd_context.verify(plain_password,hashed_password)  #verifys with hashes password

    def register(self,data):
        username=data["username"]
        gmail=data["gmail"]
        password=data["password"]
        role=data['role']
        query={"gmail":gmail}
        if db.if_exists_data("auth_list",query): #checks if gmail already exists
            raise HTTPException(status_code=409,detail="Email already exists")
        else:
            try:
                hash_password=self.hash_password(password)
                user_data={
                    "username":username,
                    "gmail":gmail,
                    "password":hash_password,
                    "role":role,
                }
                db.store_data("auth_list",user_data)  #stores user data 
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

    def login(self,data,response:Response):
        gmail=data["gmail"]
        password=data["password"]
        user=db.fetch("auth_list",{"gmail":gmail},{"_id":0})
        if not user or not self.verify_password(password,user["password"]): #checks if user name exists and password matches
            raise HTTPException(status_code=401,detail="Invalid credentials")
        username=user['username']
        role=user['role']
        payload={"gmail":gmail,"username":username,"role":role}
        access_token=self.create_access_token(payload)  #creates a initial access token
        expire=datetime.utcnow()+timedelta(days=7)
        refresh_token=self.create_refresh_token(gmail,expire) #creates and stores a refresh token
        db.store("refresh_token_db",gmail,refresh_token,expire)
        response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=IS_PROD,
        samesite="none" if IS_PROD else "lax",
        max_age=7*24*60*60
        )
        return {"access_token":access_token,"token_type":"bearer"}

    def create_access_token(self,data:dict,expires_in:int=15):   
        payload=data.copy()  
        expire=datetime.utcnow()+timedelta(minutes=expires_in)
        payload["exp"]=expire
        token=jwt.encode(payload,SECRET_KEY,algorithm=ALGORITHM)
        return token
    
    def create_refresh_token(self,gmail:str,expire:datetime):
        payload={"gmail":gmail,"exp":expire}
        token=jwt.encode(payload,SECRET_KEY,algorithm=ALGORITHM)
        return token
    
    def refresh_token(self,token:str,response:Response):
        try:
            if not token:
                raise HTTPException(status_code=401, detail="Missing refresh token")
            payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
            gmail=payload.get("gmail")
            query={"gmail":gmail}
            if gmail is None:
                raise HTTPException(status_code=401,detail="Invalid refresh token") #checks for valid token
            db_token=db.fetch("refresh_token_db",query)  #gets refresh token
            if not db_token or db_token["refresh_token"]!=token:
                raise HTTPException(status_code=401, detail="Invalid refresh token")
            # Generate new access token
            if datetime.utcnow().timestamp()>db_token["exp"]:
                db.delete("refresh_token_db",{"gmail":gmail})
                raise HTTPException(status_code=401, detail="Refresh token expired")
            new_expire=datetime.utcnow()+timedelta(days=7)
            new_refresh_token=self.create_refresh_token(gmail,new_expire)
            response.set_cookie(
            key="refresh_token",
            value=new_refresh_token,
            httponly=True,
            secure=IS_PROD,
            samesite="none" if IS_PROD else "lax",
            max_age=7*24*60*60
            )  
            db.store("refresh_token_db",gmail,new_refresh_token,new_expire)
            user=db.fetch("auth_list",{"gmail":gmail},{"_id":0,"username":1,"role":1})
            username=user['username']
            role=user['role']
            payload={"gmail":gmail,"username":username,"role":role}
            access_token=self.create_access_token(payload)
            return {"access_token": access_token,"token_type": "bearer"}
        except ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Refresh token expired")
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid refresh token")