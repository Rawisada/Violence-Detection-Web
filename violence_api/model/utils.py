import cv2
import numpy as np
from typing import List
import tempfile
import os

def compute_dense_optical_flow_stack(frame_stack: List[np.ndarray]):
    optical_flows = []
    prev_gray = cv2.cvtColor(cv2.resize(frame_stack[0], (224, 224)), cv2.COLOR_BGR2GRAY)
    for i in range(1, len(frame_stack)):
        gray = cv2.cvtColor(cv2.resize(frame_stack[i], (224, 224)), cv2.COLOR_BGR2GRAY)
        flow_fwd = cv2.calcOpticalFlowFarneback(prev_gray, gray, None, 0.5, 3, 15, 3, 5, 1.2, 0)
        flow_bwd = cv2.calcOpticalFlowFarneback(gray, prev_gray, None, 0.5, 3, 15, 3, 5, 1.2, 0)
        flow_diff = np.linalg.norm(flow_fwd + flow_bwd, axis=2)
        flow_valid_mask = flow_diff < 1.0
        flow_combined = (flow_fwd - flow_bwd) / 2.0
        mean_flow = np.mean(flow_combined, axis=(0, 1), keepdims=True)
        flow_combined -= mean_flow
        flow_x = flow_combined[..., 0]
        flow_y = flow_combined[..., 1]
        mag, _ = cv2.cartToPolar(flow_x, flow_y)

        dense_optical_flow = np.zeros((224, 224, 3), dtype=np.float32)
        dense_optical_flow[..., 0] = flow_x * flow_valid_mask
        dense_optical_flow[..., 1] = flow_y * flow_valid_mask
        dense_optical_flow[..., 2] = mag * flow_valid_mask
        optical_flows.append(dense_optical_flow)
        prev_gray = gray

    if not optical_flows:
        return None

    stacked_flow = np.mean(np.stack(optical_flows), axis=0)
    stacked_flow = cv2.normalize(stacked_flow, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    return stacked_flow

def extract_frames_from_video(video_bytes, num_frames=None):
    # เขียนไฟล์ชั่วคราว
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmpfile:
        tmpfile.write(video_bytes)
        tmp_path = tmpfile.name

    cap = cv2.VideoCapture(tmp_path)
    frames = []
    count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)
        count += 1
        if num_frames is not None and count >= num_frames:
            break

    cap.release()
    os.remove(tmp_path)  # ลบไฟล์ชั่วคราว

    return frames if frames else None
