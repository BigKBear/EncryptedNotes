/*

The JS file for database

*/
//function encrypted(){
var SECRET_PHRASE = "venkatencryption";
var db;
var pwc = 0;

swal.setDefaults({
    showCancelButton: true,
    allowOutsideClick: false,
    animation: true,
    width: '100%',
    height: '100%'
});

var app = {
    initialize: function() {
        this.bindEvents();
        this.checkForPassword();
        this.checkForInvalidPasswordAttempts();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('DOMContentLoaded', this.onDeviceReady);
        if ('addEventListener' in document) {
            document.addEventListener('DOMContentLoaded', function() {
                FastClick.attach(document.body);
            }, false);
        }
        $("#search").keyup(function() { // If nothing needed for this function ".keyup(null)"
            // Retrieve the input field text and reset the count to zero
            var filter = $(this).val(),
                count = 0;
            // Loop through the comment list
            $("ul li").each(function() {
                // If the list item does not contain the text phrase fade it out 
                if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                    $(this).hide(); // Show the list item if the phrase matches and increase the count by 1
                } else {
                    $(this).show();
                    count++;
                }
            });
        });
    },
    /**
     * this method checks the user has password saved in the local or not.   
     * If so, it proceeds,else it prompts alert to enter password and saves in local
     */
    checkForPassword: function() {
        var password = localStorage.getItem('appPsss21');
        if (password == null) {
            //ask for password to enroll
            /*app.createNewPassword();*/
            window.location = 'templates/passwordPage.html';
        }
    },
    checkForInvalidPasswordAttempts: function() {
        var count = localStorage.getItem('incorrectpwd');
        if (count != null) {
            pwc = parseInt(count);
        }
    },

    /** 
     * method to create new password
     */
    createNewPassword: function() {
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
            }*/
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
                )*/
              }
            });
    },//end of createNewPasswordForInsert

    showPopup: function() {
        swal({
            title: "Please enter password",
            text: "",
            input: "text",
            showCancelButton: true,
            closeOnConfirm: false,
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
        }, function(inputValue) {
            if (inputValue === false) {
                //alert("cancelled");
                return false;
            }
            if (inputValue === "") {
                swal.showInputError("Password field can't be blank");
                return false
            }
            alert("enter");
            swal.close();
        });
    },
    onDeviceReady: function() {
        $('#clickMe').click(function() {
            app.showPopup();
        });
        $("#fab-clicked").click(function() { 
            //write for update too
            window.location = 'templates/createnotes.html';
        });
        app.initDB();
        document.addEventListener("backbutton", app.onBackKeyDown, true);
    },
    onBackKeyDown: function(e) {
        //do nothing, it will stand in same place.
		//alert("Application is closing");
		navigator.app.exitApp();
    },
    initDB: function() {
        db = openDatabase('test', '1.0', 'Test DB', 2 * 1024 * 1024);
        if (!localStorage.getItem('dbCreated-USERS')) {
            this.createDB();
        } else {
            this.fetchedValuesList();
        }
    },
    createDB: function() {
        localStorage.setItem('dbCreated-USERS', true);
        db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS topics (topic unique, desc)');

        });
    },
    fetchedValuesList: function() {
        db.transaction(function(tx) {
            //tx.executeSql('DELETE FROM topics');
			tx.executeSql('CREATE TABLE IF NOT EXISTS topics (topic unique, desc)');//user manually delete the table table recreate auto
            tx.executeSql('SELECT * FROM topics', [], app.successCB, app.errorCB);
        });
    },
    successCB: function(tx, results) {
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
            /*password page*/
            /*window.location = 'templates/createnotes.html';*/

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
            });//end of the .then function
        });//end of item in list clicked
    },

    errorCB: function(e) {
        alert('error creating table');
    }
};

app.initialize();