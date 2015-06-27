$(document).ready(function() {

    $("button").click(function() {
        text = $(this).attr("name");
        fireAJAX(text);
      });
    
// parse the data returned from the shakespeare analysis and
// format it into a table to add to the page
    function parseData(data) {
        disableState();
        $('#results-area').html(''); 
        var myAppendTable = "<table class='table table-bordered table-striped' style='max-width:700px;'>";
    
        // loop through the analyzed speakers
        for (var i = 0; i < data.length; i++) {
            var n = data[i].name,
                s = data[i].sentiment.toFixed(2),
                w = data[i].words,
                m = (data[i].matchedwords * 100).toFixed(2);
                console.log("n =" + n + "s = " + s + "m = " + m);
            
                // add html table to main page
                myAppendTable += "<tr style='border:2px solid black;'><td colspan='2' style='border-bottom:1px solid black;'>" + n 
                        + "</td></tr><tr><td><table style='background:none; width:100%;'><tr style='border-bottom:1px solid black;'>"
                        + "<td>Score</td><td style='text-align:right;'>" + s 
                        + "</td></tr><tr><td>% Words Matched</td><td style='text-align:right;'>" + m + "%"
                        + "</td></tr></table></td><td style='width:300px;'><div style='overflow:scroll; width:100%; height:150px;'>" + w + "</div></td></tr>";
        };
        
        myAppendTable += "</table>";
        $('#results-area').append(myAppendTable);
    }

    // sends an AJAX call to the search route
    function fireAJAX(text) {
        $.ajax({
            type: 'POST',
            url: '../analyze',
            data: {
                search: text
            },
            beforeSend: function(xhr) {
                enableState();
            },
            success: parseData,
            error: oops
        });
    }
  
    function oops(data) {
        $('.error').show();
        disableState();
    }
 
    function disableState() {
        $('button').prop('disabled', false);
    }
 
    function enableState() {
        $('button').prop('disabled', true);
    }
    
});