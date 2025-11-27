# Barkly Co.
###  *"Un gran perro, conlleva una gran responsabilidad."*

## Descripción
Una página que permite contratar superheroes que se postulan como cuidadores/entrenadores de perros, donde el usuario puede acceder al catalogo completo, con el fin de encontrar el cuidador ideal para su perro. Al momento de la elección, el usuario cuenta con un servicio de reseñas para evaluar el desempeño del superheroe calificado por anteriores clientes. Los superheroes tienen distintas caracteristicas y experiencia, que determinan la relación con el perro del cliente. Los clientes pueden contratar tantos cuidadores como cantidad de perros. Los superheroes venden distintos paquetes, los cuales son determinados por sus cualidades y la cantidad de actividades que pueda ofrecer, deben ofrecer minimo 1 y como maximo 3.

## Objetivo
El objetivo general de la página será encontrar el superheroe ideal para el fiel compañero. 

Como cliente podrás elegir entre todos los superheroes que se postulen. La página se encargará de que tengas la información necesaria para seleccionar el que más sea acorde a tus necesidades (caracteristicas y precio)

Como superheroe podes ofrecer (¡y mostrarle al mundo!) tus servicios como cuidador y entrenador de perros.

# Entidades
## Usuarios
| ID | Nombre Perfil | Contraseña | Nombre Completo | Cantidad de Perros | Paquetes Comprados |
|:--:|:-------------:|:----------:|:---------------:|:------------------:|:------------------:|

## Superheroes
| ID | Nombre | Franquicia | Experiencia | Poderes | Paquetes Ofrecidos |
|:--:|:------:|:----------:|:-----------:|:-------:|:------------------:|

## Perros
| ID | ID Usuario | ID Entrenador | Nombre | Edad | Raza |
|:--:|:----------:|:-------------:|:------:|:----:|:----:|

# Tablas
## Reseñas
| ID | ID Usuario | ID Superheroe | ID Perro | Calificación | Comentario |
|:--:|:----------:|:-------------:|:--------:|:------------:|:----------:|

## Paquetes
| ID | ID Superheroe | Nombre Paquete | Descripción | Precio |
|:--:|:-------------:|:--------------:|:-----------:|:------:|

## Razas
| ID | Nombre | Tamaño | Temperamento | Fortaleza | Velocidad | Color Predominante |
|:--:|:------:|:------:|:------------:|:---------:|:---------:|:------------------:|
