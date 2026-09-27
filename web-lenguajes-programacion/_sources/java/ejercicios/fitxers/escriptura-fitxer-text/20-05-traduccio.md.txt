# Ejercicios — 20.05 — Traduccio

**Enunciat**

En aquest exercici desenvoluparem un programa que rebrà tres arguments per línia de comandes.

El primer correspondrà al nom d'un fitxer de text que suposarem que existeix, i que contindrà un text arbitrari.

Ens referirem a aquest fitxer com origen.

El segon argument correspondrà al nom d'un altre fitxer de text que també suposarem que existeix, i que anomenarem traducció

El contingut d'aquest fitxer serà un csv format per parelles de texts separades amb una coma (','). Les línies que continguin un nombre de comes diferent de 1 seran ignorades.

Al primer element de la parella li direm clau i al segon valor.

El tercer argument correspondrà al nom d'un fitxer de text que pot no existir.

Ens referirem a aquest fitxer com la destinació.

El programa escriurà en la destinació el contingut de l'origen pel que haurà reemplaçat les aparicions de les claus pels corresponents valors.

Per exemple, suposa la següent simulació:

**cat origen.txt**
En George Orwell va publicar "Animal Farm" en 1945.
Al mateix any, en Federico García Lorca va publicar "La casa de Bernarda Alba".

**cat traduccio.csv**
George Orwell, William Golding
Animal Farm, Lord of the Flies
en Federico García Lorca, la Nancy Mitford
La casa de Bernarda Alba, Madame de Pompadour
1945, 1954

java Traduccio origen.txt traduccio.csv destinacio.txt

**cat destinacio.txt**
En William Golding va publicar "Lord of the Flies" en 1954.
Al mateix any, la Nancy Mitford va publicar "Madame de Pompadour".

En cas que la traducció inclogui dues línies amb la mateixa clau i diferents valors, Traduccio considerarà la primera traducció.

**cat origen.txt**
"Animal Farm" es va publicar en 1945.

**cat traduccio.csv**
Animal Farm, Lord of the Flies
1945, 1954
1945, 2020

java Traduccio origen.txt traduccio.csv destinacio.txt

**cat destinacio.txt**
"Lord of the Flies" es va publicar en 1954.

En cas que la traducció inclogui una línia amb una clau que és traducció per una altra línia, el nostre programa aplicarà primer la primera línia i després la segona. Per exemple:

**cat origen.txt**
"Animal Farm" es va publicar en 1945.

**cat traduccio.csv**
Animal Farm, Lord of the Flies
1945, 19ipico
19ipico, 1954

java Traduccio origen.txt traduccio.csv destinacio.txt

**cat destinacio.txt**
"Lord of the Flies" es va publicar en 1954.

Per simplicitat, Traduccio distingirà majúscules i minúscules.

També per simplicitat, la traducció es realitzarà només per línies. És a dir, no es consideraran "claus trencades".

**$ cat origen.txt**
"Animal Farm" es va publicar en 1945. Des que es va publicar "Animal
Farm" el món no ha tornat a ser el que era.
$ cat traduccio.csv
Animal Farm, Lord of the Flies
1945, 1954
$ java Traduccio origen.txt traduccio.csv destinacio.txt
$ cat destinacio.txt
"Lord of the Flies" es va publicar en 1954. Des que es va publicar "Animal
Farm" el món no ha tornat a ser el que era.

Per passar totes les proves, tingues present:

Cal que implementis els següents mòduls en el fitxer que conté el main():

```java
        void tradueix(String fitxerOrigen, String fitxerTraduccio, String fitxerDestinacio)
```

Aquest mòdul rebrà els camins als fitxers i realitzarà la funcionalitat descrita.

String tradueixLinia(String linia, String fitxerTraduccio)

Aquest mòdul rebrà una línia i reemplaçarà les claus pels valors definits al fitxer de traducció.

Per simplicitat, cada cop que sigui cridada processarà novament el fitxer de traducció.

L'opertura i tancament dels fitxers ha d'aparèixer dins del codi del programa que conté el main().

prgtest t'ajudarà a decidir per detalls no especificats a aquest enunciat, com ara algun missatge d'error.

Una pista que et pot estalviar feina:

```java
jshell> "SuperMario".replace("Mario", "Girl");
```

1 ==> "SuperGirl"

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class Traduccio {
    public static void main(String[] args) throws IOException {
        if (args.length >= 3) {
            String origen = args[0];
            String traduccio = args[1];
            String destinacio = args[2];
            tradueix(origen, traduccio, destinacio);
        } else {
            System.out.println("Cal especificar els fitxers origen, traduccio i destinacio");
        }

    }

    public static void tradueix(String fitxerOrigen, String fitxerTraduccio, String fitxerDestinacio) throws IOException {
        FileReader llegirOrigen = new FileReader(fitxerOrigen);
        BufferedReader liniaOrigen = new BufferedReader(llegirOrigen);

        FileWriter escriuDestinacio = new FileWriter(fitxerDestinacio);
        BufferedWriter liniaDestinacio = new BufferedWriter(escriuDestinacio);

        while (true) {
            String linia = liniaOrigen.readLine();

            if (linia == null) { break; }
            
            String traduccio = tradueixLinia(linia, fitxerTraduccio);

            liniaDestinacio.write(traduccio);
            liniaDestinacio.newLine();
        }
        liniaOrigen.close();
        liniaDestinacio.close();
    }
    
    public static String tradueixLinia(String linia, String fitxerTraduccio) throws IOException {
        String traduccio = linia;

        FileReader llegirTraduccio = new FileReader(fitxerTraduccio);
        BufferedReader liniaTraduccio = new BufferedReader(llegirTraduccio);

        while (true) {
            String liniaTraduir = liniaTraduccio.readLine(); 
            
            if (liniaTraduir == null) { break; }

            String[] dicTraduccio = liniaTraduir.split(",");

            String clau = dicTraduccio[0].strip();
            String valor = dicTraduccio[1].strip();

            traduccio = traduccio.replace(clau, valor);
        }
        liniaTraduccio.close();
        return traduccio;
    }
}
```
