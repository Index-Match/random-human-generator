# Random human generator
This code utilises ANSUR 1988 anthropometric data to generate random human beings.
(Please note that this is for fun, and is not a substitute for using real anthropometric data if designing products for safety, e.g. car seats, air bags, restraints, and so on.)

# How does it work
The HTML file contains the data, and the canvas to draw the person on.
The Javascript file takes the data from the HTML file, processes it, then draws on to the HTML canvas.

# Further development
- More data! ANSUR only covers USA army personnel, which (considering you must be a minimum fitness to join) isn't a true representation of any civilian population.
- Faces! I'm having some difficulty locating good facial landmark data, however.
- Colours are currently arbitrary, with no generation of: freckles, moles, birthmarks. The only extra it rolls for is albinism, with a 1 in 17000 chance.
- Currently there's no way to roll for conditions (e.g. polydactyly, dwarfism, gigantism, cleft lip, birthmarks, sunburn) which makes this human being generator not very inclusive at the moment.
