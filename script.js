class Options {
  constructor(defaultOptions) {
    this.stepSpeed = defaultOptions?.stepSpeed || 1;
    this.fillStepVis = defaultOptions?.fillStepVis || true;
    this.strokeCircles = defaultOptions?.strokeCircles || true;
    this.maxGain = defaultOptions?.maxGain || .6
    this.maxFreq = defaultOptions?.maxFreq || 1600
    this.minFreq = defaultOptions?.minFreq || 0
  }

  toggleOption(option) {
      this[option] = !this[option]
  }

  increaseOption(option, amount) {
    this[option]+= amount
  }
  decreaseOption(option, amount) {
    this[option]-= amount
  }

  
}

const options = new Options();

class StepVis {
  constructor() {
    this.speed = options.stepSpeed;
    this.x = 0;
  }

  draw() {
    let newX = this.x >= 0 ? (this.x + options.stepSpeed) % width : width;
    this.x = newX
    if (options.fillStepVis) {
      stroke("white");
    } else {
      noStroke()
      noFill()
    }
    line(this.x, 0, this.x, height);
  }

  changeSpeed(speed) {
    this.speed = speed
  }
}

const items = [];

const stepVis = new StepVis();

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  background(0);
  let time = 1 / items.length
  items.forEach(item => item.computeFreq())
  items.forEach((item) => {
    let distanceThru = stepVis.x - item.leftBound;
    if (stepVis.x >= item.leftBound && stepVis.x <= item.rightBound) {
      let gain = Math.abs(Math.sin((Math.PI * distanceThru) / item.diameter));
      item.draw(options.strokeCircles, gain);
      item.play(gain * options.maxGain, time);
    } else {
      item.stop();
      item.draw(options.strokeCircles);
    }
  });
  stepVis.draw();
  if(keyIsDown(37)) {
   options.decreaseOption('stepSpeed', .05)
  } else if(keyIsDown(39)) {
    options.increaseOption('stepSpeed', .05)
  } else if(keyIsDown(79)) {
    options.decreaseOption('maxFreq', 1)
  } else if(keyIsDown(80)) {
    options.increaseOption('maxFreq', 1)
  } else if(keyIsDown(75)) {
    options.decreaseOption('maxFreq', 10)
  } else if(keyIsDown(76)) {
    options.increaseOption('maxFreq', 10)
  }
}

let current;

function mousePressed() {
  current = new Circle(mouseX, mouseY,options);
  items.push(current);
}

function mouseReleased() {
  current.growing = false;
  current = null;
}

const optionKeys = {
  'f': () => options.toggleOption('fillStepVis'),
  'c': () => options.toggleOption('strokeCircles')
}

function keyTyped() {
  if(key in optionKeys) {
    optionKeys[key]();
  }
  console.log(keyCode)
 
}

window.addEventListener("resize", () => {
  resizeCanvas(window.innerWidth, window.innerHeight);
});



// let gain = Math.abs(((Math.floor(distanceThru) % item.diameter) / item.diameter )- .5) * .6


