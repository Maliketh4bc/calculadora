export class Calculadora {

  private currentInput = '0';
  private lastInput = '0';
  private operation = '';
  private shouldResetInput = false;

  private readonly container: HTMLElement;
  private readonly display: HTMLInputElement;

  constructor(id: string) {
    const container = document.getElementById(id);
    if (!container) {
      throw new Error(`No existe ningún elemento con id "${id}"`);
    }
    this.container = container;

    this.container.innerHTML = this.template();

    const display = this.container.querySelector<HTMLInputElement>('.display-input');
    if (!display) {
      throw new Error('La plantilla no tiene .display-input');
    }
    this.display = display;

    this.addEvents();
  }

  private template(): string {
    return `
      <div class="calculadora">
        <div class="display">
          <input type="text" class="display-input" value="0" disabled />
        </div>
        <div class="teclado">
          <button class="delete span-two">DEL</button>
          <button class="reset">C</button>
          <button class="operation" data-action="sign">+/-</button>
          <button class="operation" data-action="square">x²</button>
          <button class="operation" data-action="sqrt">√x</button>
          <button class="operation" data-action="inverse">1/x</button>
          <button class="operation" data-action="+">+</button>
          <button class="number" data-value="7">7</button>
          <button class="number" data-value="8">8</button>
          <button class="number" data-value="9">9</button>
          <button class="operation" data-action="-">-</button>
          <button class="number" data-value="4">4</button>
          <button class="number" data-value="5">5</button>
          <button class="number" data-value="6">6</button>
          <button class="operation" data-action="*">*</button>
          <button class="number" data-value="1">1</button>
          <button class="number" data-value="2">2</button>
          <button class="number" data-value="3">3</button>
          <button class="operation" data-action="/">/</button>
          <button class="equals span-two">=</button>
          <button class="number" data-value="0">0</button>
          <button class="decimal">.</button>
        </div>
      </div>
    `;
  }

  private addEvents(): void {
    // Las funciones flecha mantienen el "this" de la clase.
    // Con function() {} normal, "this" sería el botón y fallaría todo.
    this.container.querySelectorAll<HTMLButtonElement>('.number').forEach((button) => {
      button.addEventListener('click', () => this.handleNumber(button.dataset.value ?? '0'));
    });

    this.container.querySelectorAll<HTMLButtonElement>('.operation').forEach((button) => {
      button.addEventListener('click', () => this.handleOperation(button.dataset.action ?? ''));
    });

    this.container.querySelector('.reset')?.addEventListener('click', () => this.reset());
    this.container.querySelector('.delete')?.addEventListener('click', () => this.deleteLast());
    this.container.querySelector('.decimal')?.addEventListener('click', () => this.addDecimal());
    this.container.querySelector('.equals')?.addEventListener('click', () => this.equals());
  }

  private updateDisplay(): void {
    this.display.value = this.currentInput;
  }

  // -------

  private handleNumber(value: string): void {
    if (this.shouldResetInput) {
      this.currentInput = value;
      this.shouldResetInput = false;
    } else {
      if (this.currentInput === '0' && value === '0') return;
      if (this.currentInput === '0') this.currentInput = '';
      this.currentInput += value;
    }
    this.updateDisplay();
  }

  private reset(): void {
    this.currentInput = '0';
    this.lastInput = '0';
    this.operation = '';
    this.shouldResetInput = false;
    this.updateDisplay();
  }

  private deleteLast(): void {
    if (this.currentInput.length === 1) {
      this.currentInput = '0';
    } else {
      this.currentInput = this.currentInput.slice(0, -1);
    }
    this.updateDisplay();
  }

  private addDecimal(): void {
    if (this.shouldResetInput) {
      this.currentInput = '0.';
      this.shouldResetInput = false;
    } else if (!this.currentInput.includes('.')) {
      this.currentInput += '.';
    }
    this.updateDisplay();
  }

  private calculate(): number {
    const num1 = parseFloat(this.lastInput);
    const num2 = parseFloat(this.currentInput);

    switch (this.operation) {
      case '+':
        return num1 + num2;
      case '-':
        return num1 - num2;
      case '*':
        return num1 * num2;
      case '/':
        return num2 !== 0 ? num1 / num2 : 0;
      default:
        return num2;
    }
  }

  private executeUnaryOperation(action: string): void {
    const num = parseFloat(this.currentInput);
    let result: number | string;

    switch (action) {
      case 'sign':
        if (this.currentInput !== '0') {
          this.currentInput = this.currentInput.startsWith('-')
            ? this.currentInput.substring(1)
            : '-' + this.currentInput;
          this.updateDisplay();
        }
        return;
      case 'square':
        result = num * num;
        break;
      case 'sqrt':
        result = num >= 0 ? Math.sqrt(num) : 'Error';
        break;
      case 'inverse':
        result = num !== 0 ? 1 / num : 'Error';
        break;
      default:
        return;
    }

    this.currentInput = result.toString();
    this.updateDisplay();
    this.shouldResetInput = true;
  }

  private handleOperation(action: string): void {

    if (action === 'sign' || action === 'square' || action === 'sqrt' || action === 'inverse') {
      this.executeUnaryOperation(action);
      return;
    }

    if (this.operation && !this.shouldResetInput) {
      this.currentInput = this.calculate().toString();
      this.updateDisplay();
    }

    this.lastInput = this.currentInput;
    this.operation = action;
    this.shouldResetInput = true;
  }

  private equals(): void {
    if (!this.operation) return;

    this.currentInput = this.calculate().toString();
    this.updateDisplay();
    this.lastInput = '0';
    this.operation = '';
    this.shouldResetInput = true;
  }
}