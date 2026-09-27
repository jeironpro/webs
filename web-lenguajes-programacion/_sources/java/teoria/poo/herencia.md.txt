# Herencia

**Herència**
L'herència és un mecanisme de la POO que permet crear una nova classe a partir d'una altra existent. La classe nova hereta propietats i mètodes de la classe "pare" o superclasse, i pot afegir o modificar funcionalitats.

Es pot resumir com: "Una classe és un tipus de una altra".

**Exemple**
// Classe pare (superclasse)

```java
public class Animal {
    public void ferSo() {
        System.out.println("Aquest animal fa un so.");
    }
}
```

// Classe filla (subclasse)

```java
public class Gos extends Animal {
    public void ferSo() {
        System.out.println("El gos borda.");
    }
}
public class Principal {
    public static void main(String[] args) {
        Animal a = new Animal();
        a.ferSo();  // Aquest animal fa un so.

        Gos g = new Gos();
        g.ferSo();  // El gos borda.
    }
}
```

**Conceptes clau**
- extends: s’utilitza per estendre una classe (fer que una classe hereti d’una altra).

- Una subclasse pot sobreescriure (override) mètodes de la superclasse.

- Una subclasse hereta tots els atributs i mètodes no privats de la superclasse.

- Es pot utilitzar super per cridar el constructor o mètodes de la superclasse.

**Exemple super**

```java
public class Animal {
    protected String nom;

    public Animal(String nom) {
        this.nom = nom;
    }

    public void presentar() {
        System.out.println("Sóc un animal i em dic " + nom);
    }
}
public class Gat extends Animal {
    public Gat(String nom) {
        super(nom);  // Crida al constructor de la superclasse
    }

    public void presentar() {
        super.presentar();  // Opcional: reutilitza la funcionalitat de la superclasse
        System.out.println("Però també sóc un gat.");
    }
}
```

**Herència i jerarquia**
Es poden crear cadenes d'herència (una classe pot heretar d'una altra que alhora hereta d'una altra). Però en Java:
- No hi ha herència múltiple de classes (una classe no pot heretat de més d'una alhora).

- Si que es poden implementar múltiples interfícies.
