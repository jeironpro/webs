# Propietats mutables

**Propietats Mutables**
Les propietats mutables són atributs d'una classe que poden ser modificats després que un objecte ha estat creat. Això significa que el valor de la propietat pot canviar al llarg de la vida de l'objecte.

Per exemple, si un objecte Cotxe, té una propietat mutable que podria ser la velocitat, perquè aquesta pot canviar en qualsevol moment.

**Exemple**

```java
public class Cotxe {
    String marca;
    int velocitat;  // Propietat mutable

    public Cotxe(String marca, int velocitat) {
        this.marca = marca;
        this.velocitat = velocitat;
    }
```

**// Mètode per accelerar el cotxe**

```java
    public void accelerar(int increment) {
        velocitat += increment;  // Modifiquem la velocitat
    }
}
```

En aquest cas, la propietat velocitat és mutable, ja que es pot modificar mitjançant el mètode accelerar().

**Característiques de les propietats mutables**
- Canviables: el seu valor pot ser modificar en qualsevol moment.

- Són utils quan cal que les propietats canvïin durant l'execució del programa (per exemple, el saldo d'un compte bancari, la velocitat d'un cotxe, etc.).

- Accés i modificació: generalment s'accedeixen i es modifiquen directament o mitjançant mètodes que encapsulen aquest comportament.

**Comparació amb les propietat immutables**
Les propietats immutables, per contra, no poden ser modificades després de la seva creació. Un exemple típic seria una classe que representi una data, ja que un cop creat un objecte Data, no pot canviar el seu valor.

**Exemple**

```java
public class Data {
    private final int dia;
    private final int mes;
    private final int any;

    public Data(int dia, int mes, int any) {
        this.dia = dia;
        this.mes = mes;
        this.any = any;
    }
```

// No hi ha mètodes per modificar la data després de la creació

```java
}
```

Aquí, les propietats dia, mes, any són immutables perquè estan declarades com a final i no hi ha mètodes que permetin canviar els seus valors un cop assignats.
