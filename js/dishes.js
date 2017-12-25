// 刷新
function refreshDishes() {

    var data = {};
    serverRequest("get", serviceUrlPrefix + "/healthplan/dishcompose/all", data, function (res) {

        populateDishComposes(res.body);
    });

}

//生成菜式的modal
function addDishModalHtml(dishComposes) {
    var html = "";
    html += "<div class='modal fade ' id='dishComposeAddModal' tabindex='-1' role='dialog'aria-labelledby='loginModalLabel'aria-hidden='true' data-keyboard='false' data-backdrop='static'>";
    html += "<div class='modal-dialog'>";
    html += "<div class='modal-content modal-lg'>";
    html += "<div class='modal-body form-horizontal'>";
    html += "<div class='form-group'>";
    html += "<label class='col-sm-2 control-label'>菜式名称</label>";
    html += "<div class='col-sm-4 control-panel'>";
    html += "<input id='dishComposeName2' name='name' class='form-control' type='text'/>";
    html += "</div>";
    html += "<label class='col-sm-1 control-label'>尺寸</label>";
    html += "<div class='col-sm-2 control-panel'>";
    html += "<select id='dishComposeSize2' class='form-control' name='size'>";
    html += "<option value='sm'>小份</option>";
    html += "<option value='md'>中份</option>";
    html += "<option value='lg'>大份</option>";
    html += "</select>";
    html += "</div>";
    html += "<label class='col-sm-1 control-label'>类型</label>";
    html += "<div class='col-sm-2 control-panel'>";
    html += "<select id='dishComposeType2' class='form-control' name='type'>";
    html += "<option value='main'>主菜</option>";
    html += "<option value='side'>配菜</option>";
    html += "<option value='soup'>汤</option>";
    html += "<option value='grain'>主食</option>";
    html += "<option value='fruit'>水果</option>";
    html += "<option value='other'>其他</option>";
    html += "</select>";
    html += "</div>";
    html += "<label class='col-sm-2 control-label'>热量(大卡)</label>";
    html += "<div class='col-sm-4 control-panel'>";
    html += "<input id='dishComposeCalories2' name='calories' class='form-control' type='number'/>";
    html += "</div>";
    html += "<label class='col-sm-2 control-label'>烹饪后重量(克)</label>";
    html += "<div class='col-sm-4 control-panel'>";
    html += "<input id='dishComposeCookedWeight2' class='form-control' type='number' name='cookedWeight'/>";
    html += "</div>";
    html += "<label class='col-sm-2 control-label'>备注</label>";
    html += "<div class='col-sm-4 control-panel'>";
    html += "<input id='dishComposeNote2' maxlength='10' class='form-control' type='text' name='note'/>";
    html += "</div>";
    html += "<div class='divider col-sm-12'>--------------&nbsp;食材&nbsp;--------------</div>"
    html += "<div class='col-sm-12 row container-lg dishes-content '>";
    html += "<label class='col-sm-1 control-label'>名称</label>";
    html += "<div class='col-sm-3 control-panel'>";
    html += "<input class='form-control dishComposeName2' type='text' name='name2'/>";
    html += "</div>";
    html += "<label class='col-sm-1 control-label'>份量</label>";
    html += "<div class='col-sm-3 control-panel'>";
    html += "<input class='form-control dishComposeWeight2' type='text' name='weight'/>";
    html += "</div>";
    html += "<div class='col-sm-2 control-panel'>";
    html += "<select class='form-control dishComposeUnit2' name='unit2'>";
    html += "<option value='克'>克</option>";
    html += "<option value='毫升'>毫升</option>";
    html += "</select>";
    html += "</div>";
    html += "<div class='col-sm-2 control-panel'>";
    html += "<button onclick='insertNew(this)' type='button' class='btn btn-success btn-sm '>新增 </button>&nbsp;";
    html += "<button onclick='deleteDishes(this)' type='button' class='btn btn-warning btn-sm delBtn'>删除 </button>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    html += "<div class='modal-footer'>";
    html += "<button onclick='resetBtn()' type='button' class='btn btn-default'>重置 </button>";
    html += "<button type='button' class='btn btn-default' data-dismiss='modal'>取消 </button>";
    html += "<button onclick='loginAddBtn()' type='button' class='btn btn-primary'>上传 </button>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    html += "</div>";
    return html;
}

// 添加菜式
function addDishes(dishComposes) {
    $("#addDishModal").empty();
    $('#addDishModal').append(addDishModalHtml(dishComposes));
    var modalWidth = $("#dishComposeAddModal").width();
    var left = "-" + parseInt(modalWidth) / 2 + "px";
    $("#dishComposeAddModal").modal("show").css({"margin-left": left});
}

// 添加菜式中的重置
function resetBtn() {
    $("#dishComposeAddModal input").val("");
    $("#dishComposeAddModal #dishComposeType2").val("main");
    $("#dishComposeAddModal #dishComposeSize2").val("sm");
    $(".add-content").remove();
}

// 新增菜式
function insertNew(e) {

    var html = "";
    html += "<div class='col-sm-12 row container-lg add-content' >";
    html += "<label class='col-sm-1 control-label'>名称</label>";
    html += "<div class='col-sm-3 control-panel'>";
    html += "<input class='form-control dishComposeName2 dishComposeName1' type='text' name='name2'/>";
    html += "</div>";
    html += "<label class='col-sm-1 control-label'>份量</label>";
    html += "<div class='col-sm-3 control-panel'>";
    html += "<input  class='form-control dishComposeWeight2 dishComposeWeight1' type='text' name='weight'>";
    html += "</div>";
    html += "<div class='col-sm-2 control-panel'>";
    html += "<select class='form-control dishComposeUnit2 dishComposeUnit1' name='unit2'>";
    html += "<option value='克'>克</option>";
    html += "<option value='毫升'>毫升</option>";
    html += "</select>";
    html += "</div>";
    html += "<div class='col-sm-2 control-panel'>";
    html += "<button onclick='insertNew(this)' type='button' class='btn btn-success btn-sm '>新增</button>&nbsp;";
    html += "<button onclick='deleteDishes(this)' type='button' class='btn btn-warning btn-sm delBtn'>删除</button>";
    html += "</div>";
    html += "</div>";

    $(e).parent().parent().after(html);
}

// 去除菜式
function deleteDishes(e) {
    if ($("#dishComposeAddModal .delBtn").length > 1 || $("#dishComposeUpdateModal .delBtn").length > 1) {
        // console.log($(".delBtn").length);
        $(e).parent().parent().remove();
    }
}

// 编辑菜式中的重置
function resetUpdateBtn() {

    // console.log(localStorage.getItem("form"));
    $(".dishComposeUpdateModalBody").empty().html(localStorage.getItem("form"));
}

//上传菜式
function loginAddBtn() {
    localStorage.removeItem("dataId");
    localStorage.removeItem("id");
    localStorage.removeItem("form");

    console.log($("#dishComposeAddModal input").length);
    var addLength = $("#dishComposeAddModal input").length;
    for (var i = 0; i < addLength; i++) {
        if ($("#dishComposeAddModal input")[i].value == "") {
            alert("当前表单不能有空项");
            return false;
        }
    }

    var name = $("#dishComposeName2").val();
    var type = $("#dishComposeType2").val();
    var size = $("#dishComposeSize2").val();
    var calories = $("#dishComposeCalories2").val();
    var note = $("#dishComposeNote2").val();
    var cookedWeight = $("#dishComposeCookedWeight2").val();
    var names = $(".dishComposeName2").serializeArray();
    var weights = $(".dishComposeWeight2").serializeArray();
    var units = $(".dishComposeUnit2").serializeArray();
    console.log(size);
    var ingredients = [];
    for (var i = 0; i < names.length; i++) {
        ingredients.push({name: names[i].value, weight: weights[i].value, unit: units[i].value})
    }
    var data = {
        size: size,
        note: note,
        name: name,
        type: type,
        calories: calories,
        cookedWeight: cookedWeight,
        ingredients: ingredients,
        active: true

    };

    serverRequest("put", serviceUrlPrefix + "healthplan/dishcompose", data, function () {

        data = {};
        serverRequest("get", serviceUrlPrefix + "/healthplan/dishcompose/all", data, function (res) {
            console.log("zxc");
            console.log(res);
            populateDishComposes(res.body);
            $("#dishComposeAddModal input").val("");
            $("#dishComposeAddModal").modal("hide");
            return;
        });
    });

}

function loginUpdateBtn() {
    localStorage.removeItem("form");
    var addLength = $("#dishComposeUpdateModal input").length;
    for (var i = 0; i < addLength; i++) {
        if ($("#dishComposeUpdateModal input")[i].value == "") {
            alert("当前表单不能有空项");
            return false;
        }
    }
    var id = localStorage.getItem("id");


    var name = $("#dishComposeName").val();
    var type = $("#dishComposeType").val();
    var size = $("#dishComposeSize1").val();
    var calories = $("#dishComposeCalories").val();
    var note = $("#dishComposeNote1").val();
    var cookedWeight = $("#dishComposeCookedWeight").val();
    var names = $(".dishComposeName1").serializeArray();
    var weights = $(".dishComposeWeight1").serializeArray();
    var units = $(".dishComposeUnit1").serializeArray();
    var ingredients = [];
    for (var i = 0; i < names.length; i++) {
        ingredients.push({name: names[i].value, weight: weights[i].value, unit: units[i].value})
    }
    var data = {
        dishComposeId: id,
        name: name,
        type: type,
        size: size,
        note: note,
        calories: calories,
        cookedWeight: cookedWeight,
        ingredients: ingredients,
        active: true

    };

    // console.log(data);

    serverRequest("put", serviceUrlPrefix + "healthplan/dishcompose", data, function () {

        // console.log(data);
        data = {};
        serverRequest("get", serviceUrlPrefix + "/healthplan/dishcompose/all", data, function (res) {
            $("#dishComposeUpdateModal").modal("hide");
            populateDishComposes(res.body);
            return;
        });
    });

}


//删除菜式
function deleteSure(data) {
    console.log($("#deleteSure").text());
    if ($("#deleteSure").text() == "确定") {
        var data = {
            dishComposeId: localStorage.getItem("dataId")
        };

        serverRequest("put", serviceUrlPrefix + "healthplan/dishcompose/delete", data, function () {

            data = {};
            serverRequest("get", serviceUrlPrefix + "/healthplan/dishcompose/all", data, function (res) {
                populateDishComposes(res.body);
            });
        });
    }


}

function removeDishes(e) {
    var id = $(e).attr('id').split('_').pop();

    var data = {dishComposeId: id};

    $("#delcfmModel").modal();

    localStorage.setItem("dataId", id);
    // deleteSure(data);


    // serverRequest("put", serviceUrlPrefix + "healthplan/dishcompose/delete", data, function () {
    //     // location.reload();
    //
    //     // window.location.href = 'dietician.html';
    //     // window.history.back(-1);
    //     // window.location.href='dietician.html#dishes';
    //     data = {};
    //     serverRequest("get", serviceUrlPrefix + "/healthplan/dishcompose/all", data, function (res) {
    //         populateDishComposes(res.body);
    //     });
    // });

}

//搜索菜式
function searchDishes() {
    var input = $("#search").val().trim();
    var data = {};
    var dishCompose = [];
    serverRequest("get", serviceUrlPrefix + "healthplan/dishcompose/all", data, function (res) {
        console.log(res);
        if (!input) {
            populateDishComposes(res.body);
        }

        // for (var i = 0; i < res.body.length; i++) {
        //     console.log(res.body[i].name);
        //     if (input === res.body[i].name) {
        //         dishCompose.push(res.body[i]);
        //         populateDishComposes(dishCompose);
        //         console.log(dishCompose);
        //         return;
        //     }
        //
        // }
        for (var i = 0; i < res.body.length; i++) {
            console.log(res.body[i].name);
            if (res.body[i].name.indexOf(input)!=-1) {
                dishCompose.push(res.body[i]);
                populateDishComposes(dishCompose);
                console.log(dishCompose);
                continue;
            }

        }
        
    })

}
