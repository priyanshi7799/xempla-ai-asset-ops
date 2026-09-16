from fastapi import FastAPI
from pydantic import BaseModel, Field
import math

app=FastAPI(title='Xempla AssetOps AI',version='1.0.0')
class Telemetry(BaseModel):
    temperature: float=Field(ge=0)
    vibration: float=Field(ge=0)
    load: float=Field(ge=0,le=100)
    health: float=Field(ge=0,le=100)

def score(x:Telemetry):
    thermal=min(x.temperature/20,1)*30
    vibration=min(x.vibration/10,1)*35
    load=max(0,(x.load-60)/40)*20
    health_penalty=(100-x.health)*0.25
    risk=max(0,min(100,thermal+vibration+load+health_penalty))
    band='High' if risk>=65 else 'Medium' if risk>=35 else 'Low'
    factors=[]
    if x.vibration>6:factors.append('elevated vibration')
    if x.temperature>15:factors.append('high thermal reading')
    if x.load>85:factors.append('high operating load')
    if x.health<55:factors.append('degraded health score')
    action='Inspect immediately' if band=='High' else 'Review in planned maintenance' if band=='Medium' else 'Continue monitoring'
    return {'risk_score':round(risk,1),'risk_band':band,'action':action,'factors':factors}

@app.get('/health')
def health(): return {'status':'ok','service':'assetops-ai'}
@app.post('/predict')
def predict(x:Telemetry): return score(x)
