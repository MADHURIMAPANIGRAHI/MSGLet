import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import Request
from fastapi import HTTPException
from .api_Endpoints import router as api_routes

ENV=os.getenv("ENV","local")
DEBUG=ENV!="prod"
    
if ENV=="prod":
    app=FastAPI(debug=False,docs_url=None,redoc_url=None,openapi_url=None)
    origins=["https://msglet-frontend.onrender.com"]
else:
    app=FastAPI(debug=True)
    origins=["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET","POST","PUT","DELETE"],
    allow_headers=["Authorization","Content-Type"],
)

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, HTTPException):
        raise exc
    return JSONResponse(status_code=500,content={"detail": "Internal server error"})

app.include_router(api_routes)