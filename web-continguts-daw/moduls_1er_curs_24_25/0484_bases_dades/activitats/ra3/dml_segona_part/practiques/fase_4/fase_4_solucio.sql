/* *****************************************************
  INSTITUT TIC de Barcelona
    CFGS DAM i DAW
    Mòdul: 0484 Bases de dades. 
    AUTORS: Jordi Quesada
    DATA: 
****************************************************** */

-- Problema 1

SELECT  ciutat, 
		a.nom AS aeroport, 
		v.data, 
		v.codi
FROM vol v
JOIN aeroport a ON v.aeroport_origen = a.codi
where 
		v.data between '2024-02-01' and '2024-02-29' 
		and durada<40 
		and descripcio='DELAYED' 
order by ciutat, data;

-- Problema 2
SELECT 	any_fabricacio as any, 
		c.nom AS companyia, 
		av.num_serie, 
		tipus
FROM avio av
		JOIN companyia c ON av.companyia = c.nom 
where 
		c.pais='Spain' 
		and any_fabricacio<2000
order by 
		any_fabricacio desc, companyia, num_serie;



-- Problema 3
SELECT 	
		v.codi, 
		v.data, 
		concat(pe.cognom, ', ', pe.nom, ' (',p.hores_vol,')') as pilot, 
		a.companyia
FROM vol v JOIN pilot p on v.pilot=p.num_empleat
     join personal pe on p.num_empleat=pe.num_empleat
	 join avio a on v.avio=a.num_serie
where 
		pe.sou>53000 and 
		year(v.data) = 2024 and month(v.data)=2 and 
		descripcio='DELAYED' and 
		p.hores_vol>7000
order by 
		companyia, data, codi;



-- Problema 4
SELECT concat (p.cognom, ', ', p.nom) as passatger, concat(pe.cognom, ', ', pe.nom) as hostessa, aeroport_origen, aeroport_desti, durada
FROM passatger p
JOIN volar vr ON p.passaport = vr.passatger
JOIN vol v ON vr.vol = v.codi
JOIN hostessa h on v.hostessa=h.num_empleat
     join personal pe on h.num_empleat=pe.num_empleat
where data='2023-12-25' and adreca like '%Madrid%'
order by passatger;


-- Problema 5
SELECT v.codi, 
		concat(ao.nom, ' (',ao.ciutat, ')') AS origen, 
		concat(ad.nom, ' (',ad.ciutat, ')') AS desti
FROM vol v
		JOIN aeroport ao ON v.aeroport_origen = ao.codi
		JOIN aeroport ad ON v.aeroport_desti = ad.codi
where durada >160 and year(data)=2024 and ao.ciutat like '__o%' and ad.ciutat like '__o%'
order by v.codi;


-- Problema 6
SELECT 	
		c.nom, c.filial_de, 
		concat(pe1.cognom, ', ', pe1.nom) as pilot, 
		concat(pe2.cognom, ', ', pe2.nom) as hostessa
FROM vol v JOIN pilot p on v.pilot=p.num_empleat
		join personal pe1 on p.num_empleat=pe1.num_empleat
		JOIN hostessa h on v.hostessa=h.num_empleat
		join personal pe2 on h.num_empleat=pe2.num_empleat
		join avio a on v.avio=a.num_serie
		join companyia c on a.companyia=c.nom
where any_fabricacio = 2008 and filial_de is not null
	order by pilot, hostessa ;



-- Problema 7
select c.nom, coalesce(m.nom, '-') as mare
from companyia c left outer JOIN companyia m on c.filial_de=m.nom
order by c.nom;

-- Problema 8
-- Atenció no es pot fer en el where, el primer filtre s'ha de fer en el join on
SELECT aeroport.nom, aeroport.pais, coalesce(vol.codi, 'Sense vol') as vol
FROM aeroport LEFT OUTER JOIN vol 
ON vol.aeroport_origen = aeroport.codi 
   AND vol.durada > 200 
   AND vol.data BETWEEN '2024-01-01' AND '2024-01-10'
WHERE aeroport.nom LIKE '%Z%' and char_length(pais)<15
order by pais, nom;



