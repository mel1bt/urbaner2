    var clienteId = $("#idUser").text();
    var montoPagar = $("#montoPagar").text();
    var time = $("#time").text();
    var distance = $("#distance").text();
    var originAddres = $("#originAddress").text();
    var destinoAddress = $("#destinoAddress").text();
    var contactPersona = $("#txtContacto--Destino").text();
    
    var telfDestino = $("#txtTelefono--Destino").text();
    var emailDestino = $("#txtEmail--Destino").text();
    var dato = {
        "client_id": clienteId,
        "type_of_order_id": "1",
        "type_payment": "CREDIT",
        "price": montoPagar,
        "duration": parseInt(time),
        "distance": parseInt(distance),
        "points": "2",
        "destinations": [{
            "name_destination": destinoAddress,
            "latlon": "10, 4",
            "order": "0",
            "interior": "123",
            "contact_person": contactPersona,
            "phone": telfDestino,
            "special_instructions": "Special instruction text",
            "email": emailDestino
        }],
        "order_details": [{
            "document": "1",
            "smallbox": "2",
            "bigbox": "1",
            "description": "Intrucciones globales del pedido"
        }]
    };
$( document ).ready(function() {
$("#solicitarEntrega").click(insertar);
function insertar(){
      $.ajax({
            url: 'http://sandbox.urbaner.com/api/order',
            type: 'post',
            dataType: 'json',
            cache:    false,
            data: dato,
            success: function () {
               alert("Pedido Registrado");
                       },
            error : function (XMLHttpRequest, textStatus,errorThrown) {
                console.log(textStatus);
            }
        });

};
    });


