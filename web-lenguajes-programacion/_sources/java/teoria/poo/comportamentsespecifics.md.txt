# Comportaments específics

**Comportaments específics**
Els comportaments específics fan referència a aquells mètodes que una subclasse redefineix per adaptar-los al seu propi funcionament, tot i haver-los heretat d'una superclasse. Això s'anomena sobreescriptura de mètodes (en anglès, method overriding).

Aquest concepte permet que diferents subclasses tinguin comportaments diferents davant una mateixa acció.

És la base del polimorfisme

**Exemple**

```java
public class Animal {
    public void ferSo() {
        System.out.println("Aquest animal fa un so desconegut.");
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
        Animal a = new Animal();
        Gos g = new Gos();
        Gat c = new Gat();

        a.ferSo();  // Aquest animal fa un so desconegut.
        g.ferSo();  // El gos diu: Bup bup!
        c.ferSo();  // El gat diu: Mèu mèu!
    }
}
```

**Característiques**
- La subclasse pot redefinir un mètode de la superclasse amb la mateixa signatura.

- Cal utilitzar l'anotació @Override per indicar que s'està sobreescrivint un mètode.

- Permet adaptar el comportament heretat a un context més específic.

**Avantatges**
- Permet personalitzar comportaments heretats.

- Facilita el polimorfisme, ja que es poden tractar diferents subclasses de manera uniforme però amb resultats diferents.

- Augmenta la flexibilitat i extensibilitat del codi.
