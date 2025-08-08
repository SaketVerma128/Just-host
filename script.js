let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  touchX = 0;
  touchY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const handleMove = (e) => {
      let clientX, clientY;
      if (e.type.includes('mouse')) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        e.preventDefault();
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      if (!this.rotating) {
        this.velX = clientX - (e.type.includes('mouse') ? this.prevMouseX : this.prevTouchX);
        this.velY = clientY - (e.type.includes('mouse') ? this.prevMouseY : this.prevTouchY);
      }

      const startX = e.type.includes('mouse') ? this.mouseX : this.touchX;
      const startY = e.type.includes('mouse') ? this.mouseY : this.touchY;

      const dirX = clientX - startX;
      const dirY = clientY - startY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }

        if (e.type.includes('mouse')) {
          this.prevMouseX = clientX;
          this.prevMouseY = clientY;
        } else {
          this.prevTouchX = clientX;
          this.prevTouchY = clientY;
        }

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    const handleStart = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (e.type.includes('mouse')) {
        if (e.button === 0) {
          this.mouseX = e.clientX;
          this.mouseY = e.clientY;
          this.prevMouseX = this.mouseX;
          this.prevMouseY = this.mouseY;
        }
        if (e.button === 2) {
          this.rotating = true;
        }
      } else {
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
        this.prevTouchX = this.touchX;
        this.prevTouchY = this.touchY;
      }
    };

    const handleEnd = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // Mouse Events
    document.addEventListener('mousemove', handleMove);
    paper.addEventListener('mousedown', handleStart);
    window.addEventListener('mouseup', handleEnd);

    // Touch Events
    paper.addEventListener('touchmove', handleMove);
    paper.addEventListener('touchstart', handleStart);
    window.addEventListener('touchend', handleEnd);

    // For two-finger rotation on touch screens
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });
    paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
