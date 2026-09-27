# Ejercicios — 12.05 — El lloro

**Enunciat**

Desenvolupa un programa anomenat Lloro, que vagi demanant paraules i les repeteixi fins que rebi una resposta en blanc o bé buida. És a dir, la resposta sigui una cadena buida o bé només espais.

Un exemple d'execució seria:

**El lloro espera paraula**
hola
El lloro repeteix: hola
El lloro espera paraula:
què tal?
El lloro repeteix: què tal?
El lloro espera paraula:

Adéu

Fixa't que la resposta del lloro canvia lleugerament en finalitzar.

**Nota**
Dins d'aquest curs, aquest exercici té una certa rellevància. Ens hi referirem com el patró del lloro. El patró bàsicament soluciona problemes que requereixen realitzar una determinada acció sobre una sèrie d'entrades fins que es rep una que marca el final de la iteració.

Pista: considera el següent codi per comprovar si una cadena és buida o només de blancs:
cadena
""
"  "
" \t "
" eo "

**cadena.isEmpty()**
true
false
false
false

**cadena.isBlank()**
true
true
true
false

**comentari**
Cadena buida
Només espais
Espais i tabuladors
Alguna cosa no espai

No entens la taula anterior? Prova executant a jshell el codi:

```java
String cadena = "";
cadena.isEmpty();

public class Lloro {
    public static void main(String[] args) {
        boolean continuar = true;

        while (continuar) {
            System.out.println("El lloro espera paraula");
            String paraula = Entrada.readLine();

            if (paraula.isBlank()) {
                continuar = false;
            }
            System.out.println("El lloro repeteix paraula: " + paraula);
        }
        System.out.println("Adéu");
    }
}
```
