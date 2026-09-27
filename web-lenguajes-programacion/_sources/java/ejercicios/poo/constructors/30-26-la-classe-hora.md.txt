# Ejercicios — 30.26 — La classe Hora

**Enunciat**

Implementa la classe Hora amb les propietats (privades) hora, minut i segon de tipus enter, i els accessors (públics) que assegurin que l'hora és sempre vàlida.

```{image} /_static/uml/uml-3026laclassehora.png
:alt: Diagrama UML
```

Per defecte, l'hora correspondrà a 0:00:00, però la classe oferirà els mecanismes necessaris per a inicialitzar una hora amb algun altre valor vàlid. És a dir, oferirà un constructor específic amb la signatura Hora(int hores, int minuts, int segons) que, en cas de que els valors rebuts no corresponguin amb una hora vàlida, inicialitzarà l'hora amb el valor per defecte.

Afegeix els següents mètodes:

void incrementa(): fa que l'hora tingui un segon més

void incrementa(int): fa que l'hora s'incrementi en el nombre de segons indicats

void decrementa(): fa que l'hora tingui un segon menys

void decrementa(int): fa que l'hora es decrementi en el nombre de segons indicats

int compareTo(Hora): compara amb l'hora indicada i retorna <0 si és menor que la indicada, 0 si són iguals i >0 si és més gran que la indicada.

String toString(): retorna un String amb l'hora en format h:mm:ss.

Inclou a Hora.java el següent main()` per fer una prova senzilla:

/**

* Compara dues hores i retorna l'operador corresponent

* Per exemple, si hora1 és menor que hora2, l'operador serà "<". Els

* altres dos valors possibles són ">" i "=="

* @param hora1: primera hora a comparar

* @param hora2: segona hora a comparar

* @return operador resultant

```java
/* private static String composaOperadorComparacio(Hora hora1, Hora hora2) {

    int comparacio = hora1.compareTo(hora2);

    if (comparacio < 0) {

        return "<";

    } else if (comparacio > 0) {

        return ">";

    } else {

        return "==";

    }

}

public static void main(String[] args) {

    Hora hora1 = new Hora();

    Hora hora2 = new Hora(0, 0, 2);

    System.out.printf("Inicialment hora1: %s %s hora2: %s%n",

            hora1,

            composaOperadorComparacio(hora1, hora2),

            hora2);

    System.out.println("Incrementem 1 segon a la primera i decrementem 1 segon a la segona");

    hora1.incrementa();

    hora2.decrementa();

    System.out.printf("Finalment hora1: %s %s hora2: %s%n",

            hora1,

            composaOperadorComparacio(hora1, hora2),

            hora2);

}

Amb aquest main() l'execució de Hora generarà:

Inicialment hora1: 0:00:00 < hora2: 0:00:02
Incrementem 1 segon a la primera i decrementem 1 segon a la segona
Finalment hora1: 0:00:01 == hora2: 0:00:01

Notes / pistes

    En cas que un constructor específic es trobi amb un o més paràmetres no vàlids, inicialitzarà la instància amb els valors per defecte: 0:00:00.

    Per escriure el 0 inicial als minuts i segons quan el valor és menor de 10, es pot fer servir el mètode System.out.format()

    Per si vas amb el temps molt just:

    String.format("%d %02d %02d", 4, 4, 4)     // 4:04:04

*/

/*
 * Compara dues hores i retorna l'operador corresponent
 * Per exemple, si hora1 és menor que hora2, l'operador serà "<". Els
 * altres dos valors possibles són ">" i "=="
 * @param hora1: primera hora a comparar
 * @param hora2: segona hora a comparar
 * @return operador resultant
 */

public class Hora {
    private int hores;
    private int minuts;
    private int segons;

    public Hora() {
        this(0,0,0);
        
    }

    public Hora(int hores, int minuts, int segons) {
        if (hores >= 0 && hores <= 23) {
            this.setHores(hores);

            if (minuts >= 0 && minuts <= 59) {
                this.setMinuts(minuts);

                if (segons >= 0 && segons <= 59) {
                    this.setSegons(segons);
                }
            }
        }
    }

    public int getHores() { return this.hores; }

    public int getMinuts() { return this.minuts; }
    
    public int getSegons() { return this.segons; }

    public void setHores(int hores) { this.hores = hores; }

    public void setMinuts(int minuts) { this.minuts = minuts; }

    public void setSegons(int segons) { this.segons = segons; }

    public void incrementa() {
        incredecre(1, "incrementa");
    }

    public void decrementa() {
        incredecre(1, "decrementa");
    }

    public void incrementa(int segons) {
        incredecre(segons, "incrementa");
    }

    public void decrementa(int segons) {
        incredecre(segons, "decrementa");
    }

    public void incredecre(int segons, String accio) {
        int horaASegons = this.hores / 3600 + this.minuts / 60 + this.segons;

        if (accio.equals("decrementa")) {
            horaASegons -= segons;
        }

        if (accio.equals("incrementa")) {
            horaASegons += segons;
        }

        if (horaASegons < 0) {
            while (horaASegons < 0) {
                horaASegons += 86400;
            }
        } else if (horaASegons >= 86400) {
            while (horaASegons >= 86400) {
                horaASegons %= 86400;
            }
        }

        this.setHores(horaASegons / 3600);
        this.setMinuts((horaASegons % 3600) / 60);
        this.setSegons((horaASegons % 3600) % 60);
    }

    public int compareTo(Hora hora) {
        int horaASegons1 = this.getHores() / 3600 + this.getMinuts() / 60 + this.getSegons();
        int horaASegons2 = hora.getHores() / 3600 + hora.getMinuts() / 60 + hora.getSegons();

        if (horaASegons1 < horaASegons2) { return -1; }
        if (horaASegons1 > horaASegons2) { return 1; }

        return 0;
    }

    @Override
    public String toString() {
        return String.format("%d:%02d:%02d", this.hores, this.minuts, this.segons);
    }

    private static String composaOperadorComparacio(Hora hora1, Hora hora2) {
        int comparacio = hora1.compareTo(hora2);
        if (comparacio < 0) {
            return "<";
        } else if (comparacio > 0) {
            return ">";
        } else {
            return "==";
        }
    }

    public static void main(String[] args) {
        Hora hora1 = new Hora();
        Hora hora2 = new Hora(0, 0, 2);
        System.out.printf("Inicialment hora1: %s %s hora2: %s%n",
                hora1,
                composaOperadorComparacio(hora1, hora2),
                hora2);
        System.out.println("Incrementem 1 segon a la primera i decrementem 1 segon a la segona");
        hora1.incrementa();
        hora2.decrementa();
        System.out.printf("Finalment hora1: %s %s hora2: %s%n",
                hora1,
                composaOperadorComparacio(hora1, hora2),
                hora2);
    }
}
```
