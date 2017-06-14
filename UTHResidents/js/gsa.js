// JavaScript Document


<!-- SCRIPT FOR GOOGLE INSIDE SEARCH -->



  function submitSwitchboard() {
    var strQ  = document.gs.q.value;
    if (trim(strQ) != '') {
      document.gsa.q.value=strQ;
      document.google_search.q.value=strQ;
      if (document.gs.selection1.checked) {
        document.google_search.submit();
        }
      if (document.gs.selection2.checked) {
        document.gs.submit();
        }
      
      }
    return false;
    }


  function trim(stringToTrim) {
    return stringToTrim.replace(/^\s+|\s+$/g,"");
  }

  function rollOn(x) {
    return true;
  }
  
  function rollOff(x) {
    return true;
  }
