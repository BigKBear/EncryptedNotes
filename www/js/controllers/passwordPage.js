/*
The JS file for database
*/
//function encrypted(){
var SECRET_PHRASE = "venkatencryption";
var db;
var i=0;
var app={
	//Application constructor
	initialize:function() {
		this.bindEvents();
	},
	
	bindEvents:function(){
        alert("Hmm");
		document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener('DOMContentLoaded', this.onDeviceReady);    
		if ('addEventListener' in document) {
		    document.addEventListener('DOMContentLoaded', function() {
		        FastClick.attach(document.body);
		    }, false);
		}
		document.getElementById("submitBtn").addEventListener("click", function(){  //write for update too

			//app.checkForPassword();
			window.location='index.html';
		});
		
	},
	
	onDeviceReady:function(){
		console.log("Details of topics page triggered");
		app.initDB();
		app.checkForFlow();
	},

	initDB:function(){
		db = openDatabase('test', '1.0', 'Test DB', 2 * 1024 * 1024);
		if(!localStorage.getItem('dbCreated-USERS')){
		this.createDB();
		 }
	},

	checkForPassword : function() {
        
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
                )*/
              }
            });
        });
	},

	successCB:function(tx,results){
	  
	  var ul = document.getElementById("fetchedValuesList");//get the UI elements from the HTML
	  ul.innerHTML = "";//Clears all existing elements to avoid duplicate entries
	    
      var len = results.rows.length;
        for (var i=0; i<len; i++){
            //alert('inside for');
			var li = document.createElement("li");//create list elements
			li.appendChild(document.createTextNode(decryptedVl.toString(CryptoJS.enc.Utf8)));// add the data to the list element
			ul.appendChild(li);//add the list to UL
        }
		$("#fetchedValuesList li").on('click', function(e) {
			//alert('inside fetchedvalue');
			openIndividualEle($(this)[0].innerHTML);
		});
    },

	openIndividualEle:function(ele)  {
		//alert('clicked element --------   '+ele);
	},
    
	errorCB:function(e){
	  alert('error creating table');
    }
};
app.initialize();
