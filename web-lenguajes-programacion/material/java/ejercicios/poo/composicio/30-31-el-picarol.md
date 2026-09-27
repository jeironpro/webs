# Ejercicios — 30.31 — El Picarol

## GatRenat

**Enunciat**

Posem-li un picarol al gat Renat!

En aquest exercici desenvoluparem una nova versió del nostre estimat Gat Renat. En aquesta ocasió, en Renat acceptarà que li pengem un picarol.

Un Picarol ens permet fer dues coses:

sona(): fa sonar el picarol

Per simular el so del picarol, el mètode sona() escriurà per pantalla el missatge "clink-clink".

int vegades(): retornarà el nombre de cops que ha sonat el picarol des de que va ser creat.

Per la seva banda, GatRenat incorpora els següents mètodes:

boolean hiHaPicarol(): cert si té un picarol assignat. En néixer, el gat Renat no en té.

Picarol agafaPicarol(Picarol): assigna un picarol. Si en tenia un, el substitueix pel nou i retorna l'anterior. Si no en tenia cap, retorna el valor null.

Picarol deixaPicarol(): retorna el picarol i a partir d'aquest moment deixa de tenir picarol. Si no en tenia cap, retorna null.

Quan el Renat té un picarol penjat, cada cop que es mou (s'aixeca, seu o s'estira), fa sonar el picarol. Atenció: no es considera que es mou quan es construeix la instància ni quan es fa servir el mètode setPosicio().

Fes servir el següent codi per provar aquesta nova funcionalitat:

/* Aquest programa demostra el funcionament de la classe GatRenat amb la funcionalitat Picarol.

* El programa crea un gat i un picarol, fa sonar el picarol sense gat i després li posa

* i el fa moure perquè soni.

* Aquesta versió en realitat no fa cap soroll.

```java
/* public class Soroll {

    public static void main(String[] args) {

        Picarol picarol = new Picarol();

        picarol.sona();   // el picarol funciona fins i tot sense gat!

        GatRenat renat = new GatRenat();

        System.out.println(renat.aixecat());

        renat.agafaPicarol(picarol);

        System.out.println(renat.seu());      // ha de sonar el picarol

        System.out.println(renat.seu());      // no sona el picarol doncs no es mou!

        renat.deixaPicarol();

        System.out.println(renat.estirat());  // no sona el picarol doncs ja no el té

        System.out.println("Nombre de cops que sona el picarol: " + picarol.vegades());

    }

}

Que generarà la següent sortida:

clink-clink
ja m'aixeco
clink-clink
ja m'assec
passo de fer res
ja m'estiro
Nombre de cops que sona el picarol: 2

Una sorollosa proposta d'ampliació

Normalment no és una bona idea escriure per sortida estàndard des dels mètodes de les nostres classes. Entre d'altres raons està que no sempre les executarem des de consola.

En aquest cas fem una excepció doncs ens simplifica molt l'exercici ja que no hem de fer sonar cap picarol.

Espera un moment. No estaràs pensant que és una llàstima no poder fer sonar realment el picarol, oi? Si és així, no et quedis amb les ganes!

Considera el següent codi:
DemoPicarol.java

import java.io.File;

import java.io.IOException;

import javax.sound.sampled.Clip;

import javax.sound.sampled.AudioSystem;

import javax.sound.sampled.AudioInputStream;

import javax.sound.sampled.UnsupportedAudioFileException;

import javax.sound.sampled.LineUnavailableException;

public class DemoPicarol {

    public static void main(String[] args) throws Exception {

        sona();

    }

    /** Fa sonar el picarol.

     * En cas que no sigui possible per qualsevol

     * motiu (ex. el fitxer no estigui disponible, o no contingui un

     * format reconegut), el procediment falla silenciosament.

     */

    /* public static void sona() {

        try {

            File fitxer = new File("picarol.wav");

            AudioInputStream stream = AudioSystem.getAudioInputStream(fitxer);

            Clip clip = AudioSystem.getClip();

            clip.open(stream);

            clip.start();

            Thread.sleep(600);

        } catch (IOException e) {

        } catch (InterruptedException e) {

        } catch (UnsupportedAudioFileException e) {

        } catch (LineUnavailableException e) {}

    }

}

Descarregat el fitxer picarol.wav i col·loca'l a la carpeta on tinguis la demostració del Picarol. Compila la demo, executa-la i assegura't que els altaveus (o auriculars) estan en funcionament i a un volum segur.

Adapta aquest codi a la teva resposta a aquest exercici i gaudeix de fer sonar el teu picarol.

Les proves no tindran en compte si el picarol realment sona o no, per la qual cosa, el sorollet quedarà com un secret entre tu i el gat Renat.
*/

public class GatRenat {
    private int vides;
    private String posicio;
    private Picarol picarol;

    public GatRenat() {
        this.setVides(7);
        this.setPosicio("estirat");
    }

    public GatRenat(String posicio) {
        this.setPosicio(posicio);
    }

    public int getVides() {
        return vides;
    }

    public void setVides(int novesVides) {
        if (novesVides >= 0) {
            vides = novesVides;
        }
    }

    public String getPosicio() {
        return posicio;
    }

    public void setPosicio(String novaPosicio) {
        String[] posicions = new String[] { "dret", "assegut", "estirat" };

        for (int i = 0; i < posicions.length; i++) {
            if (posicions[i].equals(novaPosicio)) {
                posicio = novaPosicio;
            }
        }
    }

    public boolean esDret() {
        if (posicio.equals("dret")) { return true; }
        return false;
    }

    public boolean esAssegut() {
        if (posicio.equals("assegut")) { return true; }
        return false;
    }

    public boolean esEstirat() {
        if (posicio.equals("estirat")) { return true; }
        return false;
    }

    public String aixecat() {
        if (esDret()) { return "passo de fer res"; }
        setPosicio("dret");
        if (this.hiHaPicarol()) { this.picarol.sona(); }
        return "ja m'aixeco";
    }

    public String seu() {
        if (esAssegut()) { return "passo de fer res"; }
        setPosicio("assegut");
        if (this.hiHaPicarol()) { this.picarol.sona(); }
        return "ja m'assec";
    }

    public String estirat() {
        if (esEstirat()) { return "passo de fer res"; }
        setPosicio("estirat");
        if (this.hiHaPicarol()) { this.picarol.sona(); }
        return "ja m'estiro";
    }

    public Picarol agafaPicarol(Picarol picarol) {
        Picarol anticPicarol = this.picarol;
        this.picarol = picarol;
        return anticPicarol;
    }

    public Picarol deixaPicarol() {
        Picarol anticPicarol = this.picarol;
        this.picarol = null;
        return anticPicarol;
    }

    public boolean hiHaPicarol() {
        if (this.picarol != null) { return true; }
        return false;
    }
}
```

## Picarol

```java
public class Picarol {
    private int cops;

    public void sona() {
        System.out.println("clink-clink");
        cops++;
    }

    public int vegades() {
        return cops;
    }
}
```

## Soroll

```java
public class Soroll {
    public static void main(String[] args) {
        Picarol picarol = new Picarol();

        picarol.sona();

        GatRenat renat = new GatRenat();

        System.out.println(renat.aixecat());

        renat.agafaPicarol(picarol);

        System.out.println(renat.seu());

        System.out.println(renat.seu());

        renat.deixaPicarol();

        System.out.println(renat.estirat());

        System.out.println("Nombre de cops que sona el picarol: " + picarol.vegades());
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3031elpicarol.png
:alt: Diagrama UML
```
