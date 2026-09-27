# Ejercicios — 30.28 — Metodes de classe en Hora

**Enunciat**

En aquest exercici és una ampliació de la classe Hora que vas desenvolupar a aquest exercici

boolean esValida(int hores, int minuts, int segons): retorna true si i només sí les hores, minuts i segons indicats, en aquest ordre, pels paràmetres, corresponen a una combinació vàlida per una hora.

int compareTo(Hora, Hora): retorna -1 si la primera hora és menor que (anterior a) la segona, 0 si són iguals i 1 si la primera és més gran que (posterior a) la segona.

Hora duplica(): retorna una nova instància de la classe Hora amb els mateixos valors per les propietats de l'hora corresponent.

Hora duplica(Hora): retorna una nova instància de la classe Hora amb els mateixos valors per les propietats de l'hora rebuda.

```java
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

    public static boolean esValida(int hores, int minuts, int segons) {
        if (hores >= 0 && hores <= 23) {
            if (minuts >= 0 && minuts <= 59) {
                if (segons >= 0 && segons <= 59) {
                    return true;
                }
            }
        }
        return false;
    }

    public static int compareTo(Hora hora1, Hora hora2) {
        int horaASegons1 = hora1.getHores() / 3600 + hora1.getMinuts() / 60 + hora1.getSegons();
        int horaASegons2 = hora2.getHores() / 3600 + hora2.getMinuts() / 60 + hora2.getSegons();

        if (horaASegons1 < horaASegons2) { return -1; }
        if (horaASegons1 > horaASegons2) { return 1; }

        return 0;
    }

    public Hora duplica() {
        return new Hora(this.getHores(), this.getMinuts(), this.getSegons());
    }

    public static Hora duplica(Hora hora) {
        return new Hora(hora.getHores(), hora.getMinuts(), hora.getSegons());
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

## Diagrama UML

```{image} /_static/uml/uml-3028metodesdeclasseenhora.png
:alt: Diagrama UML
```
