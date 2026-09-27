# Interfaces

**Interfaces**
Una interfície en Java és un contracte que una classe piot implementar. Defineix mètodes sense codi, és a dir, només la seva signatura, i obliga la classe que la implementa a proporcionar la seva pròpia implementació.

Una interfície no conté estat (normalment) i només declara el que una classe pot fer, no com ho fa.

**Exemple**

```java
public interface Animal {
    void ferSo();  // Mètode sense implementació
}
public class Gos implements Animal {
    public void ferSo() {
        System.out.println("Bup bup!");
    }
}
public class Gat implements Animal {
    public void ferSo() {
        System.out.println("Mèu mèu!");
    }
}
public class Principal {
    public static void main(String[] args) {
        Animal a = new Gos();
        a.ferSo();  // Bup bup!
    }
}
```

**Característiques clau**
- Es declaren amb la paraula clau interface.

- Tots els mètodes dins d'una interfície són, per defecte, públics i abstractes.

- Una classe implementa una interfície amb la paraula clau implements.

- Una classe pot implementar múltiples interfícies (solució de Java per evitar la herència múltiple).

**Diferències amb una classe abstracta**
Aspecte	                  Interfície	           Classe abstracta
Mètodes amb codi?	      No (excepte default)	   Sí
Herència múltiple?	      Sí	                   No
Paraula clau	          interface	               abstract class
Variables d’instància?	  No (només constants)	   Sí

**default i static a les interfícies**
Des de Java 8, una interfície pot contenir:
- mètodes default: tenen una implementació per defecte.

- mètodes static: que es poden cridar directament des de la interfície.

```java
public interface Salutacio {
    default void dirHola() {
        System.out.println("Hola!");
    }
}
```
