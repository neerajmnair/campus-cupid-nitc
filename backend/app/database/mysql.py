from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+pymysql://username:password@localhost/nitc_cupid"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
 