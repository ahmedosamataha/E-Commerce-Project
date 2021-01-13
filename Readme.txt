To run the code you need Node js (tested on VS code), MySQL server and preferably MySQL workbench,
as well as internet connection (for the styling of the bootstrap).

The links to the required programs:

VS code:
to download: https://code.visualstudio.com/download
to install: https://www.youtube.com/watch?v=JGsyJI8XG0Y

Node js:
to download: https://nodejs.org/en/download/
to install: https://www.youtube.com/watch?v=eauREi0vwB0

MySQL: (remember to configure the root username to "root" and the password to "000" (without the quotes)
to download: https://dev.mysql.com/downloads/
to install: https://www.youtube.com/watch?v=u96rVINbAUI&t=7s

on MySQL server, you need to set up as follows:
	root username: root
	password: 0000
and a create a schema with the name "sw-project"
(otherwise you need to modify these attributes in /database/init.js to your environment)

To run the code
	1- make sure that MySQL is running and configured as mentioned earlier, otherwise open MySQL workbench and from menu bar 
	   choose server --> startup/shutdown --> start server
	2- right clink on schemas, choose "create schema", and name it "sw-project"
	3- open the project folder with VS code
	4- in the terminal, write the command "npm install --also=dev" (without the quotes) to install the dependencies packages. 
	   (you should not need this step, as the packages exist in node_modules files, but just to be on the safe side)
	5- write either command "node app" or "npm start" (without the quotes) to run the server. (or "npm test" to run the tests)
	6- open your favourite browser and go to 'localhost:3000' to use the server

as mentioned before, you need internet connection, otherwise the pages will be viewed without styling.
