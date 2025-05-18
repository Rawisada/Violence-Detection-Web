
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import torch
import numpy as np
from model.utils import compute_dense_optical_flow_stack, extract_frames_from_video, pad_or_trim_frames
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
import warnings
from ultralytics import YOLO

FRAME_STACK_SIZE = 150
head_threshold = 0.5
person_count = 0

warnings.filterwarnings("ignore", category=FutureWarning)

def get_rgb(x):
    return x[..., :3]

def get_opt(x):
    return x[..., 3:]

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
human_model = torch.hub.load('ultralytics/yolov5', 'yolov5n', force_reload=True)
model = load_model(
    "model/weights/violence_twostream_cnn_model_rwf_2000.h5",
    custom_objects={
        'get_rgb': get_rgb,
        'get_opt': get_opt
    }
)
head_model = YOLO("model/weights/head_detection_8n.pt")

app = FastAPI()

allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def detect_human_yolov5(frame):
    results = human_model(frame)
    human_detections = [
        box for box in results.xyxy[0].cpu().numpy()
        if int(box[5]) == 0
    ]
    return human_detections

def detect_head_yolo(frame, head_threshold=0.8):
    results = head_model.predict(source=frame, conf=head_threshold)
    head_boxes = []
    for r in results:
        for box in r.boxes.data:
            x_min, y_min, x_max, y_max, conf, _ = box
            if conf >= head_threshold:
                head_boxes.append((int(x_min), int(y_min), int(x_max), int(y_max), float(conf)))
    return head_boxes

@app.post("/detect")
async def detect_segments(file: UploadFile = File(...)):
    video_bytes = await file.read()
    frames = extract_frames_from_video(video_bytes)
    frames = pad_or_trim_frames(frames, target_length=150)
    frame_stack = frames[:len(frames)-1:4]

    if frames is None or len(frames) < 150:
        return JSONResponse(content={"error": "Not enough frames"}, status_code=400)

    optical_flow_stack = compute_dense_optical_flow_stack(frame_stack)
    result = np.zeros((len(optical_flow_stack), 224, 224, 5), dtype=np.float16)
    result[..., :3] = np.array(frame_stack[:-1], dtype=np.float32)
    result[..., 3:] = optical_flow_stack.astype(np.float32)
    features = np.expand_dims(result, axis=0)
    with torch.no_grad():
        output = model.predict(features)[0][0]
        print(output)
        is_violence = output.item() >= 0.6

    response_data  = {
        "violence": is_violence,
        "bhr_results": []
    }

    if is_violence:
        for i in range(0, len(frame_stack) - 1, 2):
            frame = frame_stack[i]
            human_boxes = detect_human_yolov5(frame)
            head_boxes = detect_head_yolo(frame, head_threshold) if human_boxes else []

            for person_id, box in enumerate(human_boxes):
                x_min, y_min, x_max, y_max, conf = map(float, box[:5])
                if conf < 0.5:
                    continue

                matched_head = None
                for hx1, hy1, hx2, hy2, h_conf in head_boxes:
                    if (
                        hx1 >= x_min and hx2 <= x_max and
                        hy1 >= y_min and hy2 <= y_max
                    ):
                        matched_head = (hx1, hy1, hx2, hy2, h_conf)
                        break

                if matched_head:
                    hx1, hy1, hx2, hy2, hconf = matched_head
                    head_height = hy2 - hy1
                    body_height = y_max - y_min
                    bhr = round(body_height / head_height, 2) if head_height > 0 else 0

                    if bhr < 3:
                        label = "Human"
                    elif bhr < 6:
                        label = "Child"
                    else:
                        label = "Adult"

                    response_data["bhr_results"].append({
                        "position": [int(x_min), int(y_min), int(x_max), int(y_max)],
                        "bhr": bhr,
                        "label": label,
                        "confidence": round(conf, 2)
                    })
                else:
                    response_data["bhr_results"].append({
                        "position": [int(x_min), int(y_min), int(x_max), int(y_max)],
                        "bhr": 0,
                        "label": "Human",
                        "confidence": round(conf, 2)
                    })

    return JSONResponse(content=response_data)
