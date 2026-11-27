/* Guía GTA VI · misiones secundarias y encargos ocultos */

export const SIDE_QUESTS = [
    {
        id: "kirk",
        title: "El mono mofeta",
        giver: "Kirk",
        chapter: "1–2",
        place: "Pelican Valley y Cottonmouth Lake",
        who: "Cualquiera; el cierre, de noche",
        reward: "1.000 $ + 10.000 $",
        missable: "No",
        summary:
            "La investigación más larga de los Cayos: carteles, efigies y una criatura que Kirk lleva años persiguiendo. Empieza en el capítulo 1, pero el cierre puede esperar al 2.",
        missions: [
            {
                name: "Search for the Skunk Ape",
                desc: "Lee un cartel de «¿Has visto al mono mofeta?» en Key Lento y llama al número de Kirk. De noche, reúnete con él en Pelican Valley junto a Thorp Adventures, sigue el dron y las huellas y reduce a Mr. Mangrove con el rifle tranquilizante en vez de matarlo. Paga 1.000 $.",
            },
            {
                name: "Search for Tree Effigies",
                desc: "Kirk te manda a localizar tres efigies talladas en los árboles de Pelican Valley. Se inspeccionan en cualquier orden y no hay combate, pero algunas solo se distinguen de noche. Al completar las tres, Kirk vuelve a llamar.",
            },
            {
                name: "Help Kirk Find Mr. Mangrove",
                desc: "De noche, cerca de Cottonmouth Lake, Kirk pierde otra vez al mono y la persecución acaba en helicóptero con dardos tranquilizantes. La cadena se puede cerrar en el capítulo 2 o más tarde y paga 10.000 $; cuenta para el trofeo Extraños y Locos.",
            },
        ],
        tip: "Si la misión no aparece, cambia de protagonista y vuelve de noche. Algunas partidas atribuyen el cierre a Lucía.",
    },
    {
        id: "kyle",
        title: "La granja McKittrick",
        giver: "Kyle McKittrick",
        chapter: "2–3",
        place: "McKittrick Farm y Port Gellhorn",
        who: "Cualquiera",
        reward: "400 $ + 1.000 $ + 5.000 $",
        missable: "No",
        summary:
            "Un flyer de trabajo de piloto lleva a la granja de Kyle, que tiene el brazo roto y los campos de fresas sin fumigar. La cadena mezcla vuelo a baja altura, un almacén y una decisión sobre su futuro.",
        missions: [
            {
                name: "Check Out McKittrick Farm",
                desc: "Lee el flyer de empleo de piloto junto al Starlet Motel y preséntate en la granja. Despega el fumigador y pasa bajo sobre la camioneta de Kyle mientras recorre los campos; al terminar del turno, el sueldo entra en BuckMe y cobras 400 $.",
            },
            {
                name: "Collect Chemicals for Kyle",
                desc: "Kyle llama para recuperar un cargamento de productos químicos en un almacén vigilado. Puedes pagar al encargado o entrar por la fuerza y sacar las cajas; la vía violenta ahorra dinero pero añade testigos. Paga 1.000 $ y desbloquea el siguiente encargo.",
            },
            {
                name: "Buddy?",
                desc: "En el capítulo 3 llega un mensaje de auxilio: Kyle se ha metido en un tiroteo con la policía. Puedes dejar que se defienda solo o ponerte de su lado; las dos opciones pagan 5.000 $, pero cambian la escena final y el trofeo que salta.",
            },
        ],
        tip: "El fumigador es frágil: no roces árboles ni vallas en la pasada baja o tendrás que repetir el turno.",
    },
    {
        id: "billy",
        title: "Los Thrillbillies",
        giver: "Billy",
        chapter: "2–3",
        place: "Thrillbilly Mud Club, Kelly County",
        who: "Cualquiera; Mall Rats es en solitario",
        reward: "2.500 $ a 12.000 $ + trofeo",
        missable: "No",
        summary:
            "Billy recluta a la pareja para su equipo de motocross y robos. Son cinco pruebas que suben de nivel: barro, un camión blindado, un centro comercial, un coche de policía y una carrera final.",
        missions: [
            {
                name: "Thrillbillies",
                desc: "Tras Coffee Break, elige el mud club como salida o visítalo por tu cuenta en Kelly County. Compite en la carrera de barro y termina en cualquier puesto menos último; Billy te ficha y paga 2.500 $.",
            },
            {
                name: "Twist Wrist, Smash, Grab",
                desc: "El equipo persigue un camión blindado por la autopista. En moto, dispara a las bisagras de las puertas traseras, agárrate al botín y escapa por rutas secundarias antes de que llegue la policía. Paga 2.000 $.",
            },
            {
                name: "Mall Rats",
                desc: "Misión en solitario: entra al centro comercial en moto, revienta las vitrinas de la joyería, recoge las bolsas y sal por el pasillo que el resto del equipo ha despejado. El golpe paga 12.000 $.",
            },
            {
                name: "The Impaler",
                desc: "Wyman avisa de un Impaler de policía guardado en el depósito de Ambrosia. Sácalo sin que te vean, arranca y pierde a los coches patrulla antes de entregarlo; el coche queda para el garaje.",
            },
            {
                name: "Hometown Heroes",
                desc: "Cierre de la cadena en el mud club: carrera por el circuito, asalto a la azucarera y huida con el equipo. Paga 10.000 $ y desbloquea el trofeo The Lone Rider.",
            },
        ],
        tip: "Mall Rats no admite compañero. Si el juego pregunta si llevas a alguien, déjalo en casa.",
    },
    {
        id: "kenton",
        title: "Inmersiones de Kenton",
        giver: "Kenton Rees",
        chapter: "1–3",
        place: "Key Lento y Leonida Bay",
        who: "Cualquiera; Maritime Disputes, Jason",
        reward: "Pago por set + trofeo",
        missable: "No",
        summary:
            "Kenton regenta la tienda de buceo de Key Lento y paga por recuperar cofres de pecios. Es la cadena más tranquila del juego hasta que su historia personal se cruza con un carguero.",
        missions: [
            {
                name: "Search the Dive Sites",
                desc: "Tras Island Dreams, habla con Kenton en su tienda: los pecios aparecen como cofres morados en el mapa. Sumérgete con el detector de metales, registra los siete conjuntos y cobra por cada entrega; al completar los siete salta This Was No Boat Accident.",
            },
            {
                name: "Maritime Disputes",
                desc: "En el capítulo 3, Kenton desaparece durante una disputa marítima y acaba retenido en un carguero que se hunde. Rescátalo, sal del barco antes de que se vaya a pique y vuelve a bucear el pecio en Leonida Bay para cerrar la cadena.",
            },
        ],
        tip: "No necesitas traje especial para los pecios superficiales, pero lleva un vehículo acuático para los más alejados.",
    },
    {
        id: "shirley",
        title: "Los recados de Shirley",
        giver: "Shirley",
        chapter: "1",
        place: "Key Lento y Three Sheets Liquor",
        who: "Cualquiera",
        reward: "~1.300 $ + scooter",
        missable: "Sí, solo capítulo 1",
        summary:
            "La vecina de Jason pide dos favores con reloj y ninguno llega al capítulo 2. Son las secundarias más fáciles de perder de toda la guía.",
        missions: [
            {
                name: "Get Shirley's Rum",
                desc: "Compra el ron que pide Shirley en Three Sheets Liquor y enfréntate a los matones del patio trasero, entre las jaulas de loros. El encargo tiene temporizador y esconde un alijo de unos 1.300 $; si no lo haces antes de Tourist Trap, desaparece.",
            },
            {
                name: "Steal the Scooter",
                desc: "Shirley vuelve a llamar al día siguiente: alguien le ha cogido el scooter de movilidad. Recupéralo y devuélvelo sin destrozarlo; también tiene reloj y se cierra al terminar el capítulo 1.",
            },
        ],
        tip: "Guarda antes de aceptar el primer encargo. Si el temporizador te pilla lejos, la segunda llamada no llegará.",
    },
    {
        id: "moses",
        title: "Coches para Moses",
        giver: "Moses",
        chapter: "2",
        place: "Taller de Moses, Port Gellhorn",
        who: "Cualquiera",
        reward: "18.610 $ + regalo",
        missable: "No",
        summary:
            "Moses compra vehículos robados y los revende. La cadena enseña a valorar el estado del coche, a quitar rastreadores y a entregar sin daños.",
        missions: [
            {
                name: "Steal Vehicles for Moses",
                desc: "Tras la misión Moses, visita su taller y acepta la lista de encargos. Roba cada coche, elimina el rastreador si lo lleva y entrégalo con la carrocería entera; el total de la cadena suma 18.610 $ y desbloquea la app Scooter Bros.",
            },
            {
                name: "Collect Moses' Gift",
                desc: "Cuando hayas entregado los coches, Moses te cita en el taller para darte las gracias. La recompensa es un Sultan preparado y un descuento permanente en sus encargos.",
            },
        ],
        tip: "Un coche con el motor humeando vale mucho menos. Repara antes de entregar si el trayecto fue movido.",
    },
    {
        id: "yasmani",
        title: "Los trabajos de Yasmani",
        giver: "Yasmani",
        chapter: "3",
        place: "Vice City",
        who: "Cualquiera",
        reward: "205.000 $ + 80.000 $",
        missable: "No",
        summary:
            "La cadena de atracos que sostiene la economía de medio capítulo: joyerías, cajeros, préstamos con usura y un furgón blindado. También abre el Snap Gun y el perista de joyas.",
        missions: [
            {
                name: "Yasmani's Jewelry Jobs",
                desc: "Tras mudarte a Vice City, Yasmani llama y ofrece la primera lista de joyerías. Marca el local, entra con el Snap Gun, vacía las vitrinas y sal antes de que cierre el perímetro; al terminar desbloquea el resto de trabajos.",
            },
            {
                name: "Yasmani's ATM Jobs",
                desc: "Los cajeros se abren con el cabrestante del vehículo y dejan fajos de billetes marcados. Arranca el cajero, carga el dinero y véndelo al perista; cada golpe sube el contador de 250.000 $.",
            },
            {
                name: "Yasmani's Payday Loans Jobs",
                desc: "Siete oficinas de préstamos con usura repartidas por Vice City. Entra, vacía la caja y los archivadores, y sal antes de que llegue la policía; cuentan para las 7/7 del 100%.",
            },
            {
                name: "Tail the Security Van",
                desc: "Sigue el furgón blindado sin que te detecte, espera a que aparque y coloca explosivos en las bisagras. Abre, carga el botín y escapa; el golpe paga 205.000 $.",
            },
            {
                name: "That's Where the Money Is…",
                desc: "El cierre de la cadena lleva a Yasmani a una cámara acorazada con más dinero del que esperaba. Completa la ruta, defiende la salida y cobra 80.000 $ más un desbloqueo permanente.",
            },
        ],
        tip: "Los billetes marcados solo se venden a determinados peristas. No los acumules si necesitas efectivo limpio.",
    },
    {
        id: "randy",
        title: "La lista de Randy",
        giver: "Randy",
        chapter: "3",
        place: "Oeste de Vice City",
        who: "Cualquiera",
        reward: "12.110 $ a 31.510 $ + trofeo",
        missable: "No",
        summary:
            "Randy paga cifras altas por coches concretos. Su tablón es la mejor fuente de ingresos con vehículos y termina con el trofeo Supply & Demand.",
        missions: [
            {
                name: "Randy's Wish List",
                desc: "Tras Clonin' Keys, Makin' GS, acude al garaje de Randy en el oeste de Vice City. El tablón pide 15 coches raros (Jubilee, Windsor Drop, Jugular, Banshee, Toros y compañía); clona la llave, quita el rastreador y entrega sin daños. Cada coche paga según modelo.",
            },
            {
                name: "Collect the Tempesta",
                desc: "Randy señala un Tempesta vigilado en un garaje privado. Entra sin activar la alarma, clona la llave y sal por la rampa antes de que bajen las puertas; la entrega desbloquea dos mejoras.",
            },
            {
                name: "Dale Mamba",
                desc: "Un Mamba azul aparece en una concentración del puerto. Espera a que el dueño se aleje, abre con la llave clonada y escapa por la autopista; paga 12.110 $ y un desbloqueo.",
            },
            {
                name: "Delivery Day",
                desc: "Randy necesita tres coches en una sola noche. Organiza las entregas por zonas, evita las comisarías del centro y no pares hasta el garaje; el encargo paga 25.000 $.",
            },
            {
                name: "Mansion Thrax",
                desc: "El último encargo es un Thrax en la mansión de un coleccionista. Entra por el jardín, esquiva la seguridad, saca el coche por la puerta de servicio y pierde a los perseguidores; paga 31.510 $.",
            },
        ],
        tip: "La lista completa da Supply & Demand. Si un coche se destruye, vuelve a aparecer tras unos días de juego.",
    },
    {
        id: "eddie",
        title: "La fiesta de Eddie Acosta",
        giver: "Eddie Acosta",
        chapter: "4",
        place: "Heathcliff Heights, Vice City",
        who: "En solitario",
        reward: "Invitación; no pagues",
        missable: "No",
        summary:
            "Una sola misión, pero con trampa: Eddie vende un NFT de 50.000 $ en la azotea. La guía recomienda no pagar y salir por piernas.",
        missions: [
            {
                name: "Attend Eddie Acosta's Party",
                desc: "Tras conocer a Eddie en Pool Day, llega la invitación a su fiesta en la azotea de Heathcliff Heights. Sube, escucha la oferta del NFT y recházala: es una estafa. Eddie corta la música y manda a sus hombres; escapa en moto por las calles laterales y quédate con el contacto.",
            },
        ],
        tip: "Si pagas los 50.000 $, el NFT no se puede revender y pierdes el dinero. No hace falta para el 100%.",
    },
    {
        id: "bret",
        title: "Caza con Bret",
        giver: "Bret Vogel",
        chapter: "2",
        place: "Lummox County y Mount Kalaga",
        who: "Solo Jason",
        reward: "500 $ + rifle + trofeo",
        missable: "No",
        summary:
            "Bret, viejo amigo militar de Jason, regenta un negocio de caza. Su cadena enseña el sistema de rastros, la caza limpia y los 15 naipes de objetivos.",
        missions: [
            {
                name: "Veteran Hunted",
                desc: "Tras Coffee Break, Bret manda un mensaje y cita a Jason en su negocio de Lummox County, cerca de Mount Kalaga. Sigue el rastro del animal, dispara a la cabeza o al corazón y cobra 500 $; además entrega el rifle de caza Killtelligence SM-69.",
            },
            {
                name: "Bret's Hunting Decks",
                desc: "Bret entrega 15 naipes, cada uno con un animal concreto. Localiza cada especie, mata con un solo disparo limpio y conserva la pieza intacta para cobrar el máximo. Al completar los 15 salta Fair Game; el rifle se recupera en cualquier armero de Ammu-Nation si lo pierdes.",
            },
        ],
        tip: "Un disparo al cuerpo estropea la pieza. Espera a tener ángulo limpio a la cabeza o al corazón.",
    },
    {
        id: "tyrone",
        title: "Kitty Litter",
        giver: "Tyrone",
        chapter: "3",
        place: "Vice City",
        who: "Cualquiera",
        reward: "2.000 $ a 10.000 $ + trofeo",
        missable: "No",
        summary:
            "Tyrone señala los laboratorios de Kitty Litter repartidos por Vice City. Son 14 puntos morados, con claves, guardias y una final en un motel.",
        missions: [
            {
                name: "Take Out Kitty Litter",
                desc: "Tras Here, Kitty Kitty, Tyrone marca los laboratorios en el mapa. Entra en cada piso, neutraliza a los cocineros, coge los vídeos y vacía la caja; algunos usan el teclado 1999 y pagan entre 2.000 y 2.500 $ por local.",
            },
            {
                name: "Spin On This",
                desc: "El último laboratorio está en el motel Grayson. Registra la habitación, sigue a Rocky por el patio y decide si lo entregas o lo dejas marchar; la misión paga 10.000 $ y cierra el trofeo Spin On This!.",
            },
        ],
        tip: "Los 14 laboratorios cuentan como tareas opcionales. Si buscas el 100%, no dejes ninguno para después de la historia.",
    },
    {
        id: "dunk",
        title: "Los consejos de Dunk",
        giver: "Dunk",
        chapter: "3",
        place: "Port Gellhorn y Vice City",
        who: "Cualquiera",
        reward: "Sin pago directo; objetivos rentables",
        missable: "No",
        summary:
            "Dunk, el camello de Vicki en Port Gellhorn, señala qué comercios merecen la pena. Una sola misión que ordena la ruta de atracos del capítulo 3.",
        missions: [
            {
                name: "Dunk's Robbery Tips",
                desc: "Tras Slam Dunk, Dunk se pone en contacto en el capítulo 3 y marca una lista de tiendas, licorerías y joyerías con buena caja. Visítalo, escucha sus precios de perista y usa el mapa para elegir el próximo golpe; no hay tiroteo obligatorio ni pago al cerrar, pero desbloquea objetivos rentables para los 91 atracos.",
            },
        ],
        tip: "No cuenta para el trofeo Extraños y Locos, pero sí como tarea opcional. Pásate antes de vaciar tiendas para priorizar las de mayor botín.",
    },
    {
        id: "yago",
        title: "Las carreras de Yago",
        giver: "Yago",
        chapter: "3",
        place: "Salton y Little Cuba",
        who: "Jason en tres de las cuatro",
        reward: "3.000 $ + 500 $ + 3.800 $",
        missable: "Race Against Yago es contrarreloj",
        summary:
            "Yago es el mentor de las carreras callejeras. La cadena mezcla pruebas de velocidad, una build de taller y un cierre personal que no termina como esperas.",
        missions: [
            {
                name: "Join a Street Race",
                desc: "Tras Dealer's Choice, acude a Hit 'n' Run VC en Salton y alquila un coche de la lista (600 a 900 $). Corre contra el grupo, usa el nitro en las rectas y gana para llevarte 3.000 $ y entrar en la cadena.",
            },
            {
                name: "Bumper to Bumper",
                desc: "Yago cita a Jason en Little Cuba y le pide montar una build de carreras en el taller: motor, neumáticos y nitro. La carrera no paga inscripción, pero acaba con una persecución policial; escapa y cobra 500 $.",
            },
            {
                name: "Race Against Yago",
                desc: "El duelo directo contra Yago lleva reloj. Corre en cuanto aparezca el icono de arena, corta por las calles laterales y guarda el nitro para la última recta; paga 3.800 $ y cuenta para Extraños y Locos.",
            },
            {
                name: "Brother to Brother",
                desc: "Yago cita a Jason en El Rincon Notorio para un trato que sale mal. Persigue a los que se llevan la mercancía, decide a quién salvas y aguanta el tiroteo; paga dos desbloqueos y cierra la cadena con una escena dura.",
            },
        ],
        tip: "Haz una partida manual antes de Race Against Yago. Si fallas o la abandonas, el icono puede desaparecer.",
    },
    {
        id: "andy",
        title: "Cellerica",
        giver: "Andy",
        chapter: "3",
        place: "Belville",
        who: "Solo Lucía",
        reward: "5.000 $ + 1.800 $ + 10.000 $",
        missable: "No",
        summary:
            "Andy mete a Lucía en Cellerica, una secta de autoayuda con repartos, una cuota de entrada y una iniciación. Cinco misiones con trofeo propio.",
        missions: [
            {
                name: "Climbing the Cellerichain",
                desc: "Andy llama a Lucía y le da su nueva dirección en Belville. Haz tres entregas para el grupo, ayuda a un adicto en Ambrosia y recupera una revista; la misión desbloquea dos mejoras y la siguiente fase.",
            },
            {
                name: "Pay the Cellerica Fee",
                desc: "Para subir de nivel hay que pagar 5.000 $ por BuckMe. Haz el ingreso, guarda el recibo y espera la llamada de Andy; el dinero se recupera más adelante en la cadena.",
            },
            {
                name: "Peach!",
                desc: "Andy cita a Lucía en un banco de Belville para la iniciación. Las respuestas no cambian el resultado: conoce a Cecilia, acepta el Cloud Manifestick y entra en el círculo interno.",
            },
            {
                name: "Read the Label",
                desc: "Cecilia manda recuperar la furgoneta de Cellerica, que está en manos de dos adictos. Recupera el vehículo, comprueba la carga y entrégalo en Belville; paga 1.800 $.",
            },
            {
                name: "Puff Puff Pass",
                desc: "La reunión final es en un almacén. Protege a Andy durante la confrontación con Cecilia, decide qué pasa con el grupo y sal con la caja; paga 10.000 $ y desbloquea Road to Rehabilitation.",
            },
        ],
        tip: "Toda la cadena es exclusiva de Lucía. Si estás con Jason, cambia de personaje antes de ir a Belville.",
    },
    {
        id: "pete",
        title: "El último vuelo",
        giver: "Pilot Pete",
        chapter: "4",
        place: "Sundown Airfield y condados del sur",
        who: "Solo Jason",
        reward: "12.000 $ + 4 × 20.000 $",
        missable: "No",
        summary:
            "Pete es un veterano de la aviación que necesita un copiloto de confianza. Cinco misiones de vuelo, drops con reloj y una despedida en el aire.",
        missions: [
            {
                name: "The Last Mile: Passing the Torch",
                desc: "Pete llama a Jason y lo cita en Sundown Airfield, en Leonard County. Abre la caja fuerte con el código 3718, saca el KZ-59 y despega; el primer vuelo paga 12.000 $.",
            },
            {
                name: "The Last Mile: Backseat Pilot",
                desc: "Pete manda un mensaje con el hidroavión preparado. Haz siete lanzamientos en dos horas de juego, evita las zonas rojas y no pierdas altura en los giros; paga 20.000 $.",
            },
            {
                name: "Pete's Deliveries: Southpoint Airfield",
                desc: "La ruta sale de Southpoint, en Mariana County. Carga los paquetes, despega con viento cruzado y entrégalos en los puntos marcados antes de que cierre la ventana; paga 20.000 $.",
            },
            {
                name: "Pete's Deliveries: Avery Allen & Co.",
                desc: "El siguiente encargo sale de Wild Hog Airfield y termina en la azotea de Avery Allen & Co. Ajusta la aproximación, suelta la carga sin romperla y vuelve a la pista; paga 20.000 $.",
            },
            {
                name: "Deliver Packages",
                desc: "El último vuelo reparte carga entre Kelly County y Leonard County. Planifica el orden, reposta si hace falta y aterriza antes del plazo; paga 20.000 $ y cierra la cadena.",
            },
        ],
        tip: "Los drops se fallan si la carga toca fuera de la zona. Baja despacio y suelta cuando el círculo esté centrado.",
    },
    {
        id: "dodos",
        title: "Dodos Rising",
        giver: "Rosebud y Yvonne",
        chapter: "1–3",
        place: "Vice City International Airport",
        who: "Cualquiera",
        reward: "5.000 $ + desbloqueos",
        missable: "No",
        summary:
            "Un grupo animalista protesta frente a un santuario de chimpancés cerca del aeropuerto. Es una de las cadenas ocultas que no aparecen en todas las listas.",
        missions: [
            {
                name: "Bring Out the Chimp",
                desc: "Encuentra al grupo de Dodos Rising junto al santuario de chimpancés, al norte del VCIA. Habla con la responsable, documenta el estado de los animales y ayuda a sacar a un chimpancé sin activar la seguridad.",
            },
            {
                name: "Sisters of the Sea",
                desc: "Rosebud pide apoyo para una protesta en el paseo marítimo. Consigue el material, monta el altavoz y protege la manifestación cuando llegan los matones; desbloquea la siguiente misión.",
            },
            {
                name: "Twin Flames",
                desc: "Tyler necesita dos furgonetas para trasladar animales a un refugio. Roba los vehículos, cambia las matrículas y entrégalos sin daños; la ruta termina en una persecución corta.",
            },
            {
                name: "Dodo, Rise!",
                desc: "Yvonne convoca la acción final en el aeropuerto. Distrae a la seguridad, libera a los animales y escapa antes de que cierren los accesos; paga 5.000 $ y cierra la cadena.",
            },
        ],
        tip: "La cadena se puede empezar en el capítulo 1, pero el cierre necesita Vice City abierto.",
    },
];

export const HIDDEN_QUESTS = [
    {
        name: "The Final Flush",
        start: "Cartel «Stop! Don't Flush» en el baño del Nine1Nine",
        steps: "Escanea el QR con WAiNK, contesta el mensaje de Dr. Merle y reúnete con él en Frank's Waffles. La ruta termina en la depuradora de Gloriana Key.",
        reward: "Aumento permanente de estamina máxima",
    },
    {
        name: "Missing Persons",
        start: "Cartel de personas desaparecidas en Port Gellhorn",
        steps: "Entra al hangar cerrado junto al taller de Moses arrastrándote por el lado derecho. Fotografía las pruebas, localiza los tres cuerpos y llama a la línea de denuncia después de cada uno.",
        reward: "Desbloqueo; evita el bloqueo del capítulo 3",
    },
    {
        name: "UFO Abduction",
        start: "Coche abandonado cerca del Starlet Motel, de 2 a 4 a. m.",
        steps: "Sigue el rastro de ropa hacia el bosque, observa la luz y a la mujer flotante. Recupera su coche y deja que te abduzcan; el sueño señala un búnker.",
        reward: "Desbloqueo y pista del búnker",
    },
    {
        name: "Freddie's Defenses",
        start: "Túnel bajo el contenedor naranja",
        steps: "Entra por el túnel, espera el mensaje de Freddie y vuelve a entrar saltando la valla. En la huida, elige «Leave» para conducir hacia el huracán.",
        reward: "5.000 a 7.500 $ + Dubsta de Freddie",
    },
    {
        name: "Papa Audacity",
        start: "Especialista de stunts cerca de Ocean Beach",
        steps: "Acepta los seis encargos de promoción de Audacity coin: AudaCity Stunts, Catching a Whale, Quit Your Job Sell Your House, The Audacity, The Unknown Stuntman y Trial by Tire.",
        reward: "25.000 $ en el cierre + retos de stunt",
    },
    {
        name: "Wyman's Classic Car Collection",
        start: "Wyman, capítulo 2 (Ultimate Edition)",
        steps: "Localiza los 15 restos de coches clásicos, paga la tasa de 1.500 $ por cada uno y escanea el chasis. Al completar la colección aparece el Deviant.",
        reward: "Deviant y trofeo de colección",
    },
    {
        name: "Cal: pesca y campana",
        start: "Cal Hampton, capítulo 1, Gambit Bay",
        steps: "Catch a Bigger Fish pide pescar un ejemplar mayor que el de Cal; Ring the Bell! se activa al volver al muelle. Usa el cebo correcto y no cortes el sedal.",
        reward: "Baited My Tackle + desbloqueos",
    },
    {
        name: "Jose Bermudez",
        start: "Contacto de Jose, capítulo 3",
        steps: "President Russo's Bunkers localiza los búnkeres del presidente; Project Rumba investiga el programa de lavado de cerebro. Ambas rutas tienen seguridad militar.",
        reward: "Tres desbloqueos por misión",
    },
    {
        name: "Manhunt (Hyde Island)",
        start: "Hyde Island, capítulo 2",
        steps: "Sigue el rastro de los fugitivos por la isla, neutraliza a la banda y registra el campamento antes de que llegue la policía.",
        reward: "15.000 $ + desbloqueo",
    },
    {
        name: "Defeat Satan",
        start: "Encuentro oculto del capítulo 2",
        steps: "Sigue las pistas del culto en el mapa, completa el ritual y sobrevive al combate final. No hay marcador hasta que encuentras la primera pista.",
        reward: "Cuatro desbloqueos",
    },
    {
        name: "Gellhorn's Missing Tourists",
        start: "Alvan West, capítulo 2",
        steps: "Investiga las desapariciones en Port Gellhorn, interroga a los testigos y registra las habitaciones del motel abandonado.",
        reward: "Desbloqueo y pista de Missing Persons",
    },
    {
        name: "No Paws Clause",
        start: "Capítulo 3, refugio de animales",
        steps: "Infíltrate en la perrera ilegal, libera a los animales y escapa antes de que llegue la seguridad privada.",
        reward: "15.000 $ + dos desbloqueos",
    },
    {
        name: "Capri Cops (By Invitation Only)",
        start: "Capítulo 3, comisaría de Capri",
        steps: "Consigue la invitación, entra a la fiesta benéfica de la comisaría y roba las pruebas del despacho del capitán sin activar la alarma.",
        reward: "Desbloqueo",
    },
    {
        name: "Beefslap",
        start: "Hombre junto a su coche averiado, cerca del Thrillbilly Mud Club",
        steps: "Habla con él y ofrécele una vuelta. Si aceptas, te invita a los apple shots y queda como contacto para una entrega posterior.",
        reward: "Apple shots y contacto",
    },
    {
        name: "Encargos de la casa y de la pareja",
        start: "Casa de Jason, capítulo 1; citas con Lucía",
        steps: "Repara escalones, tejado, barandilla y pared; compra flores, encarga la compra, corta el pelo, recoge la ropa y el collar, medita con Lucía y acepta las citas. Son tareas cortas que suben la relación.",
        reward: "Relación, desbloqueos y tareas para el 100%",
    },
];
