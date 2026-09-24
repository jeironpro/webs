const moduls_ras = [
    {
        "m": "0612_ICC0",
        "nom": "Desenvolupament Web en Entorn Client",
        "resultats_aprenentatge": [
            {
                "ra1": "Selecciona les arquitectures i tecnologies de programació sobre clients web, identificant i analitzant les capacitats i les característiques de cadascuna.",
                "nota": 9.4,
                "nota_final": null
            },
            {
                "ra2": "Escriu sentències simples, aplicant la sintaxi del llenguatge i verificant la seva execució sobre navegadors web.",
                "nota": 8.7,
                "nota_final": null
            },
            {
                "ra3": "Escriu codi, identificant i aplicant les funcionalitats aportades pels objectes predefinits del llenguatge.",
                "nota": 9.3,
                "nota_final": null
            },
            {
                "ra4": "Programa codi per a clients web analitzant i utilitzant estructures definides per l'usuari.",
                "nota": 8.7,
                "nota_final": null
            },
            {
                "ra5": "Desenvolupa aplicacions web interactives integrant mecanismes de maneig d'esdeveniments.",
                "nota": 8,
                "nota_final": null
            },
            {
                "ra6": "Desenvolupa aplicacions web analitzant i aplicant les característiques del model d'objectes del document.",
                "nota": 8.5,
                "nota_final": null
            },
            {
                "ra7": "Desenvolupa aplicacions web dinàmiques, reconeixent i aplicant mecanismes de comunicació asíncrona entre client i servidor.",
                "nota": 8.50, // 8.46
                "nota_final": null
            },
        ],
        "empresa": {
            "descripcion": "Nota de les practiques realitzat a l'empresa.",
            "nota": 10
        },
        "absencies": 25, 
        "absencies_total": 46,
        calcularQMP() {
		    const qra1 = this.resultats_aprenentatge[0]?.nota || 0;
		    const qra2 = this.resultats_aprenentatge[1]?.nota || 0;
		    const qra3 = this.resultats_aprenentatge[2]?.nota || 0;
		    const qra4 = this.resultats_aprenentatge[3]?.nota || 0;
		    const qra5 = this.resultats_aprenentatge[4]?.nota || 0;
		    const qra6 = this.resultats_aprenentatge[5]?.nota || 0;
		    const qra7 = this.resultats_aprenentatge[6]?.nota || 0;
		    
		    const qem = this.empresa?.nota || 0;

		    const bloqueRAs = (0.05 * qra1) + 
		                      (0.05 * qra2) + 
		                      (0.15 * qra3) + 
		                      (0.20 * qra4) + 
		                      (0.10 * qra5) + 
		                      (0.10 * qra6) + 
		                      (0.35 * qra7);

            const notaRas = 0.9 * bloqueRAs;
            const notaEmpresa = 0.1 * qem;

		    const qfemp = notaRas + notaEmpresa;

		    return [`${Number(bloqueRAs.toFixed(2))} (${Math.round(bloqueRAs)})`, `${Number(qem.toFixed(2))} (${Math.round(qem)})`, `${Number(qfemp.toFixed(2))} (${Math.round(qfemp)})`];
		}
    },
    {
        "m": "0613_ICC0",
        "nom": "Desenvolupament Web en Entorn Servidor",
        "resultats_aprenentatge": [
            {
                "ra1": "Selecciona les arquitectures i tecnologies de programació web en entorn servidor, analitzant les capacitats i característiques pròpies.",
                "nota": 9.35,
                "nota_final": null
            },
            {
                "ra2": "Escriu sentències executables per un servidor web reconeixent i aplicant procediments d'integració del codi en llenguatges de marques.",
                "nota": 8.1,
                "nota_final": null
            },
            {
                "ra3": "Escriu blocs de sentències embeguts en llenguatges de marques, seleccionant i utilitzant les estructures de programació.",
                "nota": 8.403,
                "nota_final": null
            },
            {
                "ra4": "Desenvolupa aplicacions web embegudes en llenguatges de marques analitzant i incorporant funcionalitats segons especificacions.",
                "nota": 8.124,
                "nota_final": null
            },
            {
                "ra5": "Desenvolupa aplicacions web identificant i aplicant mecanismes per separar el codi de presentació de la lògica de negoci.",
                "nota": 8.124,
                "nota_final": null
            },
            {
                "ra6": "Desenvolupa aplicacions web d'accés a magatzems de dades, aplicant mesures per mantenir la seguretat i la integritat de la informació.",
                "nota": 7.778,
                "nota_final": null
            },
            {
                "ra7": "Desenvolupa serveis web reutilitzables i accessibles mitjançant protocols web, verificant-ne el funcionament.",
                "nota": 9,
                "nota_final": null
            },
            {
                "ra8": "Genera pàgines web dinàmiques analitzant i utilitzant tecnologies i frameworks del servidor web que afegeixin codi al llenguatge de marques.",
                "nota": 9,
                "nota_final": null
            },
            {
                "ra9": "Desenvolupa aplicacions web híbrides seleccionant i utilitzant tecnologies, frameworks servidor i repositoris heterogenis d'informació.",
                "nota": 9,
                "nota_final": null
            },
        ],
        "empresa": {
            "descripcion": "Nota de les practiques realitzat a l'empresa.",
            "nota": 10
        },
        "absencies": 25, 
        "absencies_total": 46,
        calcularQMP() {
		    const qra1 = this.resultats_aprenentatge[0]?.nota || 0;
		    const qra2 = this.resultats_aprenentatge[1]?.nota || 0;
		    const qra3 = this.resultats_aprenentatge[2]?.nota || 0;
		    const qra4 = this.resultats_aprenentatge[3]?.nota || 0;
		    const qra5 = this.resultats_aprenentatge[4]?.nota || 0;
		    const qra6 = this.resultats_aprenentatge[5]?.nota || 0;
		    const qra7 = this.resultats_aprenentatge[6]?.nota || 0;
		    const qra8 = this.resultats_aprenentatge[7]?.nota || 0;
		    const qra9 = this.resultats_aprenentatge[8]?.nota || 0;
		    
		    const qem = this.empresa?.nota || 0;

		    const bloqueRAs = (0.05 * qra1) + 
		                      (0.10 * qra2) + 
		                      (0.10 * qra3) + 
		                      (0.10 * qra4) + 
		                      (0.10 * qra5) + 
		                      (0.10 * qra6) + 
		                      (0.15 * qra7) + 
		                      (0.15 * qra8) + 
		                      (0.15 * qra9);

		    const notaRas = 0.9 * bloqueRAs;
		    const notaEmpresa = 0.1 * qem;

		    const qbemp = notaRas + notaEmpresa;
		    
		    return [`${Number(bloqueRAs.toFixed(2))} (${Math.round(bloqueRAs)})`, `${Number(qem.toFixed(2))} (${Math.round(qem)})`, `${Number(qbemp.toFixed(2))} (${Math.round(qbemp)})`];
		}
    },
    {
        "m": "0614_ICC0",
        "nom": "Desplegament d'Aplicacions Web",
        "resultats_aprenentatge": [
            {
                "ra1": "Implanta arquitectures web analitzant i aplicant criteris de funcionalitat.",
                "nota": 9,
                "nota_final": null
            },
            {
                "ra2": "Implanta aplicacions web en servidors web, avaluant i aplicant criteris de configuració per al funcionament segur.",
                "nota": 10,
                "nota_final": null
            },
            {
                "ra3": "Implanta aplicacions web en servidors d'aplicacions, avaluant i aplicant criteris de configuració per al funcionament segur.",
                "nota": 10,
                "nota_final": null
            },
            {
                "ra4": "Administra servidors de transferència de fitxers, avaluant i aplicant criteris de configuració que garanteixin la disponibilitat del servei.",
                "nota": 7,
                "nota_final": null
            },
            {
                "ra5": "Verifica l'execució d'aplicacions web comprovant els paràmetres de configuració de serveis de xarxa.",
                "nota": 10,
                "nota_final": null
            },
            {
                "ra6": "Elabora la documentació de l'aplicació web avaluant i seleccionant eines de generació de documentació, control de versions i d'integració contínua.",
                "nota": 8,
                "nota_final": null
            },
        ],
        "empresa": {
            "descripcion": "Nota de les practiques realitzat a l'empresa.",
            "nota": 10
        },
        "absencies": 2, 
        "absencies_total": 13,
        calcularQMP() {
		    const qra1 = this.resultats_aprenentatge[0]?.nota || 0;
		    const qra2 = this.resultats_aprenentatge[1]?.nota || 0;
		    const qra3 = this.resultats_aprenentatge[2]?.nota || 0;
		    const qra4 = this.resultats_aprenentatge[3]?.nota || 0;
		    const qra5 = this.resultats_aprenentatge[4]?.nota || 0;
		    const qra6 = this.resultats_aprenentatge[5]?.nota || 0;
		    
		    const qem = this.empresa?.nota || 0;

		    const bloqueRAs = (0.05 * qra1) + 
		                      (0.20 * qra2) + 
		                      (0.20 * qra3) + 
		                      (0.20 * qra4) + 
		                      (0.05 * qra5) + 
		                      (0.20 * qra6);

		    const notaRas = bloqueRAs;
		    const notaEmpresa = 0.10 * qem;

		    const qmp = notaRas + notaEmpresa;

		    return [`${Number(bloqueRAs.toFixed(2))} (${Math.round(bloqueRAs)})`, `${Number(qem.toFixed(2))} (${Math.round(qem)})`, `${Number(qmp.toFixed(2))} (${Math.round(qmp)})`];
		}
    },
    {
        "m": "0616_ICC0",
        "nom": "Projecte Intermodular de Desenvolupament d'Aplicacions Web",
        "resultats_aprenentatge": [
            {
                "ra1": "Projecte guiat.",
                "nota": 7.55,
                "nota_final": null
            },
            {
                "ra2": "Projecte multidisciplinar amb uns requeriments mínims.",
                "nota": 8.20,
                "nota_final": null
            }
        ],
        "absencies": 28, 
        "absencies_total": 39,
        calcularQMP() {
		    const ra1 = this.resultats_aprenentatge[0].nota || 0;
		    const ra2 = this.resultats_aprenentatge[1].nota || 0;

		    const qmp = (0.30 * ra1) + 
		                (0.70 * ra2);
		    
		    return [`${Number(qmp.toFixed(2))} (${Math.round(qmp)})`, `N/A`, `${Number(qmp.toFixed(2))} (${Math.round(qmp)})`];
		}
    },
    {
        "m": "1665_ICC0",
        "nom": "Digitalització Aplicada als Sectors Productius",
        "resultats_aprenentatge": [
            {
                "ra1": "Analitza el concepte de digitalització i la seva repercussió en els sectors productius tenint en compte l'activitat de l'empresa i identificant entorns IT (Information Technology: tecnologia de la informació) i OT (Operation Technology: tecnologia d'operació) característics.",
                "nota": 9,
                "nota_final": null
            },
            {
                "ra2": "Caracteritza les tecnologies habilitadores digitals necessàries per a l'adequació/transformació de les empreses a entorns digitals descrivint les seves característiques i aplicacions.",
                "nota": 9,
                "nota_final": null
            },
            {
                "ra3": "Identifica sistemes basats en cloud/núvol i la seva influència en el desenvolupament dels sistemes digitals.",
                "nota": 9,
                "nota_final": null
            },
            {
                "ra4": "Identifica aplicacions de la IA (intel·ligència artificial) en entorns del sector on està emmarcat el títol descrivint les millores implícites en la seva implementació.",
                "nota": 9,
                "nota_final": null
            },
            {
                "ra5": "Avalua la importància de les dades, així com la seva protecció en una economia digital globalitzada, definint sistemes de seguretat i ciberseguretat tant a nivell d'equip/sistema, com a globals.",
                "nota": 9,
                "nota_final": null
            },
            {
                "ra6": "Desenvolupa un projecte de transformació digital d'una empresa d'un sector relacionat amb el títol, tenint en compte els canvis que s'han de produir en funció dels objectius de l'empresa.",
                "nota": 9,
                "nota_final": null
            },
        ],
        "absencies": 2, 
        "absencies_total": 33,
        calcularQMP() {
		    const ra1 = this.resultats_aprenentatge?.[0]?.nota || 0;
		    const ra2 = this.resultats_aprenentatge?.[1]?.nota || 0;
		    const ra3 = this.resultats_aprenentatge?.[2]?.nota || 0;
		    const ra4 = this.resultats_aprenentatge?.[3]?.nota || 0;
		    const ra5 = this.resultats_aprenentatge?.[4]?.nota || 0;
		    const ra6 = this.resultats_aprenentatge?.[5]?.nota || 0;

		    const qmp = (ra1 + ra2 + ra3 + ra4 + ra5 + ra6) / 6;

		    return [`${Number(qmp.toFixed(2))} (${Math.round(qmp)})`, `N/A`, `${Number(qmp.toFixed(2))} (${Math.round(qmp)})`];
		}
    },
    {
        "m": "1708_ICC0",
        "nom": "Sostenibilitat Aplicada al Sistema Productiu",
        "resultats_aprenentatge": [
            {
                "ra1": "ASG i desenvolupament sostenible.",
                "nota": 10,
                "nota_final": null
            },
            {
                "ra2": "Reptes ambientals i socials.",
                "nota": 10,
                "nota_final": null
            },
            {
                "ra3": "Criteris de sostenibilitat en l'acompliment professional i personal.",
                "nota": 10,
                "nota_final": null
            },
            {
                "ra4": "Productes i Serveis Responsables i Economia Circular.",
                "nota": 10,
                "nota_final": null
            },
            {
                "ra5": "Activitats Sostenibles i Minimització de l'Impacte Mediambiental.",
                "nota": 10,
                "nota_final": null
            },
            {
                "ra6": "Anàlisi d'un pla de sostenibilitat.",
                "nota": 10,
                "nota_final": null
            }
        ],
        "absencies": 25, 
        "absencies_total": 46,
        calcularQMP() {
		    const ra1 = this.resultats_aprenentatge[0].nota || 0;
		    const ra2 = this.resultats_aprenentatge[1].nota || 0;
		    const ra3 = this.resultats_aprenentatge[2].nota || 0;
		    const ra4 = this.resultats_aprenentatge[3].nota || 0;
		    const ra5 = this.resultats_aprenentatge[4].nota || 0;
		    const ra6 = this.resultats_aprenentatge[5].nota || 0;

		    const qmp = (0.10 * ra1) + 
		                (0.10 * ra2) + 
		                (0.30 * ra3) + 
		                (0.10 * ra4) + 
		                (0.10 * ra5) +
		                (0.30 * ra6);
		    
		    return [`${Number(qmp.toFixed(2))} (${Math.round(qmp)})`, `N/A`, `${Number(qmp.toFixed(2))} (${Math.round(qmp)})`];
		}
    },
    {
        "m": "1710_ICC0",
        "nom": "Itinerari Personal per a l'Ocupabilitat II",
        "resultats_aprenentatge": [
            {
                "ra1": "Estratègies per a la cerca de feina\nPlanifica i posa en marxa estratègies en els diferents processos selectius d'ocupació que li permeten millorar les seves possibilitats d'inserció laboral.",
                "nota": 9,
                "nota_final": null
            },
            {
                "ra2": "Competències per a l'ocupabilitat\nAplica estratègies relacionades amb les competències personals, socials i emocionals per al desenvolupament de la seva iniciativa emprenedora i la millora de la seva ocupabilitat.",
                "nota": 9,
                "nota_final": null
            },
            {
                "ra3": "Innovació i Emprenedoria\nPosa en pràctica les habilitats emprenedores necessàries per al desenvolupament de processos d'innovació i recerca aplicades que promouen la modernització del sector productiu cap a un model sostenible.",
                "nota": 8,
                "nota_final": null
            },
            {
                "ra4": "Idees emprenedores i Noves oportunitats\nIdentifica, defineix i valida idees d'emprenedoria generadores de noves oportunitats a partir d'estratègies d'anàlisi de l'entorn socioproductiu utilitzant metodologies àgils per l'emprenedoria.",
                "nota": 10,
                "nota_final": null
            },
            {
                "ra5": "El Projecte emprenedor\nDesenvolupa un projecte emprenedor d'innovació social i/o tecnològica aplicada en col·laboració amb l'entorn.",
                "nota": 9,
                "nota_final": null
            }
        ],
        "absencies": 7, 
        "absencies_total": 13,
        calcularQMP() {
		    const ra1 = this.resultats_aprenentatge[0].nota || 0;
		    const ra2 = this.resultats_aprenentatge[1].nota || 0;
		    const ra3 = this.resultats_aprenentatge[2].nota || 0;
		    const ra4 = this.resultats_aprenentatge[3].nota || 0;
		    const ra5 = this.resultats_aprenentatge[4].nota || 0;

		    const qmp = (0.15 * ra1) + 
		                (0.15 * ra2) + 
		                (0.15 * ra3) + 
		                (0.15 * ra4) + 
		                (0.40 * ra5);
		    
		    return [`${Number(qmp.toFixed(2))} (${Math.round(qmp)})`, `N/A`, `${Number(qmp.toFixed(2))} (${Math.round(qmp)})`];
		}
    },
    {
        "m": "ml",
        "nom": "Mòdul Profesional Optatiu + Machine Learning",
        "resultats_aprenentatge": [
            {
                "ra1": "Crea aplicacions fent ús de models d'aprenentatge automàtic",
                "nota": 9,
                "nota_final": null
            }
        ],
        "absencies": 16, 
        "absencies_total": 26,
        calcularQMP() {
		    const ra1 = this.resultats_aprenentatge[0].nota || 0;

		    const qmp = ra1;
		    
		    return [`${Number(qmp.toFixed(2))} (${Math.round(qmp)})`, `N/A`, `${Number(qmp.toFixed(2))} (${Math.round(qmp)})`];
		}
    }
];

moduls_ras.forEach(modul => {
    modul.resultats_aprenentatge.forEach(ra => {
        ra.nota_final = Number.isFinite(ra.nota)
            ? Math.round(ra.nota)
            : null;
    });
});

const crearNavegacioModuls = function() {
    const navegacio = document.getElementById('navegacioModuls');
    if (!navegacio) return;

    moduls_ras.forEach((modul, index) => {
        const boto = document.createElement('button');
        boto.classList.add('tab-modul');
        boto.setAttribute('data-modul', modul.m);
        
        const codiCurt = modul.m.split('_')[0];
        boto.textContent = codiCurt;
        
        boto.addEventListener('click', () => canviarModulActiu(modul.m));
        
        navegacio.appendChild(boto);
    });
};

const renderitzarTaulaRAs = function(codiModul) {
    const taula = document.getElementById('taulaRas');
    const titol = document.getElementById('titolModul');
    const contenidor = document.querySelector('.contenidor-taula');
    
    if (!taula || !titol) return;
    
    taula.innerHTML = '';
    
    const existingResum = document.getElementById('taulaResum');
    if (existingResum) existingResum.remove();
    
    const modul = moduls_ras.find(m => m.m === codiModul);
    if (!modul) return;
    
    titol.textContent = `${modul.nom} (${modul.m})`;
    
    if (modul.resultats_aprenentatge.length === 0) {
        const filaBuida = document.createElement('tr');
        const celdaBuida = document.createElement('td');
        celdaBuida.setAttribute('colspan', '3');
        celdaBuida.classList.add('sense-dades');
        celdaBuida.textContent = 'No hi ha resultats d\'aprenentatge disponibles';
        filaBuida.appendChild(celdaBuida);
        
        const tbody = document.createElement('tbody');
        tbody.appendChild(filaBuida);
        taula.appendChild(tbody);
        return;
    }
    
    // Capçalera de la taula
    const thead = document.createElement('thead');
    const filaCapçalera = document.createElement('tr');
    
    const capçaleraRA = document.createElement('th');
    capçaleraRA.textContent = 'RA';
    
    const capçaleraDescripcio = document.createElement('th');
    capçaleraDescripcio.textContent = 'Descripció';
    
    const capçaleraNota = document.createElement('th');
    capçaleraNota.textContent = 'Nota';

    filaCapçalera.appendChild(capçaleraRA);
    filaCapçalera.appendChild(capçaleraDescripcio);
    filaCapçalera.appendChild(capçaleraNota);
    thead.appendChild(filaCapçalera);
    taula.appendChild(thead);
    
    // Cos de la taula amb els resultats d'aprenentatge
    const tbody = document.createElement('tbody');
    
    modul.resultats_aprenentatge.forEach((ra, index) => {
        const fila = document.createElement('tr');
        
        const celdaRA = document.createElement('td');
        celdaRA.classList.add('columna-ra');
        celdaRA.setAttribute('data-label', 'RA');
        celdaRA.textContent = `RA${index + 1}`;
        
        const celdaDescripcio = document.createElement('td');
        celdaDescripcio.classList.add('columna-descripcio');
        celdaDescripcio.setAttribute('data-label', 'Descripció');
        celdaDescripcio.textContent = ra[`ra${index + 1}`];
        
        const celdaNota = document.createElement('td');
        celdaNota.classList.add('columna-nota');
        celdaNota.setAttribute('data-label', 'Nota');
        
        const nota = ra.nota;
        const notaFinal = ra.nota_final;
        
        if (nota === null && notaFinal === null) {
            celdaNota.textContent = 'Pendent';
            celdaNota.classList.add('pendent');
        } else {
            celdaNota.textContent = `${nota ?? ''} (${notaFinal ?? ''})`;
        }

        fila.appendChild(celdaRA);
        fila.appendChild(celdaDescripcio);
        fila.appendChild(celdaNota);
        
        tbody.appendChild(fila);
    });
    
    taula.appendChild(tbody);

    // Taula de resum independent
    const resultats = modul.calcularQMP();
    const taulaResum = document.createElement('table');
    taulaResum.classList.add('taula-resum');
    taulaResum.id = 'taulaResum';

    const tfootResum = document.createElement('tfoot');
    tfootResum.classList.add('resum-modul');

    const filaCapResum = document.createElement('tr');
    filaCapResum.classList.add('resum-capçalera');

    const thModul = document.createElement('th');
    thModul.textContent = 'Mòdul';
    const thEmpresa = document.createElement('th');
    thEmpresa.textContent = 'Empresa';
    const thFinal = document.createElement('th');
    thFinal.textContent = 'Final';
    const thAbsencies = document.createElement('th');
    thAbsencies.textContent = 'Absències';

    filaCapResum.appendChild(thModul);
    filaCapResum.appendChild(thEmpresa);
    filaCapResum.appendChild(thFinal);
    filaCapResum.appendChild(thAbsencies);
    tfootResum.appendChild(filaCapResum);

    const filaResum = document.createElement('tr');

    const celdaNotaModul = document.createElement('td');
    celdaNotaModul.setAttribute('data-label', 'Mòdul');
    celdaNotaModul.classList.add('columna-nota-modul');
    celdaNotaModul.textContent = resultats[0];

    const celdaNotaEmpresa = document.createElement('td');
    celdaNotaEmpresa.setAttribute('data-label', 'Empresa');
    celdaNotaEmpresa.classList.add('columna-nota-empresa');
    celdaNotaEmpresa.textContent = resultats[1];

    const celdaNotaFinal = document.createElement('td');
    celdaNotaFinal.setAttribute('data-label', 'Final');
    celdaNotaFinal.classList.add('columna-nota-final');
    celdaNotaFinal.textContent = resultats[2];

    const celdaAbsencies = document.createElement('td');
    celdaAbsencies.setAttribute('data-label', 'Absències');
    celdaAbsencies.classList.add('columna-absencies-total');
    celdaAbsencies.textContent = `${modul.absencies} / ${modul.absencies_total}`;

    filaResum.appendChild(celdaNotaModul);
    filaResum.appendChild(celdaNotaEmpresa);
    filaResum.appendChild(celdaNotaFinal);
    filaResum.appendChild(celdaAbsencies);
    tfootResum.appendChild(filaResum);

    taulaResum.appendChild(tfootResum);

    if (contenidor) contenidor.appendChild(taulaResum);
};

const canviarModulActiu = function(codiModul) {
    const tabs = document.querySelectorAll('.tab-modul');
    tabs.forEach(tab => {
        if (tab.getAttribute('data-modul') === codiModul) {
            tab.classList.add('actiu');
        } else {
            tab.classList.remove('actiu');
        }
    });
    
    renderitzarTaulaRAs(codiModul);
};

const inicialitzarApp = function() {
    crearNavegacioModuls();
    canviarModulActiu('0612_ICC0');
}

document.addEventListener('DOMContentLoaded', inicialitzarApp);
