# Ejercicios — 13.03 — Els primers parells

**Enunciat**

Crea una nova versió d'aquest exercici. Aquest cop, el programa es dirà NaturalsParells, i també mostrarà els números de manera creixent. Ara, però, no els mostrarà tots sinó només els parells.

Per exemple, per l'entrada 10, el programa escriurà:

**2**
4
6
8
10

Per resoldre'l, novament intenta respondre les següents preguntes:

quin és el valor inicial?

quin és el valor final?

quina és la condició adequada per mantenir-se dins del while?

com es calcula el següent valor?

```java
public class NaturalsParells {
    public static void main(String[] args) {
        System.out.println("Introdueix un valor");
        int valor = Integer.parseInt(Entrada.readLine());
        int contador = 0;

        while (contador < valor) {
            contador += 2;
            System.out.println(contador);
        }
    }
}
```
