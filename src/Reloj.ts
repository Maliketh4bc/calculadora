import {timer, map} from 'rxjs';
import type {Subscription} from 'rxjs';

export class Reloj{

    private readonly container: HTMLElement;
    private readonly display: HTMLElement;
    private subscription?: Subscription;

    constructor(id: string) {
        const container = document.getElementById(id);
        if (!container) {
        throw new Error(`No existe ningún elemento con id "${id}"`);
        }
        this.container = container;

        this.container.innerHTML = this.template();

        const display = this.container.querySelector<HTMLElement>('.reloj-hora');
        if (!display) {
        throw new Error('La plantilla no tiene .reloj-hora');
        }
        this.display = display;

        this.iniciar();
    }

    private template(): string {
        return `
        <div class="reloj">
            <span class="reloj-hora">--:--:--</span>
        </div>
        `;
    }

    private iniciar(): void{
        const hora$ = timer(0, 1000).pipe(
            map(() => new Date().toLocaleTimeString('es-ES'))
        );

        this.subscription = hora$.subscribe((hora) => {
            this.display.textContent = hora;
        });
    }

    destroy(): void{
        this.subscription?.unsubscribe();
    }
}