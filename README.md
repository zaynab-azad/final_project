# Welcome to final_project repository!

Hi! this project is communication between department and student for their final project


# installation

 

 - `npm i`	( <= this is for installing all dependence(package) of our project.
 - `npm i -g nodemon` (<= this is for restarting our server every time when we make change)
 - go to browser and type localhost:5000/admin

## add new Top-Admin manually

please make sure to create ***top admin*** manually, because if you don't do that you cant do anything with this project ..
 

-**add new Top admin**

 - Download [***postman***](https://www.postman.com/downloads/) to make request .
 - make POST request for this route: `/admin/top-admin/add-top-admin`
 - insert the following data in the body:
		  {
					 `` "fullName" :  "example", 
						"email":  "example@example.com", 
						"password":  "...",
						``
		 }  
### make sure to use [***mongodb compass***](https://www.mongodb.com/try/download/compass)  to view your data
 
