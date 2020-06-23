const gpio = require("tinker-gpio")
//funzione che inizializza i relè
init = () => {
  relay ('open', 'low');
  relay ('close', 'low');
  relay ('enable', 'low');
  return true;
}
//funzione per sanificare il pin
sanitizePin = (p) => {
  pin = (p || '').toLowerCase().trim();
  if (p === "enable") {
    return 7;
  } else if (p === "open") {
    return 8;
  } else if (p === "close") {
    return 10;
  } else {
    throw new Error('Il pin può essere \'enable\', \'open\' o \'close\'');
  }
}
//funzione per sanificare lo stato
sanitizeState = (s) => {
  s = (s || '').toLowerCase().trim();
  if (s === "low") {
    return 0;
  } else if (s === "high") {
    return 1;
  } else {
    throw new Error('Lo stato può essere \'low\' o \'high\'');
  }
}
//pilota i relè
relay = (pin, state) => {
  pin   = sanitizePin (pin);
  state = sanitizeState (state);
  gpio.open(pin, "output", (err) => {
    gpio.write(pin, state, () => {
      gpio.close(pin);
    });
  });
}
module.exports = class Gate {
  constructor() {
    this.activeTimeout = null;
    this.isOpening     = false;
    this.isClosing     = false;
    this.enable        = init();
  }
  //metodo della classe Gate per l'apertura
  Open() {
    //disabilita eventuali timeout
    clearTimeout(this.activeTimeout);
    //pilota i relè
    this.isClosing = false;
    relay ('close', 'low');
    //se non si sta già aprendo, apri, altrimenti, stop
    if (!this.isOpening) {
      this.isOpening = true;
      relay ('open', 'high');
      //attende l'apertura completa della serranda
      this.activeTimeout = setTimeout ( () => {
        relay ('open', 'low');
        this.isOpening = false;
      }, 24000);
    } else {
        this.isOpening = false;
        relay ('open', 'low');
    }
  }
  //metodo della classe Gate per la chiusura
  Close() {
    //disabilita eventuali timeout
    clearTimeout(this.activeTimeout);
    //pilota i relè
    this.isOpening = false;
    relay ('open', 'low');
    //se non si sta già chiudendo, chiudi altrimenti, stop
    if (!this.isClosing) {
      this.isClosing = true;
      relay ('close', 'high');
      //attende l'apertura completa della serranda
      this.activeTimeout = setTimeout ( () => {
        relay ('close', 'low');
        this.isClosing = false;
      }, 24000);
    } else {
        this.isClosing = false;
        relay ('close', 'low');
    }
  }
}
