/* ServiceMap.
   Copyright (C) 2015 DISIT Lab http://www.disit.org - University of Florence

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU Affero General Public License as
   published by the Free Software Foundation, either version 3 of the
   License, or (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU Affero General Public License for more details.

   You should have received a copy of the GNU Affero General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>. */

   var parentQuery='';
   var categorie='';
   var raggioServizi = '';
   var raggioSensori = '';
   var raggioBus = '';
   var numeroRisultatiServizi = '';//numero preso dal form TextSearch
   var numeroRisultatiSensori = '';
   var numeroRisultatiBus = '';
   //var eventParam =''; 
   var coordinateSelezione =  '';
   var actualSelection = '';
   var stringaPopupOpen = '';
   var stringaCategorie = '';
   var zoom = '';
   var c = '';
   var center = '';
   var weatherCity= '';
   var stringaPopupOpen = "";
   var type='';
   var format='';

  //search Text
  var searchText='';
  var searchTextMaxResults='';

  //address
   var excludePOI = '';
   var searchMode = '';
   var categoriesAddress ='';
   var sortByDist = '';
   var addressMaxDists = '';
   var positionAddress = '';
   var addressText = '';

   //position
   var agency = '';
   var line = '';

   //path
   var routeType = '';
   var dateTimePath = '';
   var time = '';

   var idQuery_md5 = '';
   var idConf_md5 ='';

   var accessTokenMessage=false;

   function save_handler(typeService, id, nameService, embed, textSearch) {
    /* Creates the window that handle the save case.*/
    
    var t = "";
    if (embed) {
      type = "embed";
      t = "configuration";
    }
    else {
      if (textSearch == "freeText") {
        type = textSearch;
        t = "free text search";
      }
      else {
        if (id != null) {
          t = type = "service";
        }else if(typeService == "event"){//michela, sarebbe da rivedere anche questa funzione...
             t = type = "event";
        }else if(typeService == "address"){
          t = type = "address";
        }else if(typeService == "path"){
          t = type = "path";
        }else if(typeService == "Position_Bus"){
          t = type = "Position_Bus";
        }else  //QUI  
          t = type = "query";
      }
    }
    var position = "#dialog";
    var dialog = "<div id='serviceMap_save_dialog' title='Save Information' style=\"left: -10%;width: 525px;\"><div   id='serviceMap_info_title' >You can copy or save this query on ServiceMap.<a id='sm_save_close' title='Close without save'>X</a></div>";
    if (save_operation == "write") {
      dialog += "<div id='serviceMap_save_main_div' ><p>Would you overwrite the previous version? This will allow you to access at your query with the same link you accessed it.</p>";
      dialog += "<input type='button' id='sm_save_overwrite' value='Yes'>";
      dialog += "<input type='button' id='sm_save_normally' value='No'></div>";
    }
    else {
      
      dialog += "<div id='serviceMap_save_main_div'>";
      dialog+="<div id='save_json_div'>";

      dialog+="<fieldset ><legend>Query</legend>";
      // dialog += "<b>JSON:</b>";
      dialog += "<b style=\"display: none;\">Insert your e-mail:</b>";
      dialog += "<input class='save_text' type='email' id='user_email' name='email' autocomplete='on' placeholder='email@domain.ext' value='"+lastEmail+"' style=\"display: none;\">";
      if (user_mail != "") {
        dialog += "<p>Please pay attention that, the query ";
        dialog += "saved is different with respect to the original one. You will receive the url link to access at the new query from email.</p>";
      }
      //Inserts a testbox for the title and a text area for the description.
      var title = "";
      if (nameService != null && nameService != undefined)
        //title = "Service " + decodeURI(nameService);
            title = "Service " + unescape(nameService);
      else
        title = "A "+t;

      var idQuery_md5 = md5(Date.now().toString());
      var idConf_md5 = md5(Date.now().toString());

      var query_link_json_id=selectedorgUrl+'?queryId='+idQuery_md5;
      var queryLink="";

      if(type=='address' ||type=='event' || type=='path' || (type=="Position_Bus" && selectedorgUrl==superServiceMapApiUrl) || (typeService=="weather" && selectedorgUrl==superServiceMapApiUrl) || (type=="freeText" && selectedorgUrl==superServiceMapApiUrl)){
        legend_query_format='JSON Format';
        format='json';
        queryLink=saveQuery('', false, typeService, id, nameService,format, type);
      }else{
        legend_query_format='HTML Format';
        format='html';
        queryLink=saveQuery('', false, typeService, id, nameService,format, type);
      }

      dialog += "<b style=\"display: none;\">Insert a title: </b><input  class='save_text' type='text' id='query_save_title' placeholder='Service title' value='" + title + "' style=\"display: none;\"></br>"+
      "<b style=\"display: none;\">Insert a description: </b><textarea  class='save_text' id='query_save_desc' placeholder='Insert a description' style=\"display: none;\"></textarea>";

      dialog += "<a target='blank' class='no-copy wrap' rel='noopener noreferrer' href='"+query_link_json_id+"' id='query_link_json' style='word-break: break-all;pointer-events: none'>" +query_link_json_id+ "</a><br><br>";

      dialog += "<input type='button' id='saveQueryInKB' value='Save'  onclick='saveQueryInKB(\""+stringaCategorie+"\",\""+numeroRisultatiServizi+"\",\""+numeroRisultatiSensori+"\",\""+numeroRisultatiBus+"\",\""+coordinateSelezione+"\",\""+raggioServizi+"\",\""+raggioSensori+"\",\""+raggioBus+"\",\""+actualSelection+"\",\""+weatherCity+"\",\""+stringaPopupOpen+"\",\""+zoom+"\",\""+center+"\",\""+parentQuery+"\",\""+typeService+"\",\""+id+"\",\""+nameService+"\",\""+type+"\",\""+ textFilter+"\");'>";
      
      dialog += "<input disabled=\true\" type='button' id='copy_query_json' value='Copy' onclick='copy_query(\"query_link_json\");' style='left: 5px;position: relative;'>";
      dialog+="</fieldset >";
      dialog+="</div>";
      dialog+="<br>";

      if(format=='json'){
        if(accessTokenMessage==false){
          dialog+="<div id='save_json_div'>";
          dialog+="<fieldset ><legend id='legend_format'>JSON Format</legend>";
          dialog += "<a target='blank' style='word-break: break-all;' rel='noopener noreferrer' href='"+queryLink+"' id='query_link_json' value='Save' >" +queryLink+ "</a>";
          dialog += "<br><br><input type='button' id='copy_query_json' value='Copy' onclick='copy_query(\"query_link_json\");'>";
          dialog+="</fieldset>";
          dialog += "</div>";
        }else{
          dialog+="<div id='save_json_div'>";
          dialog+="<fieldset ><legend id='legend_format'>JSON Format</legend>";
<legend id="legend_format">JSON Format</legend><a target="blank" style="word-break: break-all;" rel="noopener noreferrer" href="https://servicemap.disit.org/WebAppGrafo/api/v1/?selection=43.53710051325697;10.602493286132814;44.00170567699191;11.909179687500002&amp;categories=Service%3BBusStop%3BSensorSite&amp;maxResults=100&amp;maxDists=0.1&amp;text=&amp;model=&amp;value_type=&amp;format=json" id="query_link_json" value="Save">https://servicemap.disit.org/WebAppGrafo/api/v1/?selection=43.53710051325697;10.602493286132814;44.00170567699191;11.909179687500002&amp;categories=Service%3BBusStop%3BSensorSite&amp;maxResults=100&amp;maxDists=0.1&amp;text=&amp;model=&amp;value_type=&amp;format=json</a><br><br>
<div>
<div style="FLOAT: LEFT;">
<input type="button" id="copy_query_json" value="Copy" onclick="copy_query(&quot;query_link_json&quot;);">
</div>
<div style="left: 10px;position: relative;padding-right: 3px;">
<span style="color: red;font-weight:bold;font-size: 10px;">note:</span>
<span style="font-size: 10px;">You can add \'&amp;accessToken=\' to update the results with private/delegated devices </span>
</div>
</div></fieldset>
</div>
        }

      }else if((type=="Position_Bus" || type=="freeText") && selectedorgUrl!=superServiceMapApiUrl){
      
        var queryLink_json="";
        queryLink_json=queryLink.replace(multiServiceMapUrl,selectedorgUrl);
        queryLink_json=queryLink_json.substring(0,queryLink_json.length-4)+"json";
        queryLink=queryLink.replace(multiServiceMapUrl,selectedorgUrl);

        dialog+="<div id='save_json_div'>";
        dialog+="<fieldset ><legend id='legend_format'>JSON Format</legend>";
        dialog += "<a target='blank' style='word-break: break-all;' rel='noopener noreferrer' href='"+queryLink_json+"' id='query_link_json' value='Save' >" +queryLink_json+ "</a>";
        dialog += "<br><br><input type='button' id='copy_query_json' value='Copy' onclick='copy_query(\"query_link_json\");'>";
        dialog+="</fieldset>";
        dialog += "</div>";
        dialog += "<br>";
        dialog+="<div id='save_html_div'>";
        dialog+="<fieldset  ><legend id='legend_format'>HTML Format</legend>";
        dialog += "<a target='blank' style='word-break: break-all;' rel='noopener noreferrer' href='"+queryLink+"' id='query_link_html' value='Save' >" +queryLink+ "</a>";
        dialog += "<br><br><input type='button' id='copy_query_html' value='Copy' onclick='copy_query(\"query_link_html\");'>";
        dialog+="</fieldset>";
        dialog += "</div>";
      
      
      }else if(type!="Position_Bus" || type!="freeText"){

        var queryLink_json="";
        queryLink_json=queryLink.replace(multiServiceMapUrl,selectedorgUrl);
        queryLink_json=queryLink_json.substring(0,queryLink_json.length-4)+"json";

        if(typeService=="weather"){
          queryLink=queryLink.replace(multiServiceMapUrl,selectedorgUrl);
        } 

        dialog+="<div id='save_json_div'>";
        dialog+="<fieldset ><legend id='legend_format'>JSON Format</legend>";
        dialog += "<a target='blank' style='word-break: break-all;' rel='noopener noreferrer' href='"+queryLink_json+"' id='query_link_json' value='Save' >" +queryLink_json+ "</a>";
        dialog += "<br><br><input type='button' id='copy_query_json' value='Copy' onclick='copy_query(\"query_link_json\");'>";
        dialog+="</fieldset>";
        dialog += "</div>";
        dialog += "<br>";
        dialog+="<div id='save_html_div'>";
        dialog+="<fieldset><legend id='legend_format'>HTML Format</legend>";
        dialog += "<a target='blank' style='word-break: break-all;' rel='noopener noreferrer' href='"+queryLink+"' id='query_link_html' value='Save' >" +queryLink+ "</a>";
        dialog += "<br><br><input type='button' id='copy_query_html' value='Copy' onclick='copy_query(\"query_link_html\");'>";
        dialog+="</fieldset>";
        dialog += "</div>";
      }
      dialog += "</div>";
    }
    dialog += "</div>";
    $(position).append(dialog);
    $("#overMap").show();
    if (save_operation == "write")
      $("#serviceMap_save_dialog").attr("class", "mini");
    // if(user_mail!="")$("#axrelations_save_dialog").attr("class","resave");
  
    $("#serviceMap_save_dialog #sm_save_close").click(function (e)
    {
      $("#serviceMap_save_dialog").fadeOut(300);
      $("#serviceMap_save_dialog").remove();
      $("#overMap").hide();
    });
    //Defines some trigger.
    $("#serviceMap_save_dialog #sm_save_overwrite").click(function () {//Overwrites the previous save
      $("#serviceMap_save_dialog").attr("class", "resave");
      $("#serviceMap_save_dialog #serviceMap_save_main_div").remove();
      dialog = "<div id='serviceMap_save_main_div'>";
      dialog += "<p>If you want you can change the title and the description of the current save.";
      dialog += "</br>Title of the graph: </br><input class='save_text' type='text' id='query_save_title' placeholder='Service title'></br> Description of the query: </br><textarea class='save_text' id='query_save_desc' placeholder='Insert a description'>" + description + "</textarea>";
      dialog += "<input type='button' id='proceed' value='Send'>";
      dialog += "</div>";
      $("#serviceMap_save_dialog").append(dialog);
      $("#serviceMap_save_dialog #query_save_title").val(queryTitle);
      $("#serviceMap_save_dialog #proceed").click(function (d) { //Defines the function for check the email and save the configuration.
        if (!query_checks_description())
          return;
        $("#serviceMap_save_dialog").attr("class", "small");
        // saveQuery(user_mail, true, typeService, id, nameService, $('input[name=format]:checked').val(), type);
        saveQuery('', true, typeService, id, nameService, '', type);
      });
    });
    $("#serviceMap_save_dialog #sm_save_normally").click(function () {
      $("#serviceMap_save_dialog").attr("class", "resave");
      $("#serviceMap_save_dialog #serviceMap_save_main_div").remove();
      dialog = "<div id='serviceMap_save_main_div'>";
      dialog += "<p style=\"display: none;\">Please insert a valid e-mail, and you will receive a link that could allow you to access at the results and share it with your friends.</p>";
      dialog += "<b style=\"display: none;\">Insert your e-mail:</b>";
      dialog += "<input class='save_text' type='email' id='user_email' name='email' autocomplete='on' placeholder='email@domain.ext' value='"+lastEmail+"' style=\"display: none;\">";
      //Inserts a testbox for the title and a text area for the description.
      dialog += "<b>Insert a title: </b><input  class='save_text' type='text' id='query_save_title' placeholder='Service title' value='" + title + "' style=\"display: none;\"></br>"+
                 "<b>Insert a description: </b><textarea  class='save_text' id='query_save_desc' placeholder='Insert a description' style=\"display: none;\"></textarea>";
      //           dialog += "<a href='' id='query_link'> dfgdg </a>";
      dialog += "<br><br><input type='button' id='checkmail' value='Send' >";
      dialog += "</div>";
      
      /*dialog += "<p>You can save your query. Please insert a valid e-mail, and you will receive a link that could allow you to access at the query results and share it with your friends</p>";
      dialog += "<p>Insert your e-mail:</p>";
  
      // dialog+="<form autocomplete='on'>";
      dialog += "<input class='save_text' type='email' id='user_email' name='email' autocomplete='on' placeholder='email@domain.ext'>";
      dialog += "</br>Insert a title for the query: </br><input class='save_text' type='text' id='query_save_title' placeholder='Service title'></br> Insert a description for the query: </br><textarea id='query_save_desc' placeholder='Insert a description'></textarea>";
      dialog += "<input type='button' id='checkmail' value='Send'>";
      // dialog+="</form>";
      dialog += "<p> The Query saved will be distinct with respect to the original one. ";
      dialog += "You will receive the url link to access at the new query from email. </p>";
      dialog += "</div>";*/
      $("#serviceMap_save_dialog")
              .attr("class", "resave")
              .append(dialog);
  
      $("#serviceMap_save_dialog #checkmail").click(function (d) { //Defines the function for check the email and save the configuration.
        // var email = $("#serviceMap_save_dialog #user_email")[0];
        // //Checks if the email is correct.
        // var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        // if (!filter.test(email.value)) {
        //   alert('Please provide a valid email address!');
        //   return;
        // }
        // else {
        //   if (query_checks_description() == false)
        //     return;
        //   lastEmail = email.value;
          saveQuery('', false, typeService, id, nameService, '', type);
        // }
      });
    });
    $("#serviceMap_save_dialog #checkmail").click(function (d) { //Defines the function for check the email and save the configuration.
      // var email = $("#serviceMap_save_dialog #user_email")[0];
      // //Checks if the email is correct.
      // var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      // if (!filter.test(email.value)) {
      //   alert('Please provide a valid email address!');
      //   return;
      // }
      // else {
      //   if (query_checks_description() == false)
      //     return;
      //   lastEmail = email.value;
        saveQuery('', false, typeService, id, nameService,'', type);
      // }
    });
  }

   
  function saveQuery(email, update, typeService, id, nameService, format, type) {

    var linkToReturn = "";
      
    //MICHELA: inizio alternativa al commento sotto--------------------
      //var categorie = [];
      //var event = false;
       raggioServizi = $("#raggioricerca").val();
       raggioSensori = $("#raggioricerca").val();
       raggioBus = $("#raggioricerca").val();
       numeroRisultatiServizi = $("#numberResults").val();//numero preso dal form TextSearch
       numeroRisultatiSensori = $("#numberResults").val();
       numeroRisultatiBus = $("#numberResults").val();
       coordinateSelezione =  $("#selezione").html();
       actualSelection = $("#selezione").html();
       stringaPopupOpen = '';
       stringaCategorie = '';
       zoom = map.getZoom();
       c = map.getCenter();
       center = JSON.stringify(c);
      center = escape(center);
       weatherCity= '';
       textFilter = '';
       stringaPopupOpen = "";
       var baseUrl=selectedorgUrl;
       
       if(format=='html'){
        baseUrl=multiServiceMapUrl;
       }
            
      if(type=='embed'){//qui ci passa solo se premo il bottone in basso a dx
          //deve salvare TUTTO
          //DA SISTEMARE
          
          //-----------------------------------------------INIZIO EMBED DA SISTEMARE
          //eventi in alternativa ai tab dx se Ã¨ un evento non c'Ã¨ altro che proviene dai tab laterali
          if($("#event_choice_d").is(':checked') || $("#event_choice_w").is(':checked') || $("#event_choice_m").is(':checked')){
                  //event = true;
                  if($("#event_choice_d").is(':checked'))
                      actualSelection = $("#event_choice_d").val();//query_event.type;
                  else if ($("#event_choice_w").is(':checked'))
                      actualSelection = $("#event_choice_w").val();//query_event.type;
                  else 
                      actualSelection = $("#event_choice_m").val();//query_event.type;
                  if(coordinateSelezione.includes("Coord: ") )
                      coordinateSelezione = coordinateSelezione.split("Coord: ")[1].replace(",", ";");
          } 
          else if(!jQuery.isEmptyObject(query)){//ultima query fatta da tab laterali (regular o transversal) + ricerca comune
             stringaCategorie = query.categorie;
              actualSelection = query.selection;
              //actualSelection = escape(actualSelection);
              text = query.text;//$("#serviceTextFilter").val();
              //coordinate
              //SE ho un punto metto 43.770226103491105;11.257381439208983
              //SE ho visible area metto due punti in basso a sx e in alto a dx: 43.772;11.237;43.780;11.262
              //SE ho una area specifica ci metto il nome dell'area??? 
              //SE ho inside NON lo so???
              coordinateSelezione = query.selection;
              //raggi
              if(jQuery.isEmptyObject(query.raggio)){//siamo nel caso in cui la ricerca viene fatta in base al comune, pannello in alto a sx
                  //quindi metto zero perchÃ¨ devo trovare tutto, limitatamente al numero di servizi che ho richiesto
                  raggioServizi = '0.1';
                  raggioSensori = '0.1';
                  raggioBus = '0.1';
                  actualSelection = query.selection;
                  text = ''; //rimetto il default value
              }
              else{
                  if(query.raggio[0]=='inside'){ //se Ã¨ inside devo mettere -1 l'unico caso in cui si mette -1
                      raggioServizi = '-1';
                      raggioSensori = '-1';
                      raggioBus = '-1';
                  }
                  else if(query.raggio[0]=='geo' || query.raggio[0]=='area' ){
                      raggioServizi = '0.1';
                      raggioSensori = '0.1';
                      raggioBus = '0.1';
                      coordinateSelezione = query.selection;
                  }
                  else//caso dei transversal services e dei restanti regular
                      raggioServizi = raggioSensori = raggioBus  = query.raggio[0];
              }
              //numero risultati
              if(selezione.includes("COMUNE")){
                  numeroRisultatiServizi = query.limit;
                  numeroRisultatiSensori = query.limit;
                  numeroRisultatiBus = query.limit; 
              }
              else{
                  numeroRisultatiServizi = query.numeroRisultati[0];
                  numeroRisultatiSensori = query.numeroRisultati[0];
                  numeroRisultatiBus = query.numeroRisultati[0]; 
              }
          }
          
          //previsioni
          weatherCity = $(".meteo").attr("id");
          
          //servizi singoli
          stringaPopupOpen = id;
          numberOpen = listOfPopUpOpen.length;
          //var stringaPopupOpen = listOfPopUpOpen.join(";");
          for (var i = 0; i < numberOpen; i++) {
            if (i == numberOpen - 1)
              stringaPopupOpen += JSON.stringify(listOfPopUpOpen[i]);
            else
              stringaPopupOpen += JSON.stringify(listOfPopUpOpen[i]) + " , ";
          }
          if((query.type != 'freeText') && actualSelection.indexOf("Bus Line") >= 0){//caso di selezione TPL da forma in alto a sx
              coordinateSelezione = ""; 
              if(stringaCategorie=='')
                  stringaCategorie = "PublicTransportLine";
              else
                  stringaCategorie += ";PublicTransportLine";
              
              actualSelection = $('#busstopRes')[0].innerText;
              //"Bus Stops:15 -  Bus Line: Ataf&Linea - Line: C3"
              
              sel = actualSelection.split("Bus Line: ")[1];
              linea = sel.split(" - ");
              sel_1 = linea[1].split("Line: ")[1];
              numero_corsa = sel_1.split(" - ");
              actualSelection = linea[0]+";"+numero_corsa[0];
              
          }
          /*else//da controllare
              actualSelection = '';*/
              
      //-----------------------------------------------FINE EMBED DA SISTEMARE    
      }else{//se premo gli altri dischetti dei singoli pannelli
          //deve salvare i singoli contenuti
          //in query c'Ã¨ l'ultima ricerca fatta dai pannelli
          //in query_event l'ultima ricerca degli eventi
          if(type=='event'){

              if($("#event_choice_d").is(':checked') || $("#event_choice_w").is(':checked') || $("#event_choice_m").is(':checked')){
                  //event = true;
                  if($("#event_choice_d").is(':checked'))
                      actualSelection = $("#event_choice_d").val();//query_event.type;
                  else if ($("#event_choice_w").is(':checked'))
                      actualSelection = $("#event_choice_w").val();//query_event.type;
                  else 
                      actualSelection = $("#event_choice_m").val();//query_event.type;
                  if(coordinateSelezione.includes("Coord: "))
                      coordinateSelezione = coordinateSelezione.split("Coord: ")[1].replace(",", ";");
              }

              var data = "";
              
              if (eventRange != null || eventRange != undefined)
                  data= data+"range="+eventRange;
          
              if (eventRaggioRic != null || eventRaggioRic != undefined)
                  data= data+"maxDists=" + eventRaggioRic;
          
              if (eventcentroRic != null || eventcentroRic != undefined)
                data= data+"selection="+eventcentroRic;
          
              if (eventNumEv != null || eventNumEv != undefined)
                data= data+"maxResults="+eventNumEv;

              if (eventText != null || eventText != undefined)
                data= data+"textFilter="+eventText;

              if (msm_access_token != "")
                // data= data+"accessToken="+accessToken;    
                accessTokenMessage=true;
             
              linkToReturn = baseUrl  +"events/?"+data+"&format="+format;
            
            }else if(type=='service'){//singolo servizio
              //idService Ã¨ l'id  parametro in ingresso alla funzione
              //typeService parametro in ingresso alla funzione
              //nameService parametro in ingresso alla funzione
              
              //pop-up del singolo servizio, meteo compreso
              stringaPopupOpen = id;
              numberOpen = listOfPopUpOpen.length;
              // //var stringaPopupOpen = listOfPopUpOpen.join(";");
              for (var i = 0; i < numberOpen; i++) {
                  if (i == numberOpen - 1)
                    stringaPopupOpen += JSON.stringify(listOfPopUpOpen[i]);
                  else
                    stringaPopupOpen += JSON.stringify(listOfPopUpOpen[i]) + " , ";
                  
                  if(nameService.includes("meteo") ){//previsioni tempo
                      weatherCity = $(".meteo").attr("id");
                      if(weatherCity==''){//caso in cui ho fatto prima ricerca degli eventi che a sua volta ha fatto comparire il tempo MA senza intervenire sul form del tab Tuscan Municipalities
                          weatherCity = nameService.split('meteo')[1] ;                        
                      }
                      type ='weather';
                  }            
              }

              link = baseUrl  + "?serviceUri=" +stringaPopupOpen;
              linkToReturn = link + "&format="+format;

          }else if(type=='query'){//dal tab regular services l'oggetto query Ã¨ pieno
              stringaCategorie = query.categorie;
              actualSelection = query.selection;
              //actualSelection = escape(actualSelection);
              textFilter = query.text;//$("#serviceTextFilter").val();
              //coordinate
              //SE ho un punto metto 43.770226103491105;11.257381439208983
              //SE ho visible area metto due punti in basso a sx e in alto a dx: 43.772;11.237;43.780;11.262
              //SE ho una area specifica ci metto il nome dell'area??? 
              //SE ho inside NON lo so???
              coordinateSelezione = query.selection;
              //raggi
              if(jQuery.isEmptyObject(query.raggio[0])){//siamo nel caso in cui la ricerca viene fatta in base al comune, pannello in alto a sx
                  //quindi metto zero perchÃ¨ devo trovare tutto, limitatamente al numero di servizi che ho richiesto
                  raggioServizi = '0.1';
                  raggioSensori = '0.1';
                  raggioBus = '0.1';
                  actualSelection = query.selection;
                  textFilter = ''; //rimetto il default value
              }
              else{
                  if(query.raggio[0]=='inside'){ //se Ã¨ inside devo mettere -1 l'unico caso in cui si mette -1
                      raggioServizi = '-1';
                      raggioSensori = '-1';
                      raggioBus = '-1';
                  }
                  else if(query.raggio[0]=='geo' || query.raggio[0]=='area' ){
                      raggioServizi = '0.1';
                      raggioSensori = '0.1';
                      raggioBus = '0.1';
                      coordinateSelezione = query.selection;
                      actualSelection = '';
                  }
                  else//caso dei transversal services e dei restanti regular
                      raggioServizi = raggioSensori = raggioBus  = query.raggio[0];
              }
              //numero risultati
              numeroRisultatiServizi = query.numeroRisultati[0];
              numeroRisultatiSensori = query.numeroRisultati[0];
              numeroRisultatiBus = query.numeroRisultati[0];

              var risultati="";

              if(numeroRisultatiSensori!=null && (numeroRisultatiSensori==numeroRisultatiServizi) && 
              numeroRisultatiBus!=null && (numeroRisultatiBus==numeroRisultatiServizi))
              risultati = numeroRisultatiServizi;
          else
              risultati = numeroRisultatiServizi+ ";" + numeroRisultatiSensori + ";" + numeroRisultatiBus;
              
              var risultatiEscaped = encodeURIComponent (risultati);

              //////////////////////////////START build api link//////////////////////////////////////////////

              var selection = "";
      
              if(actualSelection!=null && actualSelection!=""){
                  //actualSelection = unescapeUri(actualSelection);
                  if ((actualSelection.indexOf("COMUNE di") != -1)  ) {
                      selection = actualSelection;
                  } else {
                      selection = coordinateSelezione;
                  }
              }
        
              var selectionEscaped = encodeURIComponent(selection);
              var categorieEscaped = encodeURIComponent(stringaCategorie);
              var raggi = "";
        
              if(raggioSensori==raggioServizi && raggioBus==raggioServizi)
                raggi = raggioServizi;
              else
                raggi = raggioServizi + ";" + raggioSensori + ";" + raggioBus;
        
              var raggiEscaped = encodeURIComponent(raggi);

              if (id != null && id!="-1") {
                var link = "";
                if(raggiEscaped!="-1") 
                    link = baseUrl  + "?selection=" + coordinateSelezione /*idService*/ + "&categories=" + categorieEscaped + "&maxResults=" + risultatiEscaped;
                else
                    link = baseUrl + "?selection=" + coordinateSelezione /*idService*/  + "&categories=" + categorieEscaped + "&maxResults=" + risultatiEscaped + "&maxDists=" + raggiEscaped;
                    linkToReturn = link + "&format="+format;
            }
            else {
                var link="";
                if(selectionEscaped=="")
                    selectionEscaped = coordinateSelezione;
                if(raggiEscaped=="-1")
                    link =  baseUrl  + "?selection=" + selectionEscaped + "&categories=" + categorieEscaped + "&maxResults=" + risultatiEscaped;
                else
                    link = baseUrl  + "?selection=" + selectionEscaped + "&categories=" + categorieEscaped + "&maxResults=" + risultatiEscaped + "&maxDists=" + raggiEscaped;
  
                if(textFilter!=null || textFilter!=undefined || textFilter!='')    
                  link += "&text=" + encodeURIComponent(textFilter);

                if(serviceModel!='' || serviceModel!=null || serviceModel!=undefined)
                  link += "&model=" + encodeURIComponent(serviceModel);
                
                  if(value_type!='' || value_type!=null || value_type!=undefined)
                  link += "&value_type=" + encodeURIComponent(value_type);

                  if(msm_access_token!='')
                    // link += "&accessToken=" + msm_access_token;
                    accessTokenMessage=true;

                  linkToReturn = link + "&format="+format;
            }
              //////////////////////////////END build api link//////////////////////////////////////////////
          }else if(type=='freeText'){
            
            searchText = encodeURIComponent($("#freeSearch").val()); 
              
            if(actualSelection!=null && actualSelection!=""){
                actualSelection = encodeURIComponent(actualSelection);
                if ((actualSelection.indexOf("COMUNE di") != -1)  ) {
                    selection = actualSelection;
                } else {
                    selection = coordinateSelezione;
                }
            }

            if ((selection.indexOf("Service:") != -1)) {
              selection = selection.replace('NO SELECTION','');
            } else if((selection.indexOf("Coord: ") != -1)){
              selection = selection.replace('Coord: ','');
              selection = selection.replace(',',';');
            }

            searchTextMaxResults = $("#numberResults").val();
            var textEv = $("#freeSearch").val();
            var numTotRes = 0;
            var numeroEventi = searchEvent("day", null, null, searchTextMaxResults, textEv);

            if (numeroEventi != 0) {
                //risultatiRicerca((numService+numeroEventi), 0, 0, 1);
                numTotRes = numTotRes + numeroEventi;
                if (searchTextMaxResults != 0)
                searchTextMaxResults = (searchTextMaxResults - numeroEventi);
            }

            if(msm_access_token!='')
              accessTokenMessage=true;

            // linkToReturn=baseUrl+"?search="+searchText+"&maxResults="+searchTextMaxResults+"&geometry=true&accessToken="+msm_access_token+"&format="+format;
            linkToReturn=baseUrl+"?search="+searchText+"&maxResults="+searchTextMaxResults+"&geometry=true&format="+format;


          }else if(type=='weather'){//NOn ci entra verificare, dovrei cambiare le chiamate, ora entra in service
              //weatherCity = $(".meteo").attr("id");
              //coordinateSelezione = coordinateSelezione.split("Coord: ")[1].replace(",", ";");
              //nomeProvincia li prende direttamente da $("#elencoprovince").val()
              //nomeComune $("#elencocomuni").val()
              numberOpen = listOfPopUpOpen.length;
              for (var i = 0; i < numberOpen; i++) {
                if (i == numberOpen - 1)
                  stringaPopupOpen += JSON.stringify(listOfPopUpOpen[i]);
                else
                  stringaPopupOpen += JSON.stringify(listOfPopUpOpen[i]) + " , ";
              }
          }else if(type=='Position_Bus'){
            agency = $('#elencoagenzie option:selected').attr('value');
            line = $('#elencolinee option:selected').attr('value');
            
            linkToReturn=baseUrl+"tpl/bus-position/?agency="+agency+"&line="+line+ "&format="+format;
    
          }else if(type=='path'){
            routeType = $("#path_type").val();
            
            var date = $("#path_date").datepicker("getDate");
            console.log(date);
            var time = $("#path_time").timepicker("getTime", date);
            console.log(time);
            if(time==null)
            time = new Date();
            dateTimePath = encodeURIComponent(moment(time).format("YYYY-MM-DD[T]HH:mm:ss"));
            console.log("datetime: "+dateTimePath);

            // var dateTimePickerVal = $("#path_date").datepicker("getDate");
            // var year=dateTimePickerVal.getFullYear();
            // var month=dateTimePickerVal.getMonth();
            // var day=dateTimePickerVal.getDate();
			      // date_path=year+'-'+month+'-'+day;
            
            // if(time==null)
            //   time = new Date();
            // dateTimePath = moment(time).format("YYYY-MM-DD[T]HH:mm:ss");
            linkToReturn=baseUrl+"shortestpath/?source="+encodeURIComponent(pathStart)+"&destination="+encodeURIComponent(pathEnd)+"&routeType="+routeType+"&startDatetime="+dateTimePath+ "&format="+format;
    
          }else if(type=='address'){

             excludePOI = $("#quick-search-poi").is(':checked');
             searchMode = $("#quick-search-and").is(':checked') ? "AND" : "";
             categoriesAddress = encodeURIComponent($("#quick-search-categories").val());
             sortByDist = $("#quick-search-sortdist").is(':checked');
             addressMaxDists = $("#quick-search-maxdists").val();
             addressText = encodeURIComponent(adressSearchText);
    
            linkToReturn=baseUrl+"location/?search="+addressText+"&maxResults=20&searchMode="+searchMode+"&categories="+categoriesAddress+"&sortByDist="+sortByDist+"&excludePOI="+excludePOI;
    
            if($("#quick-search-position").val()!=""){
              positionAddress= encodeURIComponent($("#quick-search-position").val());
              linkToReturn=linkToReturn+"&position="+positionAddress;
            }
    
            if(addressMaxDists!=""){
              linkToReturn=linkToReturn+"&maxDists="+addressMaxDists;
            }
            linkToReturn= linkToReturn + "&format="+format;
      }
    }
      return linkToReturn;
      
      //MICHELA: FINE alternativa al commento sotto--------------------
      
    /*  //MICHELA: inizio commento --------------------
      if(!jQuery.isEmptyObject(query)){//TODO
          if(event || typeService=='weather'  ){
              var raggioServizi = "";
              var raggioSensori = "";
              var raggioBus = "";
              var numeroRisultatiServizi = "0";
              var numeroRisultatiSensori = "0";
              var numeroRisultatiBus = "0";
              coordinateSelezione =  $("#selezione").html();
              actualSelection = $("#selezione").html();;
              var eventParam = eparam;
            }
            else{
              if ((query["type"] == "freeText") ){
                  var type = query.type; 
                  text = $("#freeSearch").val();
                  var numeroRisultatiServizi = $("#numberResults").val();
                  actualSelection = null;
                  coordinateSelezione = null;
                  categorie = null;
                  var raggioServizi = $("#numberResults").val();
                  var raggioSensori = $("#numberResults").val();
                  var raggioBus = $("#numberResults").val();
                  var numeroRisultatiServizi = $("#raggioricerca").val();
                  var numeroRisultatiSensori = $("#raggioricerca").val();
                  var numeroRisultatiBus = $("#raggioricerca").val();
                  var eventParam = eparam;
              }
              else{    
              var raggioServizi = query.raggio[0];
              var raggioSensori = query.raggio[0];
              var raggioBus = query.raggio[0];
              var eventParam = "";
              var numeroRisultatiServizi = query.numeroRisultati[0];
              var numeroRisultatiSensori = query.numeroRisultati[0];
              var numeroRisultatiBus = query.numeroRisultati[0];
              
              if(query.raggio[0]=="area" )
                  var coordinateSelezione =  query.selection;//$("#selezione").html();
              }
            }
           //var actualSelection = $("#selezione").html();
              
              
              var stringaCategorie = query.categorie;
              var actualSelection = query.serviceName;
      }
      else{
          if(event){
              var raggioServizi = "";
              var raggioSensori = "";
              var raggioBus = "";
              var numeroRisultatiServizi = "0";
              var numeroRisultatiSensori = "0";
              var numeroRisultatiBus = "0";
              var eventParam = eparam;
            }
            else{
              //MICHELA: prendo i valori dalla variabile globale
              var raggioServizi = $("#raggioricerca").val();
              var raggioSensori = $("#raggioricerca").val();
              var raggioBus = $("#raggioricerca").val();
              var numeroRisultatiServizi = $('#nResultsServizi').val();
              var numeroRisultatiSensori = $('#nResultsServizi').val();
              var numeroRisultatiBus = $('#nResultsServizi').val();
            }
             //var actualSelection = $("#selezione").html();
            //if($("#selezione").html()=="area" )
              //var coordinateSelezione = query.selection;
              
            var coordinateSelezione =  $("#selezione").html();//TODO
            var actualSelection = $("#selezione").html(); //TODO
            var stringaCategorie = getCategorie('categorie').join(";");
      }
  
      if(!event && !(typeService=='weather') && !(type == "freeText")){
          if ((actualSelection.indexOf("Coord") != -1 || actualSelection.indexOf("COMUNE di") != -1) )
          currentServiceUri = "";
      }
  
    actualSelection = escape(actualSelection);
    var zoom = map.getZoom();
    var c = map.getCenter();
    var center = JSON.stringify(c);
    center = escape(center);
    // var latLongCenter = center.toString();
    if ($(".meteo").attr("id") != "")
      var weatherCity = $(".meteo").attr("id");
    else
      weatherCity = "";
    var stringaPopupOpen = listOfPopUpOpen.join(";");
    var text = $("#serviceTextFilter").val();
    
    if(!jQuery.isEmptyObject(query))
      coordinateSelezione = query["selection"];
    else
      coordinateSelezione = $("#selezione").html();;
     
    if (type == "embed") {
      if (query["type"] == "servicesByText") {
        actualSelection = query["selection"];
        numeroRisultatiServizi = query["limit"];
        text = query["text"];
        raggioServizi = query["range"];
      }
      else {
        if (query["type"] == "freeText") {
          text = query["text"];
          numeroRisultatiServizi = query["limit"];
          actualSelection = null;
          coordinateSelezione = null;
          categorie = null;
        } else {
          var serviceName = query['serviceName'];
          if (serviceName != null) {
            actualSelection = serviceName;
            coordinateSelezione = escape(query["selection"]);
          }
          else {
            actualSelection = query["selection"];
            coordinateSelezione = null;
          }
          categorie = query["categorie"];
        }
      }
    }
    if (type == "freeText") {
      text = $("#freeSearch").val();
      numeroRisultatiServizi = $("#numberResults").val();
      actualSelection = null;
      coordinateSelezione = null;
      categorie = null;
    }
    if(!event && !(typeService=='weather') && !(type == "freeText")){
      if (coordinateSelezione.indexOf("Coord") != -1){
          coordinateSelezione = coordinateSelezione.split("Coord: ")[1].replace(",", ";");
      }
    }
    *///MICHELA: FINE commento --------------------
    
  }
  
 function saveQueryInKB(stringaCategorie,numeroRisultatiServizi,numeroRisultatiSensori,numeroRisultatiBus,coordinateSelezione,raggioServizi,raggioSensori,raggioBus,actualSelection,weatherCity,stringaPopupOpen,zoom,center,parentQuery,typeService,id,nameService,type,text) {  

    $.ajax({
      // url: ctx + "../web/api/saveQuery.jsp",
      url: "https://www.disit.org/ServiceMap/api/v1/save/",
      type: "POST",
      dataType: 'json',
      async: true,
      data: {
        description: '',
        title: '',
        email: '',
        idQuery: idQuery_md5,
        idConf: idConf_md5,
        text: text,
        categorie: stringaCategorie,
        numeroRisultatiServizi: numeroRisultatiServizi,
        numeroRisultatiSensori: numeroRisultatiSensori,
        numeroRisultatiBus: numeroRisultatiBus,
        coordinateSelezione: coordinateSelezione,
        raggioServizi: raggioServizi,
        raggioSensori: raggioSensori,
        raggioBus: raggioBus,
        actSelect: actualSelection,
        weatherCity: weatherCity,
        popupOpen: stringaPopupOpen,
        zoom: zoom,
        center: center,
        update: 'false',
        parentQuery: parentQuery,
        nomeProvincia: $("#elencoprovince").val(),
        nomeComune: $("#elencocomuni").val(),
        typeService: typeService,
        idService: id, //usava currentServiceUri se non vuoto, non capito perche'
        nameService: nameService,
        typeSaving: type,
	      // excludePOI:excludePOI,
	      // searchMode:searchMode,
	      // categoriesAddress:categoriesAddress,
	      // sortByDist:sortByDist,
	      // maxDists:maxDists,
	      // positionAddress:positionAddress,
	      // term:term,
      	// agency:agency,
      	// line: line,
      	// routeType: routeType,
	      // dateTimePath: dateTimePath,
	      // pathStart:encodeURIComponent(pathStart),
	      // pathEnd:	encodeURIComponent(pathEnd),
        format: 'html',
        //eventParam: eventParam
        eventRange:eventRange,
        eventRaggioRic:eventRaggioRic,
        eventcentroRic:eventcentroRic,
        eventNumEv:eventNumEv,
        eventText:eventText,
        accessToken:accessToken,
        // model:query.serviceModel,
        // value_type:query.value_type
      },
      success: function (msg) {
        document.getElementById('copy_query_json').removeAttribute('disabled','disabled');
        document.getElementById('query_link_json').setAttribute("href",link);
        alert('msg.queryDone');
        // $("#serviceMap_save_main_div").remove();
        // var text = "The query has not been saved. We are sorry, try later or send us an email with your problems.";
        // if (msg.queryDone == true) {
        //   //if(msg['save_r'])save_r=msg['save_r'];//Saves the link to the read version.
        //   // if(msg['save_rw'])save_rw=msg['save_rw'];//Saves the link to the read/write version.
        //   if(type=="embed") {
        //     text = "<p>The <b>configuration</b> has been saved.<p><p>It can be accessed at <a href='"+makeConfUrl(msg.idConfR)+"' target='_new'>"+makeConfUrl(msg.idConfR)+"</a></p>";
        //     currentIdConf = msg.idConfR;
        //   }
        //   else
        //     text = " The <b>"+type+"</b> has been saved.";
        //   if (update != true) {
        //     text += " <p>A direct url to the query has been sent at the email: <b>" + msg.email + "</b></p>";
        //     user_mail = msg.email;
        //     //save_operation="write";
        //   }
        //   else
        //     text += "<p>" + msg.email + "'s version has been overwritten. New email has been sent. </p>";
        //   var new_dialog = "<div id='serviceMap_save_main_div'><p>" + text + "</p>";
        //   // new_dialog+="<input type='button' id='axr_btn_close' title='close' value='close'>";
        //   new_dialog += "</div>";
        //   $("#serviceMap_save_dialog").attr("class", "small");
        //   $("#serviceMap_save_dialog").append(new_dialog);
        //   $("#serviceMap_save_dialog #sm_btn_close").click(function (e)
        //   {
        //     $("#serviceMap_save_dialog").fadeOut(300);
        //     $("#serviceMap_save_dialog").remove();
        //     $("#overMap").hide();
        //   });
        // }
      },
            error: function (e) {
                console.log(e);
            }
    });

  }
  
  function query_checks_description() {//Checks if the description inserted is correct.
    var descrTitle = $("#serviceMap_save_dialog #query_save_title").val();
    if (descrTitle.length > 200) {
      alert('Title too large!');
      return false;
    }
    return true;
  }
  
  function saveQueryServices(centroRicerca, raggio, categorie, numeroRisultati, serviceName, text, serviceModel,value_type) {
    var lastQuery = new Object();
    lastQuery["selection"] = centroRicerca;
    lastQuery["raggio"] = raggio;
    lastQuery['serviceName'] = serviceName;
    lastQuery["categorie"] = categorie;
    lastQuery["numeroRisultati"] = numeroRisultati;
    lastQuery["text"] = text;
    lastQuery["type"] = "services";
    lastQuery["serviceModel"] = serviceModel;
    lastQuery["value_type"] = value_type;
    return lastQuery;
  }
  
  function saveQueryMunicipality(provincia, comune, categorie, numeroRisultati, selection) {
    var lastQuery = new Object();
    lastQuery["provincia"] = provincia;
    lastQuery["comune"] = comune;
    lastQuery["categorie"] = categorie;
    lastQuery["numeroRisultati"] = numeroRisultati;
    lastQuery["type"] = "services";
    lastQuery["selection"] = selection;
    return lastQuery;
  }
  
  function saveQueryBusStopLine(lineaBus) {
    var lastQuery = new Object();
    lastQuery["busLine"] = lineaBus;
    lastQuery["type"] = "busLine";
    return lastQuery;
  }
  
  function saveQueryEvent(param) {
    //$('#loading').show();
    var lastQuery = new Object();
    lastQuery["type"] = param;
    lastQuery["typeSaving"] = 'event';
    return lastQuery;
  }
  
  function embedConfiguration() {
    if (document.URL.indexOf("idConf=") == -1 && currentIdConf==null) {
      alert("To embed a configuration you need to save it.");
      save_handler(null,null,null,true);
      return;
    }
  
    var position = "#dialog";
    var dialog = "<div id='serviceMap_embed_dialog' title='Embed the ServiceMap' ><div id='serviceMap_info_title' >Embed your Service Map configuration<a id='sm_embed_close' title='Close'>X</a></div>";
    dialog += "<div id='serviceMap_embed_main_div'>";
    dialog += "<p>Link for embedding this configuration of Service Map:</p>";
    dialog += "<textarea id='sm_embed_link' rows=8 cols=40 onclick='this.select()' spellcheck='false'></textarea></br>";
    dialog += "<div class=\"share_left\"> <b>iFrame dimensions:</b>"
  
    dialog += "<p>Width: <input id='sm_embed_width' type='text' value='1000'></p>";
    dialog += "<p>Height: <input id='sm_embed_height' type='text' value='800' ></p>";
    dialog += "<p>Border: <input id='sm_embed_border' type='checkbox' checked='true' ></p>";
  
    dialog += "</div><div class=\"share_left\"><b>Embed options:</b>";
    dialog += "<p>Show controls: <select id='sm_embed_controls'><option>hidden</option><option>collapsed</option><option>open</option></select></p>";
    dialog += "<p>Show info: <select id='sm_embed_info'><option>hidden</option><option>collapsed</option><option>open</option></select></p>";
    dialog += "<p>Show description: <input id='sm_embed_description' type='checkbox'></p>";
    dialog += "<p>Map type: <select id='sm_embed_maptype'><option>satellite</option><option>streets</option><option>grayscale</option></select></p>";
  /*
    dialog += "<p>Scale:&nbsp;&nbsp;<input id='sm_embed_scale' type='text' value='0.7' > </br>( Insert a number between 0.3 and 6 ) </p>";
    dialog += "<b>Moves the Service Map</b> <p>x:&nbsp;&nbsp;<input id='sm_embed_trX' type='text' value='0' > </br> </p>";
    dialog += "<p>y:&nbsp;&nbsp;<input id='sm_embed_trY' type='text' value='0' > </br> </p>";
  */
    dialog += "</div>";
  
    //if (document.URL.indexOf("idConf") != -1)
    dialog += "<div class='share_right'><button id='embed_preview' style='margin-left:35%; height:35px; width:100px;'>Preview </button></div>";
    dialog += "</div></div>";
  
    $(position).append(dialog);
    $("#overMap").show();
    $("#link_to_save").click(function () {
      $('#serviceMap_embed_dialog').fadeOut(300);
      $('#serviceMap_embed_dialog').remove();
      save_handler(null, null, null, true);
      return false;
    });
    var numeric=function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
             // Allow: Ctrl+C
            (e.keyCode == 67 && e.ctrlKey === true) ||
             // Allow: Ctrl+X
            (e.keyCode == 88 && e.ctrlKey === true) ||
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    };
    $("#sm_embed_width").keydown(numeric);
    $("#sm_embed_height").keydown(numeric);
    $("#sm_embed_width").on('input', function () {
      if ($("#sm_embed_width").attr("value") != '')
        new_value = "width=\"" + $(this).attr("value") + "\"";
      else
        new_value = "width=\"800\"";
      embed_code = $("#sm_embed_link").val();
      part1 = embed_code.substr(0, embed_code.indexOf("width"));
      part2 = embed_code.substr(embed_code.indexOf("height"));
      embed_code = part1 + new_value + " " + part2;
      $("#sm_embed_link").val(embed_code);
    });
    $("#sm_embed_height").on('input', function () {
      if ($("#sm_embed_height").attr("value") != '')
        new_value = "height=\"" + $("#sm_embed_height").attr("value") + "\"";
      else
        new_value = "height=\"600\"";
      embed_code = $("#sm_embed_link").val();
      part1 = embed_code.substr(0, embed_code.indexOf("height"));
      part2 = embed_code.substr(embed_code.indexOf("src"));
      embed_code = part1 + new_value + " " + part2;
      $("#sm_embed_link").val(embed_code);
    });
    $("#sm_embed_border").change(function () {
      val_bord = "0";
      if (this.checked)
        val_bord = "1";
      new_value = "frameborder=\"" + val_bord + "\">";
  
      embed_code = $("#sm_embed_link").val();
      part1 = embed_code.substr(0, embed_code.indexOf("frameborder"));
      part2 = embed_code.substr(embed_code.indexOf("</iframe>"));
      embed_code = part1 + new_value + part2;
      $("#sm_embed_link").val(embed_code);
    });
    $("#sm_embed_controls").change(function () {
      val_bord = $(this).val();
      new_value = "controls=" + val_bord + "&";
  
      embed_code = $("#sm_embed_link").val();
      part1 = embed_code.substr(0, embed_code.indexOf("controls"));
      part2 = embed_code.substr(embed_code.indexOf("description"));
      embed_code = part1 + new_value + part2;
      $("#sm_embed_link").val(embed_code);
    });
    $("#sm_embed_description").change(function () {
      val_bord = "false";
      if (this.checked)
        val_bord = "true";
      new_value = "description=" + val_bord + "&";
  
      embed_code = $("#sm_embed_link").val();
      part1 = embed_code.substr(0, embed_code.indexOf("description="));
      part2 = embed_code.substr(embed_code.indexOf("info="));
      embed_code = part1 + new_value + part2;
      $("#sm_embed_link").val(embed_code);
    });
    $("#sm_embed_info").change(function () {
      val_bord = $(this).val();
      new_value = "info=" + val_bord + "&";
  
      embed_code = $("#sm_embed_link").val();
      part1 = embed_code.substr(0, embed_code.indexOf("info="));
      part2 = embed_code.substr(embed_code.indexOf("map="));
      embed_code = part1 + new_value + part2;
      $("#sm_embed_link").val(embed_code);
    });
    $("#sm_embed_maptype").change(function () {
      val_bord = $(this).val();
      new_value = "map=" + val_bord + "";
  
      embed_code = $("#sm_embed_link").val();
      part1 = embed_code.substr(0, embed_code.indexOf("map="));
      part2 = embed_code.substr(embed_code.indexOf("\" frameborder"));
      embed_code = part1 + new_value + part2;
      $("#sm_embed_link").val(embed_code);
    });
    $("#sm_embed_close").click(function (e)
    {
      $("#serviceMap_embed_dialog").fadeOut(300);
      $("#serviceMap_embed_dialog").remove();
      $("#overMap").hide();
    });
    $("#embed_preview").click(function () {
      var w = screen.width * 3 / 4;
      var h = screen.height * 3 / 4;
      var l = Math.floor((w / 4) / 2);
      var t = Math.floor((h / 4) / 2);
      var iframe_html = $("#sm_embed_link").val();
  
      var newPage_content = "<html><title>Embed Preview</title><head></head><body style='font-family:Verdana,Arial'><h2 style='margin:0px'>Embed Preview</h2><hr>\
                  <center>" +iframe_html + "</center>\
                  </body></html>";
      var newWindow = window.open("", "", "width=" + w + ",height=" + h + ",top=" + t + ",left=" + l+",location=false");
      newWindow.document.write(newPage_content);
    });
    //url da cambiare 
    var url_to_embed;
    if(currentIdConf!=null)
      url_to_embed = makeConfUrl(currentIdConf);
    else
      url_to_embed = makeConfUrl(getUrlParameter("idConf"));
    url_to_embed += "&controls=hidden&description=false&info=hidden&map=satellite";
    //var url_to_embed=ctx+"api/embed?idConfiguration="+idConfiguration+"&controls=false&description=false&info=false&translate=[0,0]&scale=(0.7)";
    var embed_code = "<iframe width=\"1000\" height=\"800\" src=\"" + url_to_embed + "\" frameborder=\"1\"></iframe>";
    // var embed_code="<iframe width=\"800\" height=\"500\" src=\""+url_to_embed+"\"  frameborder=\"1\"></iframe>";
    $("#sm_embed_link").val(embed_code);
  }
  
  function makeConfUrl(idConf) {
    var url = window.location.protocol+"//"+window.location.hostname;
    if(window.location.port!=80)
      url += ":"+window.location.port;
    url += ctx+"/api/embed/?idConf="+idConf;
    return url;
  }