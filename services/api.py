from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.preprocessing import image
import numpy as np
import io
from PIL import Image
import os
import pickle
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionResponse(BaseModel):
    predicted_class: str
    confidence: float
    message: str

class HealthResponse(BaseModel):
    status: str

def load_and_preprocess_image(img_bytes):
    try:

        img = Image.open(io.BytesIO(img_bytes))
        
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        img = img.resize((300, 300))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        
        return img_array
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")
    
model_path ="models/model.h5"

model = tf.keras.models.load_model(model_path)
    
encoder_path ="models/label_encoder.pkl"

with open(encoder_path, 'rb') as f:
    label_encoder = pickle.load(f)
    food_classes = list(label_encoder.classes_)

@app.get("/", response_model=HealthResponse)
async def root():
    return HealthResponse(
        status="healthy"
    )

@app.post("/predict", response_model=PredictionResponse)
async def predict_food(file: UploadFile = File(...)):
    try:
        img_bytes = await file.read()
        
        processed_image = load_and_preprocess_image(img_bytes)
        predictions = model.predict(processed_image, verbose=0)
        predicted_probabilities = predictions[0]
    
        predicted_class_idx = np.argmax(predicted_probabilities)
        predicted_class = food_classes[predicted_class_idx]
        confidence = float(predicted_probabilities[predicted_class_idx])       
        
        return PredictionResponse(
            predicted_class=predicted_class,
            confidence=round(confidence * 100, 2),
            message="Prediction successful"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)