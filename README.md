# 📸 Image Processing Web Application

## 👤 Author  
**Ye Myat Oo**

---

## 📘 Overview

The **Image Processing Web Application** is a browser-based interactive tool built using **JavaScript**, **p5.js**, and **objectdetect.js**.  
It uses your **webcam** to perform real-time image processing, color transformations, face detection, and fun overlay effects.

This project demonstrates practical experience in:

- Computer vision  
- Image processing  
- Color space transformations  
- Real-time interactivity  
- Front-end development with JavaScript  

Originally created as an academic coursework project, this version is refined for portfolio and professional use.

---

## ✨ Features

### 🖼 Webcam Capture & Image Processing
- Live webcam preview  
- One-click snapshot capture  
- Automatic grayscale conversion + brightness enhancement  
- Separate **Red**, **Green**, **Blue** channel extraction  

### 🎚 Thresholding (Segmentation)
- Adjustable sliders for R/G/B thresholding  
- Per-channel thresholded outputs  
- Thresholding applied to:
  - RGB channels  
  - HSV converted image  
  - YCbCr converted image  

### 🎨 Color Space Conversions
- **HSV (Hue, Saturation, Value)**  
- **YCbCr (Luma, Blue-diff, Red-diff)**  
- Real-time preview and threshold control  

### 🤖 Face Detection
- Live face detection using `objectdetect.js`  
- Face region tracking box  
- Multiple face-region filters:
  - Grayscale  
  - Blur  
  - Pixelation  
  - HSV filter  
  - YCbCr filter  
  - None (original)  

### 😺 Overlay Accessories
Based on detected face position:

- **Catty Ears overlay**
- **Maple Leaf overlay**
- Dropdown to switch accessories live  

---

## 🛠 Technologies Used

- **JavaScript (ES6)**  
- **p5.js** – rendering & webcam capture  
- **p5.sound.js** – compatibility  
- **objectdetect.js** – Frontal face detection  
- **HTML5 Canvas**  
- **CSS3**  

---

Image-Processing-Web-Application/
│
├── index.html
├── sketch.js
├── style.css
├── README.md
│
├── libraries/
│ ├── p5.min.js
│ ├── p5.sound.min.js
│ ├── objectdetect.js
│ └── objectdetect.frontalface.js
│
└── assets/
├── catty.png
└── maple_leaf.png

---

## 🚀 How to Run Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Yemo001/Image-Processing-Web-Application.git
cd Image-Processing-Web-Application
Serve using a local server

Directly opening index.html will NOT work due to webcam HTTPS requirements.

VS Code Live Server (Recommended)

Install the Live Server extension

Right-click index.html → Open with Live Server
## 📁 Folder Structure

