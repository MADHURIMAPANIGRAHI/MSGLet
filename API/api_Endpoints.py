from fastapi import APIRouter,Depends,HTTPException,Response,Request,Header,status
from Auth import Authentication
from Database import DataBaseManager
from Model import notifcationManager,messageManager
from Services import Api_Key_Manager
from Auth.dependencies import get_current_user
from .rate_limiter import rate_limiter,rate_limit_user_endpoint
from .schemas import *

router=APIRouter()
auth=Authentication()
db=DataBaseManager()
message_system=messageManager()
notifcation_system=notifcationManager()
api_manager=Api_Key_Manager()

@router.post('/register',tags=['Auth'])
async def register(data:Register,limiter=Depends(rate_limiter)):
    user_data={
            "gmail":data.gmail,
            "password":data.password,
            "username":data.username,
            "role":data.role
        }
    # auth.register(user_data)  #registers user
    return {"message":"Registered sucessfully"}

@router.post('/login',tags=['Auth'])
async def login(data:Login,response:Response,limiter=Depends(rate_limiter)):
    try:
        user_data={
            "gmail":data.gmail,
            "password":data.password
        }
        return auth.login(user_data,response) #logs in user 
    except HTTPException as e:
        raise e

@router.post("/refresh",tags=['Auth'])  #if access token has expired, generate new access token using refresh token
async def refresh(request:Request,response:Response,limiter=Depends(rate_limiter)):
    try:
        token=request.cookies.get("refresh_token")
        return auth.refresh_token(token,response)
    except HTTPException as e:
        raise e
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")

@router.post('/logout',tags=['Auth'])
async def logout(response:Response,user=Depends(get_current_user),limiter=Depends(rate_limiter)):
    gmail=user['gmail']
    db.delete("refresh_token_db",{"gmail":gmail})
    response.delete_cookie("refresh_token")
    return {"message": "Logged out"}

@router.post('/send_message',tags=['Message'])
async def send_message(data:SendMessageRequest,api_Key:str=Header(...,alias="x-api-key"),
                        api_Gmail:str=Header(...,alias="x-user-mail")):
    try:
        is_Valid,project_Id=api_manager.verify_api_key(api_Gmail,api_Key)
        if not is_Valid:
            raise HTTPException(status_code=401, detail="Invalid API key or Out of Limit")  
        await rate_limit_user_endpoint(api_Key,"/send_message")
        data=data.message_Data
        username=data.username
        sender_Gmail=data.sender_Gmail
        receiver_Gmail=data.receiver_Gmail
        can_Reply=data.can_Reply
        message=data.message
        subject=data.subject
        message_system.send_msg(username,sender_Gmail,receiver_Gmail,subject,message,can_Reply,project_Id)
        return {"message":"Successfully delivered message"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Something went wrong")
    
@router.post('/get_messages',tags=['Message'])
async def get_message(data:GetMessagesRequest,api_Key:str=Header(...,alias="x-api-key"),
                        api_Gmail:str=Header(...,alias="x-user-mail")):
    try:
        is_Valid,project_Id=api_manager.verify_api_key(api_Gmail,api_Key)
        if not is_Valid:
            raise HTTPException(status_code=401, detail="Invalid API key or Out of Limit")  
        await rate_limit_user_endpoint(api_Key,'/get_messages')
        gmail=data.gmail
        message=message_system.get_msg(gmail,project_Id)
        return message
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")

@router.post('/read_message',tags=['Message'])
async def read_message(data:ReadMessageRequest,api_Key:str=Header(...,alias="x-api-key"),
                        api_Gmail:str=Header(...,alias="x-user-mail")):
    try:
        is_Valid,project_Id=api_manager.verify_api_key(api_Gmail,api_Key)
        if not is_Valid:
            raise HTTPException(status_code=401, detail="Invalid API key or Out of Limit")  
        await rate_limit_user_endpoint(api_Key,'/read_message')
        data=data.read_Data
        msg_Id=data.msg_Id
        receiver_Gmail=data.receiver_Gmail
        return message_system.read_msg(receiver_Gmail,msg_Id,project_Id)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")

@router.post('/reply_message',tags=['Message'])
async def reply_message(data:ReplyMessageRequest,api_Key:str=Header(...,alias="x-api-key"),
                        api_Gmail:str=Header(...,alias="x-user-mail")):
    try:
        is_Valid,project_Id=api_manager.verify_api_key(api_Gmail,api_Key)
        if not is_Valid:
            raise HTTPException(status_code=401, detail="Invalid API key or Out of Limit")  
        await rate_limit_user_endpoint(api_Key,'/reply_message')
        data=data.message_Data
        username=data.username
        sender_Gmail=data.sender_Gmail
        message=data.message
        parent_Msg_Id=data.parent_Msg_Id
        result = message_system.reply_msg(parent_Msg_Id, username, sender_Gmail, message, project_Id)
        if result and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return {"message": "Successfully delivered message"}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")

@router.post('/soft_delete_message',tags=['Message'])
async def soft_delete_message(data:SoftDeleteRequest,api_Key:str=Header(...,alias="x-api-key"),
                        api_Gmail:str=Header(...,alias="x-user-mail")):
    try:
        is_Valid,project_Id=api_manager.verify_api_key(api_Gmail,api_Key)
        if not is_Valid:
            raise HTTPException(status_code=401, detail="Invalid API key or Out of Limit")  
        await rate_limit_user_endpoint(api_Key,'/soft_delete_message')
        data=data.delete_Data
        msg_Id=data.msg_Id
        gmail=data.gmail
        result = message_system.soft_delete_msg(gmail, msg_Id, project_Id)
        if result and "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")

@router.post('/delete',tags=["Message"])
async def delete(data:DeleteRequest,api_Key:str=Header(...,alias="x-api-key"),
                        api_Gmail:str=Header(...,alias="x-user-mail")):
    try:
        is_Valid,project_Id=api_manager.verify_api_key(api_Gmail,api_Key)
        if not is_Valid:
            raise HTTPException(status_code=401, detail="Invalid API key or Out of Limit")  
        await rate_limit_user_endpoint(api_Key,'/delete')
        data=data.delete_Data
        role=data.role
        msg_Id=data.msg_Id
        if role!="admin":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Not authorized to use this command!")
        msg_Id=data.msg_Id
        return message_system.delete_msg(msg_Id,project_Id)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")

@router.post("/get_notification",tags=['Message'])
async def get_notification(data:GetNotificationRequest,api_Key:str=Header(...,alias="x-api-key"),
                        api_Gmail:str=Header(...,alias="x-user-mail")):
    try:
        is_Valid,project_Id=api_manager.verify_api_key(api_Gmail,api_Key)
        if not is_Valid:
            raise HTTPException(status_code=401, detail="Invalid API key or Out of Limit")  
        await rate_limit_user_endpoint(api_Key,"/get_notification")
        gmail=data.gmail
        return notifcation_system.get_notification(gmail,project_Id)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")
    
@router.post('/generate_api_key',tags=["API Services"])
def generate_api_key(data:ApiKey,user=Depends(get_current_user),limiter=Depends(rate_limiter)):
    try:
        gmail=user['gmail']
        username=user['username']
        keyName=data.keyName
        return api_manager.generate_api_key(username,gmail,keyName)
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")

@router.get('/get_api_keys',tags=["API Services"])
def get_api_keys(user=Depends(get_current_user),limiter=Depends(rate_limiter)):
    try:
        gmail=user['gmail']
        return api_manager.get_api_keys(gmail)
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")

@router.post('/regenerate_api_key',tags=["API Services"])
def regenerate_api_key(data:ApiKeyId,user=Depends(get_current_user),limiter=Depends(rate_limiter)):
    try:
        gmail=user['gmail']
        api_Key_Id=data.keyId
        return api_manager.regenerate_api_key(gmail,api_Key_Id)
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")

@router.post('/delete_api_key',tags=["API Services"])   
def delete_api_key(data:ApiKeyId,user=Depends(get_current_user),limiter=Depends(rate_limiter)):
    try:
        gmail=user['gmail']
        api_Key_Id=data.keyId
        return api_manager.delete_api_key(gmail,api_Key_Id)
    except Exception:
        raise HTTPException(status_code=500, detail="Something went wrong")