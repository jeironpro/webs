# Ejercicios — 10.05 — Noms i cognoms

**Enunciat**

Desenvolupa un programa que demani per entrada estàndard el nom dels usuaris. Un cop obtingut, demanarà el seu primer cognom. Finalment respondrà: "Ei «nom», tinc una amiga que també és «cognom».".

Aquí tens una plantilla pel teu codi. Pots copiar-la i enganxar-la al teu editor pel fitxer NomCognom.java. Únicament hauràs de reemplaçar els comentaris █████ pel codi corresponent.

* Aquest programa demana el nom i el primer cognom als usuaris
* i els mostra un missatge amistós.
* El programa no controla valors no adequats d'entrada

```java
public class NomCognom {
    public static void main(String[] args) {
```

**// obté el nom**

```text
        System.out.println("Nom?");
        String nom = █████;
```

**// obté el cognom**

```text
        System.out.println(█████);
        String cognom = █████;
```

**// Mostra resultat**

```text
        System.out.println("Ei " + nom + ", tinc una amiga que també és " +  █████);
    }
}
```

L'execució tindrà un aspecte similar al següent

**java NomCognom**
Nom?
Renat
Primer cognom?
Taner
Ei Renat, tinc una amiga que també és Taner.

```java
public class NomCognom {
    public static void main(String[] args) {
        System.out.println("Nom?");
        String nom = Entrada.readLine();

        System.out.println("Primer cognom?");
        String cognom = Entrada.readLine();

        System.out.println("Ei " + nom + ", tinc una amiga que també és " + cognom);
    }
}
```
