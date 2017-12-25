 var dishRightLiArr = []; //存储右边ul中的li
 var chooseData = []; //存储选中的
 var mealData = []; //存放所有meal的数据
 var selectData = []; //存放选中的meal数据
 var dishAllData = []; //存放所有的dish数据
 var selectDish = []; //存放选中的dish数据
 var unselectDish = []; //存放未选中的dish数据

 //编辑套餐
 function updateMeal() {
     var that = this;
     // console.log(mealData);
     selectData = mealData.filter(function (item) {
         return item.id == that.getAttribute("id")
     })
     console.log(selectData);
     filterMeal();
     popupUpdateMealModal(selectData[0]);

 }

 //确认更新菜单
 function confirmUpdateMeal() {
     console.log(1)
     var name = $("#addMealName").val();
     var type = $("#addMealType").val();
     var caloriesRange = $("#addMealCalories").val();
     var dishComposeIds = "";
     var tempArr = [];
     var mealComposeId = localStorage.getItem("mealId");
     console.log(mealComposeId)
     for (var item of $("#mealLeft li")) {
         // console.log(item.getAttribute("dishcomposeid"));
         tempArr.push(item.getAttribute("dishcomposeid"))
     }
     dishComposeIds = tempArr.join();
     // console.log( dishComposeIds );
     if (name == "") {
         alert("请输入菜品名称");
         return;
     }
     if (dishComposeIds == "") {
         alert("请选择菜式");
         return;
     }
     if (caloriesRange == "") {
         alert("请输入热量标识");
         return;
     }
     $("#mealConfirm").attr("data-dismiss", "modal");
     var data = {
         mealComposeId,
         caloriesRange,
         dishComposeIds,
         name,
         type,
         active: true,
     }
     console.log(data);
     var callback = function (res) {
         if (res == 0) {
             return;
         }
         init();
     };
     // console.log(data);
     serverRequest("put", serviceUrlPrefix + "/healthplan/mealcompose", data, callback);
 }

 //筛选mealRight菜式
 function filterMeal() {
     unselectDish = [];
     var selectId = [];
     var dishAllId = [];
     console.log(selectData[0])
     selectData[0].dishComposes.forEach((item) => {
         //  console.log(selectDish)
         selectDish.push(item);
         selectId.push(item.id);
     });
     dishAllData.forEach((item) => {
         dishAllId.push(item.id);
     })
     let difference = dishAllId.concat(selectId).filter(v => !dishAllId.includes(v) || !selectId.includes(v));
     // console.log(difference);
     for (var i = 0; i < difference.length; i++) {
         for (var j = 0; j < dishAllData.length; j++) {
             if (difference[i] == dishAllData[j].id) {
                 unselectDish.push(dishAllData[j])
             }
         }
     }
     console.log(selectDish);
     console.log(unselectDish);
 }
 //添加菜式到套餐
 function addMeal() {
     var claNum,
         start,
         end,
         num,
         totalCla = 0,
         htmlL = "",
         htmlR = "";
     var selectId = [];
     var dishAllId = [];
     if (chooseData == "" || $("#mealLeft li").hasClass("active")) {
         $("#mealLeft li").removeClass("active");
         $("#mealRight li").removeClass("active");
         chooseData = [];
         alert("错误操作");
         return;
     }
     console.log(chooseData)
     if (chooseData != "") {
         console.log(chooseData)
         if (selectDish == "") {
             selectDish = chooseData;
         } else {
             var tempArr = [];
             tempArr.push(...selectDish);
             selectDish = []
             selectDish.push(...tempArr);
             selectDish.push(...chooseData);
         }
         console.log(selectDish);
         for (var dishCompose of selectDish) {
             //  console.log(dishCompose);
             htmlL += '<li dishComposeId=' + dishCompose.id + '>' + dishCompose.name + "&nbsp" + "(" + dishCompose.calories + ")" + "&nbsp" + dishCompose.size + '</li>';
         }
         $("#mealLeft").empty();
         $("#mealLeft").append(htmlL);
         //  filterMeal();
         //  console.log(dishAllData);
         console.log(selectDish);
         if (unselectDish != "") {
             unselectDish = [];
         }
         selectDish.forEach(function (data) {
             selectId.push(data.id);
             for (var i = 0; i < dishAllData.length; i++) {
                 dishAllId.push(dishAllData[i].id);
                 //  console.log(data.id, dishAllData[i].id)
             }
         })
         let difference = dishAllId.concat(selectId).filter(v => !dishAllId.includes(v) || !selectId.includes(v));
         for (var i = 0; i < difference.length; i++) {
             for (var j = 0; j < dishAllData.length; j++) {
                 if (difference[i] == dishAllData[j].id) {
                     unselectDish.push(dishAllData[j]);
                     break;
                 }
             }
         }
         unselectDish = new Set(unselectDish);
         var arr = [];
         arr.push(...unselectDish);
         unselectDish = [];
         unselectDish.push(...arr);
         console.log(unselectDish);
         for (var dish of unselectDish) {
             htmlR += '<li dishComposeId=' + dish.id + '>' + dish.name + "&nbsp" + "(" + dish.calories + ")" + "&nbsp" + dish.size + '</li>';
         }
         $("#mealRight").empty();
         $("#mealRight").append(htmlR);
     }
     claArr = $("#mealLeft li")
     for (var i = 0; i < claArr.length; i++) {
         start = claArr[i].innerHTML.indexOf("(");
         end = claArr[i].innerHTML.indexOf(")");
         num = parseInt(claArr[i].innerHTML.substring(start + 1, end));
         totalCla += num;
     }
     // $("#addMealCalories").val(totalCla);
     $("#chooseCalories").html(totalCla);
     chooseData = [];
     $("#mealRight li").on("click", function () {
         chooseMeal.call(this);
     });
     $("#mealLeft li").on("click", function () {
         chooseMeal.call(this);
     });
 }
 //把菜式从套餐中移除
 function cancleMeal() {
     var claNum,
         start,
         end,
         num,
         totalCla = 0,
         htmlL = "",
         htmlR = "";
     var unselectId = [];
     var dishAllId = [];
     if (chooseData == "" || $("#mealRight li").hasClass("active")) {
         $("#mealLeft li").removeClass("active");
         $("#mealRight li").removeClass("active");
         chooseData = [];
         alert("错误操作");
         return;
     }
     if (chooseData != "") {
         if (unselectDish == "") {
             unselectDish = chooseData;
         } else {
             var tempArr = [];
             tempArr.push(...unselectDish);
             unselectDish = []
             unselectDish.push(...tempArr);
             unselectDish.push(...chooseData);
         }
         console.log(unselectDish);
         console.log(selectDish)
         for (var dish of unselectDish) {
             htmlR += '<li dishComposeId=' + dish.id + '>' + dish.name + "&nbsp" + "(" + dish.calories + ")" + "&nbsp" + dish.size + '</li>';
         }
         $("#mealRight").empty();
         $("#mealRight").append(htmlR);
         console.log(selectDish);
         console.log(unselectDish);
         unselectDish.forEach(function (data) {
             unselectId.push(data.id);
             for (var i = 0; i < dishAllData.length; i++) {
                 dishAllId.push(dishAllData[i].id);
                //  console.log(data.id, dishAllData[i].id)
             }
         })
         let difference = dishAllId.concat(unselectId).filter(v => !dishAllId.includes(v) || !unselectId.includes(v));
         selectDish = [];
         for (var i = 0; i < difference.length; i++) {
             for (var j = 0; j < dishAllData.length; j++) {
                 if (difference[i] == dishAllData[j].id) {
                     selectDish.push(dishAllData[j]);
                     break;
                 }
             }
         }
         selectDish = new Set(selectDish);
         var arr = [];
         arr.push(...selectDish);
         selectDish = [];
         selectDish.push(...arr);
         console.log(selectDish);
         for (var dish of selectDish) {
             htmlL += '<li dishComposeId=' + dish.id + '>' + dish.name + "&nbsp" + "(" + dish.calories + ")" + "&nbsp" + dish.size + '</li>';
         }
         $("#mealLeft").empty();
         $("#mealLeft").append(htmlL);
     }
     claArr = $("#mealLeft li");

     for (var i = 0; i < claArr.length; i++) {
         start = claArr[i].innerHTML.indexOf("(");
         end = claArr[i].innerHTML.indexOf(")");
         num = parseInt(claArr[i].innerHTML.substring(start + 1, end));
         totalCla += num;
     }
     $("#chooseCalories").html(totalCla);
     chooseData = [];
     $("#mealRight li").on("click", function () {
         chooseMeal.call(this);
     });
     $("#mealLeft li").on("click", function () {
         chooseMeal.call(this);
     });
 }

 //选中
 function chooseMeal() {
     $(this).toggleClass("active");
     if ($(this).hasClass("active")) {
         var tempDish = dishAllData.filter((item) => {
             return item.id == this.getAttribute("dishcomposeid")
         })
         chooseData.push(...tempDish);
         //  console.log(chooseData);
     } else {
         chooseData.splice($.inArray(this, chooseData), 1);
         console.log(chooseData);
     }

 }

 //获取所有菜式的数据
 function getDishDate() {
     var data = {};
     var callback = function (res) {
         if (res == 0) {
             return;
         }
         dishAllData = res.body;
     };
     serverRequest("get", serviceUrlPrefix + "/healthplan/dishcompose/all", data, callback);
 }


 //删除套餐
 function deleteMealDate() {
     var mealComposeId = localStorage.getItem("mealId");
     var data = {
         mealComposeId
     };
     var callback = function (res) {
         if (res == 0) {
             return;
         }
         init();
     };
     serverRequest("put", serviceUrlPrefix + "/healthplan/mealcompose/delete", data, callback);
 }

 //PUT套餐数据
 function postMealDate() {
     var name = $("#addMealName").val();
     var type = $("#addMealType").val();
     var caloriesRange = $("#addMealCalories").val();
     var dishComposeIds = "";
     var tempArr = [];
     for (var item of $("#mealLeft li")) {
         //  console.log(item.getAttribute("dishcomposeid"));
         tempArr.push(item.getAttribute("dishcomposeid"))
     }
     dishComposeIds = tempArr.join();
     // console.log( dishComposeIds );
     if (name == "") {
         alert("请输入菜品名称");
         return;
     }
     if (dishComposeIds == "") {
         alert("请选择菜式");
         return;
     }
     if (caloriesRange == "") {
         alert("请输入热量标识");
         return;
     }
     $("#mealConfirm").attr("data-dismiss", "modal");
     var data = {
         caloriesRange,
         dishComposeIds,
         name,
         type,
         active: true,
     }
     var callback = function (res) {
         if (res == 0) {
             return;
         }
         init();
     };
     console.log(data);
     serverRequest("put", serviceUrlPrefix + "/healthplan/mealcompose", data, callback);
 }

 //search菜式的功能
 function searchDishData() {
     var searchData = $("#searchMeal").val();
     var htmlR = "";
     var htmlL = "";
     var searchDish = [];
     if (searchData != "") {
         console.log(unselectDish)
         $("#mealRight").empty();
         for (var dishData of unselectDish) {
             if (dishData.name.indexOf(searchData) != -1) {
                 console.log(searchDish)
                 searchDish.push(dishData)
                 //  console.log(searchDish)
             }
             //  console.log(dishData.name)
         }
         console.log(searchDish)
         for (var dish of searchDish) {
            htmlR += '<li dishComposeId=' + dish.id + '>' + dish.name + "&nbsp" + "(" + dish.calories + ")" + "&nbsp" + dish.size + '</li>';
         }
         $("#mealRight").append(htmlR);
     } else {
         chooseData = [];
         console.log(unselectDish)
         for (var dish of unselectDish) {
            htmlR += '<li dishComposeId=' + dish.id + '>' + dish.name + "&nbsp" + "(" + dish.calories + ")" + "&nbsp" + dish.size + '</li>';
         }
         for (var dish of selectDish) {
             htmlL += '<li dishComposeId=' + dish.id + '>' + dish.name + "&nbsp" + "(" + dish.calories + ")" + "&nbsp" + dish.size + '</li>';
         }
         $("#mealRight").empty();
         $("#mealRight").append(htmlR);
         $("#mealLeft").empty();
         $("#mealLeft").append(htmlL);
         
     }
     $("#mealRight li").on("click", function () {
        chooseMeal.call(this);
    });
    $("#mealLeft li").on("click", function () {
        chooseMeal.call(this);
    });

 }

 function refreshMeals() {
     init();
 }

 // 生成套餐的添加Modal 
 function addMealModalHtml(dishComposes) {
     // console.log(dishComposes);
     var html = "";
     html += '<div id="addMealModal" class="modal fade addMealModal-modal-lg" tabindex="-1" role="dialog" aria-labelledby="addMealModalLabel">';
     html += '<div class="modal-dialog" role="document">';
     html += '<div class="modal-content modal-lg">';
     html += '<div class="modal-header">';
     html += '<div class="modal-title">';
     html += '<div class="row">';
     html += '<label class="col-sm-2">名称</label>';
     html += '<div class="col-sm-4">';
     html += '<input id="addMealName" class="form-control" type="text" placeholder="请输入套餐名字">';
     html += '</div>';
     html += '<label class="col-sm-2">类型</label>';
     html += '<div class="col-sm-4">';
     html += "<select id='addMealType' class='form-control'>";
     html += "<option value='cnset'>中式套餐</option>";
     html += "<option value='jpset'>日式套餐</option>";
     html += "</select>";
     html += '</div>';
     html += ' <label class="col-sm-2">热量</label>';
     html += '<div class="col-sm-10">';
     html += '<input id="addMealCalories" class="form-control" type="number" placeholder="请输入热量标识">';
     html += '</div>';
     html += '<label class="col-sm-2">合计</label>';
     html += '<div class="col-sm-4">';
     html += '<span id="chooseCalories">0</span>';
     html += '</div>';
     html += '</div>';
     html += '</div>';
     html += '</div>';
     html += '<div class="modal-body " style="overflow:hidden">';
     html += '<div class= "col-sm-6 " style="text-align:center">';
     html += '</div>';
     html += '<div class= "col-sm-6 " style="text-align:center;margin-bottom:10px;padding-left:146px">';
     html += '<input id="searchMeal" class="form-control" type="text">';
     html += ' <button id="searchMealBtn" class="btn btn-primary btn-search">';
     html += ' <span class="glyphicon glyphicon-zoom-in"></span> 搜索</button>';
     html += '</div>';
     html += '<ul id="mealLeft" style="text-align:center" class="col-sm-5 modal-body-border">';
     html += '</ul>';
     html += '<div id="btnChoose" class="col-sm-2">';
     html += ' <button id="btnAdd" class="btn btn-primary" style="margin-bottom:120px">&lt;&lt;</button><br/><button id="btnCancle" class="btn btn-primary">&gt;&gt;</button>';
     html += '</div>';
     html += '<ul id="mealRight" style="text-align:center" class="col-sm-5 modal-body-border">';
     for (var dishcompose of dishComposes) {
         html += '<li dishComposeId=' + dishcompose.id + '>' + dishcompose.name + "&nbsp" + "(" + dishcompose.calories + ")" + "&nbsp" + dishcompose.size + '</li>';
     }
     html += '</ul>';
     html += '</div>';
     html += '<div class="modal-footer">';
     html += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
     html += '<button type="button" class="btn btn-primary " id="mealConfirm"  >确认</button>';
     html += '</div>';
     html += '</div>';
     html += '</div>';
     html += '</div>';
     return html;
 }

 //生成update的Modal
 function updateMealModalHtml(mealCompose) {
     // console.log(mealCompose);
     var sumCal = 0;
     var html = "";
     html += '<div id="updateMealModal" class="modal fade updateMealModal-modal-lg" tabindex="-1" role="dialog" aria-labelledby="updateMealModalLabel">';
     html += '<div class="modal-dialog" role="document">';
     html += '<div class="modal-content modal-lg">';
     html += '<div class="modal-header">';
     html += '<div class="modal-title">';
     html += '<div class="row">';
     html += '<label class="col-sm-2">名称</label>';
     html += '<div class="col-sm-4">';
     html += '<input id="addMealName" class="form-control" type="text" value="' + mealCompose.name + '">';
     html += '</div>';
     html += '<label class="col-sm-2">类型</label>';
     html += '<div class="col-sm-4">';
     html += "<select id='addMealType' class='form-control'>";
     html += "<option value='cnset'>中式套餐</option>";
     html += "<option value='jpset'>日式套餐</option>";
     html += "</select>";
     html += '</div>';
     html += ' <label class="col-sm-2">热量</label>';
     html += '<div class="col-sm-10">';
     html += '<input id="addMealCalories" class="form-control" type="number" value="' + mealCompose.caloriesRange + '">';
     html += '</div>';
     html += '<label class="col-sm-2">合计</label>';
     html += '<div class="col-sm-4">';
     html += '<span id="chooseCalories">';
     for (var dishCompose of mealCompose.dishComposes) {
         sumCal += dishCompose.calories
     };
     html += '' + sumCal + '';
     html += '</span>';
     html += '</div>';
     html += '</div>';
     html += '</div>';
     html += '</div>';
     html += '<div class="modal-body " style="overflow:hidden">';
     html += '<div class= "col-sm-6 " style="text-align:center">';
     html += '</div>';
     html += '<div class= "col-sm-6 " style="text-align:center;margin-bottom:10px;padding-left:146px">';
     html += '<input id="searchMeal"  class="form-control" type="text">';
     html += ' <button id="searchMealBtn" class="btn btn-primary btn-search">';
     html += ' <span class="glyphicon glyphicon-zoom-in"></span> 搜索</button>';
     html += '</div>';
     html += '<ul id="mealLeft" style="text-align:center" class="col-sm-5 modal-body-border">';
     for (var dishCompose of mealCompose.dishComposes) {
         // console.log(dishCompose)
         html += '<li dishComposeId=' + dishCompose.id + '>' + dishCompose.name + "&nbsp" + "(" + dishCompose.calories + ")" + "&nbsp" + dishCompose.size + '</li>';
     }
     html += '</ul>';
     html += '<div id="btnChoose" class="col-sm-2">';
     html += ' <button id="btnAdd" class="btn btn-primary" style="margin-bottom:120px">&lt;&lt;</button><br/><button id="btnCancle" class="btn btn-primary">&gt;&gt;</button>';
     html += '</div>';
     html += '<ul id="mealRight" style="text-align:center" class="col-sm-5 modal-body-border">';
     for (var dishAll of unselectDish) {
         html += '<li dishComposeId=' + dishAll.id + '>' + dishAll.name + "&nbsp" + "(" + dishAll.calories + ")" + "&nbsp" + dishAll.size + '</li>';
     }
     html += '</ul>';
     html += '</ul>';
     html += '</div>';
     html += '<div class="modal-footer">';
     html += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
     html += '<button type="button" class="btn btn-primary " id="mealConfirm"  >确认</button>';
     html += '</div>';
     html += '</div>';
     html += '</div>';
     html += '</div>';
     return html;
 }

 //把meal的modal插入html
 function popupAddMealModal(dishComposes) {
     console.log(dishComposes)
     $("#mealComposeModalContainer").empty();
     $('#mealComposeModalContainer').append(addMealModalHtml(dishComposes));
     var modalWidth = $("#addMealModal").width();
     var left = "-" + parseInt(modalWidth) / 2 + "px";
     $("#addMealModal").css({
         "margin-left": left
     });
 }

 //把update的modal插入html
 function popupUpdateMealModal(data) {
     // console.log(data)
     $("#mealComposeModalContainer").empty();
     $('#mealComposeModalContainer').append(updateMealModalHtml(data));
     var modalWidth = $("#updateMealModal").width();
     var left = "-" + parseInt(modalWidth) / 2 + "px";
     $("#updateMealModal").css({
         "margin-left": left
     });

 }