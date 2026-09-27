# Ejercicios — 31.17 — EnvoltaString indiferent a majuscules i minuscules

## EnvoltaString

**Enunciat**

Modifica la classe EnvoltaString de manera que consideri iguals dos EnvoltaString quan els seus valors coincideixen sense tenir en compte majúscules i minúscules.

El prgtest executarà el següent codi:

XXX

```java
 public class UsaEnvoltaString {

     public static void main(String[] args) {

         String nom1 = "Renat";

         String nom2 = args.length > 0 ? args[0] : "nom per defecte";

         System.out.printf("\"%s\" == \"%s\" -> %b%n", nom1, nom2, nom1 == nom2);

         System.out.printf("\"%s\".equals(\"%s\") -> %b%n", nom1, nom2, nom1.equals(nom2));

         EnvoltaString envoltaNom1 = new EnvoltaString(nom1);

         EnvoltaString envoltaNom2 = new EnvoltaString(nom2);

         System.out.printf("%s == %s -> %b%n", envoltaNom1, envoltaNom2, envoltaNom1 == envoltaNom2);

         System.out.printf("%s.equals(%s) -> %b%n", envoltaNom1, envoltaNom2, envoltaNom1.equals(envoltaNom2));

     }

 }
```

Esperarà que, per exemple, la següent execució generi la sortida esperada:

**"Renat" == "RENAT" -> false**
"Renat".equals("RENAT") -> false
ENVOLTAT("Renat") == ENVOLTAT("RENAT") -> false
ENVOLTAT("Renat").equals(ENVOLTAT("RENAT")) -> true

```java
public class EnvoltaString {
    private String valor;

    public EnvoltaString(String valor) { 
        this.valor = valor; 
    }

    @Override
    public String toString() { 
        return String.format("ENVOLTAT(\"%s\")", valor); 
    }

    public boolean equals(EnvoltaString altre) {
        return valor.equalsIgnoreCase(altre.valor);
    }
}
```

## UsaEnvoltaString

```java
public class UsaEnvoltaString {
    public static void main(String[] args) {
        String nom1 = "Renat";
        String nom2 = args.length > 0 ? args[0] : "nom per defecte";
        System.out.printf("\"%s\" == \"%s\" -> %b%n", nom1, nom2, nom1 == nom2);
        System.out.printf("\"%s\".equals(\"%s\") -> %b%n", nom1, nom2, nom1.equals(nom2));

        EnvoltaString envoltaNom1 = new EnvoltaString(nom1);
        EnvoltaString envoltaNom2 = new EnvoltaString(nom2);
        System.out.printf("%s == %s -> %b%n", envoltaNom1, envoltaNom2, envoltaNom1 == envoltaNom2);
        System.out.printf("%s.equals(%s) -> %b%n", envoltaNom1, envoltaNom2, envoltaNom1.equals(envoltaNom2));
    }
}
```
