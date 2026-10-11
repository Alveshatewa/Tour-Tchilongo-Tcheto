
window.TTT_CONFIG = {
  WHATSAPP_NUMBER: '244946565880', 
  waLink(text) {
    return `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }
};
