/** Get the Bitbucket user data
 * @param {string} username - Bitbucket user username
 */
function getUser(username, callback){
    var xhttpRequest;
    var bitbucketApi = 'https://api.bitbucket.org/2.0/users/' + username;
    if (window.XMLHttpRequest) {
        xhttpRequest = new XMLHttpRequest();
        } else {
        // code for IE6, IE5
        xhttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhttpRequest.open('GET', bitbucketApi, true);

    xhttpRequest.responseType = 'text';

    var response;
    xhttpRequest.onload = function () {
        if (xhttpRequest.readyState === xhttpRequest.DONE) {
            if (xhttpRequest.status === 200) {
                response = xhttpRequest.responseText;
                callback(returnData(response));
            }
        }
    };

    xhttpRequest.send(null);
}

/** Get the information about user repostiories
 * @param {string} username - Bitbucket user username
 */
function getRepositories(username, callback){
    var xhttpRequest;
    var bitbucketApi = 'https://api.bitbucket.org/2.0/repositories/' + username;
    if (window.XMLHttpRequest) {
        xhttpRequest = new XMLHttpRequest();
        } else {
        // code for IE6, IE5
        xhttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhttpRequest.open('GET', bitbucketApi, true);

    xhttpRequest.responseType = 'text';

    var response;
    xhttpRequest.onload = function () {
        if (xhttpRequest.readyState === xhttpRequest.DONE) {
            if (xhttpRequest.status === 200) {
                response = xhttpRequest.responseText;
            }

            callback(returnData(response));
        }
    };

    xhttpRequest.send(null);
}

function returnData(data){
    var JsonData = JSON.parse(data);
    return JsonData;
}

function formatDate(date){
    var newDate = moment(date).format('DD.MM.YYYY.');
    return newDate;
}

// User username
var username = 'vidovicmiroslav';

// User avatar
var avatar = 'https://bitbucket.org/account/'+username+'/avatar/128/';

// Repositories data
var repositories = getRepositories(username, function(response) {
    // handleData(response);
});

// User details
// var user = getUser(username, function(response){
//     var created_on = response.created_on;
//     console.log(response);
// });

function loadData() {

    // load user data
    $("#targetUser").load("template.html #user", function() {
        var template = $("#user").html();

        getUser(username, function(response){
            var data = {
             username : username,
             avatar : avatar,
             created_on : formatDate(response.created_on),
             display_name : response.display_name,
             link : response.links.html.href,
            };

            // console.log(response);
            var rendered = Mustache.render(template, data);
            $('#targetUser').html(rendered);

        });

    });

    //load repository data
    $("#targetRepositories").load("repositoryTemplate.html #repositories", function() {
        var template = $("#repositories").html();

        getRepositories(username, function(response) {
            var data = {
                repository : response.values,
                "created": function(){
                    return formatDate(this.created_on);
                },
                "updated": function(){
                    return formatDate(this.updated_on);
                }
            };
            console.log(response.values[0]);

            var rendered = Mustache.render(template, data);
            $('#targetRepositories').html(rendered);

        });

    });
}
