# Biblioteques

**Biblioteques**
Les biblioteques (o libraries) en Java són conjunts de classes i mètodes ja definits que podem reutilitzar per fer funcionalitats específiques sense haver de programar-les des de zero.

Són eines que ens ajuden a estalviar temps i esforç en el desenvolupament de programari.

**Tipus de biblioteques**
1. Biblioteques estàndard de Java (Java Standard Library)
Inclou totes les classes que venen amb el JDK. Exemples:
- java.util → estructures de dades, dates, etc.

- java.io → entrada/sortida.

- java.math → càlculs matemàtics.

- java.net → xarxes.

- **2.** Biblioteques externes
  Són desenvolupades per tercers i poden afegir funcionalitats potents:
- Gson o Jackson (per treballar amb JSON)

- Apache Commons (utilitats generals)

- JUnit (per proves)

- Hibernate (persistència de dades)

**Com s'utilitzen?**
- Les biblioteques estàndard es poden utilitzar directament:

```java
import java.util.ArrayList;
ArrayList<String> noms = new ArrayList<>();
```

- Les biblioteques externes s'han d'afegir al projecte:
- Manualment (afegint el .jar)

- Amb eines de gestió de dependències com Maven o Gradle (més recomanable).

**Exemple amb Gson (biblioteca externa)**

```java
import com.google.gson.Gson;

public class Exemple {
    public static void main(String[] args) {
        Persona p = new Persona("Anna", 30);
        Gson gson = new Gson();
        String json = gson.toJson(p);
        System.out.println(json);  // {"nom":"Anna","edat":30}
    }
}
```
