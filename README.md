# 🌵 Terrain Perceptor – AI-Based Terrain Analysis System

Terrain Perceptor is an AI-assisted terrain analysis system designed for **real-time understanding of desert and off-road environments**.  
It takes an input terrain image, generates a **segmented terrain map**, and produces **human-readable navigation reasoning** such as risk level and safety instructions.

This project was built for **TechnoMania 2.0 Hackathon** with a focus on **robustness, explainability, and real-time performance**.

---

## 🚀 Features

- 📸 Upload terrain images via web UI  
- 🧠 Intelligent terrain reasoning (rocks, sand, vegetation, sky)  
- 🎨 Visual segmented output (color-coded)  
- ⚠️ Dynamic risk assessment (SAFE / CAUTION / DANGER)  
- ⚡ FastAPI backend for real-time inference  
- 🌗 Modern frontend with dark/light mode  

---

## 🧩 Tech Stack

### Backend
- **Python**
- **FastAPI**
- **NLP**
- **NumPy**

### Frontend
- **HTML5**
- **CSS3**
- **Vanilla JavaScript**

---

## 📂 Project Structure
<img width="217" height="507" alt="image" src="https://github.com/user-attachments/assets/b45d2560-0554-4854-b86c-9d4dc9295621" />


---

## ⚙️ Installation & Setup

### 1️⃣ Create Virtual Environment (Recommended)

```bash
python -m venv .venv
.venv\Scripts\activate

pip install -requirements.txt

## ▶️ After Running the Project

Once both backend and frontend servers are running:

###Start Backend Server
uvicorn BACKEND.app:app
http://127.0.0.1:8000
###Start frontend Server
cd FRONTEND
python -m http.server 5500


### 1️⃣ Open the Frontend
Open your browser and go to:
http://127.0.0.1:5500

### 2️⃣ Upload a Terrain Image
- Click **“Browse Terrain Scan”**
- Select any terrain/desert/off‑road image

### 3️⃣ Automatic Analysis
After upload, the system will automatically:
- Display the **input image**
- Send the image to the backend for processing
- Generate a **segmented terrain output**
- Produce a **reasoning report** with safety instructions

### 4️⃣ View Results
You will see:
- 🎨 **Segmented Output Image** (color‑coded terrain)
- 🧠 **Reasoning Report** (human‑readable instructions)
- ⚠️ **Risk Status**: SAFE / CAUTION / DANGER  
  (based on near‑field ~5m terrain analysis)

### 5️⃣ Repeat
You can upload multiple images sequentially without restarting the servers.

---

✔ Backend runs continuously on `http://127.0.0.1:8000`  
✔ Frontend communicates with backend via REST API  
✔ Segmented outputs are dynamically updated in the UI  



