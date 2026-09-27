# Ejercicios — 00.05 — Presentem nos

**Enunciat**

En aquesta secció et proposo una senzilla modificació respecte el que hem vist al programa HolaMon.java.

- Segueix les instruccions:
Ves a la carpeta de treball del teu PC i actualitza canvis que puguin estar al repositori remot:
-cd ~/introprg
-git pull

En cas que et doni algun error, és possible que el teu espai de treball tingués canvis que no has registrat. Fes git status perquè git et recordi quins canvis vas fer, i fes el commit oportú. En cas de dubtes, avisa el teu docent que el tens desitjant ajudar-te.

- Crea la carpeta 00_05_presentemnos si encara no hi és, i entra-hi:
-mkdir -p 00_05_presentemnos
-cd 00_05_presentemnos

- Crea un nou fitxer EmPresento.java i escriu-hi codi tal que, en ser executat escrigui per pantalla el mateix que HolaMon.java, excepte que, en comptes de Hola Món!, sortirà un missatge similar al següent:

-Hola, sóc Adelita, la futura millor desenvolupadora del Món!

Per favor, si no et dius Adelita, canvia el nom. Pots modificar també la resta de la frase amb quelcom que sentis còmode.

- Compila i executa el programa
-Recorda, javac i java

Afegeix els canvis al control de versions.

Pots comprovar que git t'informa que hi ha un nou fitxer sense registrar, tot fent git status.

- Com ara hem creat un nou fitxer, ens caldrà informar a git que el volem gestionar:
-git add EmPresento.java

- Ara que el fitxer ja és conegut per git, demanem que afegeixi els canvis:
-git commit -am "Completat l'exercici en que em presento"

- Finalment pugem els canvis a GitHub:
-git push

```java
public class EmPresento {
    public static void main(String[] args) {
        System.out.println("Hola, soc Jeiron, un futur bón desenvolupador.");
    }
}
```
