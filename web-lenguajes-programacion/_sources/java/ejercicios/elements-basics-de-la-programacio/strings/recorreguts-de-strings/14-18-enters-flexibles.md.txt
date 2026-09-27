# Ejercicios — 14.18 — Enters flexibles

**Enunciat**

Desenvolupa una nova versió del programa Exercici 14_17. Enters estrictes. En aquesta ocasió implementaràs una interpretació més flexible dels enters.

En concret, a banda dels enters estrictes:

Cal ignorar els espais en qualsevol lloc que hi puguin aparèixer.

Cal ignorar els separadors (punts . i guions baixos _) sempre i quant es trobin entre dos dígits doncs poden fer la funció de separació.

Per exemple, 192.168.0.1 es considera un enter.

Considera la següent simulació:

**Introdueix texts (enter sol per finalitzar)**
123
És enter
321
És enter
-454
És enter
+543
És enter
45_678_1234.111
És enter
192.168.0.1
És enter
cinc
No és enter

Adéu

```java
public class Enters {
    public static void main(String[] args) {
        System.out.println("Introdueix texts (enter sol per finalitzar)");

        String nouText = "";
        boolean enter = false;
        
        while(true) {
            String text = Entrada.readLine();
            
            if (text.isEmpty()) {
                break;
            }
            
            if (!text.isEmpty()) { 
                enter = true;
                
                for (int i = 0; i < text.length(); i++) {
                    char c = text.charAt(i);            
                      
                    if (Character.isDigit(c) || c == '-' || c == '+' || c == '.' || c == '_') {
                        nouText += c;
                    }
                }
                
                if (!nouText.isEmpty()) {
                    for (int i = 0; i < nouText.length(); i++) {
                        char c = nouText.charAt(i);  

                        if (!Character.isDigit(c)) {
                            enter = false;
                        }           
                        
                        if (i > 0 && i < nouText.length()-1) {
                            if (c == '.' || c == '_') {
                                if (Character.isDigit(nouText.charAt(i-1)) && Character.isDigit(nouText.charAt(i+1))) {
                                    enter = true;
                                } 
                            }   
                        }
                    } 
                    
                    if ((nouText.charAt(0) == '-' || nouText.charAt(0) == '+') && Character.isDigit(nouText.charAt(1))) {
                        enter = true;                           
                    }
                }
                nouText = "";
                
                if (enter) {
                    System.out.println("És enter");
                } else {
                    System.out.println("No és enter");
                }
            }
        }
        System.out.println("Adéu");
    }
}
```
