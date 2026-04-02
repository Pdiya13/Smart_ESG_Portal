import socket
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "ML-SERVICE"
    eureka_server_url: str = "http://localhost:8761/eureka"
    host_name: str = socket.gethostname()
    host_ip: str = socket.gethostbyname(socket.gethostname())
    port: int = 8000
    
    class Config:
        env_file = ".env"

settings = Settings()
