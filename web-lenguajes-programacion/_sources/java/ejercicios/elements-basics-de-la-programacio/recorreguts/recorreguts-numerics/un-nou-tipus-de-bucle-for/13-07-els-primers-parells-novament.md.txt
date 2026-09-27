# Ejercicios — 13.07 — Els primers parells novament

**Enunciat**

Seguim versionant exercicis fets amb while passant-los a for.

Crea una nova versió d'aquest exercici; aquest cop amb el bucle for. Aquest cop, el programa es dirà NaturalsParells, i també mostrarà els números de manera creixent. Ara, però, no els mostrarà tots sinó només els parells.

Per exemple, per l'entrada 10, el programa escriurà:

**2**
4
6
8
10

```java
public class NaturalsParells {
    public static void main(String[] args) {
        System.out.println("Introdueix un valor");
        int valor = Integer.parseInt(Entrada.readLine());

        for (int i = 2; i < valor; i+=2) {
            System.out.println(i);
        }   
    }
}
```
