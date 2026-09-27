# Ejercicios — 13.11 — Historic dedats

**Enunciat**

Desenvolupa el programa HistoricEdats que demani el nom d'una persona, la seva edat i l'any actual, i escrigui l'edat que tenia aquella persona cada any des del seu naixement.

Considera la següent simulació:

**nom?**
Eleftèria
edat?
5
any actual?
2024
El 2019 vau néixer
El 2020 teníeu 1 any
El 2021 teníeu 2 anys
El 2022 teníeu 3 anys
El 2023 teníeu 4 anys
Adéu Eleftèria

L'aplicació no dirà l'edat que té la persona en l'any actual, donat que aquesta dada forma part de l'entrada. És a dir, si la persona ha nascut aquest any, simplement s'acomiadarà, i si ho va fer l'any passat, només dirà quan va néixer i s'acomiadarà.

Considera aquesta altra simulació en la que la persona ha nascut aquest mateix any:

**nom?**
Gosling
edat?
0
any actual?
2024
Adéu Gosling

Caldrà realitzar les següents comprovacions un cop obtinguts tots els valors d'entrada:

Que el nom no estigui buit ni només format per blancs

Que l'edat sigui un valor positiu (es pressuposa que serà enter)

Que l'any actual sigui com a mínim 1971 (també es pressuposa enter)

En cas d'error, sempre retornarà el mateix missatge: Entrada incorrecta

Pista: Et recomano que intentis fer l'exercici sense mirar aquesta pista i, tant si l'aconsegueixes com si no, que la llegeixis, doncs explica una tècnica molt habitual per resoldre aquest tipus de problemes.

En aquest tipus d'exercicis, és important analitzar l'exemple d'entrada que ens donen. Intentem detectar què canvia a cada línia.

En el cas del primer exemple, podem distingir els següents elements:

El 2019 vay néixer               Aquesta és la primera línia

El 2020 teníeu 1 any             Aquestes línies s'assemblen molt
El 2021 teníeu 2 anys            amb un petit canvi (el plural) a
El 2022 teníeu 3 anys            la primera
El 2023 teníeu 4 anys

Adéu Eleftèria                   Aquesta línia només depén del nom

Així, el teu programa podria tenir una estructura similar a aquesta:

// escriu any de naixement (si no és aquest!)

// escriu les línies per cada any des del de naixement fins l'actual

// escriu comiat

La part més complicada, potser, serà saber quina ha de ser la variable de recorregut. Et proposo dues opcions, encara que n'hi ha d'altres:

recórrer per edat, "aproximadament" de 1 fins a l'actual

recórrer per any, "aproximadament" des del naixement fins l'actual

```java
public class HistoricEdats {
    public static void main(String[] args) {
        System.out.println("nom?");
        String nom = Entrada.readLine();

        if (!nom.isBlank()) {
            System.out.println("edat?");
            int edat = Integer.parseInt(Entrada.readLine());

            if (edat > 0) {
                System.out.println("any actual?");
                int anyActual = Integer.parseInt(Entrada.readLine());

                if (anyActual >= 1971) {
                    int anyNaixement = anyActual - edat;
                    System.out.println("El " + anyNaixement + " vay néixer");

                    for (int i = anyNaixement + 1; i < anyActual; i++) {
                        edat = i - anyNaixement;

                        String aniversaris = (edat == 1) ? "El " + i + " teníeu " + edat + " any" : "El " + i + " teníeu " + edat + " anys";
                        System.out.println(aniversaris);
                    }
                    System.out.println("Adéu " + nom);
                } else {
                    System.out.println("Entrada incorrecta");
                }
            } else {
                System.out.println("Entrada incorrecta");
            }
        } else {
            System.out.println("Entrada incorrecta");
        }
    }
}
```
