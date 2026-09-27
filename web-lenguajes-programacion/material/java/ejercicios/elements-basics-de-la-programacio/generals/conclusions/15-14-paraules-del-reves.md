# Ejercicios — 15.14 — Paraules del reves

**Enunciat**

Aquest exercici és una nova versió d'un anterior (text del revés)

Llegeix amb atenció per descobrir els canvis.

Desenvolupa un programa anomenat ParaulesReves, que demani un text i el torni a mostrar però invertint l'ordre de les lletres dins de cada paraula. L'ordre de les paraules dins del text romandrà igual que a l'original.

Considerarem que una paraula està formada per una seqüència de lletres i finalitza quan apareix un caràcter no lletra o bé la fi del text.

Considera la següent simulació:

**Text?**
Tot el que diuen de Windows és fals!
toT le euq neuid ed swodniW sé slaf!

Pista: Llegeix aquesta pista només si no saps per on atacar el problema.

Considera anar acumulant a una variable cada lletra, fins que aparegui un que no ho sigui o s'acabi el text. Llavors, mostra la paraula acumulada a l'inrevés.

Nota

Vols una mica més de diversió? Perquè no intentar que les majúscules siguin coherents? Així, a l'exemple d'execució, la sortida seria "Tot le euq neuid ed Swodniw sé slaf!". Atreveix-te amb aquesta ampliació!

```java
public class ParaulesReves {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();
        String paraula = "";

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (Character.isLetter(c)) {
                paraula += c;
            } else {
                for (int j = paraula.length()-1; j >= 0; j--) {
                    char ch = paraula.charAt(j);
                    System.out.print(ch);
                }
                System.out.print(c);
                paraula = "";
            }
        }
    }
}
```
