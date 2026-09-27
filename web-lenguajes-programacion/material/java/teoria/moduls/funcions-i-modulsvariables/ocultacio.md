# Ocultacio

**Ocultació (Variable Hiding)**
L'ocultació de variables es produeix quan una variable en una subclasse té el mateix nom que una variable en la superclasse, ocultant-la en el context de la subclasse.

**Característiques de l'ocultació de variables**
1- Succeeix amb variables d'instància o estàtiques, però no amb mètodes (en aquest cas e s parla de sobreescriptura).

2- La variable de la superclasse encara existeix, però queda oculta si es declara una amb el mateix nom a la subclasse.

- **3.** No afecta mètodes només atributs.

4- super.nomVariable es pot usar per accedir a la variable de la superclaas.

**Exemple bàsic**

```java
class Pare {
    String missatge = "Hola des de la claase Pare";
}

class fill extends Pare {
    String missatge = "Hola des de la classe fill"; // Ocultat la variable de Pare
}

public class Exemple {
    public static void main(String[] args) {
        Pare obj1 = new Pare();
        System.out.println(obj1.missatge); // "Hola des de la classe Pare"

        Fill obj2 = new Fill();
        System.out.println(obj2.missatge); // "Hola des de la classe Fill"

        Pare obj3 = new Fill();
        System.out.println(obj3.missatge); // "Hola des de la classe Pare" (NO es polimòrfic!)
    }
}
```

Quan es declara Pare obj3 = new Fill();, la variable missatge de Pare No s'oculta dinamicament. Java no fa polimorfisme amb atributs, només amb mètodes.

**Accedir a la variable oculta amb super**
Si volem accedir a la variable de la superclasse, podem usar super.nomVariable:

```java
class Pare {
    String missatge = "Hola des de la classe Pare";
}

class Fill extends Pare {
    String missatge = "Hola des de la classe Fill";

    public void mostrarMissatge() {
        System.out.println("Missatge de Fill: " + missatge);
        System.out.println("Missatge de Pare: " + super.missatge);
    }
}

public class Exemple {
    public static void main(String[] args) {
        Fill obj = new Fill();
        obj.mostrarMissatge();
    }
}
```

**Sortida**
Missatge de Fill: Hola des de la classe Fill
Missatge de Pare: Hola des de la classe Pare

Super.missatge permet accedir a la variable de la superclasse.

**Ocultació de variables estàtiques**
L'ocultació també s'aplica a variables estàtiques, però no hi ha accés a través de super, ja que les variables estàtiques no són heretades, només compartides.

```java
class Pare {
    static String missatge = "Missatge de Pare";
}

class Fill extends Pare {
    static String missatge = "Missatge de Fill"; // Oculta la variable de Pare
}

public class Exemple {
    public static void main(String[] args) {
        System.out.println(Pare.missatge); // "Missatge de Pare"
        System.out.println(Fill.missatge); // "Missatge de Fill"

        Pare obj = new Fill();
        System.out.println(obj.missatge); // "Missatge de Pare" (No hi ha polimorfisme!)
    }
}
```

Les variables estàtiques no es comporten de manera polimòrfica.
Encara que obj és de tipus Fill, s'accedeix a missatge de Pare perquè és estàtica.

**Notes**
1- L'ocultació de variables passa quan una subclasse defineix una variable amb el mateix nom que una en la superclasse.

2- Afecta atributs d'instància i estàtics, però no mètodes.

3- Es pot accedir a la variable de la superclasse amb super.nomVariable.

4- Les variables estátiques ocultes no tenen polimorfisme, només es prenen segons el tipus de la referència.
