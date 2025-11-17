var w = 160, h = 120;
let webcam, snapshot, grayscaleImage, redChannel, greenChannel, blueChannel;
let captureButton;
let colorSpace1, colorSpace2;
let thresholdRed, thresholdGreen, thresholdBlue;
//Sliders for threshold
let redThresholdSlider, greenThresholdSlider, blueThresholdSlider;
//Variables for thresholded color space images:
let thresholdColorSpace1, thresholdColorSpace2;
let detector; 
let faceDetected = null; 
let detectionCooldown = 5;
let currentFilter = 'None';
let extCapture;
let cattyImg, mapleLeafImg;
let dropdown;
let selectedAccessory = "None";


function setup() {
    createCanvas(1400, 1000);
    background(255);

    webcam = createCapture(VIDEO);
    webcam.size(w, h);
    webcam.hide();

    captureButton = createButton('Capture Snapshot');
    //captureButton.position(20, 160);
    captureButton.mousePressed(takeSnapshot);

    redThresholdSlider = createSlider(0, 255, 128);
    redThresholdSlider.position(20, 160 + h + 10);

    greenThresholdSlider = createSlider(0, 255, 128);
    greenThresholdSlider.position(200, 160 + h + 10);

    blueThresholdSlider = createSlider(0, 255, 128);
    blueThresholdSlider.position(380, 160 + h + 10);

    // Create threshold sliders for color space conversions
    cs1ThresholdSlider = createSlider(0, 255, 128);
    cs1ThresholdSlider.position(20 + (w + 20), 150 + (h * 3) + 10); 

    cs2ThresholdSlider = createSlider(0, 255, 128);
    cs2ThresholdSlider.position(20 + 2*(w + 20), 150 + (h * 3) + 10);  

  detector = new objectdetect.detector(w, h, 1.1, objectdetect.frontalface);

  dropdown = createSelect();
    dropdown.position(600, 160);
    dropdown.option("None");
    dropdown.option("Catty");
    dropdown.option("Maple Leaf");

    dropdown.changed(() => {
        selectedAccessory = dropdown.value();
        console.log(`Selected accessory: ${selectedAccessory}`);
    });

}

function draw() {
  background(220); // Clear background

  detectLiveFace(); // Face detection

  extension(); // webcam processing (for catty & maple leaf)

  let gridX = 20;
  let gridY = 20;
  let gridSpacingX = w + 20; // Horizontal spacing
  let gridSpacingY = h + 20; // Vertical spacing

  // Row 1 - Webcam Image, Grayscale, and Capture Button
  image(webcam, gridX, gridY, w, h);
  if (grayscaleImage) image(grayscaleImage, gridX + gridSpacingX, gridY, w, h);
  captureButton.position(gridX + gridSpacingX * 2, gridY + h / 2);

  // Row 2 - RGB Channels 
  if (redChannel) image(redChannel, gridX, gridY + gridSpacingY, w, h);
  if (greenChannel) image(greenChannel, gridX + gridSpacingX, gridY + gridSpacingY, w, h);
  if (blueChannel) image(blueChannel, gridX + gridSpacingX * 2, gridY + gridSpacingY, w, h);

  // Row 2 (right) - Live Webcam Capture beside Dropdown
  let liveWebcamX = dropdown.x + dropdown.width + 20; // Right-side position
  let liveWebcamY = 160;  // Align with second row
  image(webcam, liveWebcamX, liveWebcamY, w, h); 

  // Read slider values
  let rVal = redThresholdSlider.value();
  let gVal = greenThresholdSlider.value();
  let bVal = blueThresholdSlider.value();

  // Generate thresholded images from the channel images
  if (redChannel) thresholdRed = thresholdFilter(redChannel, rVal);
  if (greenChannel) thresholdGreen = thresholdFilter(greenChannel, gVal);
  if (blueChannel) thresholdBlue = thresholdFilter(blueChannel, bVal);

  // Row 3 - Thresholded Red, Green, Blue
  if (thresholdRed) image(thresholdRed, gridX, gridY + gridSpacingY * 2, w, h);
  if (thresholdGreen) image(thresholdGreen, gridX + gridSpacingX, gridY + gridSpacingY * 2, w, h);
  if (thresholdBlue) image(thresholdBlue, gridX + gridSpacingX * 2, gridY + gridSpacingY * 2, w, h);

  // Row 4 - Color Space Conversions
  image(webcam, gridX, gridY + gridSpacingY * 3, w, h);
  if (colorSpace1) image(colorSpace1, gridX + gridSpacingX, gridY + gridSpacingY * 3, w, h);
  if (colorSpace2) image(colorSpace2, gridX + gridSpacingX * 2, gridY + gridSpacingY * 3, w, h);

  if (cs1ThresholdSlider) {
      cs1ThresholdSlider.position(gridX + gridSpacingX, (gridY + gridSpacingY * 3) + h + 10);
  }
  if (cs2ThresholdSlider) {
      cs2ThresholdSlider.position(gridX + gridSpacingX * 2, (gridY + gridSpacingY * 3) + h + 10);
  }
  // ------------------------------
// Row 5 - Face Detection with Task 13 Filters (Dynamic Box)
  if (faceDetected) {
  let faceX = faceDetected[0];  
  let faceY = faceDetected[1];  
  let faceWidth = faceDetected[2];  
  let faceHeight = faceDetected[3]; 

  let gridFaceX = gridX;
  let gridFaceY = gridY + gridSpacingY * 4;
  let gridFaceWidth = w;
  let gridFaceHeight = h;

  let scaleX = gridFaceWidth / faceWidth;
  let scaleY = gridFaceHeight / faceHeight;

  let adjustedFaceWidth = faceWidth * scaleX;
  let adjustedFaceHeight = faceHeight * scaleY;

  noFill();
  stroke(255, 0, 0);
  strokeWeight(2);
  rect(gridFaceX + (gridFaceWidth - adjustedFaceWidth) / 2, 
       gridFaceY + (gridFaceHeight - adjustedFaceHeight) / 2, 
       adjustedFaceWidth, adjustedFaceHeight);

  // Apply Task 13 Filters Only to the Detected Face
  let processedFace = applyFilter([faceX, faceY, faceWidth, faceHeight], currentFilter);

  image(processedFace, gridFaceX, gridFaceY, gridFaceWidth, gridFaceHeight);
  }

  if (colorSpace1) {
    let cs1Threshold = cs1ThresholdSlider.value();
    thresholdColorSpace1 = thresholdColorSpaceFilter(colorSpace1, cs1Threshold);
    image(thresholdColorSpace1, gridX + gridSpacingX, gridY + gridSpacingY * 4, w, h);
  }
  if (colorSpace2) {
    let cs2Threshold = cs2ThresholdSlider.value();
    thresholdColorSpace2 = thresholdColorSpaceFilter(colorSpace2, cs2Threshold);
    image(thresholdColorSpace2, gridX + gridSpacingX * 2, gridY + gridSpacingY * 4, w, h);
  }
  // ------------------------------
  // (EXTENSIONS: Maple Leaf & Catty)
  if (selectedAccessory !== "None" && faceDetected) {
    let faceX = faceDetected[0];
    let faceY = faceDetected[1];
    let faceWidth = faceDetected[2];
    let faceHeight = faceDetected[3];

    let accessoryImg = selectedAccessory === "Catty" ? cattyImg : mapleLeafImg;

    // Debugging
    console.log(`Applying ${selectedAccessory} at X:${faceX} Y:${faceY} W:${faceWidth} H:${faceHeight}`);

    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    rect(liveWebcamX + faceX, liveWebcamY + faceY, faceWidth, faceHeight);

    // Ensure valid width and height before applying filter
    if (faceWidth > 0 && faceHeight > 0) {
        image(accessoryImg, liveWebcamX + faceX, liveWebcamY + faceY, faceWidth, faceHeight);
        }
  }
  // ------------------------------
  // Text Instructions
  fill(255, 0, 0); 
  textSize(16);
  textAlign(LEFT);
  let instructionX = 20;
  let instructionY = gridY + gridSpacingY * 5 + 20;

  text("Press 1 for None", instructionX, instructionY);
  text("Press 2 for Greyscale", instructionX, instructionY + 20);
  text("Press 3 for Blur", instructionX, instructionY + 40);
  text("Press 4 for Pixelate", instructionX, instructionY + 60);
  text("Press 5 for HSV", instructionX, instructionY + 80);
  text("Press 6 for YCbCr", instructionX, instructionY + 100);
}

function takeSnapshot() {
  snapshot = createImage(w, h);
  snapshot.copy(webcam, 0, 0, webcam.width, webcam.height, 0, 0, w, h);

  // Automatically process grayscale and RGB channels
  grayscaleImage = convertToGrayscale(snapshot);
  redChannel = extractRedChannel(snapshot);
  greenChannel = extractGreenChannel(snapshot);
  blueChannel = extractBlueChannel(snapshot);

  // Color space conversions
  colorSpace1 = convertToHSV(snapshot);
  colorSpace2 = convertToYCbCr(snapshot);

  colorSpace1 = convertToHSV(snapshot); 
  colorSpace2 = convertToYCbCr(snapshot);  
}

function convertToGrayscale(img) {
  let grayImg = createImage(img.width, img.height);
  img.loadPixels();
  grayImg.loadPixels();

  for (let i = 0; i < img.pixels.length; i += 4) {
      let avg = (img.pixels[i] + img.pixels[i + 1] + img.pixels[i + 2]) / 3 + 51;
      avg = constrain(avg, 0, 255);
      
      grayImg.pixels[i] = avg;
      grayImg.pixels[i + 1] = avg;
      grayImg.pixels[i + 2] = avg;
      grayImg.pixels[i + 3] = 255;
  }

  grayImg.updatePixels();
  return grayImg;
}

function extractRedChannel(img) {
  let redImg = createImage(img.width, img.height);
  img.loadPixels();
  redImg.loadPixels();

  for (let i = 0; i < img.pixels.length; i += 4) {
      redImg.pixels[i] = img.pixels[i];  // Keep Red
      redImg.pixels[i + 1] = 0;
      redImg.pixels[i + 2] = 0;
      redImg.pixels[i + 3] = 255;
  }

  redImg.updatePixels();
  return redImg;
}

function extractGreenChannel(img) {
  let greenImg = createImage(img.width, img.height);
  img.loadPixels();
  greenImg.loadPixels();

  for (let i = 0; i < img.pixels.length; i += 4) {
      greenImg.pixels[i] = 0;
      greenImg.pixels[i + 1] = img.pixels[i + 1];  // Keep Green
      greenImg.pixels[i + 2] = 0;
      greenImg.pixels[i + 3] = 255;
  }

  greenImg.updatePixels();
  return greenImg;
}

function extractBlueChannel(img) {
  let blueImg = createImage(img.width, img.height);
  img.loadPixels();
  blueImg.loadPixels();

  for (let i = 0; i < img.pixels.length; i += 4) {
      blueImg.pixels[i] = 0;
      blueImg.pixels[i + 1] = 0;
      blueImg.pixels[i + 2] = img.pixels[i + 2];  // Keep Blue
      blueImg.pixels[i + 3] = 255;
  }

  blueImg.updatePixels();
  return blueImg;
}

function thresholdFilter(imgIn, thresholdValue) {
  
  let outImg = createImage(imgIn.width, imgIn.height);

  // Load pixel data for both images
  imgIn.loadPixels();
  outImg.loadPixels();

  let adjustedThreshold = thresholdValue +10; 
 
  for (let y = 0; y < imgIn.height; y++) {
    for (let x = 0; x < imgIn.width; x++) {

      let index = (y * imgIn.width + x) * 4;

      let r = imgIn.pixels[index + 0];
      let g = imgIn.pixels[index + 1];
      let b = imgIn.pixels[index + 2];

      let avg = (r + g + b) / 3;

      let outVal = (avg > thresholdValue) ? 255 : 0;

      outImg.pixels[index + 0] = outVal;
      outImg.pixels[index + 1] = outVal;
      outImg.pixels[index + 2] = outVal;
      outImg.pixels[index + 3] = 255; // Full alpha
    }
  }
  // Update the output image's pixel data
  outImg.updatePixels();
  return outImg;
}

function convertToHSV(img) {
  let hsvImg = createImage(img.width, img.height);
  img.loadPixels();
  hsvImg.loadPixels();
  
  colorMode(HSB, 360, 100, 100);
  for (let i = 0; i < img.pixels.length; i += 4) {
    let r = img.pixels[i];
    let g = img.pixels[i+1];
    let b = img.pixels[i+2];
    
    // Create a color and extract its H, S, B components
    let col = color(r, g, b);
    let hVal = hue(col);
    let sVal = saturation(col);
    let bVal = brightness(col);
    
    let hsvCol = color(hVal, sVal, bVal);
    
    colorMode(RGB, 255);
    hsvImg.pixels[i] = red(hsvCol);
    hsvImg.pixels[i+1] = green(hsvCol);
    hsvImg.pixels[i+2] = blue(hsvCol);
    hsvImg.pixels[i+3] = 255;
    
    colorMode(HSB, 360, 100, 100);
  }
  hsvImg.updatePixels();
  
  colorMode(RGB, 255);
  return hsvImg;
}

function convertToYCbCr(img) {
  let ycbcrImg = createImage(img.width, img.height);
  img.loadPixels();
  ycbcrImg.loadPixels();
  
  for (let i = 0; i < img.pixels.length; i += 4) {
    let r = img.pixels[i];
    let g = img.pixels[i+1];
    let b = img.pixels[i+2];
    
    // Standard YCbCr conversion formulas
    let Y  = 0.299 * r + 0.587 * g + 0.114 * b;
    let Cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    let Cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
    
    let outR = Y + 1.402 * (Cr - 128);
    let outG = Y - 0.344136 * (Cb - 128) - 0.714136 * (Cr - 128);
    let outB = Y + 1.772 * (Cb - 128);
    
    ycbcrImg.pixels[i]   = constrain(outR, 0, 255);
    ycbcrImg.pixels[i+1] = constrain(outG, 0, 255);
    ycbcrImg.pixels[i+2] = constrain(outB, 0, 255);
    ycbcrImg.pixels[i+3] = 255;
  }
  ycbcrImg.updatePixels();
  return ycbcrImg;
}

function thresholdColorSpaceFilter(img, thresholdValue) {
  let outImg = createImage(img.width, img.height);
  img.loadPixels();
  outImg.loadPixels();
  
  for (let i = 0; i < img.pixels.length; i += 4) {
    
    let avg = (img.pixels[i] + img.pixels[i + 1] + img.pixels[i + 2]) / 3;
    
    let outVal = (avg > thresholdValue) ? 255 : 0;
    
    outImg.pixels[i] = outVal;
    outImg.pixels[i + 1] = outVal;
    outImg.pixels[i + 2] = outVal;
    outImg.pixels[i + 3] = 255;
  }
  
  outImg.updatePixels();
  return outImg;
}

function detectLiveFace() {
  if (!webcam) return;

  webcam.loadPixels();
  if (webcam.pixels.length > 0) {
      let rects = detector.detect(webcam.canvas);

      if (rects.length > 0) {
          let r = rects[0]; 
          faceDetected = [r[0], r[1], r[2], r[3]]; // Track face dynamically
          detectionCooldown = 5; 
      } else {
          if (detectionCooldown > 0) {
              detectionCooldown--; 
          } else {
              faceDetected = null; 
          }
      }
  }
}

function keyPressed() {
  if (key === '2') {
      currentFilter = 'Grayscale';
  } 
  else if (key === '3') {
      currentFilter = 'Blur';
  } 
  else if (key === '4') {
      currentFilter = 'Pixelate';
  } 
  else if (key === '5') {
      currentFilter = 'HSV';
  } 
  else if (key === '6') {
      currentFilter = 'YCbCr';
  } 
  else if (key === '1') {
      currentFilter = 'None';
  }
  console.log(`Filter changed to: ${currentFilter}`);
}

function applyFilter(faceData, mode) {
  let faceX = faceData[0];
  let faceY = faceData[1];
  let faceWidth = faceData[2];
  let faceHeight = faceData[3];

  let filteredFace = createImage(faceWidth, faceHeight);
  filteredFace.copy(webcam, faceX, faceY, faceWidth, faceHeight, 0, 0, faceWidth, faceHeight);

  if (mode === 'Grayscale') {
      return convertToGrayscale(filteredFace);
  } else if (mode === 'Blur') {
      filteredFace.filter(BLUR, 3);
      return filteredFace;
  } else if (mode === 'Pixelate') {
      return pixelateImage(filteredFace, 8);
  } else if (mode === 'HSV') {
      return convertToHSV(filteredFace);
  } else if (mode === 'YCbCr') {
      return convertToYCbCr(filteredFace);
  }
  return filteredFace;
}

function pixelateImage(img, blockSize) {
  let pixelatedImg = createImage(img.width, img.height);
  img.loadPixels();
  pixelatedImg.loadPixels();

  for (let y = 0; y < img.height; y += blockSize) {
      for (let x = 0; x < img.width; x += blockSize) {
          let index = (y * img.width + x) * 4;

          let r = img.pixels[index];
          let g = img.pixels[index + 1];
          let b = img.pixels[index + 2];

          for (let dy = 0; dy < blockSize; dy++) {
              for (let dx = 0; dx < blockSize; dx++) {
                  let newX = x + dx;
                  let newY = y + dy;
                  if (newX < img.width && newY < img.height) {
                      let newIndex = (newY * img.width + newX) * 4;
                      pixelatedImg.pixels[newIndex] = r;
                      pixelatedImg.pixels[newIndex + 1] = g;
                      pixelatedImg.pixels[newIndex + 2] = b;
                      pixelatedImg.pixels[newIndex + 3] = 255;
                  }
              }
          }
      }
  }

  pixelatedImg.updatePixels();
  return pixelatedImg;
}

function preload() {
  cattyImg = loadImage("assets//catty.png");
  mapleLeafImg = loadImage("assets//maple_leaf.png");
}

function extension() {
  if (!faceDetected) return;

  let faceX = faceDetected[0];
  let faceY = faceDetected[1];
  let faceWidth = faceDetected[2];
  let faceHeight = faceDetected[3];

  let liveFaceX = dropdown.x + dropdown.width + 20;
  let liveFaceY = 160;

  noFill();
  stroke(255, 0, 0);
  strokeWeight(2);
  rect(liveFaceX + faceX, liveFaceY + faceY, faceWidth, faceHeight);

  // Apply accessory image filter
  let accessoryImg = selectedAccessory === "Catty" ? cattyImg : mapleLeafImg;

  if (selectedAccessory !== "None") {
      image(accessoryImg, liveFaceX + faceX, liveFaceY + faceY, faceWidth, faceHeight);
  }
}

/*  
Final Coursework: An Image Processing Application 

**Abstract**
This project involved implementing image processing techniques on a both dynamic and static webcam feed,
focusing on grayscale conversion, color channels extraction, focusing on grayscale conversion, and face
deteciton with dynamic tracking.

**Challenges**
I have encounter several challenges during the development, including maintaining a dynamically tracking 
face detection box, ensuring filters and aligning processed images properly with the grid layout. 

Despite facing all these setbacks the project was successfully conpleted. Adjustments, such as refining face detection
logic and fixing UI inconsistencies helped ensure the system function as intended. 

**Future Updates**
If given more time, improving computational efficiency and implementing more advanced smooting techinques and thresholding
results would be considered. 

**Extension**
The extension feature allows the application to customize the filters with custom accessories (Catty and Maple Leaf) to
detected faces, adds a fun and unique aspect to the project. It tracks the real-time face movenment, and dynamically applies 
the filter to it. 
*/