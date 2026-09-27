# Ejercicios — 30.18 — En Renat es assessinable

## GatRenat

**Enunciat**

Si et passa com a mi, a hores d'ara t'hauràs encarinyant amb el gat Renat. Però no a tothom li passa. De fet, hi ha qui podria voler que nostre estimat amic l'espitxi. Per exemple, imagina't que algú el fa servir com a personatge d'un joc en el que pugui anar perdent vides.

Ara per ara, la implementació que tenim (considera la darrera) ens obliga a fer el següent per treure-li una vida a una instància de GatRenat:

```java
renat.setVides(renat.getVides() - 1);
```

No seria molt més fàcil de llegir el següent?

```java
renat.mor();
```

Doncs per aquí va el tema que et toca implementar en aquest exercici.

Afegeix al gat Renat els següents mètodes:

String mor(): li treu una vida si encara és viu i retorna el lamentable lament "auch" quan, un cop perduda una vida, encara és viu. En canvi, si en treure-li la vida ja no li queden més, retorna el més definitiu "ximpún". Finalment, si ja estava mort del tot, retornarà un silenci en forma de punts suspensius "...".

String reviu(): quan en Renat està mort, li afegeix una vida i retorna un crit d'alegria "guai!". Si no estava mort, però, retorna el típic silenci de punts suspensius "...".

String reviu(int): fa el mateix que reviu() però en aquesta ocasió se li pot indicar el nombre de vides amb les que torna a la vida. Si el nombre de vides indicat és menor que un, retornarà el silenci típic.

Prova les noves funcionalitats amb la següent versió de UsaGatRenat:

**/***
* Mata el gat Renat 3 cops
* - el primers amb totes les vides
* - el segon amb una sola vida
* - el tercer amb dos vides
* Després de matar-lo "del tot" prova un altre cop… per si de cas
* Finalment el gat Renat acaba tenint tres vides però no les
* pot aprofitar gaire pequè el programa s'acaba.

```java
/* public class UsaGatRenat {
    public static void main(String[] args) {
        GatRenat renat = new GatRenat();
        for (int vides = 1; vides <= 3; vides++) {
            while (renat.esViu()) {
                System.out.println("Renat diu: " + renat.mor());
            }
            System.out.println("Renat diu: " + renat.mor());    // per rematar-ho!
            System.out.println("Renat diu: " + renat.reviu(vides));
        }
    }
}

Això generarà la següent sortida:

Renat diu: auch
Renat diu: auch
Renat diu: auch
Renat diu: auch
Renat diu: auch
Renat diu: auch
Renat diu: ximpún
Renat diu: ...
Renat diu: guai!
Renat diu: ximpún
Renat diu: ...
Renat diu: guai!
Renat diu: auch
Renat diu: ximpún
Renat diu: ...
Renat diu: guai!

Una mica de culturilla POO

Java ens ofereix la possibilitat de definir mètodes amb el mateix nom, sempre i quant els paràmetres siguin diferents. A aquest fenomen se li sol conèixer com sobrecàrrega (overload).

Així, el nom reviu() estaria sobrecarregat a GatRenat.

Important

Cap gat ha rebut dany durant l'elaboració d'aquest exercici. Ara, si en executar la teva resposta, algun gat pateix, a la teva consciència va.
*/

public class GatRenat {
    private int vides = 7;
    private String posicio = "estirat";

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

    public boolean esViu() {
        if (vides > 0) { return true; }
        return false;
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
        return "ja m'aixeco";
    }

    public String seu() {
        if (esAssegut()) { return "passo de fer res"; }
        setPosicio("assegut");
        return "ja m'assec";
    }

    public String estirat() {
        if (esEstirat()) { return "passo de fer res"; }
        setPosicio("estirat");
        return "ja m'estiro";
    }

    public String mor() {
        if (esViu()) { 
            setVides(getVides() - 1);
            if (getVides() == 0) { return "ximpún"; }
            return "auch"; 
        }
        return "...";
    }

    public String reviu() {
        return reviu(1);
    }

    public String reviu(int novesVides) {
        if (!esViu()) {
            setVides(getVides() + novesVides);
            return "guai!";
        }
        return "...";
    }
}
```

## UsaGatRenat

```java
public class UsaGatRenat {
    public static void main(String[] args) {
        GatRenat renat = new GatRenat();
        for (int vides = 1; vides <= 3; vides++) {
            while (renat.esViu()) {
                System.out.println("Renat diu: " + renat.mor());
            }
            System.out.println("Renat diu: " + renat.mor());
            System.out.println("Renat diu: " + renat.reviu(vides));
        }
    }
}
```

## Diagrama UML

```{image} /_static/uml/uml-3018enrenatesassessinable.png
:alt: Diagrama UML
```
