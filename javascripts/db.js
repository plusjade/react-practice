// Database Wrapper (WIP)
// When using localStorage, there will only ever be one (real) user,
// so this is mostly for demo purposes.
var DB = {
    saveUser : function(email) {
        localStorage.setItem('email', email);
    }
    ,
    doesUserExist : function(email, callback) {
        callback(localStorage.getItem('email') === email);
    }
    ,
    // note email is unused because we don't actually need scoping in localStorage.
    saveUserAnswer : function(email, data) {
        localStorage.setItem(data.question, data.answer);
        this.verifyAnswer(data.question, data.answer, function(isCorrect) {
            if(isCorrect) {
                var correct = localStorage.getItem('correct') || 0;
                localStorage.setItem('correct', (correct*1)+1);
            }
        })
    }
    ,
    verifyAnswer : function(question, answer, callback) {
        this.lookupTable(function(lookup) {
            callback(lookup[question] === answer);
        })
    }
    ,
    _lookupTableCache : null
    ,
    // Lookup table is a dict of question to correct answer.
    lookupTable : function(callback) {
        if(DB._lookupTableCache) {
            callback(DB._lookupTableCache)
            return;
        }

        var xmlhttp;
          if (window.XMLHttpRequest) {
              // code for IE7+, Firefox, Chrome, Opera, Safari
              xmlhttp = new XMLHttpRequest();
          } else {
              // code for IE6, IE5
              xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
          }

          xmlhttp.onreadystatechange = function() {
              if (xmlhttp.readyState == 4 ) {
                 if(xmlhttp.status == 200) {
                    var lookup, rsp;
                    rsp = JSON.parse(xmlhttp.responseText);
                    lookup = {};
                    for(var q in rsp) {
                        lookup[q] = rsp[q][0];
                    }
                    DB._lookupTableCache = lookup;

                    callback(lookup);
                 }
              }
          }

          xmlhttp.open("GET", "/questions.json", true);
          xmlhttp.send();
    }
}
