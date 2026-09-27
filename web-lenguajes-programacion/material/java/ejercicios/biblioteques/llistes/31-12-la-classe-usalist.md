# Ejercicios — 31.12 — La classe UsaList

**Enunciat**

En aquest exercici practicaràs l'ús d'una List.

Completa el següent main() de UsaList seguint les instruccions dels comentaris.

```java
// TODO: afegeix aquí quelcom que importi
import java.util.List;
import java.util.ArrayList;

public class UsaList {
    public static void main(String[] args) {
        List<String> llista = new ArrayList<>();

        System.out.println("Obtenim les entrades");
        System.out.println("====================");
        
        String valor;

        valor = Entrada.readLine();
        llista.add(valor);

        valor = Entrada.readLine();
        llista.add(0, valor);

        valor = Entrada.readLine();
        int mig = llista.size() / 2;
        llista.add(mig, valor);

        System.out.println("Cerquem elements de la llista");
        System.out.println("=============================");
        
        String text = Entrada.readLine();
        boolean esTroba = llista.contains(text);

        System.out.printf("El text %s és troba a la llista: %s%n", text, esTroba);

        int indexPrimerOcurrencia = llista.indexOf(text);

        System.out.printf("Posició de %s a la llista: %s%n", text, indexPrimerOcurrencia);
        System.out.println("Mostrem les entrades introduïdes");
        System.out.println("================================");

        boolean llistaBuida = llista.size() == 0;

        while (!llistaBuida) {
            String entrada = llista.get(0);

            System.out.println(entrada);

            llista.remove(0);

            llistaBuida = llista.size() == 0;
        }
    }
}
```
