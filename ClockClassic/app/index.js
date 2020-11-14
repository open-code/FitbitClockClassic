import clock from "clock";
import document from "document";
import * as health from "user-activity";
import {battery} from "power";
import * as messaging from "messaging";
import document from "document";
import * as simpleSettings from "./simple/device-settings";

var myDate = $("mydate");
var myTime = $("mytime");
var myHours = $("hours");
var myMins = $("minutes");
var mySecs = $("seconds");
var mySteps = $("mysteps");
var batColor = $("batColor");
var batText = $("batText");
var myCal = $("mycal");
var hourlyStats = false


function $(s) {
  return document.getElementById(s);
}

function formatDate(date) {
  var monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  
  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var wday = date.getDay();

  return monthNames[monthIndex] + ' ' + day + ' ' + days[wday];
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateSteps(mins) {
  if(hourlyStats) {
    const minuteRecords = health.minuteHistory.query({ limit: mins });
    let stepsThisHour = 0;
    let caloriesThisHour = 0;
    
    minuteRecords.forEach((minute, index) => {
      stepsThisHour += (minute.steps || 0);
      caloriesThisHour += (minute.calories || 0);
    });
    mySteps.text = numberWithCommas(stepsThisHour);
    myCal.text = numberWithCommas(caloriesThisHour);;
    return;
  }
  
  let today = health.today.adjusted;
  mySteps.text = numberWithCommas(today.steps);
  myCal.text = numberWithCommas(today.calories);;
}

function onTick() {
  let now = new Date();
  myDate.text = formatDate(now);
  myTime.text = formatAMPM(now);
  
  let hours = now.getHours() % 12;
  let mins = now.getMinutes();
  let secs = now.getSeconds();
  myHours.groupTransform.rotate.angle = (hours + mins / 60) * 30;
  myMins.groupTransform.rotate.angle = mins * 6;
  mySecs.groupTransform.rotate.angle = secs * 6;
  
  updateSteps(mins);
  
  let chrg = battery.chargeLevel;
  
  batText.text = chrg + "%";
  
  if(chrg < 20) {
    batColor.style.fill = "red";
  } else if(chrg < 75) {
    batColor.style.fill = "#58aae2";
  } else {
    batColor.style.fill = "#58aae2";
  }
  
  batColor.width = Math.ceil((36 * chrg) / 100);
}

function settingsCallback(data) {
  if (!data) {
    return;
  }
  hourlyStats = data.hourlyStats;
}
simpleSettings.initialize(settingsCallback);


clock.granularity = "seconds";
clock.addEventListener("tick", onTick);
