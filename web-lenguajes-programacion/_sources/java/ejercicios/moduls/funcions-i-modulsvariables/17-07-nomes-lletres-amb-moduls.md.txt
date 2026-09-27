# Ejercicios — 17.07 — Nomes lletres (amb moduls)

## NomesLletres

**Enunciat**

Rescatarem Exercici 14_13. Només lletres i el farem modular.

Recordem que el nostre programa original feia tres coses diferents:

Obtenció del text d'entrada

Filtrat de les lletres del text

Separació de les lletres filtrades

La nova versió oferirà un mòdul per cadascuna de les tres parts del programa. En concret:

L'obtenció de les dades ja la tenim resolta amb Entrada.readLine()

El filtrat de les lletres el farem amb una nova funció pura anomenada nomesLletres() que afegirem a UtilString.

"ElsgenetsdelApocalipsi".equals(UtilString.nomesLletres("Els 4 genets de l'Apocalipsi!"))

La separació la farem amb una altra funció pura que anomenarem lletresSeparades() que també afegirem a UtilString.

"A, p, o, c, a, l, i, p, s, i".equals(UtilString.lletresSeparades("Apocalipsi"))

El programa NomesLletres.java resultant tindrà el següent codi (Només falta el comentari de capçalera!):

//

???

//

```java
public class NomesLletres{

    public static void main(String[] args) {

        System.out.println("Text?");

        String text = Entrada.readLine();

        String nomesLletres = UtilString.nomesLletres(text);

        String separades = UtilString.lletresSeparades(nomesLletres);

        System.out.println(separades);

    }

}
```

T'ha semblat breu? Doncs espera't que t'ofereixo una versió encara més compacta:

//

???

//

```java
public class NomesLletres{

    public static void main(String[] args) {

        System.out.println("Text?");

        System.out.println(
```

UtilString.lletresSeparades(

UtilString.nomesLletres(

Entrada.readLine()

)

)

```java
                );

    }

}
```

Ueee! Són realment dues sentències! Compta els ;!

Aquesta versió és una cadena de crides a diferents funcions. A algunes persones, especialment quan comencen a programar, els resulta una mica més complicat entendre aquest tipus de codi; no parlem ja de que se'ls acudeixi! Tot i així, és una manera molt habitual de desenvolupar, i no està de més que comencis a familiarizar-t'hi. Per aquest exercici, i de fet per tot el curs, fes la versió que prefereixis.

```java
public class NomesLletres{
    public static void main(String[] args) {
        System.out.println("Text?");
        System.out.println(
                UtilString.lletresSeparades(
                    UtilString.nomesLletres(
                        Entrada.readLine()
                        )
                    )
                );
    }
}
```

## UtilString

*Aquest programa és la meva biblioteca de String: Conte les següents utilitats:
* Una funció per verificar si un caràcter es vocal i retorna un valor boolean (esVocal).

* Una funció que filtra un text i retorna un String amb només les lletres del text (nomesLletres).

* Una funció que separa un text de només lletres i retorna un String amb les lletres separat per comes (lletresSeparades).

```java
 public class UtilString {
    public static boolean esVocal(char caracter) {
        String vocals = "aàeèéiíïoóòuúü";
        
        for (int i = 0; i < vocals.length(); i++) {
            char v = vocals.charAt(i);
            if (Character.toLowerCase(caracter) == v) {
                return true;                   
            }
        }     
        return false;
    }
    
    public static String nomesLletres(String text) {
        String nouText = "";
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (Character.isLetter(c)) {
                nouText += c;
            }
        }
        return nouText;
    }
    
    public static String lletresSeparades(String text) {
        String nouText = "";
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (i < text.length()-1) {
                nouText += c + ", ";
            } else {
                nouText += c;
            }
        }
        return nouText;
    }
}
```
