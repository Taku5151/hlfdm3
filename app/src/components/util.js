export default class Util {
  UtilTableToCSV(tableID) {
      var table = document.getElementById(tableID);
      var data = "";
      for (var i = 0; i < table.rows.length; i++) {
          if (i > 0)
              data += "\n";
          for (var j = 0; j < table.rows[i].cells.length; j++) {
              if (j > 0)
                  data += ",";
              data += "\"" + table.rows[i].cells[j].innerHTML.replace("\"", "") + "\"";
          }
      }

      var IE = window.navigator.userAgent.indexOf("MSIE");

      if (IE > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
          var win = window.open();
          win.document.write('sep=,\r\n' + data);
          win.document.close();
          win.document.execCommand('SaveAs', true, tableID + ".csv");
          win.close();
      } else if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1)
      {
          // var data = "data:text/csv;charset=utf-8," + data;
          // var file = encodeURI(data);

          var blob = new Blob([data], { type: 'text/csv' });
          var file = URL.createObjectURL(blob);

          var templink = document.createElement("a");
          templink.setAttribute("href", file);
          templink.setAttribute("download", tableID + ".csv");
          templink.click();
      } else
      {
          var data = "data:text/csv;charset=utf-8," + data;
          var file = encodeURI(data);
          window.open(file);
      }


      /*
       if (navigator.appName == "Microsoft Internet Explorer") {
       var win = window.open();
       win.document.write('sep=,\r\n' + data);
       win.document.close();
       win.document.execCommand('SaveAs', true, tableID + ".csv");
       win.close();
       }
       else {
       var data = "data:text/csv;charset=utf-8,";
       var file = encodeURI(data);
       window.open(file);
       }
       */
  }
  UtilParseDate(string) {
      if (string === "0000-00-00")
          return "";
      //return new Date(string);
      else
      {
          var split1 = string.split(" ");
          var split2 = split1[0].split("-");
          if (split2.length > 1)
          {
              return new Date(split2[0], split2[1] - 1, split2[2]);
          }
          else
          {
              var split3 = split2[0].split("/");
              return new Date(split3[2], split3[0] - 1, split3[1]);
          }
      }
  }
  UtilParseDateTime(string) {
      if (string === "0000-00-00")
          return "";
      //return new Date(string);
      else
      {
          var split1 = string.split(" ");
          var split2 = split1[0].split("-");
          var split4 = split1[1].split(":");

          if (split2.length > 1)
          {
              return new Date(split2[0], split2[1] - 1, split2[2], split4[0], split4[1], split4[2]);
          }
          else
          {
              var split3 = split2[0].split("/");
              return new Date(split3[2], split3[0] - 1, split3[1]);
          }
      }
  }
  UtilGetSQLDate(date) {
    return `${date.getFullYear()}-${date.getMonth() < 9 ? "0" : ""}${(date.getMonth() + 1)}-${date.getDate() < 10 ? "0" : ""}${date.getDate()}`;
  }
  UtilConvertDateToSQLFormat(date) {
      if (date == "")
          return  "0000-00-00";
      else
      {
          var split1 = date.split("/");
          return split1[2] + "-" + split1[0] + "-" + split1[1];
      }
  }
  FormatDate(date) {
      if (typeof date.getMonth === 'function' && isNaN(date.getMonth()) === false)
      {
          var temp = date.getMonth() + 1;
          var temp1 = date.getDate();
          var temp2 = date.getFullYear();

          var temp3 = "";
          var temp4 = "";

          if (temp < 10)
              temp3 = "0" + temp;
          else
              temp3 = temp;

          if (temp1 < 10)
              temp4 = "0" + temp1;
          else
              temp4 = temp1;

          return temp3 + "/" + temp4 + "/" + temp2;
      }
      else
      {
          return "(Blank)";
      }
  }
}
