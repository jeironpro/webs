# Ejercicios — 13.02 — Els primers naturals

**Enunciat**

Crea una nova versió de l'exercici anterior. Aquest cop, el programa es dirà NaturalsDecreixents i, en comptes de mostrar els nombres de manera creixent, o farà decreixentment.

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

Per resoldre'l, planteja't novament les preguntes:

Quin és el valor inicial?

Quin és el valor final?

Quina és la condició adequada per mantenir-se dins del while?

Com es calcula el següent valor?

```java
public class NaturalsDecreixents {
    public static void main(String[] args) {
        System.out.println("Introdueix un valor");
        int valor = Integer.parseInt(Entrada.readLine());

        while (valor > 0) {
            System.out.println(valor);
            valor--;
        }
    }
}
```
