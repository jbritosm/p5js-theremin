// Declara una variable para guardar el objeto de sonido
let thereminSound;
let notaPrevia = null;
let brilloBola = 1;
let sBola = 1;

let controlHand;
let handOnScreen = false

let start = false
let mic; // Microphone library


const vibrato = { cantidadVibrato: 15, velocidadVibrato: 1.2}

const hzNotas = [392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 739.99, 784.00, 880.00, 987.8];

function setup() {
  // Crea un lienzo de dibujo en el que se mostrará el sonido
  createCanvas(640, 360);
  
  controlHand = {x: width / 2, y: height / 2}
  // Inicializa el objeto de sonido y establece la frecuencia en 440 Hz
  thereminSound = new p5.Oscillator();
  thereminSound.setType('sine');  
  thereminSound.start();
  thereminSound.amp(0, 0);
  mic = new p5.AudioIn(); 
  mic.start(); // Load the library   
  textAlign(CENTER, CENTER);
  textSize(30);
    
}

function draw() {    
  let vol = mic.getLevel();
    
  background(60);    
  if(start) {    
    theremin();
    drawNotes();  
  } else { 
    if (vol > 0.1) {
      setStart(true)
    }
    drawMainMenu();       
  } 
}

function keyPressed() {
  if (keyCode === ENTER) {
    setStart(true)
  }
}

function drawMainMenu() {
  fill(255);
  text("Theremin virtual, pulsa ENTER para empezar.", width / 2, height / 2);  
}

function setStart(value) {
  start = value
}

function drawNotes() {
  fill(255);
  text("G", width / 10 - width/20, 200);
  text("A", width * 2/ 10 - width/20, 200);
  text("B", width * 3/ 10 - width/20, 200);
  text("C", width * 4/ 10 - width/20, 200);
  text("D", width * 5/ 10 - width/20, 200);
  text("E", width * 6/ 10 - width/20, 200);
  text("F#",width * 7/ 10 - width/20, 200);
  text("G", width * 8/ 10 - width/20, 200);
  text("A", width * 9/ 10 - width/20, 200);
  text("B", width  - width/20, 200);
}

function setIsHandOnScreen(value) {
  handOnScreen = value
}

function theremin() {  
  // Modula la frecuencia y la amplitud del sonido en función de la posición de la mano.
    let nota = floor(map(controlHand.x, 0, width, 0, 10));
    let amp = constrain(map(controlHand.y, height, 0, 0, 1), 0, 1);

    let vibratoNote = cos(frameCount * vibrato.velocidadVibrato) * vibrato.cantidadVibrato;

    if(notaPrevia != null) {
      for (var i = 0; i < 10000; i++) {
        thereminSound.freq(map(i, 0, 10000, notaPrevia, hzNotas[nota]) + vibratoNote);
      }
    }

    if (notaPrevia != hzNotas[nota]) {
      notaPrevia = hzNotas[nota]
    }      
  
  if(!handOnScreen) {
    thereminSound.amp(0,0)
  } else {
    thereminSound.amp(amp, 0.1);
  }   
  
  
   if (sBola > 20 || sBola < 1) {
    brilloBola = - brilloBola;
  }
  
  drawBall()
  
  //Ahora vamos a dibujar una especie de teclado a modo de guía para tocar
  for(let i = 1; i < 10; i++) {
    strokeWeight(3);
    line((width * i)/10, 0,(width * i)/10 ,height);
  }
}

function drawBall() {
  if(handOnScreen) {
    sBola += brilloBola;
    stroke(255, 20);
    strokeWeight(sBola)
    fill(255);
    ellipse(controlHand.x, controlHand.y, map(controlHand.y, height, 0, 20, 50));  
  }
}


