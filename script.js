let audioContext;
let meter;
let flame = document.getElementById("flame");
let blowEnergy = 0;       // collect energy
const blowNeeded = 20;    // how much energy is required to blow out

function startMic() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);

    // Use Analyser to get volume data
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function checkVolume() {
      analyser.getByteFrequencyData(dataArray);

      // calculate average volume
      let values = 0;
      for (let i = 0; i < dataArray.length; i++) {
        values += dataArray[i];
      }
      let average = values / dataArray.length;

      // If volume is above a threshold, add to blowEnergy
      if (average > 50) {       // adjust threshold if too easy/hard
        blowEnergy += 1;
        console.log("Blowing... Energy:", blowEnergy);
      } else {
        // Slowly reduce energy if not blowing
        if (blowEnergy > 0) blowEnergy -= 0.2;
      }

      // Only vanish when enough blow energy is collected
      if (blowEnergy >= blowNeeded) {
        flame.style.display = "none";
      }

      requestAnimationFrame(checkVolume);
    }

    checkVolume();
  });
}

function relight() {
  flame.style.display = "block";
  blowEnergy = 0; // reset energy
}
