# Ejercicios — 16.03 — Quadrats modulars

**Enunciat**

Desenvolupa una nova versió del programa anterior. Aquest cop, des de dibuixaQuadrats() es cridarà un mòdul anomenat dibuixaQuadrat() que farà la feina de dibuixar les difents línies del quadrat fent servir dibuixaLinia()

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
            dibuixaQuadrat();
            System.out.println();
		}
    }

    public static void dibuixaQuadrat() {
        for (int linia = 1; linia <= 5; linia++) {
            dibuixaLinia();
            System.out.println();
        }
    }

    public static void dibuixaLinia() {
        for (int columna = 1; columna <= 5; columna++) {
            System.out.print(" X");
        }
    }
}
```
