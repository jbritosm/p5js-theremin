const videoElement = document.getElementsByClassName('input_video')[0];
const movementMultiplier = 1;
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

function onResults(results) {     
  
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 5});
      drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
    }
  }
  canvasCtx.restore();
  
  if (results.multiHandLandmarks[0]) {        
    controlHand.x = width - normalizedToPixel(results.multiHandLandmarks[0][9].x, width)
    controlHand.y = normalizedToPixel(results.multiHandLandmarks[0][9].y, height) 
    setIsHandOnScreen(true)
  } else {
    controlHand.x = width / 2
    controlHand.y = height / 2
    setIsHandOnScreen(false);
  }
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 640,
  height: 360
});

function normalizedToPixel(value, total) {
  return value * total * movementMultiplier
}

camera.start();
