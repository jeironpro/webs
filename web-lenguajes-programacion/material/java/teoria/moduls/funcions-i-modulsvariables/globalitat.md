# Globalitat

**La globalitat de les variables en Java**
En Java, no existeixen variables globals en el sentit estricte com en alguns altres llenguatges de programació (com C). Això és perquè Java està dissenyat amb un fort enfocament en l'encapsulació i l'estructura orientada a objectes. Tanmateix, podem aconseguir un comportament similar al de les variables global utilitzant variables estàtiques, constants públiques o altres tècniques.

**Variables globals en Java (conceptualment)**
Una variable global és una variable que es pot accedir des de qualsevol part del programa sense necessitat de passar-la com a paràmetre. A Java, aquest comportament es pot simular utilitzant:

- **1.** Variables estàtiques dins d'una classe.
  2. Singletons o altres patrons de disseny per gestionar dades compartides.

**Variables estàtiques com a variables "globals"**
Les variables declarades com a static dins d'una classe són compartides per totes les instàncies d'aquesta classe i són accessibles sense necessitat de crear una instància. Si aquestes variables són també public, es poden utilitzar com si fossin globals.

**Exemple**

```java
public class Configuracio {
    public static String URL_BASE = "https://api.exemple.com";
    public static int MAXIM_CONEXIONS = 10;
}
```

**Ús**

```java
public class Exemple {
    public static void main(String[] args) {
        System.out.println(Configuracio.URL_BASE); // Accessible des de qualsevol lloc
    }
}
```

Aquí, URL_BASE i MAXIM_CONEXIONS són accessibles des de qualsevol classe perquè són públiques i estàtiques.

**Constants globals**
Quan es vol que una variable global sigui constant, es pot utilitzar el modificador final conjuntament amb static.

**Exemple**

```java
public class Constants {
    public static final double PI = 3.14159;
    public static final String MISSATGE_BENVIGUDA = "Hola, benvingut!";
}
```

**Ús**

```java
public class Exemple {
    public static void main(String[] args) {
        System.out.println(Constants.PI); // 3.14159
        System.out.println(Constants.MISSATGE_BENVINGUDA); // Hola, benvingut!
    }
}
```

Aquestes constants es poden accedir de manera segura perquè el seu valor no es pot modificar.

**Limitacions i riscos de les variables globals**
Tot i que les variables estàtiques poden simular la funcionalitat d'una variable global, tenen alguns riscos:

- **1.** Problemes de concurrència: si diverses parts del programa modifiquen una variable estàtica al mateix temps, aixo pot provocar resultats inconsistents.

- **2.** Dificultats en el manteniment: les variables globals poden ser difícils de rastrejar, especialment en programes grans.

- **3.** Coupling elevat: les variables globals poden fer que diferents parts del codi depenguin massa les unes de les altres, trencant el principi de modularitat.

**Alternatives a les variables globals**
En lloc d'utilitzar variables globals, considera aquestes alternatives més segures:

- **1.** Passar variables com a paràmetres:
- És millor passar les dades necessaries als mètodes en lloc de confiar en variables globals.

```java
        public void saludar(String nom) {
            System.out.println("Hola, " + nom);
        }
```

- **2.** Patró Singleton:
- El patró Singleton garanteix que només hi hagi una instància d'una classe en tot el programa i pot ser utilitzat per emmagatzemar dades compartides.

```java
        public class Configuracio {
            private static Configuracio instancia;
            public String urlBase;

            private configuracio() {
                UrlBase = "https://api.exemple.com";
            }

            public static Configuració getInstancia() {
                if (instancia == null) {
                    instancia = new Configuracio();
                }

                return instancia;
            }
        }
```

**Ús**

```java
        public class Exemple {
            public static void main(String[] args) {
                Configuracio config = Configuracio.getInstancia();
                System.out.println(config.urlBase);
            }
        }
```

- **3.** Mòduls a partir de Java 9:
  Si treballes amb aplicacion modulars, pots gestionar l'encapsulació i visibilitat de variables dins del mòduls i només exposar aquelles que realment necessites.
