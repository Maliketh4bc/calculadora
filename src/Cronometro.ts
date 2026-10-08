import {fromEvent, interval, map, switchMap, takeUntil, tap} from 'rxjs';
import type { Subscription } from 'rxjs';

export class Cronometro {

    private readonly container: HTMLElement;
    private readonly display: HTMLElement;
    private readonly botonIniciar: HTMLButtonElement;
    private readonly botonReiniciar: HTMLButtonElement;
    private readonly subscriptions: Subscription[] = [];

    constructor(id: string) {
        const container = document.getElementById(id);
        if (!container) {
            throw new Error(`No existe ningún elemento con id "${id}"`);
        }
        this.container = container;

        this.container.innerHTML = this.template();

        const display = this.container.querySelector<HTMLElement>('.cronometro-tiempo');
        const botonIniciar = this.container.querySelector<HTMLButtonElement>('.cronometro-iniciar');
        const botonReiniciar = this.container.querySelector<HTMLButtonElement>('.cronometro-reiniciar');

        if(!display || !botonIniciar || !botonReiniciar){
            throw new Error('Falta algún elemento en la plantilla del cronómetro');
        }

        this.display = display;
        this.botonIniciar = botonIniciar;
        this.botonReiniciar = botonReiniciar;

        this.conectar();
    }

    private template(): string {
        return `
        <div class="cronometro">
            <span class="cronometro-tiempo">00:00.00</span>
            <div class="cronometro-botones">
                <button class="cronometro-iniciar">Iniciar</button>
                <button class="cronometro-reiniciar">Reiniciar</button>
            </div>
        </div>
        `;
    }

    private conectar(): void{
        const iniciar$ = fromEvent(this.botonIniciar, 'click');
        const reiniciar$ = fromEvent(this.botonReiniciar, 'click');

        const tiempo$ = iniciar$.pipe(
            tap(() => {
                this.botonIniciar.disabled = true;
            }),
            switchMap(() => {
                const inicio = Date.now();
                return interval(10).pipe(
                    map(() => Date.now() - inicio),
                    takeUntil(reiniciar$)
                );
            })
        );

        const subTiempo = tiempo$.subscribe((ms) => {
            this.display.textContent = this.formatear(ms);
        });

        const subReiniciar = reiniciar$.subscribe(() => {
            this.display.textContent = '00.00.00';
            this.botonIniciar.disabled = false;
        });

        this.subscriptions.push(subTiempo, subReiniciar);
    }

    private formatear(ms: number): string {
        const minutos = Math.floor(ms/60000);
        const segundos = Math.floor((ms%60000)/1000);
        const centesimas = Math.floor((ms % 1000)/10);

        return `${this.dosCifras(minutos)}:${this.dosCifras(segundos)}.${this.dosCifras(centesimas)}`;
    }

    private dosCifras(numero: number): string {
        return numero.toString().padStart(2,'0');
    }

    destroy(): void{
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}