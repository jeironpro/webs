# Ejercicios — 20.09 — Inspeccio d un fitxer

**Enunciat**

Desenvolupa un programa que consideri els arguments de línia de comanda com si fossin camins del sistema de fitxer.

Per cada argument, comprovarà si correspon a un camí existent.

Si no existeix, indicarà "No trobat".

En cas que existeixi, indicarà els seus permisos per l'usuari en el format típic de GNU (rwx)

A continuació, indicarà si correspon a un fitxer o un directori.

En cas de ser un directori, mostrarà el nom dels fitxers i directoris que contingui. Ho farà de manera ordenada (Pista: recorda Arrays.sort())

Si és un fitxer, indicarà la seva longitud en bytes.

En cas que es pugui llegir i que la seva extensió sigui una de les conegudes, el programa mostrarà el seu contingut envoltant cada línia entre dos caràcters | per permetre distingir espais.

Es consideraran extensions conegudes .java i .txt.

Considera la següent simulació:

tree .
.
├── carpeta
│   ├── buida
│   ├── buit.txt
│   └── contingut.txt
├── Inspecciona.class
└── Inspecciona.java

**cat carpeta/contingut.txt**
primer
segon
tercer

**ls -s carpeta/buit.txt**
0 carpeta/buit.txt

java Inspecciona inexistent carpeta carpeta/contingut.txt carpeta/buit.txt carpeta/buida

**Processant argument: inexistent**
===============================

No trobat

**Processant argument: carpeta**
============================

rwx directori que conté: contingut.txt, buit.txt, buida

**Processant argument: carpeta/contingut.txt**
==========================================

**rw- fitxer de mida en bytes: 20**
Amb els continguts:
|primer|
|segon|
|tercer|

**Processant argument: carpeta/buit.txt**
=====================================

rw- fitxer buit

**Processant argument: carpeta/buida**
==================================

rwx directori buit

Et podria ser útil revisar la documentació oficial sobre File

```java
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.Arrays;
import java.io.IOException;

public class Inspecciona {
    public static void main(String[] args) throws IOException {
        for (int i = 0; i < args.length; i++) {
            File fitxer = new File(args[i]);

            mostraArgument(args[i]);

            if (fitxer.exists()) {
                permisos(fitxer);

                if (fitxer.isFile()) {
                    System.out.print("fitxer ");
                    processaFitxer(fitxer, args[i]);
                    System.out.println();
                }

                if (fitxer.isDirectory()) {
                    System.out.print("directori ");
                    processaDirectori(fitxer);
                    System.out.println();
                }
            } else {
                System.out.println("No trobat");
            }
        }
    }

    public static void mostraArgument(String arg) {
        String argument = String.format("Processant argument: %s", arg);
        System.out.println(argument);
        String divisio = "=".repeat(argument.length());
        System.out.println(divisio + "\n");
    }

    public static void permisos(File fitxer) {
        System.out.print(fitxer.canRead() ? "r" : "-");
        System.out.print(fitxer.canWrite() ? "w" : "-");
        System.out.print(fitxer.canExecute() ? "x " : "- ");
    }

    public static String extensio(String ruta) {
        String extensio = "";

        for (int i = ruta.length()-1; i >= 0; i--) {
            char c = ruta.charAt(i);

            if (c != '.') {
                extensio += c;
            } else {
                break;
            }
        }
        return extensio;
    }

    public static boolean verificaExtensio(String ruta) {
        String[] extensions = new String[] {"txt", "java"};

        String extensio = extensio(ruta);

        for (int i = 0; i < extensions.length; i++) {
            if (extensions[i].equals(extensio)) { return true; }
        }
        return false;
    }

    public static void processaFitxer(File fitxer, String ruta) throws IOException {
        if (fitxer.length() > 0) {
            System.out.printf("de mida en bytes: %d%n", fitxer.length());

            boolean obrir = verificaExtensio(ruta);

            if (obrir) {
                System.out.printf("Amb els continguts:%n");
                mostraContingutFitxer(fitxer);
            }
        } else {
            System.out.println("buit");
        }
    }

    public static void mostraContingutFitxer(File fitxer) throws IOException {
        BufferedReader lector = new BufferedReader(new FileReader(fitxer));

        while (true) {
            String linia = lector.readLine();

            if (linia == null) { break; }

            System.out.printf("|%s|%n", linia);
        }
        lector.close();
    }

    public static void processaDirectori(File fitxer) {
        String[] contingut = fitxer.list();

        Arrays.sort(contingut);

        if (contingut.length > 0) {
            mostraContingutDirectori(contingut);
        } else {
            System.out.println("buit");
        }
    }

    public static void mostraContingutDirectori(String[] contingut) {
        System.out.printf("que conté: %s", contingut[0]);

        for (int i = 1; i < contingut.length; i++) {
            String conte = contingut[i];
            System.out.printf(", %s", conte);
        }
        System.out.println();
    }
}
```
