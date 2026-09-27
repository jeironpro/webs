# Propietats protegides

**Propietats Protegides**
Les propietats protegides són aquelles que tenen el modificador d'accés procteted.

**Això vol dir que**
- Es poden accedir des de:
- La mateixa classe
- Qualsevol subclasse (fins i tot si és en un altre paquet)
- Qualsevol classe dins del mateix paquet

Aquest tipus de modificador ofereix un nivell intermedi de visibilitat, entre private i public.

**Exemple**

```java
public class Animal {
    protected String nom;

    public Animal(String nom) {
        this.nom = nom;
    }

    public void mostrarNom() {
        System.out.println("Nom: " + nom);
    }
}

public class Gos extends Animal {
    public Gos(String nom) {
        super(nom);
    }

    public void bordar() {
        System.out.println(nom + " està bordant!");  // Accés a propietat protegida
    }
}
```

**I una classe principal**

```java
public class Principal {
    public static void main(String[] args) {
        Gos g = new Gos("Rex");

        g.bordar();  // Rex està bordant!
        g.mostrarNom();  // Nom: Rex
```

// No podem accedir a `nom` directament si no és des d'una subclasse
// System.out.println(g.nom);  // ERROR: nom té accés protegit

```java
    }
}
```

**Característiques de les propietats protegides**
1. Permet reutilització segura dins de jerarquies d'herència, ja que les subclasses poden accedir a aquestes propietats.

- **2.** No és accessible directament des de fora del paquet si no és a través d'una subclasse.

- **3.** És un bon recurs per protegir l'estat d'un objecte tot mantenint la flexibilitat per a la reutilització.

**Comparació ràpida**
Modificador   Mateixa classe   Mateix paquet   Subclasses   Fora del paquet
private	            ✅	           ❌	        ❌	          ❌
(default)	        ✅	           ✅	        ❌	          ❌
protected	        ✅	           ✅	        ✅	          ❌
public	            ✅	           ✅ 	        ✅ 	          ✅
