# Gestió de memòria

**Valor de Referència i Gestió de la Memòria**
Java utilitza dos mecanismes principals per gestionar la memoria:
1. Valor de referència
2. Assignació per valor (valor primitiu)

En Java, la forma en què les variables es gestionen en memòria depèn del tipus de dada que estem utilitzant: tipus primitius o objectes.

**Valor de referència (objectes)**
Quan es treballa amb objectes, Java utilitza un mecanisme de valor de referència. Això vol dir que les variables que emmagatzemen objectes continguen una referència (una adreça de memòria) que apunta a la ubicació de l'objecte a la memòria heap. Els objectes sempre s'emmagatzemen a la memòria heap.

**Exemple de valor de referència**

```java
public class Exemple {
    public static void main(String[] args) {
        Personatge personatge1 = new Personatge("Anna");
        Personatge personatge2 = personatge1;  // personatge2 apunta a l'objecte de personatge1

        personatge2.setNom("Maria");
        System.out.println(personatge1.getNom());  // Maria
    }
}

class Personatge {
    private String nom;

    public Personatge(String nom) {
        this.nom = nom;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }
}
```

**Explicació**
- En aquest exemple, personatge1 i personatge2 comparten la mateixa referència a l'objecte de la classe Personatge.

- Quan es modifica l'objecte via personatge2, també afecta a personatge1, ja que ambdues variables apunten a la mateixa ubicació de memòria.

La memòria heap i la recollida d'escombraries (Garbage Collection)
- Heap: és la zona de memòria on s'emmagatzemen els objectes creats per l'usuari.

- Garbage Collection: Java utilitza un mecanisme automàtic de memòria, conegut com garbage collection, per eliminar els objectes que ja no són referenciats, alliberant aixì memòria.

**Tipus primitives (assignació per valor)**
Els tipus primitius (com int, double, boolean, etc.) s'assignen per valor, és a dir, quan assignem una variable a un tipus primitiu, s'està copiant el valor real a la nova variable, no la seva referència. Cada variable té el seu propi valor a la memòria.

**Exemple de tipus primitiu per valor**

```java
public class Exemple {
    public static void main(String[] args) {
        int a = 5;
        int b = a;  // b rep el valor de a, no la referència

        b = 10;  // canviem b, però a segueix igual
        System.out.println(a);  // 5
        System.out.println(b);  // 10
    }
}
```

**Explicació**
- En aquest cas, a i b són variables independents amb el seu propi valor.

- Quan assignem a a b, es fa una còpia del valor de a, de manera que els canvis a b no afecten a a.

**Gestió de memòria**
La gestió de memòria en Java es divideix principalment en dues parts: Heap i Stack.

**Heap**
- Són els espais on es guarden els objectes creats dinàmicament.

- Els objectes viuen a la heap fins que són eliminats oel garbage collector.

- Quan es fa una nova instància d'un objecte (new Object()), la referència es guarda a la pila (stack), però l'objecte real es guarda a la heap.

**Stack**
- És on es guarden les varaibles locals i les referències a objectes.

- Les variables locals de mètodes o funcions s'emmagatzemen a la pila.

- Quan es crea una variable local, com un tipus primitiu o una referència a un objecte, aquesta variable viu a la pila fins que el mètode en què es troba ha acabat.

**Notes**
- Tipus primitius: S'assignen per valor. Cada variable té la seva pròpia còpia del valor a la memòria.

- Objectes: S'assignen per referència. Les variables contenen la referència a un objecte allotjat a la heap.

- Heap: On es guarden els objectes.

- Stack: On es guarden les variables locals i les referències als objectes.
