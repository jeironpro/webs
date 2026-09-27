# Ejercicios — 31.18 — EnvoltaString es compara amb Strings

## EnvoltaString

**Enunciat**

Crea una nova versió de la classe EnvoltaString a partir de la versió de l'exercici anterior de manera que ara també permeti comparar un EnvoltaString directament amb un String.

Considera aquest UsaEnvoltaString:

XXX

```java
 public class UsaEnvoltaString {

     public static void main(String[] args) {

         String nom1 = "Renat";

         String nom2 = args.length > 0 ? args[0] : "nom per defecte";

         System.out.printf("\"%s\".equals(\"%s\") -> %b%n", nom1, nom2, nom1.equals(nom2));

         EnvoltaString envoltaNom1 = new EnvoltaString(nom1);

         EnvoltaString envoltaNom2 = new EnvoltaString(nom2);

         System.out.printf("%s.equals(%s) -> %b%n", envoltaNom1, envoltaNom2, envoltaNom1.equals(envoltaNom2));

         System.out.printf("%s.equals(\"%s\") -> %b%n", envoltaNom1, nom2, envoltaNom1.equals(nom2));

         System.out.printf("\"%s\".equals(%s) -> %b%n", nom1, envoltaNom2, nom1.equals(envoltaNom2));

     }

 }
```

Que presentarà la sortida:

**"Renat".equals("RENAT") -> false**
ENVOLTAT("Renat").equals(ENVOLTAT("RENAT")) -> true
ENVOLTAT("Renat").equals("RENAT") -> true
"Renat".equals(ENVOLTAT("RENAT")) -> false

Nota: fixa't en la darrera comparació de UsaEnvoltaString. Creus que mai podrà ser true? Perquè? Posa la teva resposta en els comentaris del teu codi.

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

    public boolean equals(String altre) {
        return valor.equalsIgnoreCase(altre);
    }

    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof EnvoltaString)) {
            return false;
        }
        EnvoltaString altre = (EnvoltaString) obj;
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
        System.out.printf("\"%s\".equals(\"%s\") -> %b%n", nom1, nom2, nom1.equals(nom2));

        EnvoltaString envoltaNom1 = new EnvoltaString(nom1);
        EnvoltaString envoltaNom2 = new EnvoltaString(nom2);
        System.out.printf("%s.equals(%s) -> %b%n", envoltaNom1, envoltaNom2, envoltaNom1.equals(envoltaNom2));
        System.out.printf("%s.equals(\"%s\") -> %b%n", envoltaNom1, nom2, envoltaNom1.equals(nom2));
        System.out.printf("\"%s\".equals(%s) -> %b%n", nom1, envoltaNom2, nom1.equals(envoltaNom2));
    }
}
```
