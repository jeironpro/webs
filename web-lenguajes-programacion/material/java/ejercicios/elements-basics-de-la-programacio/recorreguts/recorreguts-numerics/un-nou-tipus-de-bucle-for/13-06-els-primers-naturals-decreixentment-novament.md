# Ejercicios — 13.06 — Els primers naturals decreixentment novament

**Enunciat**

Crea una nova versió d'aquest exercici; aquest cop amb el bucle for.Aquest cop, el programa es dirà NaturalsDecreixents i, en comptes de mostrar els nombres de manera creixent, o farà decreixentment.

Per exemple, per l'entrada 10, el programa escriurà:

**10**
9
8
7
6
5
4
3
2
1

El nou programa manté el nom de l'original.

```java
public class NaturalsDecreixents {
    public static void main(String[] args) {
        System.out.println("Introdueix un valor");
        int valor = Integer.parseInt(Entrada.readLine());

        for (int i = valor; i >= 1; i--) {
            System.out.println(i);
        }
    }
}
```
