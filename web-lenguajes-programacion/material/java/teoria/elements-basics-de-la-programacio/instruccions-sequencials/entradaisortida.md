# Entrada i sortida

**Entrada i sortida**
A Java, l'entrada i la sortida (E/S) permeten comunicar-nos amb l'usuari o amb altres fonts d'informació per llegir i mostrar dades.

**Sortida**
La sortida (o output) en Java sol fer-se amb la classe System i, en particular, amb els mètodes System.out.print() i System.out.println().

- System.out.print(): imprimeix el text o el valor sense salt de línia.
- System.out.println(): imprimeix el text o el valor i afegeix un salt de línia al final.

**Exemple de sortida**

```java
System.out.print("Hola, ");
System.out.println("Mon!");
System.out.println("Com estàs?");
```

**Sortida**
Hola, Mon!
Com estàs?

Així, System.out.print() manté el cursor a la mateixa línia, mentre que System.out.println() afegeix un salt de línia.

**Entrada**
Per llegir dades d'entrada des del teclat, es fa servir la classe Scanner del paquet java.util. Primer s'ha d'importar aquesta classe i crear un objecte Scanner associat a System.in, que és l'entrada estàndard del sistema.

**Exemple de lectura d'entrada**

```java
import java.util.Scanner; // Importem la classe Scanner

public class ExempleEntrada {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in); // Creem l'objecte Scanner

        System.out.print("Introdueix el teu nom: ");
        String nom = input.nextLine(); // Llegim una línia de text

        System.out.print("Introdueix la teva edat: ");
        int edat = input.nextInt(); // Llegim un enter

        System.out.println("Hola " + nom + ", tens " + edat + " anys.");

        input.close(); // Tanquem l'objecte Scanner
    }
}
```

**En aquest exemple**
- nextLine(): llegeix una línia de text completa.
- nextInt(): llegeix un enter (nombre sencer).
- Finalment, tanquem l'objecte Scanner amb input.close() per alliberar recursos.

**Sortida esperada**
Introdueix el teu nom: Jeiron
Introdueix la teva edat: 21
Hola Jeiron, tens 21 anys.

**Altes mètodes de Scanner per a altres tipus de dades**
- nextDouble(): per llegir un número decimal.
- nextBoolean(): per llegir un valor true o false.
- next(): per llegir una paraula (fins a un espai).
