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
		$('input[type=text]').each(function(input){
		input.topicname="";
		input.topicdesc="";
		});
	},
	//Bind Event Listeners
	//
	//Bind any events that are required on startup. Common events are:
	//'load', 'deviceready', 'offline' and 'online'.
	bindEvents:function(){
		document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener('DOMContentLoaded', this.onDeviceReady);    
		document.getElementById("saveBtn").addEventListener("click", function(){  //write for update too

			app.checkForPassword();
			window.location='index.html';
		});
		document.getElementById("updateBtn").addEventListener("click", function(){  //write for update too
			app.checkForPassword();
			window.location='index.html';
			//app.updateValue();
		});
		document.getElementById("backBtn").addEventListener("click", function(){
			app.back();
		});
	},
	//deviceready Event Handler
	//Scope of 'this' is the event. In order to call the 'receivedEvent'
	//function, we must explictly call 'app.receivedEvent(...);
	onDeviceReady:function(){
		console.log("Createnotes of topics page triggered");
		app.initDB();
		app.checkForFlow();
	},
	initDB:function(){
		db = openDatabase('test', '1.0', 'Test DB', 2 * 1024 * 1024);
		if(!localStorage.getItem('dbCreated-USERS')){
		this.createDB();
		 }
	},
	checkForFlow : function() {
		var idx = document.URL;
		if(idx.indexOf("?msg=view") != -1){
			$("#updateBtn").show();
			$("#saveBtn").hide();
		    var rowid = idx.split("msg=view")[1];
		    db.transaction(function(tx) {
            //tx.executeSql('DELETE FROM topics');
            	var sql = 'SELECT * FROM topics where rowid='+(parseInt(rowid) + 1);
            	tx.executeSql(sql, [], app.fecthSuccess, app.fetchError);
        	});
		}
		else{
			$("#updateBtn").hide();//
			$("#saveBtn").show();
		}
		
	},

	fecthSuccess : function(tx,results){
		//alert("fecthed");
		var len = results.rows.length;
		for (var i = 0; i < len; i++) {
			if (results.rows.item(i).topic.length > 0) {
				var topic = results.rows.item(i).topic;
				var desc = CryptoJS.AES.decrypt((results.rows.item(i).desc), SECRET_PHRASE).toString(CryptoJS.enc.Utf8);
				$("#topicname").val(topic);
				$("#topicdesc").val(desc);
				 Materialize.updateTextFields();
			}
		}
	},
	fetchError:function(e){
	  console.log(' error while fetching individual data');
    },

	createDB: function(){
		localStorage.setItem('dbCreated-USERS',true);
		db.transaction(function (tx) {
			 tx.executeSql('CREATE TABLE IF NOT EXISTS topics (topic unique, desc)')
		});
	},

	checkForPassword:function(){
		var password = localStorage.getItem('appPsss21');
		var idx = document.URL;
		if(password != null){
			//ask for password to enroll
			if(idx.indexOf("?msg=view") != -1){
				app.updateValue();
			}
			else{
				app.insertValue();
			}
		}	
		else {
			app.createNewPasswordForInsert();
		}
	},
	/**
	 * method to create new password
	 */
	createNewPasswordForInsert : function(){
		swal({
            title: "Please enter your password before saving your details !!",
            text: "",
            type: "input",
            inputType :"password",
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
            localStorage.setItem('appPsss21',inputValue);
            app.checkForPassword();
            swal.close();
        });
		
	},
	insertValue:function(){
        var topicname = document.getElementById("topicname").value;
		var desc = document.getElementById("topicdesc").value;
		//encrpt here and store in var
		debugger;
		if(topicname.length == 0 && desc.length == 0){
			Materialize.toast('Empty fields', 4000)
			return;
		}
		
		if(topicname!=null && desc!=null){
		 desc = CryptoJS.AES.encrypt(desc,SECRET_PHRASE);	
         db.transaction(function (tx) {
            tx.executeSql('INSERT INTO topics (topic, desc) VALUES (?, ?)', [topicname,desc]);
        });
		}
    },
	updateValue:function(){
        var topicname = document.getElementById("topicname").value;
		var desc = document.getElementById("topicdesc").value;
		var idx = document.URL;
		var rowid = idx.split("msg=view")[1];
		//alert("It is desc check"+desc);
		//encrpt here and store in var
		if(topicname.length == 0 && desc.length == 0){return;}
		
		if(topicname!=null && desc!=null){
		 //alert('updated before decrypt desc'+desc);
		 desc = CryptoJS.AES.encrypt(desc,SECRET_PHRASE);	
         db.transaction(function (tx) {
			 
			 tx.executeSql('Update topics set desc=? WHERE rowid=?', [desc, (parseInt(rowid))+1]);
			 //desc = CryptoJS.AES.encrypt(desc,SECRET_PHRASE);
			 //alert('updated after decrypt desc'+desc);
			 
        });
		}
    },
	
	//decrypt function
	insertdecrypt:function(){
		var topicname = document.getElementById("topicname").value;
		var desc = document.getElementById("topicdesc").value;
		//decrypt here and store in var
		if(topicname.length == 0 && desc.length == 0){return;}
		
		if(topicname!=null && desc!=null){
			desc = CryptoJS.AES.decrypt(desc,SECRET_PHRASE);
			db.transaction(function (tx) {
				tx.executeSql('INSERT INTO topics (topic, desc) VALUES (?, ?)', [topicname,desc]);
			});
		}
	},
	
	back:function(){
		window.location='index.html';
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
	  alert('error');
    }
};
app.initialize();