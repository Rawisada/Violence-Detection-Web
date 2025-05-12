
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import torch
import numpy as np
import cv2
from model.lstm_model import LSTMModel
from model.spatial_temporal import load_models, extract_spatial_features
from model.utils import compute_dense_optical_flow_stack, extract_frames_from_video
from mtcnn import MTCNN
import random
from fastapi.middleware.cors import CORSMiddleware

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# โหลดโมเดล
yolo_model = torch.hub.load('ultralytics/yolov5', 'yolov5s', force_reload=True)
face_detector = MTCNN()
temporal_model, spatial_model = load_models()

checkpoint = torch.load("model/weights/best_twostream_lstm_model_f1_12-3.pth", map_location=device)
lstm_model = LSTMModel(input_dim=4096, hidden_dim=checkpoint['hyperparameters'][0], output_dim=1).to(device)
lstm_model.load_state_dict(checkpoint['model_state_dict'])
lstm_model.eval()

app = FastAPI()

allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect")
async def detect_segments(file: UploadFile = File(...)):
    video_bytes = await file.read()
    frames = extract_frames_from_video(video_bytes)

    if frames is None or len(frames) < 20:
        return JSONResponse(content={"error": "Not enough frames"}, status_code=400)

    total_frames = len(frames)

    # สุ่ม index 20 อันจากวิดีโอ (เรียงลำดับหลังสุ่มเพื่อรักษา temporal order)
    random_indices = sorted(random.sample(range(total_frames), 20))
    segment_frames = [frames[i] for i in random_indices]

    # Optical Flow
    optical_stack = compute_dense_optical_flow_stack(segment_frames)
    optical_stack = np.expand_dims(optical_stack, axis=0)
    temporal_feat = temporal_model.predict(optical_stack).flatten()

    # Spatial (เฟรมสุดท้ายจาก 20 เฟรมที่สุ่ม)
    spatial_feat = extract_spatial_features(segment_frames[-1])
    spatial_feat = spatial_model.predict(spatial_feat).flatten()
    combined_feat = np.concatenate([spatial_feat, temporal_feat])
    input_tensor = torch.tensor(combined_feat, dtype=torch.float32).unsqueeze(0).unsqueeze(1).to(device)

    with torch.no_grad():
        output = lstm_model(input_tensor)
        print(output)
        is_violence = output.item() > 0.015

    result = {
        "violence": is_violence,
    }

    # ตรวจ BHR จากเฟรมสุดท้ายที่สุ่มมา
    bhr_results = []
    if is_violence:
        last_frame = segment_frames[-1]
        results = yolo_model(last_frame)
        detections = results.xyxy[0]

        for det in detections:
            cls = int(det[5])
            conf = float(det[4])
            if cls == 0 and conf >= 0.7:
                x1, y1, x2, y2 = map(int, det[:4])
                roi = last_frame[y1:y2, x1:x2]
                faces = face_detector.detect_faces(roi)

                bhr_label = "Unknown"
                head_length = 0

                for face in faces:
                    fx, fy, fw, fh = face['box']
                    if fy < (y2 - y1) * 0.3:
                        head_length = fh
                        break

                body_length = y2 - y1
                bhr = body_length / head_length if head_length > 0 else 0

                if bhr < 3:
                    bhr_label = "Human"
                elif bhr < 8:
                    bhr_label = "Child"
                else:
                    bhr_label = "Adult"

                bhr_results.append({
                    "position": [x1, y1, x2, y2],
                    "bhr": round(bhr, 2),
                    "label": bhr_label,
                    "confidence": round(conf, 2)
                })

    result["bhr_results"] = bhr_results

    return JSONResponse(content=result)
