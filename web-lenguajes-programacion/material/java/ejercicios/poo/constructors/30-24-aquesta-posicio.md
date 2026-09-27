# Ejercicios — 30.24 — Aquesta posicio

**Enunciat**

Crea una nova versió de l'exercici anterior, de manera que el constructor i el setter de posició defineixin el mateix nom pel paràmetre que especifica la posició que per la propietat. És a dir, les signatures seran:

```java
public GatRenat(int vides, String posicio)
public void setPosicio(String posicio)

public class GatRenat {
    private int vides = 7;
    private String posicio = "estirat";

    public GatRenat(int vides, String posicio) {
        this.setVides(vides);
        this.setPosicio(posicio);
    }

    public int getVides() { return this.vides; }

    public void setVides(int vides) {
        if (vides >= 0) {
            this.vides = vides;
        }
    }
    
    public String getPosicio() { return this.posicio; }

    public void setPosicio(String posicio) {
        String[] posicions = new String[] { "dret", "assegut", "estirat" };

        for (int i = 0; i < posicions.length; i++) {
            if (posicions[i].equals(posicio)) {
                this.posicio = posicio;
            }
        }
    }

    @Override
    public String toString() {
        return String.format("Vides: %d. Posició: %s", this.vides, this.posicio);
    }

    public static void main(String[] args) {
        System.out.println(new GatRenat(7, "estirat"));
    }
}
```
