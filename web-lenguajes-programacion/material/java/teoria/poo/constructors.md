# Constructors

**Constructors**
Un constructor és un mètode especial que s'executa automaticament quan es crea una nova instància d'una classe. La seva funció principal és inicialitzar l'objecte, és a dir, donar valors inicials a les seves propietats.

**Característiques dels constructors**
- Tenen el mateix nom que la classe.
- No tenen tipus de retorn, ni tan sols void.
- Poden tenir paràmetres o no.
- Si no se'n defineix cap, Java en proporciona un per defecte (constructor buit).

**Exemple**

```java
public class Persona {
    private String nom;
    private int edat;
```

**// Constructor**

```java
    public Persona(String nom, int edat) {
        this.nom = nom;
        this.edat = edat;
    }

    public void saludar() {
        System.out.println("Hola, em dic " + nom + " i tinc " + edat + " anys.");
    }
}
public class Principal {
    public static void main(String[] args) {
        Persona p = new Persona("Anna", 25);  // Es crida el constructor
        p.saludar();  // Hola, em dic Anna i tinc 25 anys.
    }
}
```

**Constructors múltiples (Sobrecàrrega)**
Es poden definir diversos constructors amb diferents paràmetres:

```java
public class Persona {
    private String nom;
    private int edat;

    public Persona() {
        this.nom = "Desconegut";
        this.edat = 0;
    }

    public Persona(String nom) {
        this.nom = nom;
        this.edat = 0;
    }

    public Persona(String nom, int edat) {
        this.nom = nom;
        this.edat = edat;
    }
}
```

**Per què són importants**
1. Faciliten la creació d'objectes amb estat incial.

- **2.** Permeten sobrecàrrega per oferir diferents maneres de construir un objecte.

- **3.** Poden ajudar a forçar la inicialització correcta de les propietats.
