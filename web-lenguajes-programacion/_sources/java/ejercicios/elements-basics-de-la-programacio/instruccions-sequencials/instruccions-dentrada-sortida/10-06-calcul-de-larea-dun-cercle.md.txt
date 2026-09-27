# Ejercicios — 10.06 — Calcul de larea dun cercle

**Enunciat**

Recordes el programa que calculava l'àrea d'un cercle que vam analitzar a Un primer contacte?

En aquest exercici, recuperaràs la versió en Java, l'adaptaràs a la manera de fer del curs i ampliaràs la seva funcionalitat per afegir les unitats.

Un exemple d'ús:

**java CalculaArea**
Càlcul de l'area d'un cercle
Introduïu el radi:
2
Introduïu les unitats (ex. cm):
cm
L'area és 78.53975 cm^2

Copia la següent plantilla a un editor i guarda-la en la carpeta corresponent a l'exercici. Reemplaça els comentaris █████ pel codi corresponent.

* █████

```java
public class CalculaArea {
    public static void main(String[] args) {
        System.out.println("Càlcul de l'àrea d'un cercle");
```

**█████**

```text
        String linia = █████;
        System.out.println(█████);
        String unitats = █████;
        float radi = Float.parseFloat(linia);
        float area =  (float)Math.PI * radi * radi;
```

█████

```java
    }
}
```

**Notes**
Assegura't que inclous una capçalera descriptiva.

Fixa't que aquest codi no inclou cap import, per tant, fes servir Entrada.readLine() per llegir la entrada del teclat.

```java
public class CalculaArea {
    public static void main(String[] args) {
        System.out.println("Càlcul de l'àrea d'un cercle");
        
        System.out.println("Introduïu el radi:");

        String linia = Entrada.readLine();

        System.out.println("Introduïu les unitats (ex. cm):");

        String unitats = Entrada.readLine();

        float radi = Float.parseFloat(linia);

        float area =  (float)Math.PI * radi * radi;

        System.out.println("L'àrea és " + area + " " + unitats + "^2");
    }
}
```
