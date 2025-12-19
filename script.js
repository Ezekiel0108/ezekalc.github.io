if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

let expression = '';

function aggiungiNum(num) {
  expression += num;
  document.getElementById('display').value = expression;
}

function aggiungiOperatore(op) {
  if (op === '=') {
    calcola();
    return;
  }
  expression += op;
  document.getElementById('display').value = expression;
}

function calcola() {
  try {
    let evalString = expression;
    
    // Replace square root symbol '√' with 'Math.sqrt('
    // Matches √ followed by a number (integer or decimal)
    evalString = evalString.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)');
    
    // Replace power operator '^' with '**'
    evalString = evalString.replace(/\^/g, '**');

    if (!evalString) return;

    let risultato = eval(evalString);

    if (!isFinite(risultato) || isNaN(risultato)) {
        alert("Operazione non valida (es. divisione per zero)");
        expression = '';
    } else {
        expression = risultato.toString();
    }
    
    document.getElementById('display').value = expression;
  } catch (error) {
    alert("Espressione non valida");
    expression = '';
    document.getElementById('display').value = '';
  }
}

function cancella() {
  expression = '';
  document.getElementById('display').value = '';
}
