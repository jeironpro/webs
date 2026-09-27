# Ejercicios — 16.01 — Molts quadrats

**Enunciat**

Desenvolupa un programa anomenat Quadrats que demani un número per entrada estàndard, i dibuixi tants quadrats com indiqui el número. Si el número és 0 o negatiu, no dibuixarà res.

Els quadrats els anirà dibuixant separant-los per una línia en blanc.

Important

Si has seguit el bloc anterior, aquest problema t'hauria de ser trivial. És molt important que miris de resoldre'l seguint les passes que hem vist als continguts. És a dir, comença pels comentaris i ves fent una anàlisi descendent. Idealment, ho faràs en paper, per, un cop creguis que el tens correcte, passar-ho a codi i provar que funciona.

**Quants?**
2
X X X X X
X X X X X
X X X X X
X X X X X
X X X X X

**X X X X X**
X X X X X
X X X X X
X X X X X
X X X X X

```java
public class Quadrats {
	public static void main(String[] args) {
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
