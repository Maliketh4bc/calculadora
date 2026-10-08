import './style.css'
import { Calculadora } from './Calculadora'
import {Reloj} from './Reloj'
import {Cronometro} from './Cronometro'

// Un id por cada <div> de index.html donde queremos una calculadora
const ids = ['calculadora-1', 'calculadora-2', 'calculadora-3'];

document.addEventListener('DOMContentLoaded', () => {
  new Reloj('reloj');
  new Cronometro('cronometro');
  for (const id of ids) {
    new Calculadora(id);
  }
});