# Ejercicios — Git i GitHub

## 00_02_Hola_Git

###########################

Una breu presentació de mi mateix incloent per a què estic fent aquest curs.

## Les meves dades

El meu nom és «Jeiron»

El meu usuari a GitHub és «JeironEC»

El nom del meu repositori a GitHub és  «introprg»

## Els meus coneixements previs

La meva experiència amb la programació és «Amb la programació tinc un aprenentatge extens, però per coses de la vida no pot seguir practicant perqué la programació no se tracta de formar-se únicament, cal practicar molt per aconseguir ser un bon programador.».

Nota: com a mínim hauràs programat la rentadora, o fregit un ou, no?

## Per què estic aquí?

Estic fent aquest cicle perquè «Perquè com dieu anteriorment, ja m'havia format en un tècnic de disseny i creació de sistemes, creant sistemes amb python i els frameworks flask i django, no vaig obtenir el títol perquè em vaig fer 6 mesos de pràctica en empreses i prendre l'evaluació final, però havia de venir per ací i no vaig culminar. I és per això que estic fent aquest cicle per seguir formant-me»

## Per a què estic aquí?

Un cop hagi aprovat aquesta assignatura espero ser capaç de «Vull ser capaç de realitzar programes i obtener els coneixements necessaris per propulsar-me a ser un bon programador.».

## Altres coses

Ara que "tinc el micro", t'explicaré que «De petit no volia ser programador. Volia ser arquitecte, però en passar els anys em vaig adonar que no era el meu, que era la tecnologia.»

## 00_03_Resum_de_comandes

#########################

====================================   ================================================================================================
Comandes                               Descripció
====================================   ================================================================================================
$ mkdir "nombre"                       Crea una carpeta.
$ cd                                   Canvia el directori actual.
$ cat "fitxer"                         Mostra el contingut del fitxer indicat.
$ gedit "fitxer"                       Crea o edita fitxers.
$ ls                                   Mostra el contingut de la carpeta actual.
$ rm "fitxer"                          Elimina fitxer.
$ git init                             Permet inicialitzar un repositori git.
$ git clone                            Permet clonar un repositori des de GitHub.
$ git status                           Mostra el canvis realitzat en el repositori.
$ git add                              Permet guardar canvis en l'àrea de treball.
$ git commit                           Permet confirmar els canvis guardat, acompanyat d'un missatge descriptiu.
$ git push                             Envia els canvis "commit" des de el repositori local fins al remot.
$ git pull                             Actualitza el repositori local quan hi ha canvis en el repositori remot.
$ git log                              Mostra tots els commit enviats al repositori.
$ git config                           Permet configurar git.
$ git diff                             Permet veure les diferències en els canvis actuals del repositori.
$ git restore --staged                 Permet remover arxius que s'hagin agregat en l'área de treball per error.
$ git config pull.rebase               Configura si les operacions de git pull han de fer rebase en comptes de merge por defecte.
$ git config pull.merge                Configura l'estratègia de merge utilitzada durant un git pull .
$ git branch                           Llista totes les branques locals.
$ git branch -a                        Llista totes les branques, incloent-hi les locals i les remotes.
$ git branch -d "nombre"               Elimina una branca local, però només si s'ha fusionat completament.
$ git branch -D "nombre"               Força l'eliminació d'una branca local, independentment de si s'ha fusionat o no
$ git checkout "nombre"                Canvia a una branca específica.
$ git checkout -b "nombre"             Crea una nova branca local i canvia a ella.
$ git checkout -b "nombre" "origen"    Crea una nova branca basada en una altra referència (ex, branca remota).
$ git reset --hard "referència"        Restaura l'estat del repositori al punt especificat, descartant tots els canvis locals.
$ git symbolic-ref HEAD "referència"   Redirigeix el punter HEAD per apuntar a una branca o referència concreta.
$ git fetch --all --prune              Baixa totes les referències del repositori remot i elimina les referències absolotes locals.
$ git push origin --delete "nombre"    Elimina una branca remota del repositori.
$ git ls-remote "origen"               Llista totes les referències del repositori remot, incloent-hi branques i etiquetes.
$ git log --oneline --all              Mostra un historial de tots els commits, de forma compacta, incloent-hi els de branques remotes.
====================================   ================================================================================================
