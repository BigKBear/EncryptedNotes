/*

The JS file for database

*/
//function encrypted(){
var SECRET_PHRASE = "venkatencryption";
var db;
var pwc = 0;
var app = {
    initialize: function() {
        this.bindEvents();
        this.checkForPassword();
        this.checkForInvalidPasswordAttempts();
    },
    checkForInvalidPasswordAttempts: function() {
        var count = localStorage.getItem('incorrectpwd');
        if (count != null) {
            pwc = parseInt(count);
        }
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
    /** 
     * method to create new password
     */ 
    createNewPassword: function() {
        swal({
            title: "Please enter your password before saving your details !!",
            text: "",
            type: "input",
            inputType: "password",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "enter your password"
        }, function(inputValue) {
            if (inputValue === false) {
                //alert("cancelled");
                return false;
            }
            if (inputValue === "") {
                swal.showInputError("Password field can't be blank");
                return false
            }
            localStorage.setItem('appPsss21', inputValue);
            swal.close();
        });
    },
    bindEvents: function() {
        document.addEventListener('deviceready', onDeviceReady, false);
        document.addEventListener('DOMContentLoaded', onDeviceReady);
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
    showPopup: function() {
        swal({
            title: "Please enter password",
            text: "",
            type: "input",
            inputType: "password",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "enter your password"
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
            tx.executeSql('CREATE TABLE IF NOT EXISTS topics (topic unique, desc)')

        });
    },
    fetchedValuesList: function() {
        db.transaction(function(tx) {
            //tx.executeSql('DELETE FROM topics');
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
            var type = "password";
            if(pwc >3){
                type = "text";
            }
			
            swal({
                title: "Enter Encryption Password to Decrypt",
                text: "",
                type: "input",
                inputType: type,
                showCancelButton: true,
                closeOnConfirm: false,
                animation: "slide-from-top",
                inputPlaceholder: "enter your password"
            }, function(inputValue) {
                if (inputValue === false) {
                    //alert("cancelled");
                    return false;
                }
                if (inputValue === "") {
                    swal.showInputError("Password field can't be blank");
                    return false
                }
                var pwd = localStorage.getItem('appPsss21');
                if (pwd === inputValue) {
                    //alert("password matches");
                    //selectedIndex = $(this).index();
                    localStorage.setItem('incorrectpwd', 0);
                    //alert('Selected Index =' + selectedIndex + "\n");
                    window.location.href = "createnotes.html?msg=view" + selectedIndex;
                    swal.close();
                } else {
                    pwc++;
                    localStorage.setItem('incorrectpwd', pwc);
                    if (pwc < 6) {
						//alert("You have entered an Incorrect password!")
                        alert("You have entered an Incorrect password!" +"\n"+ "Please try again"+"\n"+"Attempt Number - "+pwc);
                    }
					if(pwc == 6){
						alert("LAST ATTEMPT! \n All data will be wiped if incorrectpwd is entered again");
					}
                    if (pwc > 6) {
                        debugger;
                        //alert("LAST ATTEMPT! \n All data will be wiped if incorrectpwd is entered again");
                        db.transaction(function(tx) {
                            tx.executeSql('DELETE FROM topics');
							});
							localStorage.setItem('incorrectpwd', 0);
                            location.reload();
							type = "password";
                    }
                    swal.close();
                }
            });
        });
    },

    errorCB: function(e) {
        alert('error');
    }
};

function onBackKeyDown() {
    // Handle the back button
    alert('No Free Space!');
    window.location='index.html';
    }


function onDeviceReady() {
        document.addEventListener("backbutton", onBackKeyDown, false);
        $('#clickMe').click(function() {
            app.showPopup();
        });
        $("#fab-clicked").click(function() {  //write for update too

            //alert("clicked");
            window.location='createnotes.html';
        });
        app.initDB();
    }

app.initialize();