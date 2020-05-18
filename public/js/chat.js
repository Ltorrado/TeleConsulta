
   var ural="https://appcita.viva1a.com.co:8051/teleconsulta/";
   //var ural ="http://localhost:56508/teleconsulta/"



  function GuardarEncuesta(){
    debugger
  var form =  $("#EncuestaForm").serialize()
    $.ajax({
  
  url : ural+'api/telellamada/GuardarEncuesta',
  type : 'POST',
  data :form ,  

  success : function(data) {              
  alert('Guardado Correcto')
  },
  error : function(request,error)
  {
      
  }
  });
  }

(function(){
   
   scrollAbajo= function(ok){
     debugger

    chat.scrollToBottom();
  }
  var modal = document.getElementById("myModal");
  var modalImg = document.getElementById("img01");
  var captionText = document.getElementById("caption");

  var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  $("#myModal").modal('hide')
}
  $('body').on('click','img',function(){
    debugger
    $("#myModal").modal();
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
  })

$('img').on("click",  function(){
  debugger
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
})

$('body').on('load','img',function(){
  debugger
  $(this).css('background','none');
  console.log('imagenCargada')
  chat.scrollToBottom();
});


  var intials = this.loadingParams.nombreRemisor.charAt(0);
 $('#profileImage').text(intials);
  



  
  

  var   connection = new signalR.HubConnectionBuilder().withUrl(ural+"chatHub")
  .configureLogging(signalR.LogLevel.Information)
  .build();
  var chat = {
    isMensajeConImage:false,
    llevaImagen:function(){
      debugger
        if(this.isMensajeConImage){
          return '<div style="overflow:hidden" >'+
          '<img  style="zoom:40%" onload="scrollAbajo(this);" src={{imagen}}>'
          +'</div>'



        }else{
          return ''
        }
        return'';
    
    },
     mensajeTemplate:function(){
       return  ' <li class="clearfix">'+
       '<div class="message-data align-right">'+
        ' <span class="message-data-time" >{{time}}, Hoy</span> &nbsp; &nbsp;'+
         '<span class="message-data-name" ></span> <i class="fa fa-circle me"></i>'+
       '</div>'+
       
       '<div class="message other-message float-right">'+
       
       this.llevaImagen()  
       +
         '{{messageOutput}}'+
       '</div>'+
       '</li>'
     
     } ,

 respuestaTemplate : function(){return '  <li>'+
'<div class="message-data">'+
  '<span class="message-data-name"><i class="fa fa-circle online"></i> </span>'+
  '<span class="message-data-time">{{time}}, Hoy</span>'+
'</div>'+
'<div class="message my-message">'+       
       this.llevaImagen()  
       +
  '{{response}}'+
'</div>'+
'</li>'},

    messageToSend: '',
  
    messageResponses: [
      'Why did the web developer leave the restaurant? Because of the table layout.',
      'How do you comfort a JavaScript bug? You console it.',
      'An SQL query enters a bar, approaches two tables and asks: "May I join you?"',
      'What is the most used language in programming? Profanity.',
      'What is the object-oriented way to become wealthy? Inheritance.',
      'An SEO expert walks into a bar, bars, pub, tavern, public house, Irish pub, drinks, beer, alcohol'
    ],
     ConectarseServidorChat: function(){
      
      
      connection.start().catch(err => console.error(err));
      console.log("connected");
    },
    recivirRespuestaEvento : function(){

      connection.on("NuevoMensaje", (user, datos) => {
        debugger
            
              if(loadingParams.clientid == user){
                this.scrollToBottom();
                if (datos.mensaje.trim() !== '') {
                  debugger
                  if(datos.imagen.trim() !== '' ){
                    this.isMensajeConImage=true;
                  }
                  var html=this.respuestaTemplate()
                  var template = Handlebars.compile(html);

                  var context = { 
                    response: datos.mensaje,
                    time: this.getCurrentTime(),
                    imagen:datos.imagen
                  };
                  time=this.getCurrentTime();

                  this.$chatHistoryList.append(template(context));
                  
               
                  this.isMensajeConImage=false;      
                  this.scrollToBottom();
              
                } 
              }
      
      });
      
    },
    init: function() {
      this.cacheDOM();
      this.bindEvents();
      this.render();
      this.ConectarseServidorChat();
      this.recivirRespuestaEvento();
    },
    cacheDOM: function() {
      this.$chatHistory = $('.chat-history');
      this.$button = $('button');
      this.$textarea = $('#message-to-send');
      this.$imagenSelect =$("#selectedFile");
      this.$chatHistoryList =  this.$chatHistory.find('ul');
    },
    bindEvents: function() {
      this.$button.on('click', this.addMessage.bind(this));
      this.$textarea.on('keyup', this.addMessageEnter.bind(this));
      this.$imagenSelect.on('change',this.addimagen.bind(this))
    },
    render: function() {
      this.scrollToBottom();
      if (this.messageToSend.trim() !== '') {
        debugger
      

        input=document.getElementById("selectedFile");
             
        if (input.files && input.files[0]) {
            var reader = new FileReader();
  
            reader.onload = this.imagenCargada;
  
            reader.readAsDataURL(input.files[0]);
        }else{
          var mensaje=this.mensajeTemplate();
          var template = Handlebars.compile(this.mensajeTemplate());
          var context = { 
            messageOutput: this.messageToSend,
            time: this.getCurrentTime()
          };
          time=this.getCurrentTime();
  
          this.$chatHistoryList.append(template(context));
          this.EnivarMensajeServidor( this.messageToSend.trim());
          this.scrollToBottom();
          this.$textarea.val('');       
          


        }
      }
      
    },    
    imagenCargada:function (e) {
      debugger
      chat.isMensajeConImage=true;   
      var template = Handlebars.compile(chat.mensajeTemplate());
      var context = { 
        messageOutput: chat.messageToSend,
        time: chat.getCurrentTime(),
         imagen: e.target.result
      };  
 
      chat.$chatHistoryList.append(template(context));
      chat.EnivarMensajeServidor( chat.messageToSend.trim());
     
      chat.isMensajeConImage=false;   
      chat.$textarea.val('');       
    },
    addMessage: function() {
      this.messageToSend = this.$textarea.val()
      this.render();         
    },
    addimagen: function(input) {
      debugger;
      input=document.getElementById("selectedFile");
      preview=$("#imagentumb");
      chatHistory=$(".chat-history")
      
      if (input.files && input.files[0]) {
          var reader = new FileReader();

          reader.onload = function (e) {

            preview.attr('src', e.target.result);;
            preview.show();
            chatHistory.hide()
          };

          reader.readAsDataURL(input.files[0]);
      }
  },
    addMessageEnter: function(event) {
        // enter was pressed
        if (event.keyCode === 13) {
          this.addMessage();
        }
    },
    EnivarMensajeServidor:function(mensaje){
      debugger

      input=document.getElementById("selectedFile");
      preview=$("#imagentumb");
      chatHistory=$(".chat-history")
      var formData = new FormData();
formData.append("imagen", document.getElementById("selectedFile").files[0]);
formData.append("mensaje", mensaje);
formData.append("usuarioId", loadingParams.clientid);
formData.append('tipo',loadingParams.tipo);
formData.append('usuarioReceptor',loadingParams.remisorChat);
formData.append('citaId',loadingParams.roomId);

      $.ajax({

        url : ural+'api/Chat/GuardarMensaje',
        type : 'POST',
        data :formData,  
         processData: false,
        contentType: false,
      
        enctype: 'multipart/form-data',
        success : function(data) {              
          preview.attr('src', null);;
          input.value = "";
          preview.hide();
          chatHistory.show()
          chat.scrollToBottom();
        },
        error : function(request,error)
        {
            
        }
    });
    },
    scrollToBottom: function() {
       this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
    },
    getCurrentTime: function() {
      return new Date().toLocaleTimeString().
              replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    },
    getRandomItem: function(arr) {
      return arr[Math.floor(Math.random()*arr.length)];
    }
    
  };
  
  chat.init();
  
  var searchFilter = {
    options: { valueNames: ['name'] },
    init: function() {
      var userList = new List('people-list', this.options);
      var noItems = $('<li id="no-items-found">No items found</li>');
      
      userList.on('updated', function(list) {
        if (list.matchingItems.length === 0) {
          $(list.list).append(noItems);
        } else {
          noItems.detach();
        }
      });
    }
  };
  
  searchFilter.init();
  
})();