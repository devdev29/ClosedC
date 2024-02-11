from pydantic import BaseModel

class PriceBody(BaseModel):
    chain_id: str
    token_id: int
