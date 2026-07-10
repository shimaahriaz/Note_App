from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def ensure_schema() -> None:
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())

    if "users" in existing_tables:
        users_columns = {column["name"] for column in inspector.get_columns("users")}
        if "created_at" not in users_columns:
            with engine.begin() as connection:
                connection.execute(text("ALTER TABLE users ADD COLUMN created_at TIMESTAMPTZ DEFAULT now()"))

    if "notes" in existing_tables:
        notes_columns = {column["name"] for column in inspector.get_columns("notes")}
        if "created_at" not in notes_columns:
            with engine.begin() as connection:
                connection.execute(text("ALTER TABLE notes ADD COLUMN created_at TIMESTAMPTZ DEFAULT now()"))
        if "updated_at" not in notes_columns:
            with engine.begin() as connection:
                connection.execute(text("ALTER TABLE notes ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now()"))
        if "user_id" not in notes_columns:
            with engine.begin() as connection:
                connection.execute(text("ALTER TABLE notes ADD COLUMN user_id INTEGER"))
