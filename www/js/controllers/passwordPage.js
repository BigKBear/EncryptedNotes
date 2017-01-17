var SECRET_PHRASE = "venkatencryption";
var db;
var pwc = 0;

var app = {
    initialize: function() {
        this.bindEvents();
        this.checkForPassword();
        this.checkForInvalidPasswordAttempts();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('DOMContentLoaded', this.onDeviceReady);
        document.getElementById("submitBtn").addEventListener("click", function(){
            app.back();
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
            app.createNewPassword();
        }
    },

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
            window.location = '../index.html';
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

    checkForInvalidPasswordAttempts: function() {
        var count = localStorage.getItem('incorrectpwd');
        if (count != null) {
            pwc = parseInt(count);
        }
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
};//end of app variable

app.initialize();

/*var pwd = localStorage.getItem('appPsss21');
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
                }*/