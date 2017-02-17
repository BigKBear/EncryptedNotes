/*
The JS file for the password page
*/
var pwc = 0;
var db;
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
        document.getElementById("submitBtn").addEventListener("click", function(){  //write for update too
            var password = localStorage.getItem('appPsss21');
            var inputValue = document.getElementById("userPassword").value;
            var confirmValue = document.getElementById("userconfirmPassword").value;
            var idx = document.URL;
            var rowid = idx.split("msg=view")[1];

            /*alert(idx.indexOf("?msg=view"));*/
            if (password) {
                if(inputValue){
                    //check that the entered value is the same as the saved password
                    if((inputValue === password)&&(rowid)){
                        //Go to the selected note page
						swal({
								title: 'Decrypting note please wait',
								showConfirmButton: false,
								showLoaderOnConfirm: true,
								timer: 4000,
								imageUrl: "../images/page_loader.gif"
							}).then(
						// handling the promise rejection
						function (dismiss) {
						if (dismiss === 'timer') {
							console.log('I was closed by the timer');
						}
					}
				);
                        window.location.href = "../templates/createnotes.html?msg=view" + rowid;
                    }else{
                        pwc++;
                        localStorage.setItem('incorrectpwd', pwc);
                        if (pwc > 3) {
                            document.getElementById("userPassword").type = "text";
                        }
                        if (pwc < 6) {
                            swal({
                                title: 'You have entered an Incorrect password!',
                                text: 'Please try again \n Attempt Number - ' + pwc,
                                type: 'warning',
                                confirmButtonText: 'OK'
                            }).then(function() {
                                app.resetPasswordField();
                                //location.reload();
                            });   
                            //alert("You have entered an Incorrect password!" + "\n" + "Please try again" + "\n" + "Attempt Number - " + pwc);
                        }else if (pwc == 6) {
                            swal({
                                title: 'LAST ATTEMPT!',
                                text: 'All data will be wiped if incorrectpwd is entered again!',
                                type: 'warning',
                                confirmButtonText: 'OK'
                            }).then(function() {
                                app.resetPasswordField();
                            });  
                            //alert("LAST ATTEMPT! \n All data will be wiped if incorrectpwd is entered again");
                        }else if (pwc > 6) {
                            /*DELETE taple called topics*/
                            db.transaction(function(tx) {
                                tx.executeSql('DELETE FROM topics');
                            });
                            localStorage.setItem('incorrectpwd', 0);
                            swal({
                                title: 'DELETED!',
                                text: 'All data has been wiped!',
                                type: 'error',
                                confirmButtonText: 'OK'
                            }).then(function() {
                                /*setTimeout(function(){ window.location = '../index.html'; }, 2000);*/
                                window.location = '../index.html';
                            });
                            /*Take user back to list page*/
                        }else{
                            alert("Something went wrong with the app please reinstall.");
                        }
                    }
                }else{
                    swal({
                            title: 'Check Password!',
                            text: 'Password field can not be blank.',
                            type: 'warning',
                            confirmButtonText: 'OK'
                        }).then(function() {
                            app.resetPasswordField();
                        });  
                }                
            }else{
                if(confirmValue){
                    app.checkConfirmPassword(inputValue,confirmValue);
                }else{
                    swal({
                        title: 'Confirm password',
                        text: 'Please confirm your password by entering the same value as your password in the confirm password area',
                        type: 'warning',
                        confirmButtonText: 'OK'
                    }).then(function() {
                        app.resetPasswordAndConfirmPasswordFields();
                    }); 
                }
                
            }
        });
    },

    resetPasswordField:function(){
        var password = localStorage.getItem('appPsss21');
        if(password){            
            document.getElementById("userPassword").value = null;
            document.getElementById("userPassword").placeholder = "Enter Encryption Password to Decrypt";
        }else{
            document.getElementById("userPassword").value = null;
            document.getElementById("userPassword").placeholder = "Please create a password";
        }        
    },
    resetConfirmPasswordField:function(){
        document.getElementById("userconfirmPassword").value = null;
        document.getElementById("userconfirmPassword").placeholder = "Please confirm your password";
    },
    resetPasswordAndConfirmPasswordFields:function(){
        app.resetPasswordField();
        app.resetConfirmPasswordField();
    },    
    onDeviceReady:function(){
        //Checks to see if the user has already created a password
        app.checkForPassword();
        app.initDB();
        document.addEventListener("backbutton", app.onBackKeyDown, true);
    },

    onBackKeyDown: function(e) {
        //do nothing, it will stand in same place.
        window.location = '../index.html';
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
    checkForPassword: function() {
        var password = localStorage.getItem('appPsss21');
        if (password) {
            $("#userconfirmPassword").hide();
            app.resetPasswordField();
        }else{
            //ask for password and confirm password to enroll
            $("#userconfirmPassword").show();
            app.resetPasswordAndConfirmPasswordFields();
        }
    },
    checkConfirmPassword: function(inputValue,confirmValue){
        if(inputValue != confirmValue){
            swal({
                    title: 'Sorry your passwords do not match!',
                    text: 'please check and try again',
                    type: 'error',
                    confirmButtonText: 'OK'
                }).then(function() {
                    app.resetPasswordAndConfirmPasswordFields();
                });
        }else{
            //Save the entered value as the password
            swal({
                    title: 'Password saved!',
                    //text: 'Your password is: ' + inputValue,
                    type: 'success',
                    confirmButtonText: 'OK'
                    //}
                }).then(function() {
                    localStorage.setItem('appPsss21',inputValue);
                    window.location='../index.html';
                }); 
            }
    }    
};
app.initialize();