# Ejercicios — 20.04 — El lloro amb memoria

**Enunciat**

Al llarg d'aquest curs hem fet servir el patró del lloro en multitud d'ocasions. Aquest patró ens va bé quan hem de recorrer una seqüència de valors de la que no coneixem la longitud però sí una marca de finalització.

Inicialment aplicàvem el lloro a l'entrada estàndard però recentment l'hem vist també aplicat a les línies d'un fitxer de text.

En aquesta ocasió hauràs d'implementar una versió del lloro amb memòria. És a dir, el lloro serà capaç de guardar totes les frases que rebi per entrada estàndard en un fitxer anomenat records.txt.

El programa es dirà Recorda.

Una simulació d'execució podria ser:

**El lloro pregunta paraula**
Com estàs?
El lloro registra: Com estàs?
El lloro pregunta paraula:
Molt bé
El lloro registra: Molt bé
El lloro pregunta paraula:
Vinga, siau
El lloro registra: Vinga, siau
El lloro pregunta paraula:

**D'acord**
El lloro recorda: Com estàs?
El lloro recorda: Molt bé
El lloro recorda: Vinga, siau
Adéu

És a dir, el programa funciona en dues fases:

A la primera fase, el lloro anirà registrant les frases que rebi fins que l'entrada sigui buida.

En rebre la cadena buida, el lloro passa a la fase de record i recita les entrades que ha registrat.

Algunes consideracions addicionals:

El lloro no guarda cap línia buida

El lloro ignora els espais en blanc a l'inici i al final de cada entrada de manera que ni els registra ni els recorda.

Un cop finalitzada l'execució del programa, queda el fitxer records.txt amb el següent contingut:

**cat records.txt**
Com estàs?
Molt bé
Vinga, siau

Per fer aquesta implementació, fes servir aquest main():

```java
    public static void main(String[] args) throws IOException {

        String cami = "records.txt";

        processaEntrada(cami);

        System.out.println("D'acord");

        mostraRecords(cami);

    }
```

Nota: Per passar totes les proves, caldrà que tant l'opertura com el tancament de fitxers es faci dins del programa que conté el main().

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class Recorda {
    public static void main(String[] args) throws IOException {
        String cami = "records.txt";
        processaEntrada(cami);
        System.out.println("D'acord");
        mostraRecords(cami);
    }

    public static void processaEntrada(String ruta) throws IOException {
        BufferedWriter escriu = new BufferedWriter(new FileWriter(ruta));

        while (true) {
            System.out.println("El lloro pregunta paraula:");
            String paraula = Entrada.readLine();

            if (paraula.isBlank()) { break; }

            escriu.write(paraula);
            escriu.newLine();
            System.out.printf("El lloro registra: %s%n", paraula);
        }
        escriu.close();
    }

    public static void mostraRecords(String ruta) throws IOException {
        BufferedReader lector = new BufferedReader(new FileReader(ruta));
        
        while (true) {
            String linia = lector.readLine();

            if (linia == null) { break; }

            System.out.printf("El lloro recorda: %s%n", linia);
        }
        lector.close();
    }
}
```
