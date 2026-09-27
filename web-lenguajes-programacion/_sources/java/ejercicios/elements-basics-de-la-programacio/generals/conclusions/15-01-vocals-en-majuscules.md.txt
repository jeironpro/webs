# Ejercicios — 15.01 — Vocals en majuscules

**Enunciat**

Desenvolupa un programa anomenat VocalsMajuscules que demani un text i mostri totes les lletres en minúscules excepte les vocals, que hauran d'estar en majúscules.

Per simplicitat, considerarem només les vocals a, e, i, o i u.

Un exemple d'execució seria:

**Text?**
Els 4 Genets de l'Apocalipsi!
Els 4 gEnEts dE l'ApOcAlIpsI!

Nota: ja hem fet exercicis en els que havíem d'identificar si un caràcter corresponia o no a una vocal (per exemple aquest) Probablement aquell cop ho vas resoldre amb un munt de condicionals. Ara, però, ho podem fer molt millor. Una pista, "aeiou" és també un text i ja hem vist aquí com comprovar si un caràcter es troba o no dins d'un text. Si et calen més pistes, fes-ho amb un munt de if per començar (total, només has de copiar i enganxar-les d'algun exercici previ) però més endavant demana més pistes.

```java
public class VocalsMajuscules {
    public static void main(String[] args) {
        System.out.println("Text?");
        String text = Entrada.readLine();

        String vocals = "aeiou";

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            boolean esVocal = false;
            
            for (int j = 0; j < vocals.length(); j++) {
                char v = vocals.charAt(j);
                if (Character.toLowerCase(c) == v) {
                    esVocal = true;
                }
            }    

            if (esVocal) {
                System.out.print(Character.toUpperCase(c));
            } else {
                System.out.print(Character.toLowerCase(c));
            }
        }
    }
}
```
