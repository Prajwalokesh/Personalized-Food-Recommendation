from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.preprocessing import image
import numpy as np
import io
from PIL import Image
import os
import pickle
import pandas as pd
from typing import Optional, List
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

class HealthRecommendationResponse(BaseModel):
    predicted_class: str
    confidence: float
    nutrient_highlights: str
    recommendation: str
    alternative_suggestion: str
    is_safe_for_condition: bool
    safety_message: str
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

# Load health recommendation data
csv_path = "notebook/dataset/indian_food_with_synthetic.csv"
try:
    import pandas as pd
    health_data = pd.read_csv(csv_path)
    print(f"Loaded health data with {len(health_data)} records")
except Exception as e:
    print(f"Warning: Could not load health data - {e}")
    health_data = None

def get_health_recommendation(food_item: str, medical_condition: str):
    """Get health recommendation for a specific food item and medical condition"""
    if health_data is None:
        return None
    
    # Filter data for the specific food and medical condition
    filtered_data = health_data[
        (health_data['Food_Item'].str.lower() == food_item.lower()) & 
        (health_data['Medical_Condition'].str.lower() == medical_condition.lower())
    ]
    
    if not filtered_data.empty:
        row = filtered_data.iloc[0]
        return {
            'nutrient_highlights': row['Nutrient_Highlights'],
            'recommendation': row['Recommendation'],
            'alternative_suggestion': row['Alternative_Suggestion'],
            'affected_nutrient': row['Affected_Nutrient']
        }
    
    # If no exact match, try to find the food item with any condition for general info
    food_data = health_data[health_data['Food_Item'].str.lower() == food_item.lower()]
    if not food_data.empty:
        row = food_data.iloc[0]
        return {
            'nutrient_highlights': row['Nutrient_Highlights'],
            'recommendation': 'Consult with healthcare provider',
            'alternative_suggestion': 'General healthy alternatives',
            'affected_nutrient': 'Various'
        }
    
    return None

def is_food_safe_for_condition(recommendation: str) -> tuple[bool, str]:
    """Determine if food is safe based on recommendation"""
    recommendation_lower = recommendation.lower()
    
    if 'avoid' in recommendation_lower:
        return False, "❌ This food should be avoided for your medical condition."
    elif 'best avoided' in recommendation_lower:
        return False, "⚠️ This food is best avoided for your medical condition."
    elif 'recommended' in recommendation_lower:
        return True, "✅ This food is recommended for your medical condition."
    elif 'moderate intake' in recommendation_lower:
        return True, "⚠️ This food can be consumed in moderation for your medical condition."
    elif 'consume with care' in recommendation_lower:
        return True, "⚠️ You can consume this food but with caution for your medical condition."
    else:
        return True, "ℹ️ General caution advised. Please consult with your healthcare provider."

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

@app.post("/predict-health", response_model=HealthRecommendationResponse)
async def predict_food_with_health_recommendation(
    file: UploadFile = File(...), 
    medical_condition: str = "diabetes"  # Default condition, can be passed as form data
):
    try:
        img_bytes = await file.read()
        
        processed_image = load_and_preprocess_image(img_bytes)
        predictions = model.predict(processed_image, verbose=0)
        predicted_probabilities = predictions[0]
    
        predicted_class_idx = np.argmax(predicted_probabilities)
        predicted_class = food_classes[predicted_class_idx]
        confidence = float(predicted_probabilities[predicted_class_idx])
        
        health_rec = get_health_recommendation(predicted_class, medical_condition)
        
        if health_rec:
            is_safe, safety_message = is_food_safe_for_condition(health_rec['recommendation'])
            
            return HealthRecommendationResponse(
                predicted_class=predicted_class,
                confidence=round(confidence * 100, 2),
                nutrient_highlights=health_rec['nutrient_highlights'],
                recommendation=health_rec['recommendation'],
                alternative_suggestion=health_rec['alternative_suggestion'],
                is_safe_for_condition=is_safe,
                safety_message=safety_message,
                message="Prediction and health recommendation successful"
            )
        else:
            return HealthRecommendationResponse(
                predicted_class=predicted_class,
                confidence=round(confidence * 100, 2),
                nutrient_highlights="Information not available",
                recommendation="Consult with healthcare provider",
                alternative_suggestion="General healthy alternatives recommended",
                is_safe_for_condition=True,
                safety_message="ℹ️ No specific data available for this food and condition combination.",
                message="Prediction successful, but health data not found for this food item"
            )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")

@app.get("/medical-conditions")
async def get_available_medical_conditions():
    """Get list of available medical conditions"""
    if health_data is not None:
        conditions = health_data['Medical_Condition'].unique().tolist()
        return {"medical_conditions": conditions}
    else:
        return {"medical_conditions": ["Diabetes", "Hypertension", "High Cholesterol", "Anemia", "Lactose Intolerance"]}

@app.get("/food-info/{food_name}")
async def get_food_info(food_name: str):
    """Get all available health information for a specific food item"""
    if health_data is None:
        raise HTTPException(status_code=503, detail="Health data not available")
    
    food_info = health_data[health_data['Food_Item'].str.lower() == food_name.lower()]
    
    if food_info.empty:
        raise HTTPException(status_code=404, detail=f"No health information found for {food_name}")
    
    return {
        "food_name": food_name,
        "health_info": food_info.to_dict('records')
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)