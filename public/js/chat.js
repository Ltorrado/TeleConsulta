

(function(){


    var ural="http://181.49.176.36:8050/teleconsulta/";
  //var ural ="http://localhost:56508/"

  var   connection = new signalR.HubConnectionBuilder().withUrl(ural+"chatHub")
  .configureLogging(signalR.LogLevel.Information)
  .build();
  var chat = {
     mensajeTemplate: ' <li class="clearfix">'+
'<div class="message-data align-right">'+
 ' <span class="message-data-time" >{{time}}, Hoy</span> &nbsp; &nbsp;'+
  '<span class="message-data-name" >Olia</span> <i class="fa fa-circle me"></i>'+
'</div>'+
'<div class="message other-message float-right">'+
  '{{messageOutput}}'+
'</div>'+
'</li>',

 respuestaTemplate : '  <li>'+
'<div class="message-data">'+
  '<span class="message-data-name"><i class="fa fa-circle online"></i> '+ loadingParams.nombreRemisor+'</span>'+
  '<span class="message-data-time">{{time}}, Hoy</span>'+
'</div>'+
'<div class="message my-message">'+
  '{{response}}'+
'</div>'+
'</li>',

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

      connection.on("NuevoMensaje", (user, message) => {
        debugger
              if(loadingParams.clientid == user){
                this.scrollToBottom();
                if (message.trim() !== '') {
                  debugger
                  var template = Handlebars.compile(this.respuestaTemplate);

                  var context = { 
                    response: message,
                    time: this.getCurrentTime()
                  };
                  time=this.getCurrentTime();

                  this.$chatHistoryList.append(template(context));
                  this.scrollToBottom();
                  this.$textarea.val('');       
              
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
      this.$chatHistoryList =  this.$chatHistory.find('ul');
    },
    bindEvents: function() {
      this.$button.on('click', this.addMessage.bind(this));
      this.$textarea.on('keyup', this.addMessageEnter.bind(this));
    },
    render: function() {
      this.scrollToBottom();
      if (this.messageToSend.trim() !== '') {
        debugger
        var template = Handlebars.compile(this.mensajeTemplate);

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
      
    },    
    addMessage: function() {
      this.messageToSend = this.$textarea.val()
      this.render();         
    },
    addMessageEnter: function(event) {
        // enter was pressed
        if (event.keyCode === 13) {
          this.addMessage();
        }
    },
    EnivarMensajeServidor:function(mensaje){
      $.ajax({

        url : ural+'api/Chat/GuardarMensaje',
        type : 'GET',
        data : {
            'mensaje' : mensaje,
            'usuarioId':loadingParams.clientid,
            'usuarioReceptor':loadingParams.remisorChat,
            '':loadingParams.tipo,
            'citaId':loadingParams.roomId,
        },
        dataType:'json',
        success : function(data) {              
         
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