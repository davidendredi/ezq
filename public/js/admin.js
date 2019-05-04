const MAX_LIST_ELEM = 5;

function setList(data) {
   let liste = $("#waitingListItems");
    
   if (data.length > MAX_LIST_ELEM) {
       $("#waitingListDiv").css("overflow-y", "scroll");
       $("#waitingListDiv").css("height", "200");
   }

   liste.empty();

   for (let i = 0; i < data.length; i++) {
       if (i == 0) {
           liste.append("<li class='list-group-item active'><span class='badge badge-light badge-pill'>1</span>&nbsp;&nbsp;&nbsp;" + data[i].name + "</li>");
       } else {
           liste.append("<li class='list-group-item'><span class='badge badge-primary badge-pill'>" + (i+1) + "</span>&nbsp;&nbsp;&nbsp;" + data[i].name + "</li>");
       }
   }
}

function logout() {

}

$(document).ready(function() {
    

    $("#qrheading").on("click", ()=>{
      $(".collapse").collapse('toggle');
    });

    $("#logout").on('click', logout);
    

    setList(
        [
            { name: 'List' },
            { name: 'ist' },
            { name: 'empty' },
        ]);
});