import clock from "clock";
import document from "document";
import * as health from "user-activity";
import {HeartRateSensor} from "heart-rate";
import {display} from "display";
import {vibration} from "haptics";
import {peerSocket} from "messaging";
import {units} from "user-settings";
import * as fs from "fs";
import {battery} from "power";
import {decode} from "cbor";
import {inbox} from "file-transfer";

const THEMES = {
  white: ["FFFFFF", "FFFFFF", "FFFFFF"]
};
let weekNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

var myDate = $("mydate");
var myTime = $("mytime");
var myHours = $("hours");
var myMins = $("minutes");
var mySecs = $("seconds");
var mySteps = $("mysteps");
var batColor = $("batColor");
var batText = $("batText");
var myCal = $("mycal");

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
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateSteps() {
  let today = health.today.adjusted;
  mySteps.text = numberWithCommas(today.steps);
  myCal.text = numberWithCommas(today.calories);;
}

function onTick() {
  let now = new Date();
  myDate.text = formatDate(now);
  myTime.text = formatAMPM(now);
  
  updateSteps();

  let hours = now.getHours() % 12;
  let mins = now.getMinutes();
  let secs = now.getSeconds();
  myHours.groupTransform.rotate.angle = (hours + mins/60)*30;
  myMins.groupTransform.rotate.angle = mins*6;
  mySecs.groupTransform.rotate.angle = secs*6;
  
  let chrg = battery.chargeLevel;
  
  batText.text = chrg + "%";
  
  if(chrg < 20) {
    batColor.style.fill = "red";
  } else if(chrg < 75) {
    batColor.style.fill = "#58aae2";
  } else {
    batColor.style.fill = "#58aae2";
  }
  
  batColor.width = Math.ceil((36 * chrg)/100);
}



clock.granularity = "seconds";
clock.ontick = onTick;
