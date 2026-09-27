# Ejercicios — Expressions booleanes amb operadors logics

## 10_11_Expressions_amb_operadors_logics

################################################

## Autoria:

Jeiron Junior Espinal Cruz

## Introducció:

En aquest exercici vaig aprendre a construir i simplificar expressions amb operadors relacionals i lògics.

1. la Clara és més jove que tu.

edatClara < edatMeva

2. la Clara i el Marc són més joves que tu.

edatClara < edatMeva && edatMarc < edatMeva

3. la Clara és més jove que tu i tu ets més jove que el Marc.

edatClara < edatMeva && edatMeva < edatMarc

4. la Clara no és més jove que el Marc.

edatClara < edatMarc

5. no és cert que el Marc sigui més jove que la Clara.

!(edatMarc < edatClara)

6. Ni el Marc és més jove que la Clara ni tu ets més jove que el Marc.

!(edatMarc < edatClara) && !(edatMeva < edatMarc)

7. Tu ets més gran que la Clara i el Marc junts o bé la Clara i el Marc tenen la mateixa edat.

edatMeva > edatClara && edatMeva > edatMarc || edatClara == edatMarc

8. el meu germà té més pes que jo i el meu germà té menys pes que la meva germana.

pesGerma > pesMeu && pesGerma < pesGermana

9. la temparatura és major a 30 graus o la temperatura és menor a 32 graus

temperatura > 30 || temperatura < 32

## Aprenentatge:

He après a construir i simplificar expressions utilitzant els operadors relacionals i lògics.

## 10_12_Precedencia_dels_operadors

##########################################

## Autoria:

Jeiron Junior Espinal Cruz

## Introducció:

En aquest exercici vaig aprendre a utilitzar les precedències dels operadors.

1. 5 + 4 * 3

5 + 4 * 3 **->** 5 + (4 * 3) **->** 5 + 12 **->** 17

2. -5 * 4 + -3

-5 * 4 + -3 **->** (-5 * 4) + (-3) **->** -20 + -3 **->** -23

3. true && false || ! true

true && false || ! true **->** (true && false) || (! true) **->** false || false **->** false

4. false && (10 > 3) || ! (4 > 5)

false && (10 > 3) || ! (4 > 5) **->** (false && (10 > 3)) || (! (4 > 5)) **->** (false && true) || ! (false) **->** false || true **->** true

5. (false == (5 > 4)) && (false == ! true) || (false != true)

(false == (5 > 4)) && (false == ! true) || (false != true) **->** ((false == (5 > 4))) && ((false == ! true)) || (false != true) **->** (false == true) && (false == false) || false != true **->** false && true || true **->** false || true **->** true

6. true || (4 > 10) && (true == ! true) && (5 < 3)

true || (4 > 10) && (true == ! true) && (5 < 3) **->** true || ((4 > 10) && (true == ! true) && (5 < 3)) **->** true || (false && false && false) **->** true || false **->** true

7. (42 > 30) || true && (true != false) || (30 > 42)

(42 > 30) || true && (true != false) || (30 > 42) **->** ((42 > 30) || (true && (true != false)) || (30 > 42)) **->** (true || true && true || false) **->** (true || true || false) **->** true || false **->** true

## Aprenentatge:

He après a agregar-li parèntesis a les operacions tenint en compte les precedències del operadors.
