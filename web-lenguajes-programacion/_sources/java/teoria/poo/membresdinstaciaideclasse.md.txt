# Membres d'instància i de classe

**Membres d'instància i de classe**
Les propietats (atributs) i els mètodes d'una classe poden ser de dos tipus:
1. Membre d'instància (instance members):
Pertenyen a cada objecte creat de la classe. Cada instància té la seva pròpia còpia.

- **2.** Membres de classe (class members):
  També coneguts com a members estàtics (static). Pertenyen a la classe en si, no a les instàncies. Hi ha una sola còpia compartida entre tots els objectes.

**Exemple**

```java
public class Cotxe {
```

// Membre d’instància

```java
    private String marca;
```

**// Membre de classe (estàtic)**

```java
    public static int nombreDeCotxes = 0;
```

**// Constructor**

```java
    public Cotxe(String marca) {
        this.marca = marca;
        nombreDeCotxes++;  // Incrementa el nombre total de cotxes creats
    }
```

**// Mètode d’instància**

```java
    public String obtenirMarca() {
        return marca;
    }
```

**// Mètode de classe**

```java
    public static int obtenirNombreDeCotxes() {
        return nombreDeCotxes;
    }
}

public class Principal {
    public static void main(String[] args) {
        Cotxe c1 = new Cotxe("Toyota");
        Cotxe c2 = new Cotxe("Ford");
```

**// Membres d’instància**

```java
        System.out.println(c1.obtenirMarca());  // Toyota
        System.out.println(c2.obtenirMarca());  // Ford
```

**// Membre de classe (es pot accedir sense instància)**

```java
        System.out.println(Cotxe.obtenirNombreDeCotxes());  // 2
    }
}
```

**Diferències clau**
Característica    Membre d’instància	   Membre de classe (static)
Associat a	      Cada objecte	           Tota la classe
Còpia	          Una per objecte	       Una sola compartida
Accés	          mitjançant l’objecte	   mitjançant la classe (preferentment)
Memòria	          Assignada per objecte	   Assignada una vegada per la classe
Exemple	          this.nom	               Classe.nomEstàtic
