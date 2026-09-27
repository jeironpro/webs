# Ejercicios — 11.17 — El metge virtual

**Enunciat**

En aquest exercici hauràs de desenvolupar un metge virtual “especialista” en refredats.

El nostre metge, només té les següents regles que aplica en ordre:

a) si el malalt presenta esternuts i mal de cap llavors, si té problemes d’estómac li recomanarà prendre paracetamol i si no en té li proposarà prendre àcid acetil salicílic (una aspirina, vaja).

b) si el malalt ens diu que té tos llavors, si és massa jove (menor de 12 anys) li recomanarà un caramel de mel i altrament li proposarà un caramel d’eucaliptus.

c) si no presenta cap dels anteriors símptomes, el metge proposarà al pacient que vingui a la seva consulta presencial per poder examinar-lo.

Notes:

El programa es dirà MetgeVirtual

Pots suposar que el programa només rebrà respostes correctes.

El programa preguntarà el mínim d'informació imprescindible per donar resposta.

Considera les següents iteracions:

**esternuts? (sí o no)**
sí
mal de cap? (sí o no)
sí
problemes d'estómac? (sí o no)
no
pren una aspirina.

**esternuts? (sí o no)**
sí
mal de cap? (sí o no)
no
tos? (sí o no)
sí
edat?
10
pren un carmel de mel

**Esternuts? (sí o no)**
no
tos? (sí o no)
no
vine a la consulta

Nota: Aquest exercici està marcat amb una estrelleta perquè per superar totes les proves, hauràs d'evitar certa redundància.

```java
public class MetgeVirtual {
    public static void main(String[] args) {
        System.out.println("esternuts? (sí o no)");
        String esternuts = Entrada.readLine();
        String malCap = "";

        if (esternuts.equals("sí")) {
            System.out.println("mal de cap? (sí o no)");
            malCap = Entrada.readLine();
            
            if (malCap.equals("sí")) {
                System.out.println("problemes d’estómac? (sí o no)");
                String problemesEstomac = Entrada.readLine();
                if (problemesEstomac.equals("sí")) {
                    System.out.println("prendre paracetamol");
                } else {
                    System.out.println("prendre aspirina");
                }
            }
        }

        if (esternuts.equals("no") || (esternuts.equals("sí") && malCap.equals("no"))) {
            System.out.println("tos? (sí o no)");
            String tos = Entrada.readLine();

            if (tos.equals("sí")) {
                System.out.println("edat?");
                int edat = Integer.parseInt(Entrada.readLine());

                if (edat < 12) {
                    System.out.println("prende un caramel de mel");
                } else {
                    System.out.println("prende un caramel d’eucaliptus");
                }
            } else {
                System.out.println("vine a la consulta");
            }
        }
    }
}
```
