// Simplified Flap Display implementation
class FlapDisplay {
  constructor(container, options = {}) {
    this.container = container;
    this.chars = options.chars || ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-/';
    this.length = options.length || 10;
    this.timing = options.timing || 300;
    this.displays = [];
    
    this.init();
  }
  
  init() {
    this.container.innerHTML = '';
    this.container.style.display = 'flex';
    this.container.style.gap = '2px';
    
    for (let i = 0; i < this.length; i++) {
      const charDiv = document.createElement('div');
      charDiv.style.cssText = `
        background: #000;
        color: #fff;
        width: 1em;
        height: 1.4em;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'JetBrains Mono', 'Courier New', monospace;
        font-weight: 600;
        font-size: 1em;
        border: 1px solid #333;
        border-radius: 0;
        position: relative;
        overflow: hidden;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);
      `;
      charDiv.textContent = ' ';
      this.container.appendChild(charDiv);
      this.displays.push(charDiv);
    }
  }
  
  setValue(value) {
    const padded = value.padEnd(this.length, ' ').substring(0, this.length);
    
    padded.split('').forEach((char, index) => {
      if (this.displays[index]) {
        this.animateChar(this.displays[index], char.toUpperCase());
      }
    });
  }
  
  animateChar(display, targetChar) {
    const currentChar = display.textContent;
    if (currentChar === targetChar) return;
    
    let steps = 3;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep >= steps) {
        display.textContent = targetChar;
        clearInterval(interval);
        return;
      }
      
      const randomChar = this.chars[Math.floor(Math.random() * this.chars.length)];
      display.textContent = randomChar;
      currentStep++;
    }, this.timing / steps);
  }
  
  destroy() {
    this.container.innerHTML = '';
  }
}

window.FlapDisplay = FlapDisplay;