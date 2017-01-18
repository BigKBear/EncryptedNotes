/*
The JS file for database
*/
//function encrypted(){
var app={
	//Application constructor
	initialize:function() {
		this.bindEvents();
	},
	
	bindEvents:function(){
		document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener('DOMContentLoaded', this.onDeviceReady);    
		if ('addEventListener' in document) {
		    document.addEventListener('DOMContentLoaded', function() {
		        FastClick.attach(document.body);
		    }, false);
		}
        /*var submitbutton = document.getElementById("submitBtn");
        if(submitbutton){
          submitbutton.addEventListener("click", function(){  //write for update too
                /*app.checkForPassword();
                window.location='../index.html';
            });
        }*/

		document.getElementById("submitBtn").addEventListener("click", function(){  //write for update too
			var password = localStorage.getItem('appPsss21');
             var inputValue = document.getElementById("userPassword").value;
            if (password) {
                //check that the entered value is smae as the saved password
                if(inputValue === password){
                    window.location='../index.html';
                }
                //check that the entered password is the same as the one saved
                alert("check");
            }else{
                document.getElementById("userPassword").placeholder = "please create a password...";
                //Save the entered value as the password
                alert("value to be saved as password is: "+inputValue);
                localStorage.setItem('appPsss21',inputValue);
                window.location='../index.html';
            }
		});
		
	},
	
	onDeviceReady:function(){
        //Checks to see if the user has already created a password
		app.checkForPassword();
	},

    checkForPassword: function() {
        var password = localStorage.getItem('appPsss21');
        alert(password);
        if (password == null) {
            //ask for password to enroll
            document.getElementById("userPassword").placeholder = "please create a password...";
            //window.location = 'templates/passwordPage.html';
        }else{
            document.getElementById("userPassword").placeholder = "Enter your password ...";
        }
    },

    createNewPassword: function() {
        document.getElementById("userPassword").placeholder = "please create a password...";
       
        if(inputValue){
            alert(inputValue);    
        }else{
            alert("no value");
        }
        
        //localStorage.setItem('appPsss21',inputValue);
        /*
        swal({
            title: "Please enter your password before saving your details !!",
            text: "",
            input: "password",
                confirmButtonText: 'Submit',
                inputPlaceholder: "enter your password",
                inputAttributes: {
                    'maxlength': 10,
                    'autocapitalize': 'off',
                    'autocorrect': 'off'
                },
                inputValidator: function(value) {
                    return new Promise(function(resolve, reject) {
                      if (value) {
                        resolve();
                      } else {
                        reject("Password field can't be blank");
                      }
                    });
                  }
        }).then(function(inputValue) {
            /*if (inputValue === false) {
                //alert("cancelled");
                return false;
            }
            if (inputValue === "") {
                swal.showInputError("Password field can't be blank");
                return false
            }
            localStorage.setItem('appPsss21',inputValue);
            app.checkForPassword();
            swal.close();
        }, function(dismiss) {
              // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
              if (dismiss === 'cancel') {
               // swal.close();
             /*   swal(
                  'Cancelled',
                  'not opening note',
                  'error'
                )
              }
            });*/
    },//end of createNewPasswordForInsert

	/*checkForPassword : function() {        
		var ul = document.getElementById("fetchedValuesList"); //get the UI elements from the HTML
        ul.innerHTML = ""; //Clears all existing elements to avoid duplicate entries
        var len = results.rows.length;
        var selectedIndex = 0;
        //outer for loop to populate the list in the search box
        for (var i = 0; i < len; i++) {
            if (results.rows.item(i).topic.length > 0) {
                var li = document.createElement("li"); //create list elements 
                li.setAttribute("class", "collection-item");
                li.appendChild(document.createTextNode(results.rows.item(i).topic)); // add the data to the list element
                ul.appendChild(li); //add the list to UL 
            }
        }
		$('ul').children('li').on('click', function() {
            selectedIndex = $(this).index();
            var selectedKey = $(this).text();
            var type = "password";
            if (pwc > 3) {
                type = "text";
            }

            swal({
                title: "Enters Encryption Password to Decrypt",
                text: "",
                input: type,
                confirmButtonText: 'Submit',
                inputPlaceholder: "enter your password",
                inputAttributes: {
                    'maxlength': 10,
                    'autocapitalize': 'off',
                    'autocorrect': 'off'
                },
                inputValidator: function(value) {
                    return new Promise(function(resolve, reject) {
                      if (value) {
                        resolve();
                      } else {
                        reject("Password field can't be blank");
                      }
                    });
                  }
            }).then(function(inputValue) {
                var pwd = localStorage.getItem('appPsss21');
                if (inputValue === pwd) {
                    localStorage.setItem('incorrectpwd', 0);
                    window.location.href = "templates/createnotes.html?msg=view" + selectedKey;
                    swal.close();
                } else {
                    pwc++;
                    localStorage.setItem('incorrectpwd', pwc);
                    if (pwc < 6) {
                        swal({
                            title: 'You have entered an Incorrect password!',
                            text: 'Please try again \n Attempt Number - ' + pwc,
                            type: 'warning',
                            confirmButtonText: 'OK'
                        });
                        //alert("You have entered an Incorrect password!" + "\n" + "Please try again" + "\n" + "Attempt Number - " + pwc);
                    }else if (pwc == 6) {
                        swal({
                            title: 'LAST ATTEMPT!',
                            text: 'All data will be wiped if incorrectpwd is entered again!',
                            type: 'warning',
                            confirmButtonText: 'OK'
                        });
                        //alert("LAST ATTEMPT! \n All data will be wiped if incorrectpwd is entered again");
                    }else if (pwc > 6) {
                        //alert("LAST ATTEMPT! \n All data will be wiped if incorrectpwd is entered again");
                        db.transaction(function(tx) {
                            tx.executeSql('DELETE FROM topics');
                        });
                        localStorage.setItem('incorrectpwd', 0);
                        location.reload();
                        type = "password";
                        swal({
                            title: 'DELETED!',
                            text: 'All data has been wiped!',
                            type: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                    //swal.close();
                }
            }, function(dismiss) {
              // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
              if (dismiss === 'cancel') {
               // swal.close();
             /*   swal(
                  'Cancelled',
                  'not opening note',
                  'error'
                )
              }
            });
        });
	},*/
};
app.initialize();