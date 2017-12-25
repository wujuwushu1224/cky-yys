var serviceUrlPrefix = "http://cyktst.inteshare.com/cykhealthplan/";

function serverRequest(method, url, data, callback){

    var token = getToken();
    if(token == null){
        window.location.reload();
    }
    data.token = token;
    if(method.toUpperCase() == "POST" || method.toUpperCase() == "PUT"){
        data = JSON.stringify(data);
    }

    var success = function(res){
        callback(res);
    }

    var error = function(res){
        var err = {};
        console.log(res)
        if(res.status == 404){
            err.errorCode = res.status;
            callback(0);
        }else{
            err.errorCode = res.responseJSON.header.errorCode;
            if(err.errorCode == 2001){
                localStorage.cykadminToken = null;
                localStorage.cykadminExpireAt = null;
                window.location.reload();
                return;
            }else{
                callback(0);
            }
        }
    }

    $.ajax({
        url:encodeURI(url),
        data: data,
        async:false,
        type: method,
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json',
        success: success,
        error: error
    });

}

function clearToken(){
    localStorage.cykadminToken = null;
    localStorage.cykadminExpireAt = null;
}

function getToken(){
    var token = localStorage.cykadminToken;
    var expireAt = localStorage.cykadminExpireAt;

    if(typeof(token) == 'undefined' || token == null || token == 'null'){
        return null;
    }

    if(typeof(expireAt) == 'undefined' || expireAt == null || expireAt == 'null' || expireAt < Date.now()){
        return null;
    }

    return token;
}

function popUpLoginForm(){
    $('#loginModal').modal('show');
}

function initLoginEvent(adminType){

    $("#password").on('keydown', function(event){
        if(event.keyCode ==  13){
            doLogin({data:{adminType:adminType}});
        }
    });

    $("#loginButton").on("click",{adminType: adminType}, doLogin);
}

function doLogin(event){
    var adminType = event.data.adminType;
    var username = $('#username').val();
    var password = $('#password').val();

    var usernamePasswordOk = true;
    if(typeof(username) == "undefined" || username == null || $.trim(username).length <= 0){
        $('#enterUsernameWarning').css('display', 'block');
        usernamePasswordOk = false;
    }else{
        $('#enterUsernameWarning').css('display', 'none');
    }

    if(typeof(password) == "undefined" || password == null || $.trim(password).length <= 0){
        $('#enterPasswordWarning').css('display', 'block');
        usernamePasswordOk = false;
    }else{
        $('#enterPasswordWarning').css('display', 'none');
    }

    if(!usernamePasswordOk){
        return;
    }

    var callback = function(res){
        if(res.errorCode == 1){
            var token = res.token;
            var expireIn = res.expireIn;

            localStorage.cykadminToken = token;
            localStorage.cykadminExpireAt = Date.now() + (expireIn*1000) - 30000;
            $('#loginModal').modal('hide');
            init();
        }else if(res.errorCode == 2001){
            $('#notMatchWarning').css('display', 'block');
        }else if(res.errorCode == 404){
            $('#notConnectedWarning').css('display', 'block');
        }
    }

    login(adminType, username, password, callback);
}

function login(adminType, username, password, callback){
    password = hex_md5(password);

    var url = serviceUrlPrefix + "/healthplan/admin/login";
    var data = {
        admintype: adminType,
        username: username,
        password: password
    };
    var success = function(res){
        callback(res.header);
    };
    var error = function(res){
        var err = {};
        if(res.status == 404){
            err.errorCode = res.status;
        }else{
            err.errorCode = res.responseJSON.header.errorCode;
        }
        callback(err);
    };

    $.ajax({
        url:url,
        data: data,
        async:false,
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json',
        success: success,
        error: error
    });
}

function popUpErrorMessage(err){

    if(err.errorCode == 404){
        alert("无法连接服务器");
    }else if(err.errorCode == 3001){
        alert("读取数据时出错");
    }else if(err.errorCode == 4001){
        alert("写入数据是出错");
    }else if(err.errorCode == 5001){
        alert("服务器处理异常");
    }else{
        alert("其他错误,错误码: " + err.errorCode);
    }
}