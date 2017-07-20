$(document).ready(function() {
  
    // Define PC homepage URL; update a href links:
    var pcHome = "http://www.pathwaycommons.org/";
    $(".pc-url").each(function(i, a) {
      var e = $(a);
      e.attr('href', pcHome + e.attr('href'));
    });
    
    // Setup clipboard
    var clip = new ZeroClipboard($("#clip"));
    var curlClip = new ZeroClipboard($("#curlClip"));
    var rClip = new ZeroClipboard($("#rClip"));
    var pythonClip = new ZeroClipboard($("#pythonClip"));
    var groovyClip = new ZeroClipboard($("#groovyClip"));

    if (!String.prototype.encodeHTML) {
        String.prototype.encodeHTML = function () {
            return this.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
        };
    }

    /* HANDLEBARS */
    Handlebars.registerHelper('toLowerCase', function(str) {
        return str.toLowerCase();
    });

    Handlebars.registerPartial('exampleTmpl', $("#example-template").html());

    var menuTmpl = Handlebars.compile($("#menu-template").html());
    $('#sidebar').append(menuTmpl({api: api}));

    var middleTmpl = Handlebars.compile($("#middle-template").html());
    $('#middle').append(middleTmpl({api: api}));

    // NOTE: This is done to make sure the document is ready.
    $(document).on('click', '.example', function(evt) {
        evt.preventDefault();

        var id = this.id;

        // NOTE: These return arrays
        var tmp = _.filter(api, function(obj) { return _.some(obj.examples, {id: id}) });
        var exampleTmp = _.where(tmp[0].examples, {id: id});

        var params = exampleTmp[0].params;

        var func = tmp[0].name.toLowerCase();

        // RESET FORM
        var formId = 'form#form-' + func + ' :input';
        console.log("F: " + formId);
        $(formId).each(function() {
            $(this).val('');
        });

        // FILL IN FORM
        _.each(params, function(val, key) {
            var inputId = 'param-' + func + '-' + val.param;
            console.log("II: " + inputId + " V: " + val.value);

            $('#' + inputId).val(val.value);
        });
    });

    /* Run example */
    $(".execBtn").click(function(evt) {
        var elem = $(this).closest('form');
        var query = [];
        var returnType = "";
        var command = elem.attr('id').replace('form-', "");

        console.log("ETI: " + elem.attr('id'));
        elem.find('.form-control').each(function() {
            var tmp = $(this).attr('id');
            tmp = tmp.replace('param-' + command + '-', "");
            console.log("P: " + tmp + " et " + $(this).val());

            if($(this).val() !== null && $(this).val() !== "") {
                if(tmp != "returnType") {
                    //console.log(tmp + " = " + $(this).val());
                    query.push(tmp + "=" + $(this).val());
                } else {
                    //console.log("RT: " + tmp + " = " + $(this).val());
                    returnType = "." + $(this).val();
                }
            }
        });

        var baseUrl = pcHome + "pc2/";
        var url = baseUrl + "search.json?q=Q06609";
        var url2 = baseUrl + command + returnType + '?' + query.join('&');
        console.log("URL2: " + url2);

        $('#requestLink').attr('href', url2);
        $('#requestUrl').text(url2);

        //$("#requestUrl").html('<a class="codeLink" href="' + url2 + '" target="_blank">Open in New Tab</a><pre>' + url2 + '</pre>');
        $("#curlCode").text('curl -X GET ' + url2);
        $("#pythonCode").text("from urllib2 import Request, urlopen\n\nrequest = Request('" + url2 + "')\n\nresponse_body = urlopen(request).read()\nprint response_body");
        $("#rCode").text("library(httr)\n\nresult <- GET('" + url2 + "')\n\ncontent(result)");
        $("#groovyCode").text("content = '" + url2 + "'.toURL().text\n\nprintln content");

        $.ajax({
            type: "GET",
            url: url2,
            dataType: "text",
            timeout: 10000,
            success: function(data) {
                if(returnType.indexOf("json") != -1) {
                    //console.log("J: " + data);
                    //var tmp = JSON.parse(data);
                    //var tmp2 = JSON.stringify(tmp, null, 2);
                    var output = vkbeautify.json(data);
                    $('#responseCode').attr('class', 'json');
                    $('#responseCode').text(output);

                    //$("#response").html('<pre><code id="responseCode" class="json">' + json_pp + '</code></pre>');
                } else {
                    //console.log("X: " + data);
                    //var tmp = data.encodeHTML();
                    var output = vkbeautify.xml(data);
                    $('#responseCode').attr('class', 'xml');
                    $('#responseCode').text(output);

                    //$("#response").html('<pre><code id="responseCode" class="xml">' + xml_pp.encodeHTML() + '</code></pre>');
                }
            },
            error: function(xhr, status, errorThrown) {
                $('#responseCode').text('Status: ' + status + " ERROR: " + errorThrown);
                //$("#response").html('<pre><code id="responseCode">Status: ' + status + " ERROR: " + errorThrown + '</code></pre>');
            }
        }).done(function() {
            // NOTE: Allow the div to expand the original size
            // NOTE: Both must be changed
            $('#responseCode').css({"height": getResponseHeight() - 40});
            $('#response').css({"height": getResponseHeight() - 20});

            // NOTE: Does not run if async is true in Gist download
            $("code").each(function(i, codeDiv) {
                hljs.highlightBlock(codeDiv);
            });
        });

        $(document)
            .ajaxStart(function() {
                //$loading.show();
                waitingDialog.show('Fetching ...', { dialogSize: 'sm', progressType: 'primary' });
            })
            .ajaxStop(function() {
                //$loading.hide();
                waitingDialog.hide();
            });


        /* SPLIT */
        // RESIZE EDITORS
        // Taken from: http://jsfiddle.net/xBjnY/122/
        //window.onresize = resize;
        //resize();

        function resize() {
            var h = (window.innerHeight || (window.document.documentElement.clientHeight || window.document.body.clientHeight));
            var divHeight = 20 + $("#div_left").height();//20=body padding:10px
            $("#content").css({ "min-height": h - divHeight + "px" });
            //$("#div_vertical").css({ "height": h - divHeight + "px" });
            //$("#LeftPanel").css({ "height": h - divHeight + "px" });
            //$("#responseSidebar").css({
            //    //"width": $("#content").width() - $("#navBar").width() - $("#middle").width() + "px"
            //    "width": '300px'
            //});
        }

        jQuery.resizable = function(resizerID, vOrH){
            jQuery('#' + resizerID).bind("mousedown", function(e){
                var start = e.pageY;
                if(vOrH=='v') start = e.pageX;
                jQuery('body').bind("mouseup", function(){
                    jQuery('body').unbind("mousemove");
                    jQuery('body').unbind("mouseup");

                });
                jQuery('body').bind("mousemove", function(e){
                    var end = e.pageY;
                    if(vOrH=='v') end = e.pageX;
                    if(vOrH=='h'){
                        jQuery('#' + resizerID).prev().height(jQuery('#' + resizerID).prev().height()+ (end-start));
                        jQuery('#' + resizerID).next().height(jQuery('#' + resizerID).next().height()- (end-start));
                    }
                    else{
                        jQuery('#' + resizerID).prev().width(jQuery('#' + resizerID).prev().width()+ (end-start));
                        jQuery('#' + resizerID).next().width(jQuery('#' + resizerID).next().width()- (end-start));
                    }
                    start = end;

                    // NOTE: Allow the div to expand the original size
                    // NOTE: Both must be changed
                    $('#responseCode').css({"height": getResponseHeight() - 40});
                    $('#response').css({"height": getResponseHeight() - 20});
                });
            });
        }

        jQuery.resizable('div_right', "h");
    });

    function getResponseHeight() {
        var totalHeight = 0;

        $("#something").children().each(function(){
            totalHeight = totalHeight + $(this).outerHeight(true);
        });

        var remainingSpace = $("#top").outerHeight(true) - totalHeight;

        //console.log("RS: " + remainingSpace);
        return(remainingSpace);
    }

    // NOTE: Must happen after appending menu
    $('body').scrollspy({
        target: '.bs-docs-sidebar',
        offset: 20
    });

    $('#clip').click(function() {
        //alert($('#responseCode').text());
        clip.setText($('#responseCode').text());
    });

    $('#curlClip').click(function() {
        curlClip.setText($('#curlCode').text());
    });

    $('#rClip').click(function() {
        rClip.setText($('#rCode').text());
    });

    $('#pythonClip').click(function() {
        pythonClip.setText($('#pythonCode').text());
    });

    $('#groovyClip').click(function() {
        groovyClip.setText($('#groovyCode').text());
    });
});



