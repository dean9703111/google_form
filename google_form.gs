function getFormResponse (event) { //event為觸發submit事件時帶入的資訊

  //表單名稱(請填寫對應的名稱，否則google會無法找出對應的form id)
  var FORMNAME = "餐後回饋表單";

  //取得表單
  var formHandle = DriveApp.getFilesByName(FORMNAME).next();

  //由表單 Id 開啟表單
  var form = FormApp.openById(formHandle.getId());

  //取得表單名稱
  var formTitle = form.getTitle();

  //取得表單回覆內容
  var formResponse = event.response;

  //取得表單上的項目
  var itemResponses = formResponse.getItemResponses();

  //傳送訊息設定
  var itemContext = "\n" + formTitle + "\n 電子郵件 : " + Session.getEffectiveUser().getEmail() + "\n";
  
  //紀錄回覆評分
  var scrore = 0

  //將表單每一項問答組成訊息
  for (var j = 0; j < itemResponses.length; j++) {
    //取得問題標題
    itemContext += itemResponses[j].getItem().getTitle();

    //取得問題回覆內容
    itemContext += " : " + itemResponses[j].getResponse() + "\n";

    //用這裡來取得評分
    if (itemResponses[j].getItem().getTitle() == '店家評分(5分最高)') {
      scrore = itemResponses[j].getResponse()
    }
  }

  //取得填寫表單時間
  itemContext += "\n填寫時間 : " + formResponse.getTimestamp() + "\n\n\n";
  
  if (Number(scrore) <= 2) {//如果訂單評分低於2分則馬上送出表單到Line讓店家儘速回覆
    sendToLine(itemContext);
    form.setConfirmationMessage('非常抱歉造成您用餐的不愉快，我們店長將儘快與您取得聯繫並致上最誠懇的道歉');
  } 
  else if (Number(scrore) >= 4){//如果訂單評分高於4分則馬上送出店家粉絲團爭取按讚機會
    form.setConfirmationMessage('如果本次的用餐讓您感到愉悅，請您給粉絲團一個讚:' + "\n" + 'https://www.facebook.com/profile.php?id=100001123361906');
  }

}

function sendToLine (message) {

  var token = "你自己的LINE Notify";

  var options =
  {
    method: "post",
    payload: "message=" + message,
    headers: { "Authorization": "Bearer " + token },
    muteHttpExceptions: true
  };

  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}