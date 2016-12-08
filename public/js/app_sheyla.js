/*
$( document ).ready(function() {
    var dato = {
        "client_id": "52",
        "type_of_order_id": "1",
        "type_payment": "CREDIT",
        "price": 10,
        "duration": "12",
        "distance": "1",
        "points": "2",
        "destinations": [{
            "name_destination": "Testing Avenue 253, Testing City",
            "latlon": " ",
            "order": 0,
            "interior": "123",
            "contact_person": "Alpha Tester",
            "phone": "995555521",
            "special_instructions": "Special instruction text",
            "email": "alpha.tester@testing.test"
        }, {
            "name_destination": "Testing Avenue 252, Testing City",
            "latlon": "",
            "order": 1,
            "interior": "121",
            "contact_person": "Gamma Tester",
            "phone": "995555523",
            "special_instructions": "Special instruction text",
            "email": "gamma.tester@testing.test"
        }],
        "order_details": [{
            "document": true,
            "smallbox": null,
            "bigbox": null,
            "description": "Intrucciones globales del pedido"
        }]
    };

    $.ajax({
        type: 'POST',
        url: 'http://sandbox.urbaner.com/api/order',
        data: JSON.stringify(dato),
        dataType:"application/json",

    })


    .done(function (response) {
        console.log('fail!');
        console.log(response);
    })

    .done(function (response) {
        console.log('Success!');
        console.log(response);
    })
    .always(function (response) {
        console.log('Always!');
        console.log(response);
    });



    });
*/
/*var template =
            '<div class="card-stacked">' +
              '<div class="card-content amber white-text">' +
                  '<p>Hi, my name is <strong>{{name}}</strong></p>' +
              '</div>' +
              '<div class="card-action">' +
                  '<a data-show-url="{{url}}" class="about" >See more about me</a>' +
              '</div>' +
          '</div>'
*/
  //personaje += template.replace("{{name}}", response.name);

/*$(document).ready(function(){
   $.ajax("http://sandbox.urbaner.com/api/order")
    .fail(function(response){
      console.log("Fail");
      console.log("response")
    })
    .done(function(response){
      html_str = "<div>:updated_at:</div>"
      console.log("Success!");
      $("#user").html(
        html_str
          .replace(":updated_at:", response.updated_at)
        );

      .always(function(response) {
        console.log("AJAX request has finished");
        console.log(response);
      })
    });
});

*/

          ;(function() {
                html_str = '<div class="marco">'+'<strong id="borde">CODIGO DE PEDIDO: </strong> <div id="blue">:user_name:</div>' +
                            '<strong id="borde">CODIGO DE CLIENTE: </strong> <div id="blue">:code_cliente:</div>'+
                            '<strong id="borde">Crear: </strong> <div id="blue">:creado:</div>'+
                            '<strong id="borde">Precio: </strong> <div id="blue">:precio:</div>'+'</div>'+ '<br>'+ '<br>';
              window.addEventListener('load', function() {
                  $.ajax('http://sandbox.urbaner.com/api/order')

                      .fail(function(response) {
                          console.log("Fail!");
                          console.log(response);
                      })
                      .done(function(response) {
                        var pedido = "";
                          console.log("Success!");
                          $.each(response.data, function(k,v){
                            //$("#user").append(v.code);
                            var client_name;
                            $.get("http://sandbox.urbaner.com/api/client/" + v.client_id, function(client){
                              if( client.client.name !== null )
                                client_name = client.client.name + ' ' + client.client.last_name;
                              else
                                client_name = '-';
                            });

                            pedido += html_str.replace(":user_name:", v.code)
                                      .replace(":code_cliente:", client_name)
                                      .replace(":creado:", v.created_at);
                                 //     .replace(":precio:", v.price);
                            $("#user").append(pedido);
                          })
                          /*$("#user").each(function(){
                          $(this).html(
                              html_str
                                  .replace(':user_name:', response.data[0].price)
                          );
                          console.log(response);
                          })
                          */
                      })
                      .always(function(response) {
                          console.log("AJAX request has finished!");
                          console.log(response);
                      })
              });
          })()








