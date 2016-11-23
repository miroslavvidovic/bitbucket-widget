/** Returns the Bitbucket user information.
 * @param {string} username - The Bitbucket username.
 */
function getUser(username, callback){
    var xhttpRequest;
    var bitbucketApi = "https://api.bitbucket.org/2.0/users/" + username;

    if (window.XMLHttpRequest) {
        xhttpRequest = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhttpRequest.open("GET", bitbucketApi, true);
    xhttpRequest.responseType = "text";
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

/** Returns info for repositories owned by the user.
 * @param {string} username - The Bitbucket username.
 */
function getRepositories(username, callback){
    var xhttpRequest;
    var bitbucketApi = "https://api.bitbucket.org/2.0/repositories/" + username;
    if (window.XMLHttpRequest) {
        xhttpRequest = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhttpRequest.open("GET", bitbucketApi, true);
    xhttpRequest.responseType = "text";
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

/** Returns data in json format.
 * @param {string} data.
 * @returns {json} jsonData.
 */
function returnData(data){
    var jsonData = JSON.parse(data);
    return jsonData;
}

/** Returns date in DD.MM.YYYY. format.
 * @param {date} inputDate. 
 * @returns {date} newDate - Properly formated date.
 */
function formatDate(inputDate){
    var newDate = moment(inputDate).format("DD.MM.YYYY.");
    return newDate;
}

/** Returns the user avatar url.
 * @param {string} username
 * @returns {string} avatar - The url of the user avatar.
 */ 
function getAvatar(username) {
    var avatar = "https://bitbucket.org/account/"+username+"/avatar/128/";
    return avatar;
}

/** Loads the user and repositories data into Mustache templates and renders
 * the templates. 
 * @param {string} username - The user name of the Bitbucket user.
 */
function loadData(username) {

    var username = username;

    // load user data
    $("#targetUser").load("templates/userTemplate.html #user", function() {
        var template = $("#user").html();

        getUser(username, function(response){
            var data = {
                username : username,
                avatar : getAvatar(username),
                created_on : formatDate(response.created_on),
                display_name : response.display_name,
                link : response.links.html.href,
            };
            var rendered = Mustache.render(template, data);
            $("#targetUser").html(rendered);
        });

    });

    //load repository data
    $("#targetRepositories").load("templates/repositoryTemplate.html #repositories", function() {
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

            var rendered = Mustache.render(template, data);
            $("#targetRepositories").html(rendered);
        });
    });

}
