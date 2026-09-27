# Polimorfisme

**Polimorfisme**
El polimorfisme és la capacitat que tenen els objectes de respondre de manera diferent a un mateix missatge (mètode), segons la seva classe específica.

Polimorfisme significa literalment "moltes formes".

A Java, això vol dir que una mateixa referència pot apuntar a objectes de diferents subclasses, i quan s'invoca un mètode, s'executa el comportament corresponent a la classe real de l'objecte.

**Exemple**

```java
public class Animal {
    public void ferSo() {
        System.out.println("Aquest animal fa un so.");
    }
}
public class Gos extends Animal {
    @Override
    public void ferSo() {
        System.out.println("El gos diu: Bup bup!");
    }
}
public class Gat extends Animal {
    @Override
    public void ferSo() {
        System.out.println("El gat diu: Mèu mèu!");
    }
}
public class Principal {
    public static void main(String[] args) {
        Animal a1 = new Gos();  // Referència d'Animal, però objecte Gos
        Animal a2 = new Gat();  // Referència d'Animal, però objecte Gat

        a1.ferSo();  // El gos diu: Bup bup!
        a2.ferSo();  // El gat diu: Mèu mèu!
    }
}
```

Encara que a1 i a2 són de tipus Animal, el mètode ferSo() invoca el comportament sobreescrit en la subclasse (Gos o Gat).

**Tipus de polimorfisme en Java**
Tipus	                     Descripció
Polimorfisme d’execució	     Es resol durant l’execució (exemple anterior).
Polimorfisme de compilació	 Mitjançant sobrecàrrega de mètodes (overloading).

**Aplicació habitual**
El polimorfisme permet escriure codi més genèric i reutilitzable:

```java
public void ferQueSoni(Animal animal) {
    animal.ferSo();  // El comportament depèn de la classe real
}
```

Pots passar-hi qualsevol subclasse d’Animal, i el comportament serà correcte.
