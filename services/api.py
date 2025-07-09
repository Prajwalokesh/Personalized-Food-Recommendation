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
import pandas as pd
from dotenv import load_dotenv
import os
from groq import Groq
import re

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=groq_api_key)

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
    health_analysis: str
    safety_message: str 
    message: str

class HealthResponse(BaseModel):
    status: str

health_prompt = (
    "You are a professional health expert specializing in dietary recommendations for various medical conditions.\n"
    "You have been asked to analyze a specific food item for someone with a particular medical condition.\n\n"
    "### Rules:\n"
    "- Provide comprehensive health analysis based on nutritional science\n"
    "- Sound professional and authoritative, like a real healthcare professional\n"
    "- Focus on evidence-based recommendations and clear guidance\n"
    "- Cover all essential health aspects:\n"
    "  * Nutritional composition and key nutrients present\n"
    "  * Medical compatibility with the specific condition\n"
    "  * Safety assessment for consumption\n"
    "  * Effects on the medical condition\n"
    "  * Risk factors and preventive measures\n"
    "  * Alternative healthier options when applicable\n"
    "- Use clear, structured markdown format with proper sections\n"
    "- Include specific nutritional values and medical insights\n"
    "- Provide actionable recommendations for the patient\n\n"
    "### Input:\n"
    f"FOOD ITEM: {{food}}\n"
    f"MEDICAL CONDITION: {{condition}}\n\n"
    "### Analysis Requirements:\n"
    "Conduct a thorough health analysis covering nutritional assessment, medical compatibility,\n"
    "safety evaluation, and provide specific recommendations for this food-condition combination.\n\n"
    "### Format your response exactly as follows:\n\n"
    "# Health Analysis: {food} for {condition}\n\n"
    "## 🥗 Nutrient Highlights\n\n"
    "[Provide detailed nutritional breakdown with bullet points using - and ** for bold]\n\n"
    "## 📋 Recommendation\n\n"
    "[Give specific, actionable recommendations with bullet points]\n\n"
    "## 🔄 Alternative Suggestions\n\n"
    "[Suggest healthier alternatives with bullet points]\n\n"
    "## ⚠️ Safety Assessment\n\n"
    "[Assess safety level and provide clear safety guidance]\n\n"
    "## 📊 Effects on Condition\n\n"
    "[Explain positive and negative effects with bullet points]\n\n"
    "## 🚨 Risk Factors\n\n"
    "[Identify risk level and important factors with bullet points]\n\n"
    "Provide your comprehensive health analysis now:"
)



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

csv_path = "notebook/dataset/indian_food_with_synthetic.csv"
try:
    import pandas as pd
    health_data = pd.read_csv(csv_path)
    print(f"Loaded health data with {len(health_data)} records")
except Exception as e:
    print(f"Warning: Could not load health data - {e}")
    health_data = None

def extract_safety_info_from_markdown(markdown_text: str) -> tuple[bool, str]:
    """Extract safety information from markdown response"""
    try:
        # Look for safety assessment section
        safety_section = ""
        lines = markdown_text.split('\n')
        in_safety_section = False
        
        for line in lines:
            if '## ⚠️ Safety Assessment' in line:
                in_safety_section = True
                continue
            elif line.startswith('## ') and in_safety_section:
                break
            elif in_safety_section and line.strip():
                safety_section += line.strip() + " "
        
        # Remove markdown formatting (bold, italics, etc.)
        safety_section = re.sub(r'\*\*(.*?)\*\*', r'\1', safety_section)  
        safety_section = re.sub(r'\*(.*?)\*', r'\1', safety_section)      
        safety_section = re.sub(r'`(.*?)`', r'\1', safety_section)        
        
        safety_lower = safety_section.lower()
        
        if 'avoid' in safety_lower or 'not safe' in safety_lower or 'should not' in safety_lower:
            return False, "❌ This food should be avoided for your medical condition."
        elif 'safe' in safety_lower and 'not' not in safety_lower:
            return True, "✅ This food is safe for your medical condition."
        elif 'caution' in safety_lower or 'moderate' in safety_lower or 'with care' in safety_lower:
            return True, "⚠️ This food can be consumed with caution for your medical condition."
        else:
            return True, "ℹ️ General caution advised. Please consult with your healthcare provider."
    except:
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
    medical_condition: str = "diabetes"  
):
    try:
        img_bytes = await file.read()
        
        processed_image = load_and_preprocess_image(img_bytes)
        predictions = model.predict(processed_image, verbose=0)
        predicted_probabilities = predictions[0]
    
        predicted_class_idx = np.argmax(predicted_probabilities)
        predicted_class = food_classes[predicted_class_idx]
        confidence = float(predicted_probabilities[predicted_class_idx])
        
        response = client.chat.completions.create(
            model = "meta-llama/llama-4-scout-17b-16e-instruct",
            messages = [
                {
                    "role": "system",
                    "content": "You're a health expert specializing in dietary recommendations for various medical conditions. Your task is to provide health advice in markdown format with clear sections and emojis."
                },
                {
                    "role": "user",
                    "content": health_prompt.format(food=predicted_class, condition=medical_condition)
                }
            ],
            temperature = 0.7,   
        )
        health_recommendation = response.choices[0].message.content.strip()
        
        is_safe, safety_message = extract_safety_info_from_markdown(health_recommendation)
        
        return HealthRecommendationResponse(
            predicted_class=predicted_class,
            confidence=round(confidence * 100, 2),
            health_analysis=health_recommendation,
            safety_message=safety_message,
            message="Health analysis completed successfully"
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