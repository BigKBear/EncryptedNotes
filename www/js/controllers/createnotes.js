/*
The JS file for createnotes.html
*/

var SECRET_PHRASE = "venkatencryption";
var db;
var i=0;
var app={
	//Application constructor
	initialize:function() {
		var acc = document.getElementsByClassName("accordion");
		var i;

		for (i = 0; i < acc.length; i++) {
		    acc[i].onclick = function(){
		        this.classList.toggle("active");
		        var panel = this.nextElementSibling;
		        if (panel.style.display === "block") {
		            panel.style.display = "none";
		        } else {
		            panel.style.display = "block";
		        }
		    }
		}

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
		//document.getElementById("myDropdownMenu").toggle("hide");
		document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener('DOMContentLoaded', this.onDeviceReady);    
		if ('addEventListener' in document) {
		    document.addEventListener('DOMContentLoaded', function() {
		        FastClick.attach(document.body);
		    }, false);
		}
		var savebutton = document.getElementById("saveBtn");
		if(savebutton){
		  savebutton.addEventListener("click", function(){  //write for update too
				app.checkForPassword();
				//window.location='../index.html';
			});
		}

		var savebuttonTop = document.getElementById("saveBtnTop");
		if(savebuttonTop){
		  savebuttonTop.addEventListener("click", function(){  //write for update too
				app.checkForPassword();
				//window.location='../index.html';
			});
		}

		var updatebutton = document.getElementById("updateBtn");
		if(updatebutton){
			updatebutton.addEventListener("click", function(){  //write for update too
				app.checkForPassword();
				var delay=1000;//*
				setTimeout(function() {//*
					window.location='../index.html';
				}, delay);//*
			});
		}

		var updatebuttonTop = document.getElementById("updateBtnTop");
		if(updatebuttonTop){
			updatebuttonTop.addEventListener("click", function(){  //write for update too
				app.checkForPassword();
				var delay=1000;//*
				setTimeout(function() {//*
					window.location='../index.html';
				}, delay);//*
			});
		}
		var backbutton = document.getElementById("backBtn");
		if(backbutton){
			backbutton.addEventListener("click", function(){
				app.back();
			});
		}

		var backbuttonTop = document.getElementById("backBtnTop");
		if(backbuttonTop){
			backbuttonTop.addEventListener("click", function(){
				app.back();
			});
		}

		var backBtnTopBar = document.getElementById("backBtnTopBar");
		if(backBtnTopBar){
			backBtnTopBar.addEventListener("click", function(){
				app.back();
			});
		}
		
		var deletebutton = document.getElementById("deleteBtn");
		if(deletebutton){
			deletebutton.addEventListener("click",function(){
			//ask user are you sure
			app.askUserBeforeDelete();
			var delay=1000; //1 second

			setTimeout(function() {
			  window.location='../index.html';
			}, delay);
			});
		}
		
		var deletebutton = document.getElementById("deleteBtns");
		if(deletebutton){
			deletebutton.addEventListener("click",function(){
			//ask user are you sure
			app.askUserBeforeDelete();
			var delay=1000; //1 second

			setTimeout(function() {
			  window.location='../index.html';
			}, delay);
			});
		}

		var deletebuttonTop = document.getElementById("deleteBtnTop");
		if(deletebuttonTop){
				deletebuttonTop.addEventListener("click",function(){
				//ask user are you sure
				app.askUserBeforeDelete();
				var delay=1000; //1 second

				setTimeout(function() {
				  window.location='../index.html';
				}, delay);

			});
		}

		var menubutton = document.getElementById("deleteBtnTop");
		if(menubutton){
				menubutton.addEventListener("click",function(){
				document.getElementById("myDropdownMenu").toggle("show");

			});
		}


	},

	askUserBeforeDelete:function(){
		 var deleteUser = window.confirm('Are you sure you want to delete this item?');

		    if (deleteUser) {
		      app.checkForPasswordDelete();
		    }else{
		    	window.location='../index.html';
		    }
	},

	//deviceready Event Handler
	//Scope of 'this' is the event. In order to call the 'receivedEvent'
	//function, we must explictly call 'app.receivedEvent(...);
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

	checkForFlow : function() {
		var idx = document.URL;
		if(idx.indexOf("?msg=view") != -1){
			$("#updateBtn").show();
			$("#saveBtn").hide();
			$("#deleteBtn").show();
			$("#deleteBtns").show();//test

			$("#updateBtnTop").show();
			$("#saveBtnTop").hide();
			$("#backBtnTop").show();
		    var rowid = idx.split("msg=view")[1];
		    rowid = decodeURI(rowid);
		    db.transaction(function(tx) {
            //tx.executeSql('DELETE FROM topics');
            	var sql = 'SELECT * FROM topics where topic="'+rowid+'"';
            	console.log(sql);
            	tx.executeSql(sql, [], app.fecthSuccess, app.fetchError);
        	});
		}
		else{
			$("#updateBtn").hide();
			$("#saveBtn").show();
			$("#deleteBtn").hide();
			$("#deleteBtns").hide();//test
			
			$("#updateBtnTop").hide();
			$("#saveBtnTop").show();
			$("#deleteBtnTop").hide();
		}
		
	},

	fecthSuccess : function(tx,results){
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
			
			 tx.executeSql('CREATE TABLE IF NOT EXISTS topics (topic unique, desc) WITHOUT ROWID;')
		});
	},

	checkForPassword:function(){
		var password = localStorage.getItem('appPsss21');
		var idx = document.URL;
		if(password != null){
			//ask for password to enroll
			if(idx.indexOf("?msg=view") != -1){
				app.updateValue();
			}else{
				app.insertValue();
			}
		}else{
			app.createNewPasswordForInsert();
		}
	},
		
	checkForPasswordDelete:function(){
		var password = localStorage.getItem('appPsss21');
		var idx = document.URL;
		if(password != null){
			if(idx.indexOf("?msg=view") != -1){
				app.deleteValue();
			}
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
                alert("There was an error creating your password please restart the application");
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
		var topicname = document.getElementById("topicname").value.trim();
     	var desc = document.getElementById("topicdesc").value;
		//encrpt here and store in var		
		if(topicname.length == 0 && desc.length == 0){
			//$('.emptyfields').stop().fadeIn(400).delay(3000).fadeOut(400);
			swal({
					  title: 'Error with fields!',
					  text: 'emptyfields.',
					  timer: 2000
					}).then(
					  function () {},
					  // handling the promise rejection
					  function (dismiss) {
					    if (dismiss === 'timer') {
					      console.log('I was closed by the timer');
					    }
					  }
					);
			return false;
		}else if(topicname!=null && desc!=null){
			//check that topic does not already exist
			app.doesTopicExist(topicname,desc);
		}else{
			alert("Inserting value error.");
		}
    },

     doesTopicExist:function(topicnametobechecked, desctobeadded){
    	db.transaction(function (tx) {		
    		tx.executeSql('SELECT * from topics WHERE topic=?',[topicnametobechecked],function(tx,results){
    			var len = results.rows.length, i;
    			if(len>0){
    				//Materialize.toast('Topic exist already', 4000);
					//$('.topicalreadyexist').stop().fadeIn(400).delay(3000).fadeOut(400);
					swal({
					  title: 'Topic error!',
					  text: 'topicalreadyexist.',
					  timer: 2000
					}).then(
					  function () {},
					  // handling the promise rejection
					  function (dismiss) {
					    if (dismiss === 'timer') {
					      console.log('I was closed by the timer');
					    }
					  }
					);
					return false;
    			}else{
					desctobeadded = CryptoJS.AES.encrypt(desctobeadded,SECRET_PHRASE);
					db.transaction(function (tx) {			 
			            tx.executeSql('INSERT INTO topics (topic, desc) VALUES (?, ?)', [topicnametobechecked,desctobeadded],onInsertSuccess,onInsertError);
			        });
			        var delay=1000; //1 second
					setTimeout(function() {
					  window.location='../index.html';
					}, delay);
    			}
    		},null);
    	});
    },

	updateValue:function(){
        var topicname = document.getElementById("topicname").value.trim();
		var desc = document.getElementById("topicdesc").value;
		//var idx = document.URL;
		//var rowid = idx.split("msg=view")[1];
		//alert("It is desc check"+desc);
		//encrpt here and store in var
		if(topicname.length == 0 && desc.length == 0){
			alert("Either the note title or description was incorrect.");
			return;
		}
		else if(topicname!=null && desc!=null){
			 //alert('updated before decrypt desc'+desc);
			 desc = CryptoJS.AES.encrypt(desc,SECRET_PHRASE);	
	         db.transaction(function (tx) {
				 //tx.executeSql('Update topics set desc=? WHERE rowid=?', [desc, (parseInt(rowid))+1],onInsertSuccess,onInsertError);
				 tx.executeSql('Update topics set desc=? WHERE topic=?', [desc, topicname],onInsertSuccess,onInsertError);
				 //desc = CryptoJS.AES.encrypt(desc,SECRET_PHRASE);
				 //alert('updated after decrypt desc'+desc);
	        });
		}else{
			alert("Error updating value.");
		}
    },
	
	//decrypt function
	/*insertdecrypt:function(){
		var topicname = document.getElementById("topicname").value.trim();
		var desc = document.getElementById("topicdesc").value;
		
		//decrypt here and store in var
		if(topicname.length == 0 && desc.length == 0){return;}
		else if(topicname!=null && desc!=null){
			desc = CryptoJS.AES.decrypt(desc,SECRET_PHRASE);
			db.transaction(function (tx) {
				//debugger;
				tx.executeSql('INSERT INTO topics (topic, desc) VALUES (?, ?)', [topicname,desc],app.onInsertSuccess,app.onInsertError);
			});
		}
	},*/

	deleteValue:function(){
		var topicname = document.getElementById("topicname").value.trim();
		var desc = document.getElementById("topicdesc").value;
		var idx = document.URL;
		var rowid = idx.split("msg=view")[1];
		if(topicname.length == 0 && desc.length == 0){
			alert("Either the note title or description was incorrect.");
			return;
		}else if(topicname!=null && desc!=null){
			db.transaction(function (tx) {
				//The below line clears the current table in the database with out deleting the table it self
				//tx.executeSql("DELETE FROM topics",app.onInsertSuccess,app.onInsertError);
				tx.executeSql("DELETE FROM topics WHERE topic=?",[topicname],onInsertSuccessdelete,onInsertError);
			});
		}else{
			alert("Error deleting value.");
		}
	},

	/*
	deleteMultipleValue:function(){
		var topicname = document.getElementById("topicname").value.trim();
		var desc = document.getElementById("topicdesc").value;
		var idx = document.URL;
		var i = 0;
		alert(idx);
		var rowid = idx.split("msg=view")[i+1];
		//alert(rowid);
		if(topicname.length == 0 && desc.length == 0){return;}
		if(topicname!=null && desc!=null){
			db.transaction(function (tx) {
				tx.executeSql("DELETE FROM topics WHERE rowid=?",[rowid],onInsertSuccess,onInsertError);
				//The below line clears the current table in the database with out deleting the table it self
				//tx.executeSql("DELETE FROM topics",app.onInsertSuccess,app.onInsertError);
			});
		}
	},*/
	
	back:function(){
		window.location='../index.html';
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
			//inside fetchedvalue
			openIndividualEle($(this)[0].innerHTML);
		});
    },

    // TODO:See if this can be removed
	openIndividualEle:function(ele)  {
		//alert('clicked element --------   '+ele);
	},

	errorCB:function(e){
	  alert('error creating table');
    }
};

app.initialize();

function onInsertSuccess(){
	swal({
		title: 'Encrypting notes please wait',
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
}

function onInsertSuccessdelete(){
	//$('.success').stop().fadeIn(400).delay(3000).fadeOut(400);
	/*
	var _img = document.getElementById('id1');
	var newImg = new Image;
	newImg.onload = loader(){
		_img.src = this.src;
	}
	newImg.src = 'images/page-loader.gif';*/
	swal({
		title: 'Deleting Note please wait',
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
}

function onInsertError(e){
	//debugger;
	alert("This title already exists!" + "\n" +"Please select a unique title name");
	window.location='templates/createnotes.html';
	//$('success').stop().fadeIn(400).delay(3000).fadeOut(400);
}