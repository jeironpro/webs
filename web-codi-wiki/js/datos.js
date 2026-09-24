const datosContenido = {
    lenguajes: [
        {
            id: 'python',
            nombre: 'Python',
            etiqueta: 'Proposito General',
            descripcion: 'Python es un lenguaje de programación de alto nivel, interpretado y multiparadigma, ideal para quienes buscan legibilidad y eficiencia en el desarrollo. Su filosofía "Zen de Python" prioriza la simplicidad y la claridad, lo que lo ha convertido en el lenguaje favorito tanto para la enseñanza como para aplicaciones industriales complejas.',
            historia: 'Concebido a finales de los 80 por Guido van Rossum en el CWI de los Países Bajos como un sucesor del lenguaje ABC capaz de manejar excepciones e interactuar con el sistema operativo Amoeba. Su versión 3.0, lanzada en 2008, marcó un hito al limpiar inconsistencias históricas del lenguaje, aunque rompió la compatibilidad hacia atrás para asegurar un futuro más limpio.',
            usos: ['Ciencia de Datos y Machine Learning', 'Desarrollo Backend con Django/Flask', 'Automatización de tareas (Scripting)', 'Computación Científica'],
            pros: ['Sintaxis casi tan legible como el inglés humano', 'Biblioteca estándar inmensa ("Baterías incluidas")', 'Comunidad global activa y diversa', 'Portabilidad extrema'],
            contras: ['Velocidad de ejecución lenta (limitada por el GIL)', 'Alto consumo de memoria en objetos simples', 'Errores detectados solo en tiempo de ejecución'],
            ejemplo: `// Ejemplo: Clase simple en Python
class Saludo:
    def __init__(self, nombre):
        self.nombre = nombre
    
    def decir_hola(self):
        return f"Hola, {self.nombre}!"

s = Saludo("Mundo")
print(s.decir_hola())`
        },
        {
            id: 'js',
            nombre: 'JavaScript',
            etiqueta: 'Web & Fullstack',
            descripcion: 'JavaScript es el motor que impulsa la interactividad de la web moderna. Originalmente limitado al navegador, hoy es un lenguaje omnipresente capaz de ejecutarse en servidores, robots y dispositivos móviles. Es dinámico, débilmente tipado y basado en prototipos, ofreciendo una flexibilidad inigualable.',
            historia: 'Creado por Brendan Eich en 1995 en solo 10 días bajo el nombre Mocha, luego LiveScript y finalmente JavaScript. Estandarizado como ECMAScript, ha vivido un renacimiento desde 2015 (ES6) con la introducción de clases, módulos y promesas, transformándose en una herramienta robusta para ingeniería de software.',
            usos: ['Desarrollo Frontend (React, Vue, Angular)', 'Desarrollo Backend (Node.js)', 'Aplicaciones Móviles (React Native)', 'Desarrollo de Videojuegos Web'],
            pros: ['Ejecución nativa en cualquier navegador web', 'Modelo asíncrono no bloqueante eficiente', 'Ecosistema de paquetes NPM gigantesco', 'Permite desarrollo Fullstack'],
            contras: ['Tipado débil propenso a errores silenciosos', 'Fatiga por el cambio constante de frameworks', 'Modelo de herencia prototípica confuso'],
            ejemplo: `// Promesas y Async/Await
async function obtenerDatos() {
    try {
        const respuesta = await fetch('/api/datos');
        const datos = await respuesta.json();
        console.log(datos);
    } catch (error) {
        console.error("Error:", error);
    }
}`
        },
        {
            id: 'java',
            nombre: 'Java',
            etiqueta: 'Empresarial',
            descripcion: 'Java es el estándar de oro para aplicaciones empresariales robustas y escalables. Es un lenguaje estrictamente tipado, orientado a objetos y diseñado para ser independiente de la arquitectura gracias a su Máquina Virtual (JVM). Su enfoque en la estabilidad y compatibilidad lo hace ideal para sistemas de misión crítica.',
            historia: 'Iniciado por James Gosling en Sun Microsystems en 1991 (originalmente Green Project). Lanzado en 1995 con el slogan "Write Once, Run Anywhere". Transformó la web temprana con Applets y luego dominó el servidor empresarial. Adquirido por Oracle en 2010, sigue evolucionando con un ciclo de lanzamiento de 6 meses.',
            usos: ['Sistemas Bancarios y Financieros', 'Desarrollo de aplicaciones Android Nativo', 'Big Data (Hadoop, Spark)', 'Servidores de aplicaciones empresariales'],
            pros: ['Robustez y gestión de memoria automática', 'Portabilidad total gracias a la JVM', 'Multihilo y concurrencia maduros', 'Herramientas de desarrollo de clase mundial'],
            contras: ['Verbosidad excesiva (mucho código boilerplate)', 'Consumo de memoria elevado', 'Tiempo de arranque lento en aplicaciones pequeñas'],
            ejemplo: `public class Principal {
    public static void main(String[] args) {
        System.out.println("Java Enterprise");
    }
}`
        },
        {
            id: 'c',
            nombre: 'C',
            etiqueta: 'Sistemas',
            descripcion: 'C es la lengua franca de la programación de sistemas. Es un lenguaje procedimental de bajo nivel que ofrece un control absoluto sobre el hardware y la memoria. Eficiente, compacto y rápido, C es la base sobre la que se construyen sistemas operativos, compiladores y otros lenguajes.',
            historia: 'Desarrollado entre 1969 y 1972 por Dennis Ritchie en los Laboratorios Bell de AT&T para reescribir el sistema operativo UNIX. Su diseño minimalista y potente ha influido en la sintaxis de casi todos los lenguajes modernos (C++, Java, C#, JS).',
            usos: ['Núcleos de Sistemas Operativos (Linux, Windows)', 'Desarrollo de Drivers y Firmware', 'Sistemas Embebidos e IoT', 'Motores de bases de datos'],
            pros: ['Rendimiento inigualable cerca del metal', 'Portabilidad a cualquier arquitectura de CPU', 'Control manual preciso de la memoria', 'Tamaño de ejecutable minúsculo'],
            contras: ['Gestión de memoria manual peligrosa (fugas)', 'Falta de abstracciones modernas (Clases, Namespaces)', 'Curva de dificultad elevada'],
            ejemplo: `#include <stdio.h>
int main() {
    printf("Hola, Memoria.\\n");
    return 0;
}`
        },
        {
            id: 'cpp',
            nombre: 'C++',
            etiqueta: 'Alto Rendimiento',
            descripcion: 'C++ es una extensión poderosa de C que añade orientación a objetos, programación genérica y abstracciones de alto nivel sin sacrificar el rendimiento. Es el lenguaje elegido cuando se necesita exprimir cada ciclo del procesador en software complejo.',
            historia: 'Creado por Bjarne Stroustrup en 1979 como "C con Clases". Estandarizado en 1998. Ha experimentado un renacimiento masivo con C++11 y versiones posteriores (C++14, 17, 20), incorporando características modernas como inferencia de tipos y lambdas.',
            usos: ['Motores de Videojuegos (Unreal Engine)', 'Sistemas de Trading de Alta Frecuencia', 'Navegadores Web (Chrome, Firefox)', 'Software de Ingeniería y Diseño (CAD)'],
            pros: ['Rendimiento extremo con abstracciones de alto nivel', 'Control determinista de recursos (RAII)', 'Biblioteca Estándar de Plantillas (STL)', 'Multiparadigma flexible'],
            contras: ['Curva de aprendizaje extremadamente empinada', 'Tiempos de compilación muy largos', 'Mensajes de error complejos'],
            ejemplo: `#include <iostream>
#include <vector>
int main() {
    std::vector<int> v = {1, 2, 3};
    for(auto i : v) std::cout << i << "\\n";
}`
        },
        {
            id: 'csharp',
            nombre: 'C#',
            etiqueta: 'Microsoft .NET',
            descripcion: 'C# es un lenguaje elegante y estrictamente tipado, diseñado por Microsoft para compilar aplicaciones en el ecosistema .NET. Combina la potencia de C++ con la simplicidad de Visual Basic y la robustez de Java, ofreciendo una experiencia de desarrollo moderna y productiva.',
            historia: 'Lanzado en 2000 liderado por Anders Hejlsberg como respuesta a Java. Originalmente exclusivo de Windows, se ha transformado en un gigante multiplataforma y de código abierto gracias a .NET Core (ahora .NET 5+).',
            usos: ['Desarrollo de Videojuegos (Unity)', 'Aplicaciones Empresariales en Windows', 'Desarrollo Web Backend (ASP.NET)', 'Aplicaciones Móviles (Xamarin/MAUI)'],
            pros: ['Integración perfecta con herramientas Visual Studio', 'LINQ para manipulación elegante de datos', 'Sistema de tipos robusto y genéricos reales', 'Constante innovación (Async/Await, Records)'],
            contras: ['Ecosistema históricamente cerrado (mejorando)', 'Dependencia del runtime .NET', 'Sobrecarga en aplicaciones pequeñas'],
            ejemplo: `using System.Linq;
var numeros = new[] { 1, 2, 3, 4, 5 };
var pares = numeros.Where(n => n % 2 == 0);
foreach(var n in pares) Console.WriteLine(n);`
        },
        {
            id: 'go',
            nombre: 'Go',
            etiqueta: 'Cloud Native',
            descripcion: 'Go (Golang) es un lenguaje compilado de código abierto creado en Google. Diseñado para la simplicidad y la eficiencia, destaca en la programación concurrente y en la construcción de servicios de red escalables. Rechaza la complejidad innecesaria en favor de un código claro y directo.',
            historia: 'Diseñado en 2007 por luminarias como Rob Pike, Ken Thompson y Robert Griesemer frustrados por la complejidad de C++. Lanzado en 2009. Se ha convertido en el lenguaje "de la nube", siendo la base de Docker y Kubernetes.',
            usos: ['Infraestructura en la Nube y Microservicios', 'Herramientas de Línea de Comandos (CLI)', 'Sistemas Distribuidos', 'Servidores Web de alto rendimiento'],
            pros: ['Compilación extremadamente rápida', 'Manejo de concurrencia nativo y sencillo (Goroutines)', 'Binarios estáticos sin dependencias', 'Sintaxis minimalista'],
            contras: ['Sistema de tipos rígido (mejorado con Genéricos)', 'Manejo de errores repetitivo (if err != nil)', 'Ausencia de frameworks tradicionales'],
            ejemplo: `package main
import "fmt"
func main() {
    go func() { fmt.Println("Hilo ligero") }()
    fmt.Println("Hilo principal")
}`
        },
        {
            id: 'rust',
            nombre: 'Rust',
            etiqueta: 'Sistemas Seguro',
            descripcion: 'Rust empodera a los desarrolladores para construir software fiable y eficiente. Es un lenguaje de sistemas que resuelve el viejo dilema entre seguridad y rendimiento, garantizando la seguridad de memoria sin necesidad de un recolector de basura (Garbage Collector).',
            historia: 'Proyecto personal de Graydon Hoare en Mozilla en 2006. Lanzado establemente en 2015. Ha sido votado consistentemente como el "lenguaje más amado" en las encuestas globales por su capacidad de eliminar clases enteras de bugs.',
            usos: ['Sistemas Operativos (Redox, módulos Linux)', 'Motores de navegador (Servo)', 'Herramientas CLI modernas', 'WebAssembly (Wasm)'],
            pros: ['Seguridad de memoria garantizada en compilación', 'Rendimiento comparable a C++', 'Sistema de paquetes moderno (Cargo)', 'Mensajes de error del compilador extremadamente útiles'],
            contras: ['Curva de aprendizaje muy pronunciada (Borrow Checker)', 'Tiempos de compilación lentos', 'Ecosistema aún madurando en ciertas áreas'],
            ejemplo: `fn main() {
    let mut s = String::from("hola");
    s.push_str(", mundo"); // Mutación segura
    println!("{}", s);
}`
        },
        {
            id: 'typescript',
            nombre: 'TypeScript',
            etiqueta: 'JavaScript Escalable',
            descripcion: 'TypeScript es un superconjunto tipado de JavaScript que se compila a JavaScript plano. Añade tipos estáticos opcionales, clases e interfaces, permitiendo a los desarrolladores escribir código más robusto, mantenible y escalable en grandes equipos.',
            historia: 'Lanzado por Microsoft en 2012 bajo la dirección de Anders Hejlsberg. Nació para resolver la dificultad de escalar aplicaciones JS. Hoy es un estándar de facto en el desarrollo frontend moderno, adoptado por Angular, React y Vue.',
            usos: ['Aplicaciones Web de Gran Escala (Frontend)', 'Desarrollo Backend con Node.js/NestJS', 'Bibliotecas y Frameworks', 'Aplicaciones híbridas'],
            pros: ['Detección de errores en tiempo de escritura', 'Autocompletado y refactorización superiores', 'Documentación viva a través de tipos', 'Compatibilidad total con JS existente'],
            contras: ['Requiere un paso de compilación (transpilación)', 'Configuración inicial compleja (tsconfig)', 'Curva de aprendizaje del sistema de tipos'],
            ejemplo: `interface Usuario {
    id: number;
    nombre: string;
}
function logUsuario(u: Usuario) {
    console.log(\`Usuario \${u.id}: \${u.nombre}\`);
}`
        },
        {
            id: 'swift',
            nombre: 'Swift',
            etiqueta: 'Ecosistema Apple',
            descripcion: 'Swift es un lenguaje de programación intuitivo diseñado por Apple para crear apps en iOS, Mac, Apple TV y Apple Watch. Es rápido, seguro e interactivo, combinando lo mejor del pensamiento moderno sobre lenguajes con la sabiduría de la ingeniería de Apple.',
            historia: 'Presentado en la WWDC 2014 como reemplazo moderno de Objective-C. Se hizo de código abierto en 2015. Ha evolucionado rápidamente, introduciendo SwiftUI para diseño declarativo de interfaces.',
            usos: ['Desarrollo de Apps iOS y iPadOS', 'Aplicaciones macOS', 'Desarrollo del lado del servidor (Vapor)', 'Machine Learning (Core ML)'],
            pros: ['Rendimiento superior a Objective-C', 'Seguridad por diseño (manejo de nulos)', 'Sintaxis concisa y expresiva', 'Playgrounds para experimentación rápida'],
            contras: ['Atado fuertemente al ecosistema Apple', 'Tiempos de compilación mejorables', 'Falta de estabilidad binaria en versiones tempranas'],
            ejemplo: `let saludos = ["Hola", "Hello", "Bonjour"]
for saludo in saludos {
    print("Digo: \\(saludo)")
}`
        },
        {
            id: 'php',
            nombre: 'PHP',
            etiqueta: 'Web Backend',
            descripcion: 'PHP es un lenguaje de script del lado del servidor de código abierto, ampliamente utilizado y especialmente adecuado para el desarrollo web. A pesar de las críticas históricas, PHP moderno es rápido, tipado y potente, impulsando una gran parte de la web visible.',
            historia: 'Creado en 1994 por Rasmus Lerdorf. Inicialmente un conjunto de binarios CGI escritos en C. Evolucionó orgánicamente. PHP 7 y 8 (lanzado recientemente) trajeron mejoras de rendimiento dramáticas y características modernas como JIT y tipos de unión.',
            usos: ['Sistemas de Gestión de Contenidos (WordPress, Drupal)', 'Frameworks Web (Laravel, Symfony)', 'Comercio Electrónico (Magento, WooCommerce)', 'APIs REST'],
            pros: ['Fácil de desplegar y hosting omnipresente', 'Ciclo de desarrollo rápido "Refrescar y ver"', 'Ecosistema maduro y estable', 'Mejoras de rendimiento recientes masivas'],
            contras: ['Inconsistencias en la biblioteca estándar', 'Uso declinante en nuevas startups', 'Diseño heredado con deuda técnica'],
            ejemplo: `<?php
class Usuario {
    public function __construct(
        public string $nombre
    ) {}
}
$u = new Usuario("Ana");
echo "Hola " . $u->nombre;`
        },
        {
            id: 'ruby',
            nombre: 'Ruby',
            etiqueta: 'Felicidad del Dev',
            descripcion: 'Ruby es un lenguaje dinámico y de código abierto enfocado en la simplicidad y la productividad. Tiene una sintaxis elegante que es natural de leer y fácil de escribir, siguiendo el principio de "mínima sorpresa".',
            historia: 'Escrito por Yukihiro "Matz" Matsumoto en Japón en 1995. Su popularidad explotó en 2005 con el lanzamiento del framework Ruby on Rails, que revolucionó el desarrollo web permitiendo crear aplicaciones completas en tiempo récord.',
            usos: ['Desarrollo Web Rápido (Ruby on Rails)', 'Automatización y DevOps (Chef, Puppet)', 'Prototipado', 'Generadores de sitios estáticos (Jekyll)'],
            pros: ['Sintaxis humana y expresiva', 'Comunidad increíblemente amigable y colaborativa', 'Ecosistema de "Gemas" de alta calidad', 'Fomenta buenas prácticas de testing'],
            contras: ['Rendimiento inferior a lenguajes compilados', 'Uso de memoria elevado', 'Popularidad eclipsada parcialmente por Node/Python'],
            ejemplo: `5.times do |i|
  puts "Iteración #{i} - Ruby es elegante"
end`
        },
        {
            id: 'kotlin',
            nombre: 'Kotlin',
            etiqueta: 'Android Moderno',
            descripcion: 'Kotlin es un lenguaje moderno, conciso y seguro que corre sobre la Máquina Virtual de Java (JVM). Elimina el código repetitivo común en Java y añade características potentes como seguridad nula (Null Safety) y extensiones.',
            historia: 'Desarrollado por JetBrains en 2011. En 2017, Google anunció soporte de primera clase para Kotlin en Android, impulsando su adopción masiva. Se ha convertido en el lenguaje preferido para desarrollo móvil.',
            usos: ['Desarrollo de Apps Android', 'Backend (Spring Boot, Ktor)', 'Multiplataforma (Kotlin Multiplatform Mobile)', 'Ciencia de Datos'],
            pros: ['Interoperabilidad 100% con Java', 'Prevención de errores "NullPointerException"', 'Sintaxis concisa que reduce el código visual', 'Soporte oficial de Google'],
            contras: ['Tiempos de compilación más lentos que Java', 'Comunidad más pequeña que la de Java', 'Curva de aprendizaje para desarrolladores Java clásicos'],
            ejemplo: `fun main() {
    val nombre: String? = null
    // Manejo seguro de nulos
    println(nombre?.length ?: "Nombre vacío")
}`
        },
        {
            id: 'sql',
            nombre: 'SQL',
            etiqueta: 'Bases de Datos',
            descripcion: 'SQL (Structured Query Language) es el lenguaje estándar para almacenar, manipular y recuperar datos en bases de datos relacionales. Es un lenguaje declarativo, donde especificas qué datos quieres, y el motor decide cómo obtenerlos.',
            historia: 'Desarrollado en IBM en los años 70 (originalmente SEQUEL) basado en el modelo relacional de Codd. Estandarizado por ANSI en 1986. Sigue siendo la base de datos dominante mundialmente a través de MySQL, PostgreSQL, Oracle, etc.',
            usos: ['Gestión de Bases de Datos Relacionales', 'Análisis de Datos y Business Intelligence', 'Backend de aplicaciones', 'Ingeniería de Datos'],
            pros: ['Estándar industrial universal', 'Potente para consultas complejas y relaciones', 'Garantías ACID para integridad de datos', 'Altamente optimizado durante décadas'],
            contras: ['Escalar horizontalmente es difícil (sharding)', 'Sintaxis puede volverse compleja en queries anidados', 'Diferencias dialectales entre proveedores'],
            ejemplo: `SELECT nombre, email 
FROM usuarios 
WHERE activo = 1 
ORDER BY fecha_registro DESC;`
        },
        {
            id: 'r',
            nombre: 'R',
            etiqueta: 'Estadística & Datos',
            descripcion: 'R es un lenguaje y entorno de programación para gráficos y computación estadística. Proporciona una amplia variedad de técnicas estadísticas y gráficas, y es altamente extensible.',
            historia: 'Creado en 1993 por Ross Ihaka y Robert Gentleman en la Universidad de Auckland. Es una implementación moderna del lenguaje S. Se ha convertido en la herramienta estándar de facto para estadísticos y mineros de datos.',
            usos: ['Análisis Estadístico Avanzado', 'Bioinformática', 'Visualización de Datos (ggplot2)', 'Investigación Académica'],
            pros: ['Capacidades estadísticas inigualables', 'Paquetes gráficos de calidad editorial', 'Comunidad académica vibrante (CRAN)', 'Excelente para manipulación de dataframes'],
            contras: ['Gestión de memoria ineficiente con grandes datos', 'Sintaxis idiosincrásica para programadores convencionales', 'Lento en bucles tradicionales'],
            ejemplo: `datos <- c(10, 20, 30, 40)
promedio <- mean(datos)
print(paste("La media es:", promedio))`
        },
        {
            id: 'perl',
            nombre: 'Perl',
            etiqueta: 'Scripting Potente',
            descripcion: 'Perl es una familia de lenguajes interpretados de alto nivel conocidos como la "navaja suiza" de los lenguajes de scripting. Destaca increíblemente en el procesamiento de texto y tareas de administración de sistemas.',
            historia: 'Creado por Larry Wall en 1987. Fue fundamental para construir la Web temprana (pionero en CGI). Su lema "There\'s more than one way to do it" refleja su extrema flexibilidad.',
            usos: ['Administración de Sistemas Linux', 'Procesamiento de Texto y Logs', 'Biología Computacional', 'Scripts de automatización heredados'],
            pros: ['Manipulación de texto y Regex insuperables', 'CPAN: el archivo de librerías más maduro', 'Extremadamente flexible y permisivo', 'Presente en casi todos los servidores Unix'],
            contras: ['Sintaxis puede volverse ilegible ("Write Only")', 'Popularidad en declive frente a Python/Go', 'Complejidad excesiva en bases de código grandes'],
            ejemplo: `my $texto = "Hola Mundo";
if ($texto =~ /Hola/) {
    print "Encontrado saludo\\n";
}`
        },
        {
            id: 'scala',
            nombre: 'Scala',
            etiqueta: 'Funcional + Objetos',
            descripcion: 'Scala (Scalable Language) combina la programación orientada a objetos y la funcional en un lenguaje conciso y de alto nivel. Se ejecuta en la JVM y permite acceder a todo el ecosistema Java, pero con una sintaxis mucho más potente.',
            historia: 'Diseñado por Martin Odersky en la EPFL en 2004. Ganó tracción masiva con frameworks como Play y herramientas de Big Data como Apache Spark, que están escritos en Scala.',
            usos: ['Procesamiento de Big Data (Apache Spark)', 'Sistemas Distribuidos concurrentes (Akka)', 'Backend Financiero de alto rendimiento'],
            pros: ['Expresividad y concisión extremas', 'Sistema de tipos estático muy avanzado', 'Inmutabilidad y concurrencia facilitadas', 'Interoperable con Java'],
            contras: ['Tiempos de compilación notoriamente lentos', 'Curva de aprendizaje muy elevada', 'Complejidad que puede abrumar'],
            ejemplo: `val numeros = List(1, 2, 3, 4)
val dobles = numeros.map(_ * 2)
println(dobles) // List(2, 4, 6, 8)`
        },
        {
            id: 'lua',
            nombre: 'Lua',
            etiqueta: 'Scripting Embebido',
            descripcion: 'Lua es un lenguaje de scripting potente, eficiente y ligero, diseñado para ser embebido dentro de aplicaciones. Combina una sintaxis procedural simple con potentes construcciones de descripción de datos.',
            historia: 'Creado en 1993 en la Pontificia Universidad Católica de Río de Janeiro (PUC-Rio). Es uno de los pocos lenguajes globales creados en el hemisferio sur. Famoso por su uso en la industria de videojuegos.',
            usos: ['Scripting de Videojuegos (Roblox, WoW, Angry Birds)', 'Sistemas Embebidos (IoT)', 'Configuración de aplicaciones (Neovim)', 'Extensión de aplicaciones C/C++'],
            pros: ['Intérprete extremadamente pequeño y rápido', 'API C simple y elegante para integración', 'Muy fácil de aprender', 'Flexible gracias a las metatablas'],
            contras: ['Biblioteca estándar minimalista', 'Índices de arrays comienzan en 1 (inusual)', 'Scope global por defecto puede causar errores'],
            ejemplo: `function factorial(n)
    if n == 0 then return 1 end
    return n * factorial(n - 1)
end`
        },
        {
            id: 'dart',
            nombre: 'Dart',
            etiqueta: 'UI Cliente Optimizado',
            descripcion: 'Dart es un lenguaje optimizado para clientes, desarrollado por Google para crear aplicaciones rápidas en cualquier plataforma. Es la base del popular framework Flutter, permitiendo UI nativas de alto rendimiento.',
            historia: 'Presentado en 2011 como un posible reemplazo de JavaScript. Encontró su verdadero propósito con el lanzamiento de Flutter. Dart 2.0 (2018) lo reorientó completamente hacia el desarrollo de clientes.',
            usos: ['Desarrollo Multiplataforma (Flutter)', 'Aplicaciones Web', 'Desarrollo de Servidores (menos común)', 'Interfaces de usuario complejas'],
            pros: ['Compilación AOT (Nativo) y JIT (Desarrollo)', 'Hot Reload con estado para desarrollo UI rápido', 'Sintaxis familiar tipo C/Java', 'Tipado seguro'],
            contras: ['Fuertemente dependiente del éxito de Flutter', 'Comunidad más pequeña fuera del nicho móvil', 'Menos librerías generales que JS/Python'],
            ejemplo: `void main() {
  var lista = [1, 2, 3];
  lista.forEach(print);
}`
        },
        {
            id: 'haskell',
            nombre: 'Haskell',
            etiqueta: 'Funcional Puro',
            descripcion: 'Haskell es un lenguaje puramente funcional, estandarizado y de propósito general, con semántica no estricta (lazy) y tipado fuerte estático. Es famoso por su elegancia matemática y su capacidad para prevenir efectos secundarios indeseados.',
            historia: 'Definido en 1990 por un comité internacional para consolidar los lenguajes funcionales existentes. Nombrado en honor al lógico Haskell Curry. Es el campo de pruebas para muchas ideas avanzadas de teoría de lenguajes.',
            usos: ['Investigación Académica', 'Sistemas Financieros de alta seguridad', 'Compiladores y herramientas de análisis', 'Contratos inteligentes blockchain'],
            pros: ['Pureza garantiza ausencia de efectos secundarios ocultos', 'Sistema de tipos muy avanzado e inferencia potente', 'Concisión y elegancia matemática', 'Excelente para paralelismo'],
            contras: ['Curva de aprendizaje extremadamente empinada', 'Conceptos abstractos difíciles (Mónadas)', 'Rendimiento difícil de predecir (Laziness)'],
            ejemplo: `-- Factorial en Haskell
factorial :: Integer -> Integer
factorial 0 = 1
factorial n = n * factorial (n - 1)`
        },
        {
            id: 'assembly',
            nombre: 'Ensamblador',
            etiqueta: 'Lenguaje Máquina',
            descripcion: 'El lenguaje ensamblador (Assembly) es una representación legible por humanos del código máquina nativo de una arquitectura específica. Proporciona el nivel más bajo de abstracción posible sobre el hardware.',
            historia: 'Data de los primeros ordenadores programables (años 40-50). Antes de él, se programaba en binario o cables. Sigue siendo fundamental para el arranque de sistemas y optimización crítica.',
            usos: ['Programación de Drivers y Kernels iniciales', 'Ingeniería Inversa y Hacking', 'Sistemas de tiempo real crítico', 'Sistemas embebidos de recursos mínimos'],
            pros: ['Control total y absoluto del procesador', 'Rendimiento máximo teóricamente posible', 'Tamaño de código mínimo', 'No requiere compilador complejo (solo ensamblador)'],
            contras: ['No es portable (específico de cada CPU)', 'Desarrollo extremadamente lento y propenso a errores', 'Difícil de leer y mantener', 'Complejidad de gestión manual de registros'],
            ejemplo: `section .text
global _start
_start:
    mov edx, 9      ; longitud
    mov ecx, msg    ; mensaje
    mov ebx, 1      ; stdout
    mov eax, 4      ; sys_write
    int 0x80`
        },
        {
            id: 'cobol',
            nombre: 'COBOL',
            etiqueta: 'Negocios Legacy',
            descripcion: 'COBOL (Common Business-Oriented Language) es un lenguaje compilado similar al inglés diseñado para uso comercial. A pesar de su antigüedad, sigue procesando la mayoría de las transacciones bancarias y de seguros del mundo.',
            historia: 'Desarrollado en 1959 por CODASYL con la influencia clave de Grace Hopper. Diseñado para ser legible por gerentes. Ha sobrevivido durante más de 60 años en mainframes.',
            usos: ['Sistemas Mainframe (IBM z/OS)', 'Transacciones Bancarias y Cajeros', 'Sistemas de Seguros y Gobierno', 'Procesamiento Batch masivo'],
            pros: ['Manejo preciso de decimales (vital para dinero)', 'Capacidad para procesar volúmenes masivos de datos', 'Estabilidad y compatibilidad legendaria', 'Legibilidad autodocumentada'],
            contras: ['Considerado obsoleto y poco atractivo', 'Verbosidad extrema', 'Escasez crítica de desarrolladores (jubilación)', 'Herramientas modernas limitadas'],
            ejemplo: `       IDENTIFICATION DIVISION.
       PROGRAM-ID. HELLO.
       PROCEDURE DIVISION.
           DISPLAY 'HOLA MUNDO'.
           STOP RUN.`
        },
        {
            id: 'elixir',
            nombre: 'Elixir',
            etiqueta: 'Concurrencia Escalable',
            descripcion: 'Elixir es un lenguaje funcional dinámico diseñado para construir aplicaciones escalables y mantenibles. Se ejecuta sobre la máquina virtual BEAM de Erlang, conocida por ejecutar sistemas de baja latencia, distribuidos y tolerantes a fallos.',
            historia: 'Creado por José Valim en 2011. Buscaba traer la extensibilidad de Ruby al poder de la VM de Erlang. Ha sido adoptado por empresas como Discord y WhatsApp para manejar millones de conexiones.',
            usos: ['Sistemas Distribuidos de alta concurrencia', 'Aplicaciones Web en tiempo real (Phoenix Framework)', 'Sistemas de Mensajería Instantánea', 'IoT'],
            pros: ['Tolerancia a fallos: "Let it crash"', 'Concurrencia masiva con procesos ligeros', 'Sintaxis amigable y moderna', 'Herramientas excelentes (Mix, Hex)'],
            contras: ['Tipado dinámico (menos seguridad en compilación)', 'Ecosistema de paquetes menor que Node/Python', 'Curva de aprendizaje del modelo de actores'],
            ejemplo: `defmodule Saludo do
  def hola(nombre) do
    IO.puts "Hola #{nombre}"
  end
end
Saludo.hola("Elixir")`
        },
        {
            id: 'fortran',
            nombre: 'Fortran',
            etiqueta: 'Computación Científica',
            descripcion: 'Fortran (Formula Translation) es un lenguaje de programación imperativo de propósito general, especialmente adaptado al cálculo numérico y a la computación científica. Fue el primer lenguaje de alto nivel de la historia.',
            historia: 'Desarrollado por IBM en los años 50. Dominó la computación científica durante décadas. Sigue siendo insustituible en supercomputación para simulación física y climática debido a su optimización matemática.',
            usos: ['Supercomputación y HPC', 'Modelado Climático y Meteorología', 'Dinámica de Fluidos Computacional', 'Física de Partículas'],
            pros: ['Rendimiento numérico superior (optimización de arrays)', 'Bibliotecas científicas probadas durante 60 años', 'Paralelismo nativo moderno', 'Estándar en la academia física'],
            contras: ['Sintaxis arcaica en bases de código antiguas', 'Uso limitado fuera de la ciencia/ingeniería', 'Interacción compleja con lenguajes modernos'],
            ejemplo: `program hola
  print *, "Hola Fortran"
end program hola`
        }
    ],
    paradigmas: [
        {
            id: 'poo',
            nombre: 'Orientado a Objetos',
            etiqueta: 'Estructural y Organizativo',
            descripcion: 'La Programación Orientada a Objetos (POO) es un modelo que organiza el diseño de software alrededor de datos u objetos, en lugar de funciones y lógica. Se basa en cuatro pilares: encapsulamiento, abstracción, herencia y polimorfismo. Permite modelar sistemas complejos como interacciones entre entidades autónomas.',
            historia: 'Sus conceptos surgieron en los 60 con Simula. Smalltalk en los 70 lo refino. C++ y Java lo llevaron al dominio global en los 90. Hoy es el paradigma dominante en la industria del software empresarial.',
            usos: ['Desarrollo de Software Empresarial', 'Motores de Videojuegos', 'Sistemas de UI', 'Aplicaciones Móviles Simbólicas'],
            pros: ['Simulación natural del mundo real', 'Reutilización de código mediante herencia', 'Modularidad y facilidad de mantenimiento', 'Seguridad de datos mediante encapsulamiento'],
            contras: ['Puede añadir complejidad innecesaria', 'Problema del "Gorila y la Banana" (acoplamiento)', 'Sobrecarga de rendimiento por abstracción'],
            ejemplo: `// Herencia y Polimorfismo
class Animal {
    hacerSonido() { return "..."; }
}
class Perro extends Animal {
    hacerSonido() { return "Guau"; }
}
const miPerro = new Perro(); // Instancia`
        },
        {
            id: 'funcional',
            nombre: 'Programación Funcional',
            etiqueta: 'Matemático y Declarativo',
            descripcion: 'La programación funcional trata la computación como la evaluación de funciones matemáticas y evita el cambio de estado y los datos mutables (inmutabilidad). Se centra en el "qué" se está calculando en lugar del "cómo" llevar a cabo el cálculo mediante pasos secuenciales.',
            historia: 'Basada en el Cálculo Lambda de los años 30. Lisp (1958) fue el primer lenguaje en implementarlo. Ha resurgido con fuerza en la era moderna para resolver problemas de concurrencia y complejidad de estado.',
            usos: ['Sistemas Concurrentes y Paralelos', 'Procesamiento de Datos y ETL', 'Sistemas Financieros Críticos', 'Inteligencia Artificial'],
            pros: ['Código más predecible y fácil de testear', 'Facilita la programación paralela (sin race conditions)', 'Funciones puras sin efectos secundarios', 'Código conciso y expresivo'],
            contras: ['Curva de aprendizaje inicial alta', 'Puede ser menos intuitivo que el imperativo', 'Problemas de rendimiento sin optimización (GC)'],
            ejemplo: `// Estilo Funcional: Inmutabilidad
const numeros = [1, 2, 3];
// map crea una NUEVA lista, no toca la original
const dobles = numeros.map(n => n * 2);
console.log(dobles); // [2, 4, 6]`
        },
        {
            id: 'imperativo',
            nombre: 'Imperativo',
            etiqueta: 'Clásico y Procedural',
            descripcion: 'El paradigma imperativo es el más antiguo y cercano a cómo funciona el hardware. Consiste en dar instrucciones paso a paso a la computadora para que modifique el estado del programa hasta alcanzar el resultado deseado. Es una secuencia de comandos explícitos.',
            historia: 'Derivado de la arquitectura Von Neumann. Lenguajes como Fortran, C y Pascal definieron la computación durante décadas bajo este modelo. Es la base sobre la que se construyen otros paradigmas.',
            usos: ['Programación de Sistemas Operativos', 'Sistemas Embebidos y Controladores', 'Scripting simple', 'Optimización de bajo nivel'],
            pros: ['Control total sobre la ejecución', 'Alta eficiencia y rendimiento', 'Fácil de entender conceptualmente (receta de cocina)', 'Mapeo directo al hardware'],
            contras: ['Difícil de razonar a gran escala (Spaghetti code)', 'Efectos secundarios impredecibles', 'Difícil de paralelizar automáticamente'],
            ejemplo: `// Estilo Imperativo: Paso a paso
let suma = 0;
const lista = [1, 2, 3];
for(let i=0; i < lista.length; i++) {
    suma = suma + lista[i]; // Modifica estado
}`
        },
        {
            id: 'declarativo',
            nombre: 'Declarativo',
            etiqueta: 'Descriptivo',
            descripcion: 'En la programación declarativa, el desarrollador describe la lógica del cálculo (el "qué") sin describir el flujo de control (el "cómo"). El sistema subyacente decide la mejor manera de realizar la tarea. Es un nivel de abstracción superior al imperativo.',
            historia: 'SQL y Prolog son ejemplos clásicos. En la web moderna, HTML es puramente declarativo, y frameworks como React han popularizado la UI declarativa.',
            usos: ['Consultas a Bases de Datos (SQL)', 'Definición de Interfaces (HTML/React)', 'Configuración de Infraestructura (Terraform)', 'Expresiones Regulares'],
            pros: ['Código más legible y conciso', 'Menor superficie de errores (menos estado)', 'Optimizable automáticamente por el motor', 'Fácil de mantener'],
            contras: ['Menor control sobre el rendimiento detallado', 'Puede ser difícil de depurar', 'Requiere un motor subyacente complejo'],
            ejemplo: `// SQL es Declarativo
// Dices QUÉ quieres, no CÓMO buscarlo paso a paso
SELECT nombre FROM usuarios WHERE activo = true;

// HTML también es declarativo
// <h1>Mi Titulo</h1>`
        },
        {
            id: 'logico',
            nombre: 'Lógico',
            etiqueta: 'IA Simbólica',
            descripcion: 'La programación lógica se basa en la lógica formal matemática. Un programa es un conjunto de sentencias en forma lógica, que expresan hechos y reglas sobre un dominio de problemas. La computación es una deducción lógica a partir de esos hechos.',
            historia: 'Prolog (1972) es el lenguaje lógico por excelencia. Fue fundamental en los primeros intentos de Inteligencia Artificial (Sistemas Expertos) en Japón y Europa.',
            usos: ['Inteligencia Artificial Simbólica', 'Sistemas Expertos y de Diagnóstico', 'Procesamiento de Lenguaje Natural', 'Análisis de ontologías'],
            pros: ['Excelente para resolución de problemas complejos y puzzles', 'Base matemática sólida', 'Código muy compacto para reglas complejas'],
            contras: ['Rendimiento lento para tareas generales', 'Muy difícil de entender para programadores tradicionales', 'Nicho de mercado reducido'],
            ejemplo: `% Hechos y Reglas en Prolog
padre(juan, pedro).
padre(pedro, maria).
% Regla: X es abuelo de Y si X es padre de Z y Z es padre de Y
abuelo(X, Y) :- padre(X, Z), padre(Z, Y).`
        },
        {
            id: 'reactivo',
            nombre: 'Reactivo',
            etiqueta: 'Flujos Asíncronos',
            descripcion: 'La programación reactiva se orienta al manejo de flujos de datos y la propagación del cambio. Facilita la composición de operaciones asíncronas y basadas en eventos, tratando los eventos como colecciones observables.',
            historia: 'Originado en la programación funcional reactiva. Popularizado masivamente por las "Reactive Extensions" (Rx) creadas por Microsoft y portadas a todos los lenguajes (RxJS, RxJava).',
            usos: ['Interfaces de Usuario complejas (Netflix, Uber)', 'Sistemas en Tiempo Real', 'Manejo de eventos de mouse/teclado', 'Streams de datos'],
            pros: ['Manejo elegante de la asincronía compleja', 'Evita el "Callback Hell"', 'Código declarativo y composable', 'Excelente para UI dinámicas'],
            contras: ['Curva de aprendizaje mental alta (pensar en streams)', 'Depuración complicada', 'Abstracción pesada'],
            ejemplo: `// Pseudocódigo Reactivo (RxJS)
fromEvent(boton, 'click')
  .pipe(
    throttleTime(1000), // Solo un click por segundo
    map(ev => ev.clientX) // Obtener coordenada X
  )
  .subscribe(x => console.log('Click en X:', x));`
        },
        {
            id: 'eventos',
            nombre: 'Orientado a Eventos',
            etiqueta: 'Respuesta a Estímulos',
            descripcion: 'En este paradigma, el flujo de ejecución del programa está determinado por sucesos o "eventos" (acciones del usuario, mensajes de otros programas, sensores). Es el modelo dominante en interfaces gráficas y servidores I/O no bloqueantes.',
            historia: 'Nació con las interfaces gráficas y los sistemas operativos interactivos. Node.js lo popularizó en el backend con su bucle de eventos (Event Loop).',
            usos: ['Interfaces Gráficas de Usuario (GUI)', 'Servidores Web de alta concurrencia (Node.js)', 'Sistemas de mensajería', 'Juegos'],
            pros: ['Altamente responsivo e interactivo', 'Desacoplamiento entre componentes', 'Eficiente para I/O (Entrada/Salida)', 'Flexible'],
            contras: ['El flujo de control no es lineal (difícil de seguir)', 'Riesgo de "Callback Hell"', 'Condiciones de carrera si no se gestiona bien'],
            ejemplo: `// JavaScript Event Listener
const boton = document.getElementById('btn');
boton.addEventListener('click', function(e) {
    console.log("¡Evento capturado!");
    mostrarAlerta();
});`
        },
        {
            id: 'aspectos',
            nombre: 'Orientado a Aspectos',
            etiqueta: 'Modularidad Transversal',
            descripcion: 'La Programación Orientada a Aspectos (AOP) permite separar las "preocupaciones transversales" (funcionalidades que cortan a través de múltiples módulos, como logging, seguridad o transacciones) de la lógica de negocio principal.',
            historia: 'Desarrollado en Xerox PARC en los 90. AspectJ para Java es la implementación más famosa. Frameworks como Spring (Java) y NestJS usan AOP extensivamente.',
            usos: ['Logging y Auditoría centralizada', 'Gestión de Transacciones de Base de Datos', 'Control de Seguridad y Autenticación', 'Caché'],
            pros: ['Código de negocio mucho más limpio', 'Evita duplicación de código (DRY)', 'Modularidad superior', 'Fácil mantenimiento de políticas globales'],
            contras: ['Añade "magia" oculta al flujo de ejecución', 'Difícil de rastrear y depurar', 'Puede romper el encapsulamiento'],
            ejemplo: `// Decorador (Concepto AOP)
@LogExecutionTime
class Servicio {
    procesar() {
        // La lógica de log se ejecuta automáticamente antes/después
        // sin ensuciar este método.
        return db.guardar();
    }
}`
        },
        {
            id: 'concurrent',
            nombre: 'Concurrente',
            etiqueta: 'Paralelismo',
            descripcion: 'La programación concurrente trata con la ejecución de múltiples tareas o procesos que se superponen en el tiempo. Se enfoca en la estructura de los programas que deben interactuar con el mundo real simultáneo y gestionar recursos compartidos.',
            historia: 'Fundamental desde los primeros sistemas operativos multitarea. Lenguajes como Erlang y Go han hecho de la concurrencia un ciudadano de primera clase.',
            usos: ['Servidores Web de alto tráfico', 'Procesamiento de video e imágenes', 'Sistemas Distribuidos', 'Simulaciones'],
            pros: ['Aprovecha procesadores modernos multinúcleo', 'Mejora la capacidad de respuesta (responsiveness)', 'Modela mejor problemas del mundo real'],
            contras: ['Extremadamente difícil de hacer bien', 'Problemas de Deadlocks y Race Conditions', 'Depuración no determinista (heisenbugs)'],
            ejemplo: `// Go Routines (Concurrencia)
func main() {
    go tareaPesada() // Se ejecuta en background
    go otraTarea()   // En paralelo
    fmt.Println("El main sigue ejecutándose")
}`
        },
        {
            id: 'meta',
            nombre: 'Metaprogramación',
            etiqueta: 'Código que escribe Código',
            descripcion: 'La metaprogramación consiste en escribir programas que pueden leer, generar, analizar o transformar otros programas (o a sí mismos) mientras se ejecutan. Permite una flexibilidad y abstracción extremas.',
            historia: 'Lisp fue el pionero con sus macros. Smalltalk y Ruby llevaron la metaprogramación dinámica al extremo. Hoy se usa en casi todos los frameworks modernos para reducir el código repetitivo.',
            usos: ['Creación de Frameworks (Ruby on Rails)', 'Lenguajes de Dominio Específico (DSL)', 'Compiladores y Transpiladores', 'Generación de código'],
            pros: ['Reduce drásticamente el código repetitivo (Boilerplate)', 'Permite crear sintaxis expresivas y DSLs', 'Abstracción muy potente'],
            contras: ['Hace el código difícil de entender y depurar', 'Curva de aprendizaje elevada', 'Puede impactar el rendimiento o la seguridad'],
            ejemplo: `// Metaprogramación en Ruby
class Persona
  # Crea getters y setters automáticamente en tiempo de ejecución
  attr_accessor :nombre, :edad
end`
        }
    ]
};
