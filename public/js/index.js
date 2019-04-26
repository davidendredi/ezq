const MAX_LIST_ELEM = 5;

function setList(data) {
   let liste = $("#waitingListItems");

   if (data.items.length > MAX_LIST_ELEM) {
       $("#waitingListDiv").css("overflow-y", "scroll");
       $("#waitingListDiv").css("height", "200");
   }

   liste.empty();

   for (let i = 0; i < data.items.length; i++) {
       if (i == 0) {
           liste.append("<li class='list-group-item active'><span class='badge badge-light badge-pill'>1</span>&nbsp;&nbsp;&nbsp;" + data.items[i].name + "</li>");
       } else {
           liste.append("<li class='list-group-item'><span class='badge badge-primary badge-pill'>" + (i+1) + "</span>&nbsp;&nbsp;&nbsp;" + data.items[i].name + "</li>");
       }
   }
}

$(document).ready(function() {
    new QRCode(document.getElementById("qrcode"), {
        text: "http://jindo.dev.naver.com/collie",
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    $("#qrheading").on("click", ()=>{
      $(".collapse").collapse('toggle');
    });

    setList({items : [{name : 'hallo'}, {name : 'welt'}, {name : 'hallo'}, {name : 'hallo'}, {name : 'welt'},  {name : 'hallo'},  {name : 'hallo'},  {name : 'hallo'},  {name : 'hallo'},  {name : 'hallo'},  {name : 'hallo'}]});
});