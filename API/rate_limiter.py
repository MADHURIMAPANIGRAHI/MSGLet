from fastapi import Request,HTTPException
from time import time
import asyncio
from Services import Api_Key_Manager

request_logs={}
lock=asyncio.Lock()
RATE_LIMIT=10
TIME_WINDOW=60

api_Manager=Api_Key_Manager()

async def rate_limiter(request: Request):
    user=request.client.host
    now=time()
    async with lock:
        timestamps=request_logs.get(user,[])
        timestamps=[t for t in timestamps if now - t < TIME_WINDOW]
        if len(timestamps)>=RATE_LIMIT:
            raise HTTPException(status_code=429,detail="Rate limit exceeded")
        timestamps.append(now)
        request_logs[user]=timestamps

async def rate_limit_user_endpoint(api_key:str,endpoint:str,limit:int=50,window:int=60):
    now=time()
    async with lock:
        user_logs=request_logs.setdefault(api_key,{})
        timestamps=user_logs.get(endpoint,[])
        timestamps=[t for t in timestamps if now-t<window]
        if len(timestamps)>=limit:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        timestamps.append(now)
        user_logs[endpoint]=timestamps
        request_logs[api_key]=user_logs