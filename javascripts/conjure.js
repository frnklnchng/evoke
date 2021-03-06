let intensityBorder = 0.215;
const radiusMultiplier = 1;
const barsMultiplier = 0.7;

let file = document.getElementById("input")
let loading = document.getElementById("loading");
let greeting = document.getElementById("greeting");

let audio;
let fft;

let newInput = false;
let newWindow = true;

file.onchange = function () {
  if (this.files[0]) {
    audio.stop();
    audio.disconnect();

    audio = loadSound(URL.createObjectURL(this.files[0]));
    loading.classList.add("true");
    newInput = true;
    // console.log("new audio");
  }
}

function setup() {
  const curses = [
    // 'https://raw.githubusercontent.com/frnklnchng/conjure/master/assets/fellow_feeling.mp3',
    'https://raw.githubusercontent.com/frnklnchng/conjure/master/assets/truth.mp3',
    // 'https://raw.githubusercontent.com/frnklnchng/conjure/master/assets/touched.mp3',
  ];

  const hex = Math.floor(Math.random() * curses.length);

  // if (hex === 0) {
  //   intensityBorder = 0.27;
  //   console.log("goodbye");
  // }

  audio = loadSound(curses[hex]);
  loading.classList.add("true");
  amplitude = new p5.Amplitude();

  const canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.style('display', 'block');
  canvas.mouseClicked(togglePlayback);

  const name = createDiv('conjure');
  name.addClass('name');

  const instructions = createDiv('loading');
  instructions.id('instructions');

  const volumeLabel = createDiv('volume');
  volumeLabel.addClass('volumeLabel');
  volumeLabel.addClass('label');

  const sensitivityLabel = createDiv('sensitivity');
  sensitivityLabel.addClass('sensitivityLabel');
  sensitivityLabel.addClass('label');

  const barsLabel = createDiv('bars');
  barsLabel.addClass('barsLabel');
  barsLabel.addClass('label');

  const halosLabel = createDiv('halos');
  halosLabel.addClass('halosLabel');
  halosLabel.addClass('label');

  volumeSlider = createSlider(0, 1.0, 0.5, 0.01);
  volumeSlider.addClass('volume');
  volumeSlider.addClass('slider');

  sensitivitySlider = createSlider(-0.99, 0, -0.85, 0.01);
  sensitivitySlider.addClass('sensitivity');
  sensitivitySlider.addClass('slider');

  barSlider = createSlider(0, 11, 9, 1);
  barSlider.addClass('bars');
  barSlider.addClass('slider');

  haloSlider = createSlider(3, 8, 7, 1);
  haloSlider.addClass('halos');
  haloSlider.addClass('slider');
}

function draw() {
  if (newWindow && audio && audio.isLoaded()) {
    if (!greeting.classList.contains('true')) {
      greeting.classList.add('true');
    }
  }

  const instructions = document.getElementById("instructions");

  const volume = volumeSlider.value();
  const smooth = -sensitivitySlider.value(); // Sensitivity toggle
  const bars = Math.pow(2, barSlider.value()); // Frequencies toggle
  const halos = Math.pow(2, haloSlider.value()); // Frequencies toggle
  const intensity = amplitude.getLevel();
  // const bars = 256;

  background(33, 33, 36);
  // background(0, 0, 0);

  // if (audio) {
  //   console.log(smooth);
  //   console.log(audio.currentTime());
  //   console.log(intensity);
  //   console.log(newInput);
  //   console.log(audio);
  //   console.log(audio.isLoaded());
  //   console.log(fft);
  // }

  // if (loading.class() === "true") {
  //   instructions.innerHTML = "loading";
  // }

  if (audio && audio.isLoaded() && !audio.isPaused() && !audio.isPlaying()) {
    loading.classList.remove("true");

    fft = new p5.FFT(smooth, 2048);

    if (newInput === true) {
      audio.play();
      newInput = false;
    }
  }

  // let status = instructions.innerHTML === "press the spacebar to play";
  let status = instructions.innerHTML === "paused";
  let loaded = instructions.innerHTML === "loading";

  if (!audio || !audio.isLoaded()) {
    instructions.innerHTML = "loading";
  }
  else if ((audio.isPaused() || !audio.isPlaying()) && !status) {
    // instructions.innerHTML = "press the spacebar to play";
    instructions.innerHTML = "paused";
  }
  else if (audio.isPlaying() && (status || loaded)) {
    // instructions.innerHTML = "press the spacebar to pause";
    instructions.innerHTML = "playing";
  }

  if (fft) {
    audio.setVolume(volume);
    fft.smooth(smooth);

    const spectrum = fft.analyze();

    const bass = fft.getEnergy("bass");
    const lowMid = fft.getEnergy("lowMid");
    const mid = fft.getEnergy("mid");
    const highMid = fft.getEnergy("highMid");
    const treble = fft.getEnergy("treble");

    const mapBass = map(bass, 0, 255, -100, 100);
    const mapLowMid = map(lowMid, 0, 255, -125, 125);
    const mapMid = map(mid, 0, 255, -150, 150);
    const mapHighMid = map(highMid, 0, 255, -175, 175);
    const mapTreble = map(treble, 0, 255, -200, 200);

    const combo = fft.getEnergy("bass", "lowMid");
    const mapCombo = map(combo, 0, 255, -125, 125);

    // console.log(mapBass);
    // console.log(mapLowMid);
    // console.log(mapMid);
    // console.log(mapHighMid);
    // console.log(mapTreble);
    // console.log(mapCombo);

    let bassRadius = mapBass * radiusMultiplier;
    let lowMidRadius = mapLowMid * radiusMultiplier;
    let midRadius = mapMid * radiusMultiplier;
    let highMidRadius = mapHighMid * radiusMultiplier;
    let trebleRadius = mapTreble * radiusMultiplier;

    let comboRadius = mapCombo * radiusMultiplier;

    let halosColor = "rgb(0, 255, 204)";
    let barsColor = "rgba(0, 255, 204, 0.25)";

    // console.log(intensity);

    // colorMode(RGB);
    // const backgroundFrom = color(33, 33, 36);
    // const backgroundTo = color(0, 0, 0);
    // const halosFrom = color(0, 255, 204);
    // const halosTo = color(255, 0, 51);
    // const barsFrom = color('rgba(0, 255, 204, 0.25)');
    // const barsTo = color('rgba(255, 0, 51, 0.25)');

    // const lerpIncrement = map(intensity, 0, intensityBorder, 0, 1);

    // background(lerpColor(backgroundFrom, backgroundTo, lerpIncrement));
    // halosColor = lerpColor(halosFrom, halosTo, lerpIncrement);
    // barsColor = lerpColor(barsFrom, barsTo, lerpIncrement);
    
    if (intensity > intensityBorder) {
      background(0, 0, 0);
      halosColor = "rgb(255, 0, 51)";
      barsColor = "rgba(255, 0, 51, 0.25)";
    }
    else if (intensity > intensityBorder - 0.01) {
      background(24, 24, 26);
      halosColor = "rgb(232, 23, 65)";
      barsColor = "rgba(232, 23, 65, 0.25)";
    }
    else if (intensity > intensityBorder - 0.02) {
      background(27, 27, 29);
      halosColor = "rgb(209, 46, 79)";
      barsColor = "rgba(209, 46, 79, 0.25)";
    }
    else if (intensity > intensityBorder - 0.03) {
      background(30, 30, 33);
      halosColor = "rgb(185, 70, 93)";
      barsColor = "rgba(185, 70, 93, 0.25)";
    }
    // Transition
    else if (intensity > intensityBorder - 0.04) {
      halosColor = "rgb(162, 93, 107)";
      barsColor = "rgba(162, 93, 107, 0.25)";
    }
    else if (intensity > intensityBorder - 0.05) {
      halosColor = "rgb(139, 116, 121)";
      barsColor = "rgba(139, 116, 121, 0.25)";
    }
    else if (intensity > intensityBorder - 0.06) {
      halosColor = "rgb(116, 139, 134)";
      barsColor = "rgba(116, 139, 134, 0.25)";
    }
    else if (intensity > intensityBorder - 0.07) {
      halosColor = "rgb(93, 162, 148)";
      barsColor = "rgba(93, 162, 148, 0.25)";
    }
    else if (intensity > intensityBorder - 0.08) {
      halosColor = "rgb(70, 185, 162)";
      barsColor = "rgba(70, 185, 162, 0.25)";
    }
    else if (intensity > intensityBorder - 0.09) {
      halosColor = "rgb(46, 209, 176)";
      barsColor = "rgba(46, 209, 176, 0.25)";
    }
    else if (intensity > intensityBorder - 0.1) {
      halosColor = "rgb(23, 232, 190)";
      barsColor = "rgba(23, 232, 190, 0.25)";
    }

    // Fade out draw transitions
    // https://p5js.org/examples/hello-p5-drawing.html

    // Validate bars selection
    if (bars !== 1) {
      noStroke(); // No outlines
      fill(barsColor);

      for (let i = 0; i < bars; i++) {
        const w = map(i, 0, bars, 0, width);
        const h = map(spectrum[i], 0, 255, height, 0) - height;
        const x = map(i, 0, bars, width, 0);
        const y = map(spectrum[i], 0, 255, 0, height);

        // Experimental
        const foo = map(i, 0, bars, 0, width);
        const bar = map(spectrum[i], 0, 255, height, 0) - height;
        const a = map(i, 0, bars, width, 0);
        const b = map(spectrum[i], 0, 255, 0, height);

        rect(w, height, width / bars, h * barsMultiplier);
        rect(w, 0, width / bars, -1 * h * barsMultiplier);
        rect(x, height, width / bars, -1 * y * barsMultiplier);
        rect(x, 0, width / bars, y * barsMultiplier);

        if (intensity > 0.3) {
          rect(w, height, width / bars, h * 0.5);
          rect(w, 0, width / bars, -1 * h * 0.5);
          rect(x, height, width / bars, -1 * y * 0.5);
          rect(x, 0, width / bars, y * 0.5);
        }

        // if (intensity > intensityBorder) {
        //   let r = 255;
        //   let g = 200 * (i / bars);
        //   let b = h + (50 * (i / bars));
  
        //   fill(r, g, b);
        // }
      }
    }

    translate(window.innerWidth / 2, window.innerHeight / 2);

    for (i = 0; i < halos; i++) {
      rotate(4 * PI / halos);

      // Draw lines
      strokeWeight(1);

      stroke(halosColor);

      line(mapBass, bassRadius * 0.75 / 2, 0, bassRadius * 0.75);

      stroke(255, 255, 255);
      line(mapMid, midRadius / 2, 0, midRadius);

      stroke(halosColor);

      line(mapTreble, trebleRadius * 1.2 / 2, 0, trebleRadius * 1.2);

      // Draw points
      strokeWeight(2);
      stroke(255, 255, 255);

      point(mapBass, bassRadius * 1.5);
      point(mapMid, midRadius * 1.6);
      point(mapMid, midRadius * 1.4);
      point(mapTreble, trebleRadius * 0.9);

      // Experimental
      if (intensity > intensityBorder) {
        point(mapCombo, comboRadius * 3.6);
        point(mapCombo, comboRadius * 3.7);
        point(mapLowMid, lowMidRadius * 3.7);
        point(mapLowMid, lowMidRadius * 3.8);
        point(mapHighMid, highMidRadius * 3.8);
        point(mapHighMid, highMidRadius * 3.6);

        // Static
        // const x = random(windowWidth);
        // const y = random(windowHeight - 200);

        // noStroke();
        // fill(halosColor);
        // rect(x, y, 4, 4);
        // rect(y, x, 4, 4);
      }

      if (intensity > intensityBorder - 0.1) {
        point(mapCombo, comboRadius * 2.6);
        point(mapCombo, comboRadius * 2.7);
        point(mapLowMid, lowMidRadius * 2.7);
        point(mapLowMid, lowMidRadius * 2.8);
        point(mapHighMid, highMidRadius * 2.8);
        point(mapHighMid, highMidRadius * 2.6);

        // Static
        // const x = random(windowWidth);
        // const y = random(windowHeight - 200);

        // noStroke();
        // fill(halosColor);
        // rect(x, y, 4, 4);
        // rect(y, x, 4, 4);
      }

      if (intensity > intensityBorder - 0.2) {
        point(mapCombo, comboRadius * 2.1);
        point(mapCombo, comboRadius * 2.2);
        point(mapLowMid, lowMidRadius * 2.2);
        point(mapLowMid, lowMidRadius * 2.3);
        point(mapHighMid, highMidRadius * 2.3);
        point(mapHighMid, highMidRadius * 2.1);

        // Static
        // const x = random(windowWidth);
        // const y = random(windowHeight - 200);

        // noStroke();
        // fill(halosColor);
        // rect(x, y, 4, 4);
        // rect(y, x, 4, 4);
      }
      
      // if (intensity > intensityBorder - 0.1) {
      //   point(mapCombo, comboRadius * 2.6);
      //   point(mapCombo, comboRadius * 2.7);
      //   point(mapLowMid, lowMidRadius * 2.7);
      //   point(mapLowMid, lowMidRadius * 2.8);
      //   point(mapHighMid, highMidRadius * 2.8);
      //   point(mapHighMid, highMidRadius * 2.6);

        // Static
        // const x = random(windowWidth);
        // const y = random(windowHeight - 200);

        // noStroke();
        // fill(halosColor);
        // rect(x, y, 4, 4);
        // rect(y, x, 4, 4);
      // }
      
      // if (intensity > intensityBorder - 0.1) {
      //   point(mapCombo, comboRadius * 2.6);
      //   point(mapCombo, comboRadius * 2.7);
      //   point(mapLowMid, lowMidRadius * 2.7);
      //   point(mapLowMid, lowMidRadius * 2.8);
      //   point(mapHighMid, highMidRadius * 2.8);
      //   point(mapHighMid, highMidRadius * 2.6);

        // Static
        // const x = random(windowWidth);
        // const y = random(windowHeight - 200);

        // noStroke();
        // fill(halosColor);
        // rect(x, y, 4, 4);
        // rect(y, x, 4, 4);
      // }
    }
  }
}

// function mouseClicked() {
//   togglePlayback();
// }

function keyPressed() {
  switch (keyCode) {
    case 32:
      togglePlayback();
      break;
    case 79:
      audio.stop();
      audio.disconnect();

      audio = loadSound('https://raw.githubusercontent.com/frnklnchng/conjure/master/assets/fellow_feeling.mp3');
      loading.classList.add("true");
      newInput = true;

      intensityBorder = 0.25;

      if (greeting.classList.contains('true')) {
        newWindow = false;
        greeting.classList.remove('true');
      }

      break;
    default:
      break;
  }

  return false;
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function togglePlayback() {
  if (greeting.classList.contains('true')) {
    newWindow = false;
    greeting.classList.remove('true');
  }

  if (audio && audio.isLoaded()) {
    audio.isPlaying() ? audio.pause() : audio.play();
  }
}

function toggleColors() {
  // console.log(halosColor);
  // console.log(barsColor);
}

function limit(num, min, max) {
  return num > max ? max : num < min ? min : num;
}
