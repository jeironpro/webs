# Variables i mòduls

**Variables abans de mòduls**
Les vaiables són noms que fa referència a espais de memòria on es poden emmagatzemar dades. Permeten guardar, modificar i recuperar valors al llarg de l'execusió d'un programa. Cada variable té un nom, un tipus i un valor.

**Declaració i inicialització**
Una variable es declara especificant el tipus de dada i el nom, i opcionalment es pot inicialitzar amb un valor.

```java
tipus nomVariable = valor;
```

**Exemple**

```java
int edat = 25; // Variable de tipus enter
double preu = 9.99; // Variable de tipus decimal
String nom = "Maria"; // Variable de tipus cadena
```

**Tipus de variables**
En java, les variables es poden classificar en funció del seu abast i ús:
1. Variable locals:
- Es declaren dins d'un mètode, constructor o bloc.
- Només són accessibles dins del bloc on es declaren.
- No tenen un valor per defecte i han de ser inicialitzades abans d'usar-les.

```java
        public void saludar() {
            String missatge = "Hola!"; // Variable local
            System.out.println(missatge);
        }
```

- **2.** Variables d'instància (no estàtiques):
- Es declaren fora dels mètodes, dins d'una classe.
- Cada instància de la classe té la seva pròpia còpia.
- Tenen un valor per defecte (per exemple, 0 per enters, null per objectes).

```java
        public class Persona {
            String nom; // Variable d'instància
        }
```

- **3.** Variables estàtiques (de classe):
- Es declaren amb el modificador static.
- Comparteixen el mateix valor entre totes les instàncies de la classe.
- Es poden accedir directament utilitzant el nom de la classe.

```java
        public class Exemple {
            static int contador = 0; // Variable estàtica
        }
```

**Modificadors de les variables**
Les variables es poden modificar utilitzant paraules clau:
1. final: converteix la variable en constant. Un cop inicialitzada, el valor no es pot canviar.

```java
        final double PI = 3.14159;
```

- **2.** static: fa que la variable sigui compartida entre totes les instàncies de la classe.abstract

- **3.** transient: indica que la variable no es serialitzarà.

- **4.** volatile: utilitzada en programes multithread per garantir la coherència de la variable entre fils.abstract

**Tipus de dades de les variables**
Les variables a Java es basen en dos tipus de dades:
1. Tipus primitius:
- byte, short, int, long (números enters).
- float, double (números decimals).
- char (caràcters).
- boolean (cert/fals).

- **2.** Tipus de referència:
- Inclou objectes i arrays. El valor d'aquestes variables és una referència a un espai de memòria.

**Inicialització per defecte**
Les variables locals no tenen un valor per defecte i han de ser inicialitzades abans d'usar-les. Les variables d'instancia i estàtiques, en canvi, tenen els valors per defecte següents:
- Números enters (int, long): 0
- Números decimals (float, double): 0.0
- Booleans: false
- Objectes: null

Quan parlem de variables en el context de mòduls a Java, ens referim a com es poden gestionar, compartir i limitar les variables en una aplicació modular. Això inclou com les variables dins dels mòduls es fan accessibles o es restringeixen per millorar la seguretat i l'encapsulació.

**Context de les variables en mòduls**
En una aplicacioó modular (introduïda a partir de Java 9), les variables es poden utilitzar dins de les classe, paquets i mòduls amb els mateixos principis generals, però amb algunes particularitats:

- **1.** Encapsulació amb mòduls: podem decidir quins paquets i variables són accessibles per altres mòduls.
  2. Visibilitat limitada: els mètodes i variables d'una classe dins d'un mòdul poden ser visibles només dins del mòdul, a menys que es defineix explícitament al fitxer module-info.java.

**Exemple pràctics**
1. Variables dins d'una classe són per defecte encapsulades, fins i tot en aplicacions modulars.

```java
module calculadora {
    exports com.exemple.calculadora; // Només exposem el paquet
}

package com.exemple.calculadora;

public class Calculadora {
    private int resultat; // Només accessible dins de la classe

    public int sumar(int a, int b) {
        resultat = a + b;
        return resultat;
    }
}
```

Aquí, la variable resultat no és accesible fora de la classe Calculadora, ni tan sols per altres classes del mateix mòdul.

- **2.** Exposició de variables a través de mètodes públics
  Si volem permetre l'accés a una variable des d'un altre mòdul, utilitzem mètodes públics per encapsular-la i controlar-ne l'accés.

```java
module calculadora {
    exports com.exemple.calculadora;
}

package com.exemple.calculadora;

public class Calculadora {
    private int resultat;

    private int getResultat() { // Mètode públic per accedir a la variable
        return resultat;
    }

    public int sumar(int a, int b) {
        resultat = a + b;
        return resultat;
    }
}
```

En aquest cas, la variable resultat pot ser llegida però no modificada directament, mantenint la integritat del mòdul.

- **3.** Variables estàtiques dins d'un mòdul
  Les variables estàtiques són compartides per totes les instàncies d'una classe. Si es defineixen dins d'un mòdul, poden ser accessibles des de fora si el paquet és exportat i la variable és pública.

```java
module calculadora {
    exports com.exemple.utils;
}

package com.exemple.utils;

public class Constants {
    public static final double PI = 3.14159; // Accessible des de qualsevol mòdul
}
```

Aquesta variable PI serà accesible des d'altres mòduls sempre que el paquet com.exemple.utils estigui exportat.

**Com afecta el fitxer module-info.java a les variables**
El fitxer module-info.java controla quins paquets i, per extensió, quines variables o classes poden ser utilitzades per altres mòduls.

**Exemple**

```java
module calculadora {
    exports com.exemple.utils; // Exposem només aquest paquet
}
```

- Si una classe dins del paquet com.exemple.utils té una variable pública o estàtica, aquesta serà accessible des d'altres mòduls.

- Si el paquet no està exportat, totes les seves variables quedaran encapsulades dins del mòdul, encara que siguin publiques.

**Bones pràctiques amb variables en aplicacions modulars**
1. Encapsula les variables sensibles: declara-les com a private i proporciona accés només a través de mètodes públics o protegits.

- **2.** Exporta només el que és necessari: limita els paquets i classes accessibles per altres mòduls al mínim indispensable.

- **3.** Utilitza constants: per valors i invariables, utilitza final i static per millorar la claredat i evitar canvis inesperats.

- **4.** Evita fer variables globals dins de mòduls: les variables global poden provocar problemes de coherència i depuració.
