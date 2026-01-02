/*  This is Exponential Moving Average (EMA). if alpha = 1, no smoothing.
    alpha = 0, full smoothing (always return previous value). this is a low-pass filter.
    A low-pass filter allows signals with frequencies below a specific cutoff frequency to pass through 
    while blocking higher frequencies, essentially smoothing out noise
*/
function lowPassFilter(prev, curr, alpha) {
  return alpha * curr + (1 - alpha) * prev;
}

/*  compute smoothing factor alpha
    converts cutoff frequency to alpha i.e. smoothing factor
    dt = sampling period
*/
function computeAlpha(cutoff, dt) {
  const tau = 1 / (2 * Math.PI * cutoff);
  return 1 / (1 + tau / dt);
}

// adaptive filter logic
export class OneEuroFilter {
  constructor(freq, minCutoff = 1.0, beta = 0.0, dCutoff = 1.0) {

    /* we are making 2 filters, one on input signal
         and one on derivative of input signal */
    this.freq = freq; //fps
    this.minCutoff = minCutoff; //base cutoff frequency
    this.beta = beta; //speed sensitivity
    this.dCutoff = dCutoff; //cutoff frequency for derivative

    //refreshing state
    this.prevValue = null;
    this.prevDerivative = 0;
    this.lastTime = null;
  }

  filter(value, time) {
    if (this.lastTime === null) {
      this.lastTime = time;
      this.prevValue = value;
      return value;
    }
    /* dt = time now - time prev. dividing it by 1000
    converts it from milisecond to seconds
    dt is the time between two successful MediaPipe outputs,
    which will always vary due to different object orientation,
    lighting, available ram etc.
                  this is dt*/
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;

    if (dt <= 0) return value;

    /* 
        as discussed above, dt is variable, so we cant calc derivatives
        using 'dx/dt', as this formula works only if time interval for 
        every change in x-coord is constant. 
        hence one euro algo uses this formula to approx derivative
        
        The derivative is an approximate velocity estimate of landmark 
        motion in continuous time, inferred from irregular samples.
    */
    const derivative = (value - this.prevValue) * this.freq;

    /* as mentioned earlier, dt isnt constant, so we use the 
    low pass filter on dt to get smoothing factor alpha for smoothing*/
                        //cutoff freq for derivative
    const alphaD = computeAlpha(this.dCutoff, dt);
    //as mentioned earlier, we smoothen the derivative 
    const filteredDerivative = lowPassFilter(
      this.prevDerivative,
      derivative,
      alphaD
    );

    // Adaptive cutoff
    const cutoff = this.minCutoff + this.beta * Math.abs(filteredDerivative);
    const alpha = computeAlpha(cutoff, dt);

    //the actual low pass filtering happens here
    const filteredValue = lowPassFilter(
      this.prevValue,
      value,
      alpha
    );

    this.prevValue = filteredValue;
    this.prevDerivative = filteredDerivative;

    return filteredValue;
  }
}
