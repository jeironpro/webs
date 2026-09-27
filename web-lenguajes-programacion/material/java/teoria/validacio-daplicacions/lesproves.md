# Les proves

**Les proves**
Quan parlem de proves o tests, ens referim a accions sistemàtiques per verificar que el nostre codi funciona correctament. Les proves són una part essencial del cicle de vida del programari, tant durant el desenvolupament com després del desplegament.

**Objectiu de les proves**
- Detectar errors abas que arribin a producció.
- comprovar que el comportament del programa és el que s'espera.
- Permetre refactors segurs (canvis en el codi sense trencar funcionalitats).
- Millorar la confiança i mantenibilidad del sistema.

**Característiques d'un bon sistema de proves**
- Repetible: pots executar-lo tantes vegades com calgui amb el mateix resultat.
- Automatitzat: no depèn de l'usuari ni d'un entorn manual.
- Predictible: hauria de fallar només si hi ha realment un error.
- Independent: les proves no haurien de dependre les unes de les altres.
- Clares: quan una prova falla, hauria d'indicar què ha anat malament i per què.

**Tipus d'activitats que impliquen proves**
Activitat                    Que es comprova?
Validació de funcionalitat   Que els resultats són els esperats
Robustesa                    Que el sistema reacciona bé a dades incorrectes
Rendiment                    Que el sistema respon disnde limits raonables
Seguretat                    Que no hi ha vulnerabilitats evidents
Regressions                  Que canvis nous no trenquen funcionalitats anteriors

**Proves vs Depuració (debugging)**
- Provar és anticipar-se als errors: comprovar si poden existir i provenir-los.
- Depurar és corregir errors després que el programa hagi fallat.

Les proves completen però no substitueixen la depuració.

**Exemple de prova manual**

```java
public class Calculadora {
    public static int suma(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        if (suma(2, 3) != 5) {
            System.out.println("Error en la suma!");
        } else {
            System.out.println("Test correcte.");
        }
    }
}
```

Però això no és escalable ni modular... Per això usem eines com JUnit, que veurem més endevant.

**Proves en el context de Java**
Java és un llenguatge que es beneficia molt d'un bon sisteam de proves perquè:
- Estña fortament tipat (els errors de tipus es poden provar clarament).
- Té biblioteques potents com JUnit, Mockito, Hamcrest.
- És molt usat en projectes grans, on la validació continua és clau.
