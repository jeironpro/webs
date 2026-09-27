# Ejercicios — 17.06 — Es vocal

## LloroVocalIniciFi

**Enunciat**

En diferents exercicis ens hem trobat la necessitat de distingir si un caràcter és o no una vocal. Ara que ja coneixem les funcions, podem definir la nostra funció esVocal() que rebi un caràcter i retorni un booleà indicant si el caràcter correspon o no amb una vocal.

Considerarem com a vocals totes les variants d'accents i dièresis de les vocals catalanes.

Recorda que aquests variants són, a banda de les cinc habituals, à, è, é, í, ï, ò, ó, ú i ü.
Què has de fer

En aquest exercici hi haurà tres fitxers:

UtilString.java: contindrà la funció esVocal(). No cal que contingui main().

LloroVocalIniciFi.java: una nova versió entre mig de Exercici 14_05. Inicia amb vocal minúscula i Exercici 14_06. Inicia i acaba en vocal que farà servir la nova funció per que el lloro repeteixi qualsevol text que comenci o acabi en vocal (siguin majúscules o minúscules)

UtilitatsConfirmacio.java: que ja tens d'un exercici anterior

Una simulació d'execució seria:

**El lloro demana paraula amb vocal a l'inici o/i final**
ànec
El lloro diu: ànec
El lloro demana paraula amb vocal a l'inici o/i final
lleó
El lloro diu: lleó
El lloro demana paraula amb vocal a l'inici o/i final
gos
El lloro demana paraula amb vocal a l'inici o/i final

**El lloro demana confirmació per finalitzar**
Encara no
El lloro demana paraula amb vocal a l'inici o/i final

**El lloro demana confirmació per finalitzar**
sí
Adéu

```java
public class LloroVocalIniciFi {
    public static void main(String[] args) {
        while (true) {
            System.out.println("El lloro demana paraula amb vocal a l'inici o/i final");
            String paraula = Entrada.readLine();
            
            if (!paraula.isEmpty()) {
                char primerCaracter = paraula.charAt(0);
                char ultimCaracter = paraula.charAt(paraula.length()-1);
                
                boolean iniVocal = UtilString.esVocal(primerCaracter);  
                boolean fiVocal = UtilString.esVocal(ultimCaracter);   
                
                if (iniVocal || fiVocal) {
                    System.out.println("El lloro diu: " + paraula);
                }  
            } else {
                System.out.println("El lloro demana confirmació per finalitzar");
                if (UtilitatsConfirmacio.respostaABoolean(Entrada.readLine())) {
                    break;                                
                }
            }
        }
        System.out.println("Adéu");
    }
}
```

## UtilString

*Aquest programa és la meva biblioteca de String: Conte les següents utilitats:
* Una funció per verificar si un caràcter es vocal i retorna un valor boolean (esVocal).

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
}
```

## UtilitatsConfirmacio

* Donada una resposta textual, aquesta funció tradueix la resposta a
* un booleà.
* Considera true quan la resposta és, independentment de majúscules i
* sense considerar espais a l'inici ni al final,
* "sí", "s", "yes" o "y", i algunes variants amb errors ortogràfics.
* Altrament considera false.

```java
public class UtilitatsConfirmacio {
    public static boolean respostaABoolean(String resposta) {
        String nuevaResposta = "";
        for (int i = 0; i < resposta.length(); i++) {
            char c = resposta.charAt(i);
            if (Character.isLetter(c)) {
                nuevaResposta += c;
            }
        }
        if (nuevaResposta.isBlank()) {     
            return false;
        }
        
        nuevaResposta = nuevaResposta.toLowerCase();
        if (nuevaResposta.equals("s") || nuevaResposta.equals("y")) {
            return true;
        }
        if (nuevaResposta.equals("sí") || nuevaResposta.equals("yes")) {
            return true;
        }
        if (nuevaResposta.equals("si") || nuevaResposta.equals("vale") || nuevaResposta.equals("yeah")) {
            return true;
        }
        return false;
    }
}
```
