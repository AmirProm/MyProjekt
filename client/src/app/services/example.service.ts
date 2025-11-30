import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  ageSig = signal<number>(0);

  updateAgeSig(): void {
    this.ageSig.set(10);
  }
}
