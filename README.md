# Detecting and Classifying Violence between Children and Adults
ระบบตรวจจับและจำแนกพฤติกรรมความรุนแรงจากวิดีโอด้วยโมเดล Deep Learning แบบ Two-Stream CNN (RGB + Optical Flow) ออกแบบมาเพื่อแยกแยะพฤติกรรมรุนแรงระหว่างเด็กและผู้ใหญ่ พร้อมด้วย Web Interface สำหรับการทดสอบและแสดงผลลัพธ์แบบเรียลไทม์

# System Overview
- ใช้โมเดล Two-Stream CNN (RGB + Optical Flow) ที่ฝึกจากชุดข้อมูล RWF-2000
- รองรับการตรวจจับพฤติกรรมรุนแรงทั้งในผู้ใหญ่และเด็ก
- มี Web Interface ให้ผู้ใช้สามารถอัปโหลดวิดีโอหรือตรวจสอบผลได้ผ่านเบราว์เซอร์
- มี REST API รองรับการเรียกใช้งานโมเดลผ่าน backend (FastAPI)

# โครงสร้างระบบ
- `violence-detection-app/` — ส่วนติดต่อผู้ใช้ (UI) สำหรับอัปโหลดวิดีโอ, ดูผลลัพธ์
- `violence_api/` — FastAPI ที่ให้บริการ API สำหรับวิเคราะห์วิดีโอด้วยโมเดลตรวจจับความรุนแรง
- `models/` — ไฟล์โมเดลที่ฝึกไว้ (.h5, .pt)
- `requirements.txt` — รายการไลบรารีที่จำเป็นสำหรับ backend

# การเริ่มต้นใช้งาน
1. Clone โปรเจกต์
https://github.com/Rawisada/Violence-Detection-Web.git
cd Violence-Detection-Web

2. ติดตั้งและรัน Web Interface
cd violence-detection-app
npm install
npm run dev
http://localhost:3000

3. ติดตั้งและรัน APIs
cd violence_api
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8001

# Requirements
- Python: ≥ 3.8
- Node.js: ≥ 16
- MongoDB: ≥ 5.0
- ffmpeg
- โมเดล .h5 หรือ .pt ต้องอยู่ในโฟลเดอร์ models/ ก่อนรัน API
- violence_twostream_cnn_model_rwf_2000.h5
- head_detection_8n.pt

# ตัวอย่างการใช้งาน
- อัปโหลดวิดีโอผ่านหน้าเว็บ
- ระบบจะประมวลผลและแสดงผลการจำแนกเป็น “ความรุนแรง” หรือ “ไม่รุนแรง”  พร้อมกราฟและรายละเอียด

