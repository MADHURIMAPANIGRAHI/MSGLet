from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
from typing import Optional

class Register(BaseModel):
    username: str = Field(min_length=3, max_length=20, pattern=r"^[a-zA-Z0-9_]+$")
    gmail: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: Optional[str] = "default"
    class Config:
        extra = "forbid"

class Login(BaseModel):
    gmail: EmailStr
    password: str = Field(min_length=8, max_length=128)
    class Config:
        extra = "forbid"

class Refresh(BaseModel):
    refresh_token: str = Field(min_length=20, max_length=500)
    class Config:
        extra = "forbid"

class ResponseModel(BaseModel):
    msg: str = Field(min_length=1, max_length=200)
    class Config:
        extra = "forbid"

class ApiKey(BaseModel):
    keyName: str = Field(min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_-]+$")
    class Config:
        extra = "forbid"

class ApiKeyId(BaseModel):
    keyId: str = Field(min_length=10, max_length=100)
    class Config:
        extra = "forbid"

def not_blank(v: str) -> str:
    if not v.strip():
        raise ValueError("Field cannot be blank")
    return v.strip()

class SendMessageData(BaseModel):
    username: str = Field(min_length=1, max_length=50)
    sender_Gmail: EmailStr
    receiver_Gmail: list[EmailStr]
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1, max_length=5000)
    can_Reply: bool

    @field_validator("username", "subject", "message")
    @classmethod
    def fields_not_blank(cls, v):
        return not_blank(v)

    @model_validator(mode="after")
    def validate_receivers(self):
        receivers = self.receiver_Gmail
        if not receivers:
            raise ValueError("receiver_Gmail cannot be empty")
        if len(receivers) != len(set(receivers)):
            raise ValueError("Duplicate emails in receiver_Gmail")
        if self.sender_Gmail in receivers:
            raise ValueError("sender_Gmail should not be in receiver_Gmail")
        return self

    class Config:
        extra = "forbid"

class SendMessageRequest(BaseModel):
    message_Data: SendMessageData
    class Config:
        extra = "forbid"

class GetMessagesRequest(BaseModel):
    gmail: EmailStr
    class Config:
        extra = "forbid"

class ReadMessageData(BaseModel):
    msg_Id: str = Field(min_length=1, max_length=100)
    receiver_Gmail: EmailStr

    @field_validator("msg_Id")
    @classmethod
    def msg_id_not_blank(cls, v):
        return not_blank(v)

    class Config:
        extra = "forbid"

class ReadMessageRequest(BaseModel):
    read_Data: ReadMessageData
    class Config:
        extra = "forbid"

class ReplyMessageData(BaseModel):
    username: str = Field(min_length=1, max_length=50)
    sender_Gmail: EmailStr
    parent_Msg_Id: str = Field(min_length=1, max_length=100)
    message: str = Field(min_length=1, max_length=5000)

    @field_validator("username", "message", "parent_Msg_Id")
    @classmethod
    def fields_not_blank(cls, v):
        return not_blank(v)

    class Config:
        extra = "forbid"

class ReplyMessageRequest(BaseModel):
    message_Data: ReplyMessageData
    class Config:
        extra = "forbid"

class SoftDeleteData(BaseModel):
    msg_Id: str = Field(min_length=1, max_length=100)
    gmail: EmailStr

    @field_validator("msg_Id")
    @classmethod
    def msg_id_not_blank(cls, v):
        return not_blank(v)

    class Config:
        extra = "forbid"

class SoftDeleteRequest(BaseModel):
    delete_Data: SoftDeleteData
    class Config:
        extra = "forbid"

class DeleteData(BaseModel):
    msg_Id: str = Field(min_length=1, max_length=100)
    role: str = Field(min_length=1, max_length=20)

    @field_validator("msg_Id", "role")
    @classmethod
    def fields_not_blank(cls, v):
        return not_blank(v)

    class Config:
        extra = "forbid"

class DeleteRequest(BaseModel):
    delete_Data: DeleteData
    class Config:
        extra = "forbid"

class GetNotificationRequest(BaseModel):
    gmail: EmailStr
    class Config:
        extra = "forbid"