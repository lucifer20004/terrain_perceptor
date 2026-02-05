from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import shutil, uuid, os
import numpy as np
import cv2

from BACKEND.infer_single_image import run_inference
from BACKEND.visualize import colorize_mask


app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("BACKEND/uploads", exist_ok=True)
os.makedirs("BACKEND/outputs", exist_ok=True)

app.mount("/outputs", StaticFiles(directory="BACKEND/outputs"), name="outputs")


@app.get("/")
def home():
    return {"status": "Terrain Reasoner running"}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    try:
        uid = str(uuid.uuid4())
        img_path = f"BACKEND/uploads/{uid}.jpg"
        out_path = f"BACKEND/outputs/{uid}.png"

        # Save uploaded file
        with open(img_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        print(f"✓ Image saved to {img_path}")

        # Run inference
        mask = run_inference(img_path)
        print(f"✓ Inference complete. Mask shape: {mask.shape}")

        # Colorize and save
        colored = colorize_mask(mask)
        cv2.imwrite(out_path, colored)
        print(f"✓ Colored mask saved to {out_path}")
        
        # Verify file exists
        if os.path.exists(out_path):
            file_size = os.path.getsize(out_path)
            print(f"✓ File verified. Size: {file_size} bytes")
        else:
            print(f"✗ ERROR: File not created at {out_path}")

        detected = np.unique(mask).tolist()
        print(f"✓ Detected classes: {detected}")

        instructions = []
        status = "SAFE"

        if 1 in detected:
            instructions.append("Loose sand detected: maintain steady throttle")
        if 2 in detected:
            instructions.append("Vegetation present: avoid off-track movement")
        if 3 in detected:
            instructions.append("Clear sky: visibility good")
        if 4 in detected:
            instructions.append("Rocky terrain ahead: reduce speed")
            status = "DANGER"

        response = {
            "uid": uid,
            "segmented_image": f"/outputs/{uid}.png",
            "status": status,
            "instructions": instructions
        }
        print(f"✓ Response: {response}")
        return response
        
    except Exception as e:
        print(f"✗ ERROR in analyze: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}
