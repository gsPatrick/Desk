// utils/session-state.js
let _isSessionExpired = false;
let _listeners = [];

export const sessionState = {
  get isExpired() {
    return _isSessionExpired;
  },

  setExpired(value) {
    if (_isSessionExpired !== value) {
      _isSessionExpired = value;
      _listeners.forEach(listener => listener(_isSessionExpired));
    }
  },

  // Permite que componentes assinem para receber atualizações
  subscribe(listener) {
    _listeners.push(listener);
    return () => {
      _listeners = _listeners.filter(l => l !== listener);
    };
  }
};