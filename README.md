#Image Processing Web Application
👤 Author

Ye Myat Oo

📘 Overview

Image Processing Web Application is a browser-based interactive tool built with JavaScript, p5.js, and objectdetect.js.
It uses your webcam to perform real-time image processing and face detection, featuring multiple filters, color space conversions, and RGB channel segmentation.

This project demonstrates practical skills in:

Computer vision

Color space transformation

Image segmentation

Face detection

Real-time UI interaction

Front-end JavaScript development

It was originally developed as part of an academic coursework project and has been upgraded and refactored for portfolio use.

✨ Features
🖼 Webcam Capture & Processing

Live webcam feed

Capture snapshot with a single click

Automatic grayscale + brightness adjustment

Extract Red, Green, and Blue channels independently

🎚 Thresholding (Segmentation)

Per-channel threshold sliders (R, G, B)

Adjustable threshold images for segmentation

Thresholding applied to:

RGB channels

HSV converted image

YCbCr converted image

🎨 Color Space Conversions

HSV (Hue, Saturation, Value)

YCbCr (Luma, Blue-diff, Red-diff)

Live preview + threshold slider per color space

🤖 Face Detection

Real-time face detection using objectdetect.js

Bounding box tracking

Task 13 Facial region processing:

Grayscale

Blur

Pixelate

HSV filter

YCbCr filter

“None” (original)

😺 Fun Face Accessories

Based on a detected face:

Catty ears overlay

Maple leaf overlay

Dropdown menu to switch accessories

🛠 Technologies Used

JavaScript (ES6)

p5.js — rendering, webcam capture, filters

p5.sound.js — included for compatibility

objectdetect.js — frontal face detection

HTML5 Canvas

CSS3
