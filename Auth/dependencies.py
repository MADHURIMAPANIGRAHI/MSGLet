from jose import JWTError,jwt,ExpiredSignatureError
from fastapi import Depends,HTTPException,status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
import os

load_dotenv()
SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM="HS256"

oauth2_scheme=OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token:str=Depends(oauth2_scheme)):
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])  #verifys token
        gmail:str=payload.get("gmail") #gets gmail
        username:str=payload.get("username") #gets gmail
        role:str=payload.get("role") #gets gmail
        if gmail is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid token") #if token invalid
        return {"gmail":gmail,"username":username,"role":role}
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except JWTError:
        print("Test2")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Token verification failed")