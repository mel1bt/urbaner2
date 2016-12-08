;(function() {
                html_str = '<div class="col-md-3"><div class="btn-green"><strong>CODIGO DE PEDIDO:</strong></div>' + '<div class="user">:user_name:</div></div>'+ '<br>' +
                            '<div class="btn-green"><strong>CODIGO DE CLIENTE: </strong></div> <div class="user">:code_cliente:</div>' + '<br>'+ '<br>'+ '<br>';
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
                            pedido += html_str.replace(":user_name:", v.code)
                            .replace(":code_cliente:", v.client_id);
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
