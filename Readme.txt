To run the code you need Node js (tested on VS code), MySQL server,
as well as internet connection (for the styling of the bootstrap).


on MySQL server, you need to set up as follows:
	root username: root
	password: 0000
and a create a schema with the name "sw-project"
(otherwise you need to modify these attributes in /database/init.js to your specifications)

on VS code, 
	1- open the project folder with VS code
	2- run the command "node install --also=dev" (without the quotes) to install the dependencies packages.
	3- run either command "node app" or "node start" (without the quotes) to run the server.
	4- open your favourite browser and go to 'localhost:3000'

as mentioned before, you need internet connection, otherwise the pages will be viewed without styling.
