# Efectes col·laterals

Efectes col·laterals de les funcions (Pures vs Impures)

Quan parlem d'efectes col·laterals en les funcions, ens referim a si una funció modifica alguna cosa fora del seu àmbit o no. Això està relacionat amb el concepte de funcions pures i impures.

**Funcions pures**
Una funció pura és aquella que sempre retorna el mateix resultat per als mateixos arguments i no té efectes col·laterals.

**Características d'una funció pura**
- No modifica cap variable global ni cap estat extern.
- No té efectes secundaris (com escriure a un fitxer o modificar un objecte extern).
- No depèn de dades externes que puguin canviar (com una variable global o una base de dades).

**Exemple de funció pura**

```java
public class Exemple {
    public static int sumar(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        System.out.println(sumar(5, 3)); // Sempre retorna 8
    }
}
```

Aquesta funció és pura perquè sempre retorna el mateix resultat per als mateixos arguments i no modifica cap variable global.

**Funcions impures**
Una funció impura és aquella que pot tenir efectes col·laterals, és a dir, pot modificar l'estat del programa fora del seu propi àmbit.

**Característiques d'una funció impura**
- Pot modificar variables globals o atributs d'objectes.
- Pot realizar operacions d'entrada/sortida (System.out.println, escriure a un fitxer, modificar una base de dades, etc.).
- Pot dependre de dades externes (un valor aleatori, l'hora actual, un fitxer, etc.).

**Exemple de funció impura**

```java
public class Exemple {
    private static int total = 0; // Variable global

    public static int sumar(int a) {
        total += a; // Modifica una variable global (efectes col·lateral)
        return total;
    }

    public static void main(String[] args) {
        System.out.println(sumar(5)); // 5
        System.out.println(sumar(3)); // 8 (resultat diferent per al mateix paràmetre)
    }
}
```

Aquesta funció no és pura perquè modifica l'estat global (total), i el seu resultat depèn de les crides anteriors.

Altres tipus d'efectes col·laterals comuns en funcions impures

- **1.** Modificar objectes mutables passats com a paràmetres

```java
import java.util.List;

public class Exemple {
    public static void afegirElement(List<String> llista, String element) {
        llista.add(element); // Modifica l'objecte original (impur)
    }

    public static void main(String[] args) {
        List<String> noms = new java.util.ArrayList<>();
        afegirElement(noms, "Anna");
        System.out.println(noms); // [Anna]
    }
}
```

Aquesta funció és impura perquè modifica llista i afecta el seu estat fora de la funció.

- **2.** Llegir dades d'una font externa (ex: System.currentTimeMillis())

```java
public class Exemple {
    public static long obtenirTempsActual() {
        return System.currentTimeMillis(); // Depèn del sistema extern (impur)
    }

    public static void main(String[] args) {
        System.out.println(obtenirTempsActual());
    }
}
```

Aquesta funció és impura perquè cada vegada retorna un resultat diferent.

- **3.** Operacions d'entrada/sortida (System.out.println())

```java
public class Exemple {
    public static void imprimirMissatge(String missatge) {
        System.out.println(missatge); // Efecte col·lateral (escriu a la consola)
    }

    public static void main(String[] args) {
        imprimirMissatge("Hola!"); // No retorna res, només imprimeix
    }
}
```

Escriure a la consola és un efecte col·lateral perquè la funció modifica l'estat del programa fora del seu propi àmbit.

**Notes (funcions pures)**
1. Codi més previsible: el resultat sempre és el mateix per als mateixos arguments.

- **2.** Més fàcil de provar: no cal preocupar-se per estats globals o dades externes.

- **3.** Millor manteniment: els errors són més fàciñ de detectar.

- **4.** Millor optimizació: els compiladors poden optimitzar millor funcions pures perquè saben que no modifiquen res extern.

**Ús de funcions pures i impures**
Situació                        |Funció pura o impura   |Solució
Càlcul matemàtic senzill        |Pura                   |No modificar dades extern
Llegir un fitxer                |Impura                 |Separar la lectura de la lògica
Modificar un objecte existent   |Pura                   |Crear una còpia en lloc de modificar l’original
Escriure a la consola           |Impura                 |Evitar barreges amb lògica de càlcul

Les funcions pures són prevesibles, fàcils de provar i mantenir.

Les funcions impures són necessàris per interactuar amb el món exterior, però cal utilitzar-les amb precaució per evitar errors difícils de rastrejar.

Sempre que sigui possible, evita efectes col·laterals i separa les funcions pures de les impures.
