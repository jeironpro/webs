# Ejercicios — 15.16 — Maleida contrasenya

**Enunciat**

Desenvolupa un programa anomenat Password que demani una contrasenya i digui si és vàlida o no segons els següents criteris:

Té una llargària mínima de 8 caràcters i màxima de 16

Ha de contenir un mínim d'un número

Ha de contenir un mínim d'una lletra majúscula

Ha de contenir un mínim d'una lletra minúscula. Considera que una lletra és minúscula si no és majúscula.

Ha de contenir un mínim d'un símbol

El nombre de lletres majúscules no pot ser inferior al de minúscules

No pot contenir espais en blanc

No es poden repetir caràcters

No poden ser més de 4 caràcters seguits del mateix tipus. Els tipus són números, lletres majúscules, lletres minúscules i símbols. Ex. "91235a!A" no és vàlid perquè té més de quatre dígits seguits.

No poden contenir més de tres números consecutius. Ex. "1234Abc!" no es vàlid perquè inclou els números consecutius 1, 2, 3 i 4. Atenció: No es considera consecutius "8901", és a dir, no són consecutius circulars.

Per passar les proves, els missatges d'error esperat estaran en l'ordre indicat. És a dir, el text "abcdefg" no és un password vàlid per vàries raons. Per exemple, no té números, ni símbols, ni majúscules, etc. El problema pel que es queixarà Password, però, serà per que la longitud no és correcta, ja que és aquesta la primera comprovació a realitzar.

Aniràs descobrint els missatges a donar a partir dels errors que t'indicarà el prgtest.

Pista: No saps per on començar? Et proposo que comencis per resoldre cada regla per separat. Quan una no et passi les proves, considera provar-la en un programa a part, fins que la tinguis funcionant.

```java
public class Password {
    public static void main(String[] args) {
        String contrasenya = Entrada.readLine();
        boolean conteDigit = false;
        boolean conteMajuscula = false;
        boolean conteMinuscula = false;
        boolean conteSimbol = false;
        boolean majusculesSuperior = false;
        boolean conteEspai = false;
        boolean caracterRepetit = false;
        boolean quatresSeguit = false;
        boolean tresDigitsConsecutius = false;
        boolean tresDigitsConsecutiusDecreixent = false;
        int comptadorMajuscula = 1;
        int comptadorMinuscula = 1;
        int comptadorDigit = 1;
        int comptadorSimbol = 1;
        String digit = "";
        int comptadorDigitsConsecutius = 0;
        int comptadorDigitsConsecutiusDecreixent = 0;
        
        if (contrasenya.length() >= 8 && contrasenya.length() <= 16) {
            for (int i = 0; i < contrasenya.length(); i++) {
                char c = contrasenya.charAt(i);
                
                if (Character.isWhitespace(c)) {
                    conteEspai = true;
                }
                
                if (Character.isDigit(c)) {
                    if (i < contrasenya.length()-1) {
                        if (Character.isDigit(contrasenya.charAt(i+1))) {
                            comptadorDigit++;                    
                        }                    
                    }
                    digit += c;
                    conteDigit = true;
                } else if (Character.isUpperCase(c)) {
                    if (i < contrasenya.length()-1) {
                        if (Character.isUpperCase(contrasenya.charAt(i+1))) {
                            comptadorMajuscula++;                    
                        }                    
                    }
                    conteMajuscula = true;
                } else if (Character.isLowerCase(c)) {
                    if (i < contrasenya.length()-1) {
                        if (Character.isLowerCase(contrasenya.charAt(i+1))) {              
                            comptadorMinuscula++;
                        }                    
                    }
                    conteMinuscula = true;
                } else {
                    if (i < contrasenya.length()-1) {
                        if (!Character.isLetter(contrasenya.charAt(i+1)) && !Character.isDigit(contrasenya.charAt(i+1)) && !Character.isWhitespace(contrasenya.charAt(i+1))) {
                            comptadorSimbol++;               
                        }                    
                    } 
                    conteSimbol = true;
                }
                
                for (int j = i+1; j < contrasenya.length(); j++) {
                    char ch = contrasenya.charAt(j);
                    if (c == ch) {
                        caracterRepetit = true;
                    }
                }
                majusculesSuperior = comptadorMajuscula >= comptadorMinuscula;
                
                if (comptadorMajuscula > 4 || comptadorMinuscula > 4 || comptadorDigit > 4 || comptadorSimbol > 4) {
                    quatresSeguit = true;
                }
            }
            
            if (!digit.isEmpty()) {
                for (int i = 0; i < digit.length(); i++) {
                    char d = digit.charAt(i);
                    String dig = "" + d;
                    int num = Integer.parseInt(dig);
                    
                    if (i < digit.length()-1) {
                        char di = digit.charAt(i+1);
                        String digi = "" + di;
                        int numAnt = Integer.parseInt(digi);
                        if (num-1 == numAnt) {
                            comptadorDigitsConsecutius++;
                        }                    
                    }
                }
                if (comptadorDigitsConsecutius >= 3) {
                    tresDigitsConsecutius = true;
                }
                
                for (int i = digit.length()-1; i >= 0; i--) {
                    char d = digit.charAt(i);
                    String dig = "" + d;
                    int num = Integer.parseInt(dig);
                    
                    if (i > 0) {
                        char di = digit.charAt(i-1);
                        String digi = "" + di; 
                        int numAnt = Integer.parseInt(digi);

                        if (num-1 == numAnt) {
                            comptadorDigitsConsecutiusDecreixent++;
                        }                    
                    }
                }
                if (comptadorDigitsConsecutiusDecreixent >= 3) {
                    tresDigitsConsecutiusDecreixent = true;
                }
            }
            
            if (!conteDigit) {
                System.out.println("El password ha de contenir com a mínim un numero.");
            } else if (!conteMajuscula) {
                System.out.println("El password ha de contenir com a mínim una lletra majúscula.");
            } else if (!conteMinuscula) {
                System.out.println("El password ha de contenir com a mínim una lletra minúscula.");
            } else if (!conteSimbol) {
                System.out.println("El password ha de contenir com a mínim un símbol.");
            } else if (!majusculesSuperior) {
                System.out.println("El password no pot contenir menys majúscules que minúscules.");
            } else if (conteEspai) {
                System.out.println("El password no pot contenir espais en blanc.");
            } else if (caracterRepetit) {
                System.out.println("El password no pot contenir caràcters repetits.");
            } else if (quatresSeguit) {
                System.out.println("El password no pot contenir més de 4 caràcters seguits del mateix tipus.");
            } else if (tresDigitsConsecutius || tresDigitsConsecutiusDecreixent) {
                System.out.println("El password no pot contenir més de 3 números consecutius."); 
            } else {
                System.out.println("El maleït password és vàlid!");
            }
        } else {
            System.out.println("El password ha de tenir entre 8 i 16 caràcters.");
        }
    }
}
```
