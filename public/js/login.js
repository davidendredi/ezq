$(document).ready(()=>{

    $("#routeLogin").on("click", () => {
        $("#LoginDiv").children().show();
        $("#RegisterDiv").children().hide();

        $("#routeLogin").addClass("active");
        $("#routeRegister").removeClass("active");
    });

    $("#routeRegister").on("click", () => {
        $("#RegisterDiv").children().show();
        $("#LoginDiv").children().hide();

        $("#routeLogin").removeClass("active");
        $("#routeRegister").addClass("active");
    });

    $("#RegisterDiv").children().hide();
});