import os
from typing import List


class Settings:
    """Runtime settings loaded from environment variables."""

    def __init__(self) -> None:
        # Load from environment; .env is loaded in main.py using python-dotenv
        self.SECRET_KEY: str | None = os.getenv("SECRET_KEY")
        self.DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./data.sqlite")
        self.ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
        self.CORS_ORIGINS: List[str] = self._parse_origins(os.getenv("CORS_ORIGINS", "*"))

    @staticmethod
    def _parse_origins(value: str) -> List[str]:
        if not value:
            return ["*"]
        v = value.strip()
        if v == "*":
            return ["*"]
        return [o.strip() for o in v.split(",") if o.strip()]


# PUBLIC_INTERFACE
def get_settings() -> Settings:
    """Return singleton settings instance for the application."""
    # Singleton instance cached on module
    global _settings
    try:
        return _settings  # type: ignore[name-defined]
    except NameError:
        _settings = Settings()  # type: ignore[assignment]
        return _settings
