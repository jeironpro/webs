# Ejercicios — 16.02 — Quadrats amb un modul

**Enunciat**

Desenvolupa una nova versió del programa anterior. Aquest cop, des de main es cridarà un mòdul anomenat dibuixaQuadrats() que farà la feina de demanar el número de quadrats a dibuixar i els dibuixarà.

La sortida serà la mateixa que per la versió anterior.

```java
public class Quadrats {
    public static void main(String[] args) {
        dibuixaQuadrats();
    }

	public static void dibuixaQuadrats() {
		System.out.println("Quants?");
		int quants = Integer.parseInt(Entrada.readLine());

		for (int i = 0; i < quants; i++) {
			for (int linia = 1; linia <= 5; linia++) {
				for (int columna = 1; columna <= 5; columna++) {
					System.out.print(" X");
				}
				System.out.println();
			}
			System.out.println();
		}
	}
}
```
