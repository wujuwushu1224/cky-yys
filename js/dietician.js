$(document).ready(function () {
   
    init();

});

function init() {
    dishRightLiArr = []; 
    chooseData = []; 
    mealData = []; 
    selectData = []; 
    dishAllData = []; 
    selectDish = []; 
    unselectDish = []; 
    initLoginEvent("mealDesigner");

    if (getToken() == null) {
        popUpLoginForm();
        return;
    }


    $('#tabMenu a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    loadMealComposes();
    loadDishComposes();
    initDieticianEvents();
}

function removeActive() {
    $("menuTab").removeClass("active");
}

function initDieticianEvents() {
    $("#mealTab").on("click", "a", function () {
        loadMealComposes();
        $(".deleteBtn").on("click", function () {
            $("#delcfmMealModel").modal();
            localStorage.setItem("mealId", this.id)
        });
        $(".updateMealBtn").on("click", function () {
            selectDish = [];
            unselectDish = [];
            updateMeal.call(this);
            localStorage.setItem("mealId", this.id)
            dishLiArr = $("#mealRight").children("li");

            $("#mealRight li").on("click", function () {
                chooseMeal.call(this);
            });
            $("#mealLeft li").on("click", function () {
                chooseMeal.call(this);
            });
            $("#btnAdd").on("click", function () {
                addMeal();
            });
            $("#btnCancle").on("click", function () {
                cancleMeal();
            });
            $("#searchMealBtn").on("click", function () {
                if(unselectDish==""){
                    unselectDish = dishAllData;
                }
                searchDishData(unselectDish)
            });
            $("#mealConfirm").on("click", function () {
                confirmUpdateMeal();
            });
        });
    });
    $("#dishTab").on("click", "a", function () {
        loadDishComposes();

    });
    $("#mealComposeAdd").on("click", function () {
        selectDish = []; 
        unselectDish = []; 
        popupAddMealModal(dishAllData);
        $("#mealRight li").on("click", function () {
            chooseMeal.call(this);
        });
        $("#mealLeft li").on("click", function () {
            chooseMeal.call(this);
        });
        $("#btnAdd").on("click", function () {
            addMeal();
        });
        $("#btnCancle").on("click", function () {
            cancleMeal();
        });
        $("#mealConfirm").on("click", function () {
            postMealDate();
        });
        $("#searchMealBtn").on("click", function () {
            if(unselectDish==""){
                unselectDish = dishAllData;
            }
            searchDishData(unselectDish)
        })
    });
    $(".deleteBtn").on("click", function () {
        $("#delcfmMealModel").modal();
        localStorage.setItem("mealId", this.id)
    });
    $(".updateMealBtn").on("click", function () { 
        selectDish = []; 
        unselectDish = []; 
        updateMeal.call(this);
        localStorage.setItem("mealId", this.id)
        dishLiArr = $("#mealRight").children("li");

        $("#mealRight li").on("click", function () {
            chooseMeal.call(this);
        });
        $("#mealLeft li").on("click", function () {
            chooseMeal.call(this);
        });
        $("#btnAdd").on("click", function () {
            addMeal();
        });
        $("#btnCancle").on("click", function () {
            cancleMeal();
        });
        $("#searchMealBtn").on("click", function () {
            if(unselectDish==""){
                unselectDish = dishAllData;
            }
            searchDishData(unselectDish)
        });
        $("#mealConfirm").on("click", function () {
            confirmUpdateMeal();
        });
    });
}


function loadMealComposes() {
    var data = {};

    var callback = function (res) {
        if (res == 0) {
            return;
        }
        // console.log(res.body)
        populateMealComposes(res.body);
    };

    serverRequest("get", serviceUrlPrefix + "/healthplan/mealcompose/all", data, callback);

}

function populateDishComposes(dishComposes) {
    $('#dishComposes').empty();

    var html = "";

    for (var dishCompose of dishComposes) {
        console.log(JSON.stringify(dishCompose));
        html += getDishComposeHtml(dishCompose);
    }

    $('#dishComposes').append(html);
}


function populateMealComposes(mealComposes) {
    $('#mealComposes').empty();

    var html = "";

    for (var mealCompose of mealComposes) {

        html += getMealComposeHtml(mealCompose);
    }

    $('#mealComposes').append(html);
}

function loadDishComposes() {

    var data = {};

    var callback = function (res) {
        if (res == 0) {
            return;
        }
        dishAllData=res.body;
        populateDishComposes(res.body);

    };

    serverRequest("get", serviceUrlPrefix + "/healthplan/dishcompose/all", data, callback);

}

function popupDishComposeUpdateModal(dishCompose) {
    localStorage.setItem("id", dishCompose.id);
    console.log(getDishComposeUpdateHtml(dishCompose));
    $("#dishComposeModalContainer").empty();
    $("#dishComposeModalContainer").append(getDishComposeUpdateHtml(dishCompose));
    var modalWidth = $("#dishComposeUpdateModal").width();
    var left = "-" + parseInt(modalWidth) / 2 + "px";
    $("#dishComposeUpdateModal").modal("show").css({
        "margin-left": left
    });
}



function getDishComposeUpdateHtml(dishCompose) {
    var html = "";
    var html2 = "";
    var html3 = "";

    html += "<div class='modal fade' id='dishComposeUpdateModal' tabindex='-1' role='dialog' aria-labelledby='loginModalLabel' aria-hidden='true' data-keyboard='false' data-backdrop='static'>";
    html += "<div class='modal-dialog'>";
    html += "<div class='modal-content modal-lg'>";
    html += "<div class='modal-body form-horizontal dishComposeUpdateModalBody'>";
    html2 += "<div class='form-group'>";
    html2 += "<label class='col-sm-2 control-label'>菜式名称</label>";
    html2 += "<div class='col-sm-4 control-panel'>";
    html2 += "<input id='dishComposeName' class='form-control' type='text' value='" + dishCompose.name + "' />";
    html2 += "</div>";
    html2 += "<label class='col-sm-1 control-label'>尺寸</label>";
    html2 += "<div class='col-sm-2 control-panel'>";
    html2 += "<select id='dishComposeSize1' class='form-control' name='size'>";
    html2 += "<option value='sm'>小份</option>";
    html2 += "<option value='md'>中份</option>";
    html2 += "<option value='lg'>大份</option>";
    html2 += "</select>";
    html2 += "</div>";
    html2 += "<label for='name' class='col-sm-1 control-label'>类型</label>";
    html2 += "<div class='col-sm-2 control-panel'>";
    html2 += "<select id='dishComposeType' class='form-control'>";
    html2 += "<option value='main'>主菜</option>";
    html2 += "<option value='side'>配菜</option>";
    html2 += "<option value='soup'>汤</option>";
    html2 += "<option value='grain'>主食</option>";
    html2 += "<option value='fruit'>水果</option>";
    html2 += "<option value='other'>其他</option>";
    html2 += "</select>";
    html2 += "</div>";
    html2 += "<label class='col-sm-2 control-label'>热量(大卡)</label>";
    html2 += "<div class='col-sm-4 control-panel'>";
    html2 += "<input id='dishComposeCalories' class='form-control' type='number' value='" + dishCompose.calories + "' />";
    html2 += "</div>";
    html2 += "<label class='col-sm-2 control-label'>烹饪后重量(克)</label>";
    html2 += "<div class='col-sm-4 control-panel'>";
    html2 += "<input id='dishComposeCookedWeight' class='form-control' type='number' value='" + dishCompose.cookedWeight + "' />";
    html2 += "</div>";
    html2 += "<label class='col-sm-2 control-label'>备注</label>";
    html2 += "<div class='col-sm-4 control-panel'>";
    html2 += "<input id='dishComposeNote1' maxlength='10' class='form-control' type='text' name='note' value='" + dishCompose.note + "'/>";
    html2 += "</div>";
    html2 += "<div class='divider col-sm-12'>--------------&nbsp;食材&nbsp;--------------</div>";
    for (var ingredient of dishCompose.ingredients) {
        html2 += "<div class='col-sm-12 row container-lg'>";
        html2 += "<label class='col-sm-1 control-label'>名称</label>";
        html2 += "<div class='col-sm-3 control-panel'>";
        html2 += "<input  class='form-control dishComposeName1' name='name2' type='text' value='" + ingredient.name + "' />";
        html2 += "</div>";
        html2 += "<label class='col-sm-1 control-label'>份量</label>";
        html2 += "<div class='col-sm-3 control-panel'>";
        html2 += "<input  class='form-control dishComposeWeight1' name='weight' type='text' value='" + ingredient.weight + "' />";
        html2 += "</div>";
        html2 += "<div class='col-sm-2 control-panel'>";
        html2 += "<select  class='form-control dishComposeUnit1' name='unit2'>";
        html2 += "<option value='克'>克</option>";
        html2 += "<option value='毫升'>毫升</option>";
        html2 += "</select>";
        html2 += "</div>";
        html2 += "<div class='col-sm-2 control-panel'>";
        html2 += "<button onclick='insertNew(this)' type='button' class='btn btn-success btn-sm '>新增</button>&nbsp;";
        html2 += "<button onclick='deleteDishes(this)' type='button' class='btn btn-warning btn-sm delBtn'>删除</button>";
        html2 += "</div>";
        html2 += "</div>";
    }
    html2 += "</div>";
    html2 += "</div>";
    html3 += "<div class='modal-footer'>";
    html3 += "<button onclick='resetUpdateBtn()' type='button' class='btn btn-default' >";
    html3 += "重置";
    html3 += "</button>";
    html3 += "<button type='button' class='btn btn-default' data-dismiss='modal'>";
    html3 += "取消";
    html3 += "</button>";
    html3 += "<button onclick='loginUpdateBtn()' type='button' class='btn btn-primary'>";
    html3 += "上传";
    html3 += "</button>";
    html3 += "</div>";
    html3 += "</div>";
    html3 += "</div>";
    html3 += "</div>";
    localStorage.setItem("form", html2);
    return html + html2 + html3;
}

function getDishComposeHtml(dishCompose) {

    var html = "";

    html += "<div class='panel panel-default'>";
    html += "<div class='panel-heading'>";
    html += "<h4 class='panel-title row'>";
    html += "<a class='dish-item-name col-xs-9' data-toggle='collapse' data-parent='#accordion' href='#dish_" + dishCompose.id + "'>";
    html += "<span class='title'>名称:&nbsp;</span>";
    html += "<span class='value'>" + dishCompose.name + "</span>";
    html += "<span class='title'>,&nbsp;&nbsp;</span>";
    html += "<span class='title'>尺寸:&nbsp;</span>";
    html += "<span class='value'>" + getDishSize(dishCompose.size) + "</span>";
    html += "<span class='title'>,&nbsp;&nbsp;</span>";
    html += "<span class='title'>类型:&nbsp;</span>";
    html += "<span class='value'>" + getDishType(dishCompose.type) + "</span>";
    html += "<span class='title'>,&nbsp;&nbsp;</span>";
    html += "<span class='title'>热量标识:&nbsp;</span>";
    html += "<span class='value'>" + dishCompose.calories + "大卡</span>";
    html += "<span class='title'>,&nbsp;&nbsp;</span>";
    html += "<span class='title'>烹饪后重量:&nbsp;</span>";
    html += "<span class='value'>" + dishCompose.cookedWeight + "克</span>";
    html += "<span class='title'>,&nbsp;&nbsp;</span>";
    html += "<span class='title'>备注:&nbsp;</span>";
    html += "<span class='value'>" + dishCompose.note + "</span>";
    html += "</a>";
    html += "<div class='dish-item-control col-xs-3'>";
    html += "<button onclick='popupDishComposeUpdateModal(" + JSON.stringify(dishCompose) + ");' type='button' class='btn btn-primary btn-sm updateBtn'>编辑</button>&nbsp;";
//    html +=              "<button id='editDishCompose_" + dishCompose.id + "' data-json='" + JSON.stringify(dishCompose) + "' type='button' class='btn btn-primary btn-sm'>编辑</button>&nbsp;";
    html += "<button onclick='removeDishes(this) ' id='deleteDishCompose_" + dishCompose.id + "' data-json='" + JSON.stringify(dishCompose) + "' type='button' class='btn btn-danger btn-sm'>删除</button>";
    html += "</div>";
    html += "</h4>";
    html += "</div>";
    html += "<div id='dish_" + dishCompose.id + "' class='panel-collapse collapse'>";
    html += "<div class='panel-body'>";

    for (var ingredient of dishCompose.ingredients) {
        html += "<div class='ingredient'>";
        html += "<div class='concept row'>";
        html += "<div class='dish-name col-xs-4 col-sm-4'>";
        html += "<span class='title'>名称:&nbsp;</span>";
        html += "<span class='value'>" + ingredient.name + "</span>";
        html += "</div>";
        html += "<div class='dish-type col-xs-4 col-sm-4'>";
        html += "<span class='title'>份量:&nbsp;</span>";
        html += "<span class='value'>" + ingredient.weight + ingredient.unit + "</span>";
        html += "</div>";
        html += "<div class='col-xs-4 col-sm-4'>";
        html += "</div>";
        html += "</div>";
        html += "</div>";
    }
    html += "</div>";
    html += "</div>";
    html += "</div>";

    return html;
}

function getMealComposeHtml(mealCompose) {
    mealData.push(mealCompose)
    var html = "";
    html += "<div class='panel panel-default'>";
    html += "<div class='panel-heading'>";
    html += "<h4 class='panel-title row'>";
    html += "<a class='meal-item-name col-xs-9' data-toggle='collapse' data-parent='#accordion' href='#meal_" + mealCompose.id + "'>";
    html += "<span class='title'>名称:&nbsp;</span>";
    html += "<span class='value'>" + mealCompose.name + "</span>";
    html += "<span class='title'>,&nbsp;&nbsp;</span>";
    // html += "<span class='title'>尺寸:&nbsp;</span>";
    // html += "<span class='value'>" + getDishSize(mealCompose.size) + "</span>";
    // html += "<span class='title'>,&nbsp;&nbsp;</span>";
    html += "<span class='title'>类型:&nbsp;</span>";
    html += "<span class='value'>" + getMealType(mealCompose.type) + "</span>";
    html += "<span class='title'>,&nbsp;&nbsp;</span>";
    html += "<span class='title'>热量标识:&nbsp;</span>";
    html += "<span class='value'>" + mealCompose.caloriesRange + "大卡</span>";
    html += "</a>";
    html += "<div class='meal-item-control col-xs-3'>";
    html += "<button data-toggle='modal' data-target='.updateMealModal-modal-lg'  type='button' class='btn btn-primary btn-sm updateMealBtn' id ='" + mealCompose.id + "'  >编辑</button>&nbsp;";
    html += "<button type='button' class='btn btn-danger btn-sm deleteBtn' id ='" + mealCompose.id + "'>删除</button>";
    html += "</div>";
    html += "</h4>";
    html += "</div>";
    html += "<div id='meal_" + mealCompose.id + "' class='panel-collapse collapse'>";
    html += "<div class='panel-body'>";

    for (var dishCompose of mealCompose.dishComposes) {
        html += "<div class='dish'>";
        html += "<div class='concept row'>";
        html += "<div class='dish-name col-xs-6 col-sm-3'>";
        html += "<span class='title'>名称:&nbsp;</span>";
        html += "<span class='value'>" + dishCompose.name + "</span>";
        html += "</div>";
        html += "<div class='dish-type col-xs-6 col-sm-2'>";
        html += "<span class='title'>尺寸:&nbsp;</span>";
        html += "<span class='value'>" + getDishSize(dishCompose.size) + "</span>";
        html += "</div>";
        html += "<div class='dish-type col-xs-6 col-sm-2'>";
        html += "<span class='title'>类型:&nbsp;</span>";
        html += "<span class='value'>" + getDishType(dishCompose.type) + "</span>";
        html += "</div>";
        html += "<div class='dish-calories col-xs-6 col-sm-2'>";
        html += "<span class='title'>热量:&nbsp;</span>";
        html += "<span class='value'>" + dishCompose.calories + " 大卡</span>";
        html += "</div>";
        html += "<div class='dish-cookedWeight col-xs-6 col-sm-3'>";
        html += "<span class='title'>烹饪后重量:&nbsp;</span>";
        html += "<span class='value'>" + dishCompose.cookedWeight + "克</span>";
        html += "</div>";
        html += "</div>";
        html += "<div class='ingredient'>";
        html += "<span class='title'>&nbsp;&nbsp;配料:&nbsp;</span>";
        html += "<span class='value'>" + getIngredientHtml(dishCompose.ingredients) + "</span>";
        html += "</div>";
        html += "</div>";
    }
    html += "</div>";
    html += "</div>";
    html += "</div>";

    return html;
}




function getMealType(typeCode) {
    if ("cnset" == typeCode) {
        return "中式套餐";
    }else{
        return "日式套餐";
    }
}

function getDishType(typeCode) {
    if ("main" == typeCode) {
        return "主菜";
    } else if ("side" == typeCode) {
        return "配菜";
    } else if ("grain" == typeCode) {
        return "主食";
    } else if ("soup" == typeCode) {
        return "汤";
    } else if ("fruit" == typeCode) {
        return "水果";
    } else {
        return "其他";
    }
}

function getDishSize(typeCode) {
    if ("sm" == typeCode) {
        return "小份";
    } else if ("md" == typeCode) {
        return "中份";
    } else {
        return "大份";
    }
}

function getIngredientHtml(ingredients) {
    var html = "";
    // console.log(ingredients)
    for (var ingredient of ingredients) {
        html += ingredient.name + "&nbsp;" + ingredient.weight + ingredient.unit + ", ";
    }

    if (html.length > 0 && html.lastIndexOf(", ") == html.length - 2) {
        html = html.substr(0, html.length - 2);
    }
    return html;
}