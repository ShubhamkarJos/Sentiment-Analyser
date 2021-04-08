function clearForm(){
  //alert("Your data has been processed!");
  document.getElementById('inputForm').reset();
}

$(document).ready(function(){
  //Hide the form and line when reloading page
  $("hr").hide();
  $("#outForm").hide();

  $("#inputForm").on("submit", function(event){
    event.preventDefault();
    //Display message for confirming data has been accepted
    alert("Your data has been accepted!");

    //Hide all form labels and change header of the stat part to "Loading..."
    $("hr").hide();
    $("#outForm").show();
    $("#outForm").find("label").toggle();
    $("#predict-header").show();
    $("#predict-header").text("Loading...");

    //Fetch form data and send POST request to server
    var formData = {};
    $("#inputForm").find("input").each(function (index, node) {
      formData[index] = node.value;
    })
    $("#inputForm").find("textarea").each(function (index, node) {
      formData[index] = node.value;
    })
    console.log(formData);
    $.ajax({
        url: "http://127.0.0.1:5000/predict",
        type: 'POST',
        cache: false,
        data: formData,
        success: function(response) {
          console.log(response)
          clearForm()

          //Show all form labels and change header of the output part to "Status"
          $("hr").show();
          $("#outForm").show();
          $("#outForm").find("label").toggle();
          $("#predict-header").text("Status");
          $("#predict-header").css({ "text-decoration" : "underline"});
          $("#predict-review").text(response['review']);
          $("#predict-output").text(response['result']);
          $("#predict-output").css("color", response['color']);
          $("#predict-score").text(response['score']); 
        },
    });
  });
});

function openTab(evt, tabName) {
    //Some element stylings
    $("hr").hide();
    $("#outForm").hide();

    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "";
    evt.currentTarget.className += " active";
}

function closeTab(tabName){
    //Close the tab
    document.getElementById(tabName).style.display="none";
}