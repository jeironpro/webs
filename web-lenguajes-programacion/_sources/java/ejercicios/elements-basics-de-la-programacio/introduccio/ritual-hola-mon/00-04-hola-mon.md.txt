# Ejercicios — 00.04 — Hola Mon

**Enunciat**

En aquest exercici comprovaràs el funcionament de prgtest.

Fixa't com la icona que representa l'exercici es mostra amb la marca ✓. Això t'indica que l'exercici disposa de prova automàtica. Anem a executar-la.

- Si no ho has fet encara, actualitza el teu repositori per si hi ha canvis. Per exemple, si has fet coses a un altre lloc o bé jo t'he afegit actualitzacions.
-git pull

Ara, obre un terminal, inicialitza l'exercici, crea i ves a la carpeta corresponent (recorda prgtest init 00_04).

Ara guarda el fitxer HolaMon.java dins la carpeta de lliurament que s'indica a l'inici d'aquest enunciat.

- Pots comprovar que a la carpeta hi és el fitxer HolaMon.java des del terminal:
-ls
-HolaMon.java
-cat HolaMon.java

* Programa que saluda al món

```java
public class HolaMon {
    public static void main(String[] args) {
        System.out.println("Hola Món!");
    }
}
```

- Un cop te n'has assegura't que el codi del teu programa hi és, toca compilar:
-javac HolaMon.java

- Probablement no et donarà cap error i t'haurà generat el fitxer HolaMon.class. Ho comprovem:
-ls
-HolaMon.class
-HolaMon.java

- Fas la prova de que el teu programa fa el que s'espera:
-java HolaMon
Hola Món!

- Com que fa bona pinta, el guardes al repositori:
-git add HolaMon.java
-git commit -am "finalitzat 00_04"

Fixa't que el missatge del commit indica que s'ha finalitzat aquest exercici. Et recomano molt que quan registris els canvis prenguis una mica de temps per descriure què has fet. Aquests missatges t'ajudaran molt per trobar una versió en cas que tinguis algun problema en el futur.

- Ara és el moment de comprovar que el programa fa l'esperat:
prgtest
🟢 INFO: Test de compilació principal passat
⛔ ERROR: La prova d'entrada/sortida 01 ha fallat.

He trobat una discrepància en la sortida estànadard del teu programa

- He executat el teu programa amb la comanda:
-java HolaMon

No li he passat cap més entrada.

**El que esperava per sortida estàndard és**
1  → Hello World!

**La sortida ha produït el teu programa ha estat**
1  → Hola Món!

**Aquesta és la primera diferència**
1    Hello World!
1    Hola Món!
-     ^
💡 Executa el teu programa amb l'entrada especificada per reproduir l'error

Ops! Què ha passat? Sembla que el nostre programa no passa una de les proves!

Si ens fixem bé en el que ens diu prgtest veiem que la sortida esperada era "Hello World!" mentre que la que ha generat el nostre programa ha estat "Hola Món!". De fet, fins i tot ens indica quina és la primera lletra que difereix. Per descomptat, podrien haver-hi més errors. En aquest tipus de proves, prgtest només ens donarà el primer error que trobi.

Però el meu programa estava bé, profe. Si he copiat exactament el teu codi!

D'acord. He fet una miqueta de trampa aquí i he demanat que la prova requereixi que la sortida del programa estigui en anglès. Tenia una bona raó per enredar-te: que poguessis veure un error de prgtest. Si segueixes el curs sencer, el prgtest serà una eina tan important (i estimada/odiada) com ho pugui ser el compilador javac. Està bé que vagis coneixent les seves manies.

- Ara que ja saps quin és el problema, corregeix el codi, torna a fer una prova manual per veure que tot estigui bé, registra el canvi i passa un altre cop prgtest:
-javac HolaMon.java
-java HolaMon
-Hello World!
-git commit -am "00_04 canvi idioma de la sortida"
-prgtest
El teu exercici passa totes les proves

Un cop saps que el teu programa passa les proves, pots decidir pujar-lo al repositori remot perquè jo te'l pugui corregir, o esperar-te a haver fet més exercicis.

- Suposem que ja has acabat de treballar per avui i vols lliurar:
-git push

Si tot ha anat bé, ja pots donar-ho per lliurat.

```java
public class HolaMon {
    public static void main(String[] args) {
        System.out.println("Hola Món!");
    }
}
```
