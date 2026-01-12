// const videoElement = document.getElementById('input_video');
// const canvasElement = document.getElementById('output_canvas');
// const canvasCtx = canvasElement.getContext('2d');
// const scoreLabel = document.getElementById('score');
// const statusLabel = document.getElementById('status');

// function onResults(results) {
//     canvasCtx.save();
//     canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
//     canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

//     if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
//         // Simple logic: If face is detected, engagement is high
//         // In a full version, we check eye gaze coordinates here
//         scoreLabel.innerText = "100%";
//         statusLabel.innerText = "Attentive";
//         statusLabel.style.color = "green";
//     } else {
//         scoreLabel.innerText = "10%";
//         statusLabel.innerText = "Distracted / Away";
//         statusLabel.style.color = "red";
//     }
//     canvasCtx.restore();
// }

// const faceMesh = new FaceMesh({locateFile: (file) => {
//     return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
// }});

// faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5 });
// faceMesh.onResults(onResults);

// const camera = new Camera(videoElement, {
//     onFrame: async () => { await faceMesh.send({image: videoElement}); },
//     width: 640, height: 480
// });
// camera.start();


const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const scoreLabel = document.getElementById('score');
const statusLabel = document.getElementById('status');

// --- NEW STATE VARIABLES ---
let currentStatus = "Analyzing...";
let currentScore = "0%";

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        // Update global state
        currentScore = "100%";
        currentStatus = "Attentive";
        
        // Update UI
        scoreLabel.innerText = currentScore;
        statusLabel.innerText = currentStatus;
        statusLabel.style.color = "green";
    } else {
        // Update global state
        currentScore = "10%";
        currentStatus = "Distracted / Away";
        
        // Update UI
        scoreLabel.innerText = currentScore;
        statusLabel.innerText = currentStatus;
        statusLabel.style.color = "red";
    }
    canvasCtx.restore();
}

// --- NEW FUNCTION: SEND TO BACKEND ---
async function sendReport() {
    const data = {
        score: currentScore,
        status: currentStatus,
        timestamp: new Date().toLocaleString() // Adds date and time
    };

    console.log("Attempting to send report...", data);

    try {
        // This targets the Node.js server we discussed previously
        const response = await fetch('http://localhost:3000/send-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            console.log("Report emailed successfully!");
        }
    } catch (error) {
        console.error("Connection to email server failed. Is the backend running?");
    }
}

// --- NEW TIMER: TRIGGER EVERY 5 MINUTES ---
// 300,000 milliseconds = 5 minutes
setInterval(sendReport, 10000);

const faceMesh = new FaceMesh({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});

faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5 });
faceMesh.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => { await faceMesh.send({image: videoElement}); },
    width: 640, height: 480
});
camera.start();