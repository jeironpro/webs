# Ejercicio 048 - El grupo del profesor de matemáticas

**Nivel:** 7 - POO I
**Tema(s):** clases, **arreglo de objetos**, composición (una clase que contiene y gestiona otra), métodos que operan sobre la colección
**Dificultad estimada:** ⭐⭐⭐☆☆

## Enunciado

El profesor tiene un **grupo** fijo de estudiantes con su nota de la unidad (entre 0 y 100, puede ser decimal). En vez de manejar varios objetos sueltos, el programa define una clase `Grupo` que **contiene** un arreglo de objetos `Estudiante` y sabe resolver las preguntas del profesor: el **promedio del grupo** y el **mejor estudiante**.

El programa lee `N` (mayor a 0), y por cada estudiante el **nombre** (puede tener espacios) y la **nota**. Luego muestra:

```
Promedio: X.XX
Mejor estudiante: NOMBRE con nota Y.YY
```

## Instrucciones

- Crea dos clases:
  - **`Estudiante`**: atributos privados `String nombre`, `double nota`; constructor que asigna ambos; getters `getNombre()` y `getNota()`.
  - **`Grupo`**: atributo privado `Estudiante[] estudiantes` y un contador de cuántos hay; constructor `Grupo(int capacidad)` que reserva el arreglo; métodos `void agregar(Estudiante e)`, `double promedio()` y `Estudiante mejorEstudiante()`.
- `Grupo` debe **inicializar cada casilla** con `new Estudiante(...)` antes de meterla (una casilla sin objeto es `null`).
- El promedio divide entre el **número real de estudiantes** (el contador), no entre `estudiantes.length` (que puede ser mayor si el arreglo quedó con casillas vacías).
- `main` solo lee datos, construye los objetos y delega los cálculos al `Grupo`.
- El mejor estudiante se devuelve como referencia; `main` imprime sus valores con los getters.
- Notas se muestran con dos decimales.

## Firma sugerida

```java
import java.util.Scanner;

public class GrupoDelProfesor {
    public static void main(String[] args) {
        // Tu código aquí
    }
}

class Estudiante {
    private String nombre;
    private double nota;

    public Estudiante(String nombre, double nota) {
        this.nombre = nombre;
        this.nota = nota;
    }

    public String getNombre() { return nombre; }
    public double getNota() { return nota; }
}

class Grupo {
    private Estudiante[] estudiantes;
    private int cantidad;

    public Grupo(int capacidad) {
        estudiantes = new Estudiante[capacidad];
    }

    public void agregar(Estudiante e) {
        // Tu código aquí
    }

    public double promedio() {
        return 0; // reemplaza
    }

    public Estudiante mejorEstudiante() {
        return null; // reemplaza
    }
}
```

## Ejemplos de ejecución

**Ejemplo 1:**
```
Entrada: 3
Entrada: Ana
Entrada: 95.5
Entrada: Luis
Entrada: 80
Entrada: Ro
Entrada: 72.25
Salida: Promedio: 82.58
        Mejor estudiante: Ana con nota 95.50
```

**Ejemplo 2 (un solo estudiante):**
```
Entrada: 1
Entrada: Juan Pike
Entrada: 50
Salida: Promedio: 50.00
        Mejor estudiante: Juan Pike con nota 50.00
```

**Ejemplo 3 (notas iguales):**
```
Entrada: 2
Entrada: Ema
Entrada: 88
Entrada: Ivo
Entrada: 88
Salida: Promedio: 88.00
        Mejor estudiante: Ema con nota 88.00
```

## Casos límite a considerar

- **Casillas `null`:** después de crear `new Estudiante[capacidad]`, todas las casillas valen `null` hasta que pongas un objeto. Llamar `estudiantes[i].getNota()` sobre una casilla sin asignar lanza `NullPointerException` — por eso el promedio usa el **contador** de estudiantes agregados.
- **`agregar` incrementa el contador:** cada vez que metes un objeto, `cantidad` sube; el promedio divide por `cantidad`.
- **`mejorEstudiante` con notas iguales:** usa `>` estricto para quedarte con el primero.
- **No confundir `cantidad` con `capacidad`:** el arreglo puede reservar más espacio del que se llena.
- `N = 1`: el único es el mejor; el promedio es su nota.
- La referencia devuelta por `mejorEstudiante()` se usa así: `Estudiante m = grupo.mejorEstudiante();` y luego `m.getNombre()`, `m.getNota()`.

## Pistas (opcional, ocultables)

<details>
<summary>Ver pista</summary>

En `agregar`: `estudiantes[cantidad] = e; cantidad++;` — `cantidad` siempre marca la siguiente casilla libre. En `promedio`: `double s = 0; for (int i = 0; i < cantidad; i++) s += estudiantes[i].getNota(); return s / cantidad;`. En `mejorEstudiante`, inicializa con `estudiantes[0]` y recorre desde 1 comparando las notas con getters.

</details>
