import cv2
import numpy as np
from typing import List
import tempfile
import os

FRAME_STACK_SIZE = 150
IMG_SIZE = 224

def compute_dense_optical_flow_stack(frame_stack):

    flows = []
    for i in range(0, len(frame_stack)-1):

        prev = cv2.resize(frame_stack[i], (IMG_SIZE, IMG_SIZE))
        next = cv2.resize(frame_stack[i + 1], (IMG_SIZE, IMG_SIZE))

        prev_gray = cv2.cvtColor(prev, cv2.COLOR_BGR2GRAY)
        next_gray = cv2.cvtColor(next, cv2.COLOR_BGR2GRAY)

        flow = cv2.calcOpticalFlowFarneback(
            prev_gray, next_gray,
            None,
            pyr_scale=0.5,
            levels=3,
            winsize=15,
            iterations=3,
            poly_n=5,
            poly_sigma=1.2,
            flags=1
        )

        dx = flow[..., 0]
        dy = flow[..., 1]

        mean_dx = np.mean(dx)
        mean_dy = np.mean(dy)

        flow[..., 0] = np.where(dx >= mean_dx, dx - mean_dx, 0)
        flow[..., 1] = np.where(dy >= mean_dy, dy - mean_dy, 0)

        flow[..., 0] = cv2.normalize(flow[..., 0],None,0,255,cv2.NORM_MINMAX)
        flow[..., 1] = cv2.normalize(flow[..., 1],None,0,255,cv2.NORM_MINMAX)

        flows.append(flow)

        del prev, next, prev_gray, next_gray, flow, dx, dy


    return np.array(flows, dtype=np.float32)


def extract_frames_from_video(video_bytes, resize_shape=(224, 224)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmpfile:
        tmpfile.write(video_bytes)
        tmp_path = tmpfile.name

    cap = cv2.VideoCapture(tmp_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    frames = []
    count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print(f"Frame {count} could not be read.")
            break
        resized_frame = cv2.resize(frame, resize_shape)
        frames.append(resized_frame)
        count += 1

    cap.release()
    os.remove(tmp_path)
    return frames if frames else None

def pad_or_trim_frames(frames, target_length=150):
    current_len = len(frames)
    if current_len >= target_length:
        return frames[:target_length]
    padded_frames = frames.copy()
    while len(padded_frames) < target_length:
        remaining = target_length - len(padded_frames)
        mirrored = frames[::-1][:remaining]
        padded_frames.extend(mirrored)

    return padded_frames
