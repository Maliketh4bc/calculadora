import './style.css'
import { Calculadora } from './Calculadora'

// Un id por cada <div> de index.html donde queremos una calculadora
const ids = ['calculadora-1', 'calculadora-2', 'calculadora-3'];

document.addEventListener('DOMContentLoaded', () => {
  for (const id of ids) {
    new Calculadora(id);
  }
});