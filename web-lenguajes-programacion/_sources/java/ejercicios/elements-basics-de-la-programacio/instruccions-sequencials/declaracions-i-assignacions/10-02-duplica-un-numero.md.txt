# Ejercicios — 10.02 — Duplica un numero

**Enunciat**

Desenvolupa un programa que multipliqui per 2 el número que rep en executar-ho.

Aquí tens una plantilla pel teu codi. Pots copiar-la i enganxar-la al teu editor pel fitxer Duplica.java. Únicament hauràs de reemplaçar els comentaris █████ pel codi corresponent.

* Aquest programa duplica el valor que rep com a primer argument

* El programa no controla valors no adequats d'entrada

```java
public class Duplica {
    public static void main(String[] args) {
```

**// declara les variables a utilitzar**

```java
        int nombreADuplicar;
        int nombreDuplicat;
```

**// obté el nombre a duplicar**

```java
        nombreADuplicar = Integer.parseInt(args[0]);
```

**// calcula el doble**

```text
        nombreDuplicat =  █████;
```

**// mostra resultats**

```text
        System.out.print("El doble de ");
        System.out.print(█████);
        System.out.print(" és ");
        System.out.println(█████);
    }
}
```

Per exemple, considera la següent execució:

**java Duplica 5**
El doble de 5 és 10

```java
public class Duplica {
    public static void main(String[] args) {
        int nombreADuplicar;
        int nombreDuplicat;

        nombreADuplicar = Integer.parseInt(args[0]);

        nombreDuplicat =  nombreADuplicar * 2;

        System.out.print("El doble de ");
        System.out.print(nombreADuplicar);
        System.out.print(" és ");
        System.out.println(nombreDuplicat);
    }
}
```
