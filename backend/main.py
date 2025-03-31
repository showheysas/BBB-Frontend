from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import cv2
import numpy as np
import face_recognition
import os

app = FastAPI()

# CORS設定（フロントから呼べるように）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    contents = await file.read()
    np_arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    faces = face_recognition.face_locations(rgb_img)

    if faces:
        top, right, bottom, left = faces[0]

        # 顔サイズからマージンを計算（髪の毛を含むように上方向多め）
        height = bottom - top
        width = right - left

        margin_top = int(height * 0.4)     # 上に40%拡張（髪の毛）
        margin_bottom = int(height * 0.2)  # 下に20%
        margin_side = int(width * 0.2)     # 左右に20%

        img_height, img_width, _ = img.shape
        new_top = max(0, top - margin_top)
        new_bottom = min(img_height, bottom + margin_bottom)
        new_left = max(0, left - margin_side)
        new_right = min(img_width, right + margin_side)

        face_img = img[new_top:new_bottom, new_left:new_right]
        face_img = cv2.resize(face_img, (128, 128))

        filename = f"face_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        os.makedirs("saved", exist_ok=True)
        filepath = os.path.join("saved", filename)
        cv2.imwrite(filepath, face_img)

        return {"message": f"顔を保存しました: {filename}"}
    else:
        return {"message": "顔が見つかりませんでした"}
