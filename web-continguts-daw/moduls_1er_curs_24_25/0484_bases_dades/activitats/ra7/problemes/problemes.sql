-- Problema 1
-- Mostra el nombre total de pokemons que hi ha a la col·lecció
db.pokedex2.countDocuments()

-- Problema 2
-- Mostra la informació del pokemon amb número (num) 25
db.pokedex2.find(
	{
		num: 25
	}
)

-- Problema 3
-- Mostra només el nom (name) del pokemon amb número 25
db.pokedex2.find({num: 25}, {_id: 0, name: 1})

-- Problema 4
-- Mostra el nom dels pokemon amb número entre el 100 i el 110
db.pokedex2.find(
	{$and: [
			{num: {$gte:100}},
			{num: {$lte:110}}
		]
	}
)

-- Problema 5
-- Mostra el nom dels pokemon amb número entre el 100 i el 110 ordenats per nom
db.pokedex2.find(
	{$and: [
			{num: {$gte:100}},
			{num: {$lte:110}}
		]
	}, {_id: 0, name: 1}
).sort({name: 1})

-- Problema 6
-- Mostra el nom dels pokemon amb número entre el 100 i el 110 ordenats per nom en ordre decreixent
db.pokedex2.find(
	{$and: [
			{num: {$gte:100}},
			{num: {$lte:110}}
		]
	}, {_id: 0, name: 1}
).sort({name: -1})

-- Problema 7
/* Mostra el nom, espècie i tipus dels pokèmon que el nom contingui
“ord” independentment de majúscules i minúscules, per exemple, si
hi haguès un pokemon amb nom Jordi hauria d’aparèixer */
db.pokedex2.find(
	{
	}, {_id: 0, name: 1, specie: 1, types: 1}
)