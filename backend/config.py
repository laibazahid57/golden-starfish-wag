from pydantic_settings import BaseSettings

# Settings configuration
class Settings(BaseSettings):
    MONGODB_URI: str
    DB_NAME: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    class Config:
        env_file = ".env"

# Initialize settings
settings = Settings()