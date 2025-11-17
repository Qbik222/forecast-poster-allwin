"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function (_sessionStorage$getIt, _document$querySelect) {
  var apiURL = 'https://fav-prom.com/api_forecast_poster_allwin';
  var unauthMsgs = document.querySelectorAll('.authBtn'),
    counterSpan = document.querySelector('.counter'),
    eventsSpan = document.querySelector('.events'),
    welcomeBet = document.querySelector('.welcome__bet'),
    switchWrap = document.querySelector(".welcome__switch"),
    switchBtn = document.querySelector(".welcome__switch-btn");
  var ukLeng = document.querySelector('#ukLeng');
  var enLeng = document.querySelector('#enLeng');

  // let locale = 'uk';
  var locale = sessionStorage.getItem("locale") || "uk";
  if (ukLeng) locale = 'uk';
  if (enLeng) locale = 'en';
  var i18nData = {};
  // let userId;
  // userId = 100300268;
  var userId = (_sessionStorage$getIt = sessionStorage.getItem("userId")) !== null && _sessionStorage$getIt !== void 0 ? _sessionStorage$getIt : null;
  var elementsByMatchiD = {};
  var allMatches = [];
  var favDataByMatch = {};
  var savedSwitcherState = localStorage.getItem("switcherActive");
  if (savedSwitcherState === "1") {
    switchBtn.classList.add("active");
  }
  switchBtn.addEventListener("click", function () {
    switchBtn.style.pointerEvents = "none";
    setTimeout(function () {
      switchBtn.style.pointerEvents = "";
    }, 2000);
    var isActive = switchBtn.classList.toggle("active");
    localStorage.setItem("switcherActive", isActive ? "1" : "0");
    if (!userId) return;
    getBetslipItems().then(function (betslipMatches) {
      if (isActive) {
        allMatches.forEach(function (match) {
          var matchDiv = elementsByMatchiD[match.matchId];
          addMatchToBetslip(match, matchDiv, betslipMatches);
        });
      } else {
        var _iterator = _createForOfIteratorHelper(allMatches),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var match = _step.value;
            var matchDiv = elementsByMatchiD[match.matchId];
            removeMatchFromBetslip(match, matchDiv);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    })["catch"](function (err) {
      return console.error('Error getting betslip items:', err);
    });
  });
  function loadTranslations() {
    return fetch("".concat(apiURL, "/new-translates/").concat(locale)).then(function (res) {
      return res.json();
    }).then(function (json) {
      i18nData = json;
      translate();
      var mutationObserver = new MutationObserver(function (mutations) {
        translate();
      });
      mutationObserver.observe(document.getElementById('forecastPoster'), {
        childList: true,
        subtree: true
      });
    });
  }
  function translate() {
    var elems = document.querySelectorAll('[data-translate]');
    elems.forEach(function (elem) {
      var key = elem.getAttribute('data-translate');
      elem.innerHTML = translateKey(key);
      elem.removeAttribute('data-translate');
    });
    if (locale === 'en') {
      mainPage.classList.add('en');
    }
  }
  function translateKey(key) {
    var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : key;
    return i18nData[key] || defaultValue;
  }
  var request = function request(link, extraOptions) {
    return fetch(apiURL + link, _objectSpread({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }, extraOptions || {})).then(function (res) {
      if (!res.ok) throw new Error('API error');
      return res.json();
    })["catch"](function (err) {
      console.error('API request failed:', err);
      reportError(err);
      document.querySelector('.allwin__page').style.display = 'none';
      if (window.location.href.startsWith("https://www.favbet.hr/")) {
        window.location.href = '/promocije/promocija/stub/';
      } else {
        window.location.href = '/promos/promo/stub/';
      }
      return Promise.reject(err);
    });
  };
  function reportError(err) {
    var reportData = {
      origin: window.location.href,
      userid: userId,
      errorText: (err === null || err === void 0 ? void 0 : err.error) || (err === null || err === void 0 ? void 0 : err.text) || (err === null || err === void 0 ? void 0 : err.message) || 'Unknown error',
      type: (err === null || err === void 0 ? void 0 : err.name) || 'UnknownError',
      stack: (err === null || err === void 0 ? void 0 : err.stack) || ''
    };
    fetch('https://fav-prom.com/api-cms/reports/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportData)
    })["catch"](console.warn);
  }
  function initAddAllBtn() {
    var addAllBtn = document.querySelector('.predictBtn');
    addAllBtn.addEventListener('click', function () {
      if (!userId) return;
      getBetslipItems().then(function (betslipMatches) {
        var _iterator2 = _createForOfIteratorHelper(allMatches),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var match = _step2.value;
            var matchDiv = elementsByMatchiD[match.matchId];
            addMatchToBetslip(match, matchDiv, betslipMatches);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      })["catch"](function (err) {
        return console.error('Error getting betslip items:', err);
      });
    });
  }
  var InitPage = function InitPage() {
    translate();
    initAddAllBtn();
    request('/matches').then(function (matches) {
      allMatches = (matches || []).sort(function (a, b) {
        return new Date(a.matchDate) - new Date(b.matchDate);
      });
      getBetslipItems().then(function (betslipMatches) {
        // initMatches(allMatches, betslipMatches);
        initSlider();
      })["catch"](function (err) {
        return console.error('Error getting betslip items:', err);
      });
    });
  };
  function initMatches(matches, betslipMatches) {
    var container = document.querySelector('.welcome__row');
    container.innerHTML = '';
    var added = 0;
    for (var i = 0; i < matches.length; i += 2) {
      var rowWrap = document.createElement('div');
      rowWrap.className = 'welcome__row-wrap';
      var _loop = function _loop() {
        var match = matches[j];
        var matchDiv = document.createElement('div');
        matchDiv.className = 'welcome__item';
        match.matchId = +match.matchId;
        if (betslipMatches.some(function (b) {
          return b.event_id == match.matchId;
        })) {
          added++;
          matchDiv.classList.add('_done');
        }
        matchDiv.innerHTML = "\n                <div class=\"welcome__item-close\"></div>\n                <div class=\"welcome__item-row\">\n                    <div class=\"welcome__item-title\">\n                        <span>".concat(translateKey(match.title), "</span>\n                    </div>\n                    <div class=\"welcome__item-date\">").concat(formatDate(match.matchDate), "</div>\n                </div>\n                <div class=\"welcome__item-max-title\">").concat(translateKey(match.team1), " \u2013 ").concat(translateKey(match.team2), "</div>\n                <div class=\"welcome__item-info\">\n                    <div class=\"welcome__item-bid\">").concat(translateKey(match.outcomeTranslation), "</div>\n                    <div class=\"welcome__item-cof\">").concat(match.defaultCoef || 0, "</div>\n                </div>\n                ");
        elementsByMatchiD[match.matchId] = matchDiv;
        rowWrap.appendChild(matchDiv);
        getMatchData(match).then(function (m) {
          if (m) {
            var cofDiv = matchDiv.querySelector('.welcome__item-cof');
            cofDiv.innerHTML = m.outcomeCoef;
          }
        });
        matchDiv.addEventListener('click', function (e) {
          return addMatchToBetslip(match, matchDiv, betslipMatches, e);
        });
        var closeBtn = matchDiv.querySelector('.welcome__item-close');
        closeBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          removeMatchFromBetslip(match, matchDiv);
        });
      };
      for (var j = i; j < i + 2 && j < matches.length; j++) {
        _loop();
      }
      container.appendChild(rowWrap);
    }
    setCounter(added);
    return container;
  }
  var hasSentClickEvent = false;
  function addMatchToBetslip(match, matchDiv, betslipMatches, e) {
    if (!userId || betslipMatches.some(function (b) {
      return b.event_id === match.matchId || e && e.target.classList.contains('welcome__item-close');
    })) {
      return;
    }
    var favData = favDataByMatch[match.matchId];
    if (!favData || !favData.matchId) return;
    if (!hasSentClickEvent) {
      hasSentClickEvent = true;
      request('/events', {
        method: 'POST',
        body: JSON.stringify({
          userid: userId,
          eventId: match.matchId
        })
      })["catch"](console.error);
    }
    addToBetslip(favData);
    matchDiv.classList.add('_done');
    updateCounter(1);
    var activeCount = document.querySelectorAll('.welcome__item._done').length;
    var totalCount = document.querySelectorAll('.welcome__item').length;
    if (activeCount === totalCount && !switchBtn.classList.contains("active")) {
      switchBtn.classList.add("active");
      localStorage.setItem("switcherActive", "1");
    }
  }
  function removeMatchFromBetslip(match, matchDiv) {
    if (!userId) return;
    var favData = favDataByMatch[match.matchId];
    if (!favData || !favData.matchId) return;
    var isRemoved = removeFromBetslip(favData);
    if (isRemoved) {
      matchDiv.classList.remove('_done');
      updateCounter(-1);
      if (switchBtn.classList.contains("active")) {
        switchBtn.classList.remove("active");
        localStorage.setItem("switcherActive", "0");
      }
    }
  }
  function updateCounter(diff) {
    var currCounter = +counterSpan.innerHTML;
    setCounter(currCounter + diff);
  }
  function setCounter(value) {
    counterSpan.innerHTML = value;
    var lastDigit = value % 10;
    var translationKey = lastDigit === 1 ? 'event1' : lastDigit >= 2 && lastDigit <= 4 ? 'event2' : 'event3';
    eventsSpan.innerHTML = "".concat(translateKey(translationKey));
    welcomeBet.classList.toggle('hide', value <= 0);
  }
  function getMatchData(match) {
    var serviceId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (serviceId > 1) return;
    return fetch('https://www.favbet.ua/service/lineout/frontend_api2/', {
      method: 'POST',
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "id": 16,
        "method": "frontend/market/get",
        "params": {
          "by": {
            "lang": 'uk',
            "service_id": serviceId,
            "event_id": match.matchId
          }
        }
      })
    }).then(function (res) {
      return res.json();
    }).then(function (favData) {
      var coefDataArray = favData.result.filter(function (o) {
        return o.market_name === match.marketName && o.result_type_name === match.marketType;
      });
      if (!coefDataArray.length) return getMatchData(match, serviceId + 1);
      var foundOutcome = null;
      var selectedCoefData = null;
      coefDataArray.some(function (coefData) {
        var outcome = coefData.outcomes.find(function (o) {
          return o.outcome_name === match.outcomeName;
        });
        if (outcome) {
          foundOutcome = outcome;
          selectedCoefData = coefData;
          return true;
        }
        return false;
      });
      if (!foundOutcome || !selectedCoefData) return getMatchData(match, serviceId + 1);
      var result = {
        outcomeId: foundOutcome.outcome_id,
        outcomeCoef: foundOutcome.outcome_coef,
        marketId: selectedCoefData.market_id,
        serviceId: serviceId,
        matchId: match.matchId
      };
      favDataByMatch[match.matchId] = result;
      return result;
    });
  }
  function formatDate(date) {
    var d = new Date(date);
    return "".concat(String(d.getDate()).padStart(2, '0'), ".").concat(String(d.getMonth() + 1).padStart(2, '0'));
  }
  function addToBetslip(match) {
    if (!window.addBetslipOutcomes) return;
    var outcome = {
      serviceId: match.serviceId,
      eventId: match.matchId,
      marketId: match.marketId,
      outcomeId: match.outcomeId
    };
    window.addBetslipOutcomes([outcome]);
  }
  function removeFromBetslip(match) {
    if (!window.removeBetslipItems) return false;
    var outcomeId = match.outcomeId;
    var result = window.removeBetslipItems([outcomeId]);
    return result;
  }
  function getBetslipItems() {
    if (!window.getBetslipItems) return Promise.resolve([]);
    return window.getBetslipItems().then(function (result) {
      return result;
    })["catch"](function () {
      return [];
    });
  }
  function init() {
    InitPage();
    if (window.store) {
      var state = window.store.getState();
      userId = state.auth.isAuthorized && state.auth.id || '';
    } else {
      var c = 0;
      var i = setInterval(function () {
        if (c < 50 && !!window.g_user_id) {
          userId = window.g_user_id;
          checkUserAuth();
          clearInterval(i);
        } else {
          c++;
        }
      }, 200);
    }
    checkUserAuth();
  }
  function checkUserAuth() {
    if (userId) {
      unauthMsgs.forEach(function (el) {
        return el.classList.add('hide');
      });
      switchWrap.classList.remove("hide");
    } else {
      // switchWrap.classList.add("hide");
      unauthMsgs.forEach(function (el) {
        return el.classList.remove('hide');
      });
    }
  }
  function initSlider() {
    var isDragging = false;
    var startX;
    var scrollLeft;
    var draggableContainer = document.getElementById('draggableContainer');
    var itemsWrap = document.querySelectorAll('.welcome__row-wrap');
    var row = document.querySelector('.welcome__row');
    var widths = {
      5: '2098px',
      4: '1668px',
      3: '1258px',
      2: '828px',
      1: '418px',
      "default": '2098px'
    };
    row.style.maxWidth = widths[itemsWrap.length] || widths["default"];
    draggableContainer.addEventListener('mousedown', function (e) {
      isDragging = true;
      startX = e.pageX - draggableContainer.offsetLeft;
      scrollLeft = draggableContainer.scrollLeft;
    });
    draggableContainer.addEventListener('mouseleave', function () {
      return isDragging = false;
    });
    draggableContainer.addEventListener('mouseup', function () {
      return isDragging = false;
    });
    draggableContainer.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      e.preventDefault();
      var x = e.pageX - draggableContainer.offsetLeft;
      var walk = (x - startX) * 2;
      draggableContainer.scrollLeft = scrollLeft - walk;
    });
  }
  document.addEventListener('click', function (e) {
    var target = e.target.closest('.welcome__item');
    if (target && !userId) {
      window.location.href = '/login';
    }
    // if(target){
    //     target.classList.toggle('_done');
    // }
    // console.log(e.target.closest('.welcome__close-'));
  });
  var mainPage = document.querySelector('.allwin__page');
  setTimeout(function () {
    return mainPage.classList.add('overflow');
  }, 1000);
  loadTranslations().then(init);

  //for test
  var lngBtn = document.querySelector(".lng-btn");
  lngBtn.addEventListener("click", function () {
    if (sessionStorage.getItem("locale")) {
      sessionStorage.removeItem("locale");
    } else {
      sessionStorage.setItem("locale", "en");
    }
    window.location.reload();
  });
  (_document$querySelect = document.querySelector(".menu-btn")) === null || _document$querySelect === void 0 || _document$querySelect.addEventListener("click", function () {
    var _document$querySelect2;
    (_document$querySelect2 = document.querySelector(".menu-test")) === null || _document$querySelect2 === void 0 || _document$querySelect2.classList.toggle("hide");
  });
  var authBtn = document.querySelector(".auth-btn");
  var betBtn = document.querySelector(".bet-btn");
  authBtn.addEventListener("click", function () {
    if (userId) {
      sessionStorage.removeItem("userId");
    } else {
      sessionStorage.setItem("userId", "100300268");
    }
    window.location.reload();
  });
  betBtn.addEventListener("click", function () {
    document.querySelector(".welcome__bet").classList.toggle("hide");
  });
  var container = document.getElementById('draggableContainer');
  container.addEventListener('click', function (e) {
    var close = e.target.closest('.welcome__item-close');
    if (close) {
      var _item = close.closest('.welcome__item');
      if (_item && _item.classList.contains('_done')) _item.classList.remove('_done');
      e.stopPropagation();
      return;
    }
    var item = e.target.closest('.welcome__item');
    if (item && !item.classList.contains('_done')) item.classList.add('_done');
  });
})();
"use strict";
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzZWNvbmQuanMiXSwibmFtZXMiOlsiX3Nlc3Npb25TdG9yYWdlJGdldEl0IiwiX2RvY3VtZW50JHF1ZXJ5U2VsZWN0IiwiYXBpVVJMIiwidW5hdXRoTXNncyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImNvdW50ZXJTcGFuIiwicXVlcnlTZWxlY3RvciIsImV2ZW50c1NwYW4iLCJ3ZWxjb21lQmV0Iiwic3dpdGNoV3JhcCIsInN3aXRjaEJ0biIsInVrTGVuZyIsImVuTGVuZyIsImxvY2FsZSIsInNlc3Npb25TdG9yYWdlIiwiZ2V0SXRlbSIsImkxOG5EYXRhIiwidXNlcklkIiwiZWxlbWVudHNCeU1hdGNoaUQiLCJhbGxNYXRjaGVzIiwiZmF2RGF0YUJ5TWF0Y2giLCJzYXZlZFN3aXRjaGVyU3RhdGUiLCJsb2NhbFN0b3JhZ2UiLCJjbGFzc0xpc3QiLCJhZGQiLCJhZGRFdmVudExpc3RlbmVyIiwic3R5bGUiLCJwb2ludGVyRXZlbnRzIiwic2V0VGltZW91dCIsImlzQWN0aXZlIiwidG9nZ2xlIiwic2V0SXRlbSIsImdldEJldHNsaXBJdGVtcyIsInRoZW4iLCJiZXRzbGlwTWF0Y2hlcyIsImZvckVhY2giLCJtYXRjaCIsIm1hdGNoRGl2IiwibWF0Y2hJZCIsImFkZE1hdGNoVG9CZXRzbGlwIiwiX2l0ZXJhdG9yIiwiX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIiLCJfc3RlcCIsInMiLCJuIiwiZG9uZSIsInZhbHVlIiwicmVtb3ZlTWF0Y2hGcm9tQmV0c2xpcCIsImVyciIsImUiLCJmIiwiY29uc29sZSIsImVycm9yIiwibG9hZFRyYW5zbGF0aW9ucyIsImZldGNoIiwiY29uY2F0IiwicmVzIiwianNvbiIsInRyYW5zbGF0ZSIsIm11dGF0aW9uT2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwib2JzZXJ2ZSIsImdldEVsZW1lbnRCeUlkIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsImVsZW1zIiwiZWxlbSIsImtleSIsImdldEF0dHJpYnV0ZSIsImlubmVySFRNTCIsInRyYW5zbGF0ZUtleSIsInJlbW92ZUF0dHJpYnV0ZSIsIm1haW5QYWdlIiwiZGVmYXVsdFZhbHVlIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwicmVxdWVzdCIsImxpbmsiLCJleHRyYU9wdGlvbnMiLCJfb2JqZWN0U3ByZWFkIiwiaGVhZGVycyIsIm9rIiwiRXJyb3IiLCJyZXBvcnRFcnJvciIsImRpc3BsYXkiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJzdGFydHNXaXRoIiwiUHJvbWlzZSIsInJlamVjdCIsInJlcG9ydERhdGEiLCJvcmlnaW4iLCJ1c2VyaWQiLCJlcnJvclRleHQiLCJ0ZXh0IiwibWVzc2FnZSIsInR5cGUiLCJuYW1lIiwic3RhY2siLCJtZXRob2QiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsIndhcm4iLCJpbml0QWRkQWxsQnRuIiwiYWRkQWxsQnRuIiwiX2l0ZXJhdG9yMiIsIl9zdGVwMiIsIkluaXRQYWdlIiwibWF0Y2hlcyIsInNvcnQiLCJhIiwiYiIsIkRhdGUiLCJtYXRjaERhdGUiLCJpbml0U2xpZGVyIiwiaW5pdE1hdGNoZXMiLCJjb250YWluZXIiLCJhZGRlZCIsImkiLCJyb3dXcmFwIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsIl9sb29wIiwiaiIsInNvbWUiLCJldmVudF9pZCIsInRpdGxlIiwiZm9ybWF0RGF0ZSIsInRlYW0xIiwidGVhbTIiLCJvdXRjb21lVHJhbnNsYXRpb24iLCJkZWZhdWx0Q29lZiIsImFwcGVuZENoaWxkIiwiZ2V0TWF0Y2hEYXRhIiwibSIsImNvZkRpdiIsIm91dGNvbWVDb2VmIiwiY2xvc2VCdG4iLCJzdG9wUHJvcGFnYXRpb24iLCJzZXRDb3VudGVyIiwiaGFzU2VudENsaWNrRXZlbnQiLCJ0YXJnZXQiLCJjb250YWlucyIsImZhdkRhdGEiLCJldmVudElkIiwiYWRkVG9CZXRzbGlwIiwidXBkYXRlQ291bnRlciIsImFjdGl2ZUNvdW50IiwidG90YWxDb3VudCIsImlzUmVtb3ZlZCIsInJlbW92ZUZyb21CZXRzbGlwIiwicmVtb3ZlIiwiZGlmZiIsImN1cnJDb3VudGVyIiwibGFzdERpZ2l0IiwidHJhbnNsYXRpb25LZXkiLCJzZXJ2aWNlSWQiLCJjb2VmRGF0YUFycmF5IiwicmVzdWx0IiwiZmlsdGVyIiwibyIsIm1hcmtldF9uYW1lIiwibWFya2V0TmFtZSIsInJlc3VsdF90eXBlX25hbWUiLCJtYXJrZXRUeXBlIiwiZm91bmRPdXRjb21lIiwic2VsZWN0ZWRDb2VmRGF0YSIsImNvZWZEYXRhIiwib3V0Y29tZSIsIm91dGNvbWVzIiwiZmluZCIsIm91dGNvbWVfbmFtZSIsIm91dGNvbWVOYW1lIiwib3V0Y29tZUlkIiwib3V0Y29tZV9pZCIsIm91dGNvbWVfY29lZiIsIm1hcmtldElkIiwibWFya2V0X2lkIiwiZGF0ZSIsImQiLCJTdHJpbmciLCJnZXREYXRlIiwicGFkU3RhcnQiLCJnZXRNb250aCIsImFkZEJldHNsaXBPdXRjb21lcyIsInJlbW92ZUJldHNsaXBJdGVtcyIsInJlc29sdmUiLCJpbml0Iiwic3RvcmUiLCJzdGF0ZSIsImdldFN0YXRlIiwiYXV0aCIsImlzQXV0aG9yaXplZCIsImlkIiwiYyIsInNldEludGVydmFsIiwiZ191c2VyX2lkIiwiY2hlY2tVc2VyQXV0aCIsImNsZWFySW50ZXJ2YWwiLCJlbCIsImlzRHJhZ2dpbmciLCJzdGFydFgiLCJzY3JvbGxMZWZ0IiwiZHJhZ2dhYmxlQ29udGFpbmVyIiwiaXRlbXNXcmFwIiwicm93Iiwid2lkdGhzIiwibWF4V2lkdGgiLCJwYWdlWCIsIm9mZnNldExlZnQiLCJwcmV2ZW50RGVmYXVsdCIsIngiLCJ3YWxrIiwiY2xvc2VzdCIsImxuZ0J0biIsInJlbW92ZUl0ZW0iLCJyZWxvYWQiLCJfZG9jdW1lbnQkcXVlcnlTZWxlY3QyIiwiYXV0aEJ0biIsImJldEJ0biIsImNsb3NlIiwiaXRlbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxDQUFDLFVBQUFB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RUFDcEUsQ0FBQyxDQUFDO0VBRUYsSUFBTTBGLFNBQVMsR0FBR3JILFFBQVEsQ0FBQzRELGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQztFQUUvRHlELFNBQVMsQ0FBQy9GLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFDd0IsQ0FBQyxFQUFLO0lBQ3ZDLElBQU0rSyxLQUFLLEdBQUcvSyxDQUFDLENBQUNnRyxNQUFNLENBQUN3RSxPQUFPLENBQUMsc0JBQXNCLENBQUM7SUFDdEQsSUFBSU8sS0FBSyxFQUFFO01BQ1AsSUFBTUMsS0FBSSxHQUFHRCxLQUFLLENBQUNQLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztNQUM1QyxJQUFJUSxLQUFJLElBQUlBLEtBQUksQ0FBQzFNLFNBQVMsQ0FBQzJILFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRStFLEtBQUksQ0FBQzFNLFNBQVMsQ0FBQ29JLE1BQU0sQ0FBQyxPQUFPLENBQUM7TUFDNUUxRyxDQUFDLENBQUM2RixlQUFlLENBQUMsQ0FBQztNQUNuQjtJQUNKO0lBRUEsSUFBTW1GLElBQUksR0FBR2hMLENBQUMsQ0FBQ2dHLE1BQU0sQ0FBQ3dFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztJQUMvQyxJQUFJUSxJQUFJLElBQUksQ0FBQ0EsSUFBSSxDQUFDMU0sU0FBUyxDQUFDMkgsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFK0UsSUFBSSxDQUFDMU0sU0FBUyxDQUFDQyxHQUFHLENBQUMsT0FBTyxDQUFDO0VBQzlFLENBQUMsQ0FBQztBQUdOLENBQUMsRUFBRSxDQUFDO0FDM2ZKIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGFwaVVSTCA9ICdodHRwczovL2Zhdi1wcm9tLmNvbS9hcGlfZm9yZWNhc3RfcG9zdGVyX2FsbHdpbic7XG5cbiAgICBjb25zdFxuICAgICAgICB1bmF1dGhNc2dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmF1dGhCdG4nKSxcbiAgICAgICAgY291bnRlclNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY291bnRlcicpLFxuICAgICAgICBldmVudHNTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmV2ZW50cycpLFxuICAgICAgICB3ZWxjb21lQmV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX2JldCcpLFxuICAgICAgICBzd2l0Y2hXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53ZWxjb21lX19zd2l0Y2hcIiksXG4gICAgICAgIHN3aXRjaEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2VsY29tZV9fc3dpdGNoLWJ0blwiKTtcblxuICAgIGNvbnN0IHVrTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN1a0xlbmcnKTtcbiAgICBjb25zdCBlbkxlbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZW5MZW5nJyk7XG5cbiAgICAvLyBsZXQgbG9jYWxlID0gJ3VrJztcbiAgICBsZXQgbG9jYWxlID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcImxvY2FsZVwiKSB8fCBcInVrXCJcbiAgICBpZiAodWtMZW5nKSBsb2NhbGUgPSAndWsnO1xuICAgIGlmIChlbkxlbmcpIGxvY2FsZSA9ICdlbic7XG5cbiAgICBsZXQgaTE4bkRhdGEgPSB7fTtcbiAgICAvLyBsZXQgdXNlcklkO1xuICAgIC8vIHVzZXJJZCA9IDEwMDMwMDI2ODtcbiAgICBsZXQgdXNlcklkID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInVzZXJJZFwiKSA/PyBudWxsXG4gICAgbGV0IGVsZW1lbnRzQnlNYXRjaGlEID0ge307XG4gICAgbGV0IGFsbE1hdGNoZXMgPSBbXTtcbiAgICBsZXQgZmF2RGF0YUJ5TWF0Y2ggPSB7fTtcblxuICAgIGNvbnN0IHNhdmVkU3dpdGNoZXJTdGF0ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic3dpdGNoZXJBY3RpdmVcIik7XG4gICAgaWYgKHNhdmVkU3dpdGNoZXJTdGF0ZSA9PT0gXCIxXCIpIHtcbiAgICAgICAgc3dpdGNoQnRuLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgfVxuXG4gICAgc3dpdGNoQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHN3aXRjaEJ0bi5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJub25lXCI7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoQnRuLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIlwiO1xuICAgICAgICB9LCAyMDAwKTtcblxuICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IHN3aXRjaEJ0bi5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInN3aXRjaGVyQWN0aXZlXCIsIGlzQWN0aXZlID8gXCIxXCIgOiBcIjBcIik7XG5cbiAgICAgICAgaWYgKCF1c2VySWQpIHJldHVybjtcblxuICAgICAgICBnZXRCZXRzbGlwSXRlbXMoKS50aGVuKGJldHNsaXBNYXRjaGVzID0+IHtcbiAgICAgICAgICAgIGlmIChpc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgIGFsbE1hdGNoZXMuZm9yRWFjaCgobWF0Y2gpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hEaXYgPSBlbGVtZW50c0J5TWF0Y2hpRFttYXRjaC5tYXRjaElkXTtcbiAgICAgICAgICAgICAgICAgICAgYWRkTWF0Y2hUb0JldHNsaXAobWF0Y2gsIG1hdGNoRGl2LCBiZXRzbGlwTWF0Y2hlcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbWF0Y2ggb2YgYWxsTWF0Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaERpdiA9IGVsZW1lbnRzQnlNYXRjaGlEW21hdGNoLm1hdGNoSWRdO1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVNYXRjaEZyb21CZXRzbGlwKG1hdGNoLCBtYXRjaERpdik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcignRXJyb3IgZ2V0dGluZyBiZXRzbGlwIGl0ZW1zOicsIGVycikpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gbG9hZFRyYW5zbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGAke2FwaVVSTH0vbmV3LXRyYW5zbGF0ZXMvJHtsb2NhbGV9YCkudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgIC50aGVuKGpzb24gPT4ge1xuICAgICAgICAgICAgICAgIGkxOG5EYXRhID0ganNvbjtcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUoKTtcblxuICAgICAgICAgICAgICAgIHZhciBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBtdXRhdGlvbk9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZvcmVjYXN0UG9zdGVyJyksIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlKCkge1xuICAgICAgICBjb25zdCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRyYW5zbGF0ZV0nKTtcbiAgICAgICAgZWxlbXMuZm9yRWFjaChlbGVtID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpO1xuICAgICAgICAgICAgZWxlbS5pbm5lckhUTUwgPSB0cmFuc2xhdGVLZXkoa2V5KTtcbiAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gJ2VuJykge1xuICAgICAgICAgICAgbWFpblBhZ2UuY2xhc3NMaXN0LmFkZCgnZW4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZUtleShrZXksIGRlZmF1bHRWYWx1ZSA9IGtleSkge1xuICAgICAgICByZXR1cm4gaTE4bkRhdGFba2V5XSB8fCBkZWZhdWx0VmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3QgcmVxdWVzdCA9IChsaW5rLCBleHRyYU9wdGlvbnMpID0+XG4gICAgICAgIGZldGNoKGFwaVVSTCArIGxpbmssIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAuLi4oZXh0cmFPcHRpb25zIHx8IHt9KVxuICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXJlcy5vaykgdGhyb3cgbmV3IEVycm9yKCdBUEkgZXJyb3InKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdBUEkgcmVxdWVzdCBmYWlsZWQ6JywgZXJyKTtcblxuICAgICAgICAgICAgICAgIHJlcG9ydEVycm9yKGVycik7XG5cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWxsd2luX19wYWdlJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuc3RhcnRzV2l0aChcImh0dHBzOi8vd3d3LmZhdmJldC5oci9cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3Byb21vY2lqZS9wcm9tb2NpamEvc3R1Yi8nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9wcm9tb3MvcHJvbW8vc3R1Yi8nO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICBmdW5jdGlvbiByZXBvcnRFcnJvcihlcnIpIHtcbiAgICAgICAgY29uc3QgcmVwb3J0RGF0YSA9IHtcbiAgICAgICAgICAgIG9yaWdpbjogd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgICAgICAgICB1c2VyaWQ6IHVzZXJJZCxcbiAgICAgICAgICAgIGVycm9yVGV4dDogZXJyPy5lcnJvciB8fCBlcnI/LnRleHQgfHwgZXJyPy5tZXNzYWdlIHx8ICdVbmtub3duIGVycm9yJyxcbiAgICAgICAgICAgIHR5cGU6IGVycj8ubmFtZSB8fCAnVW5rbm93bkVycm9yJyxcbiAgICAgICAgICAgIHN0YWNrOiBlcnI/LnN0YWNrIHx8ICcnXG4gICAgICAgIH07XG5cbiAgICAgICAgZmV0Y2goJ2h0dHBzOi8vZmF2LXByb20uY29tL2FwaS1jbXMvcmVwb3J0cy9hZGQnLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocmVwb3J0RGF0YSlcbiAgICAgICAgfSkuY2F0Y2goY29uc29sZS53YXJuKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0QWRkQWxsQnRuKCkge1xuICAgICAgICBjb25zdCBhZGRBbGxCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJlZGljdEJ0bicpO1xuICAgICAgICBhZGRBbGxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXVzZXJJZCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBnZXRCZXRzbGlwSXRlbXMoKS50aGVuKGJldHNsaXBNYXRjaGVzID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIGFsbE1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hEaXYgPSBlbGVtZW50c0J5TWF0Y2hpRFttYXRjaC5tYXRjaElkXTtcbiAgICAgICAgICAgICAgICAgICAgYWRkTWF0Y2hUb0JldHNsaXAobWF0Y2gsIG1hdGNoRGl2LCBiZXRzbGlwTWF0Y2hlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgYmV0c2xpcCBpdGVtczonLCBlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgSW5pdFBhZ2UgPSAoKSA9PiB7XG4gICAgICAgIHRyYW5zbGF0ZSgpO1xuICAgICAgICBpbml0QWRkQWxsQnRuKCk7XG4gICAgICAgIHJlcXVlc3QoJy9tYXRjaGVzJykudGhlbihtYXRjaGVzID0+IHtcbiAgICAgICAgICAgIGFsbE1hdGNoZXMgPSAobWF0Y2hlcyB8fCBbXSkuc29ydCgoYSwgYikgPT4gbmV3IERhdGUoYS5tYXRjaERhdGUpIC0gbmV3IERhdGUoYi5tYXRjaERhdGUpKTtcblxuICAgICAgICAgICAgZ2V0QmV0c2xpcEl0ZW1zKCkudGhlbihiZXRzbGlwTWF0Y2hlcyA9PiB7XG4gICAgICAgICAgICAgICAgLy8gaW5pdE1hdGNoZXMoYWxsTWF0Y2hlcywgYmV0c2xpcE1hdGNoZXMpO1xuICAgICAgICAgICAgICAgIGluaXRTbGlkZXIoKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKCdFcnJvciBnZXR0aW5nIGJldHNsaXAgaXRlbXM6JywgZXJyKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRNYXRjaGVzKG1hdGNoZXMsIGJldHNsaXBNYXRjaGVzKSB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWxjb21lX19yb3cnKTtcbiAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgICAgIGxldCBhZGRlZCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Y2hlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICAgICAgY29uc3Qgcm93V3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgcm93V3JhcC5jbGFzc05hbWUgPSAnd2VsY29tZV9fcm93LXdyYXAnO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gaTsgaiA8IGkgKyAyICYmIGogPCBtYXRjaGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBtYXRjaGVzW2pdO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgbWF0Y2hEaXYuY2xhc3NOYW1lID0gJ3dlbGNvbWVfX2l0ZW0nO1xuICAgICAgICAgICAgICAgIG1hdGNoLm1hdGNoSWQgPSAoK21hdGNoLm1hdGNoSWQpO1xuICAgICAgICAgICAgICAgIGlmIChiZXRzbGlwTWF0Y2hlcy5zb21lKGIgPT4gYi5ldmVudF9pZCA9PSBtYXRjaC5tYXRjaElkKSkge1xuICAgICAgICAgICAgICAgICAgICBhZGRlZCsrO1xuICAgICAgICAgICAgICAgICAgICBtYXRjaERpdi5jbGFzc0xpc3QuYWRkKCdfZG9uZScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG1hdGNoRGl2LmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1jbG9zZVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS10aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+JHt0cmFuc2xhdGVLZXkobWF0Y2gudGl0bGUpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLWRhdGVcIj4ke2Zvcm1hdERhdGUobWF0Y2gubWF0Y2hEYXRlKX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1tYXgtdGl0bGVcIj4ke3RyYW5zbGF0ZUtleShtYXRjaC50ZWFtMSl9IOKAkyAke3RyYW5zbGF0ZUtleShtYXRjaC50ZWFtMil9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0taW5mb1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1iaWRcIj4ke3RyYW5zbGF0ZUtleShtYXRjaC5vdXRjb21lVHJhbnNsYXRpb24pfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1jb2ZcIj4ke21hdGNoLmRlZmF1bHRDb2VmIHx8IDB9PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgYDtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnRzQnlNYXRjaGlEW21hdGNoLm1hdGNoSWRdID0gbWF0Y2hEaXY7XG4gICAgICAgICAgICAgICAgcm93V3JhcC5hcHBlbmRDaGlsZChtYXRjaERpdik7XG5cbiAgICAgICAgICAgICAgICBnZXRNYXRjaERhdGEobWF0Y2gpLnRoZW4obSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2ZEaXYgPSBtYXRjaERpdi5xdWVyeVNlbGVjdG9yKCcud2VsY29tZV9faXRlbS1jb2YnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZkRpdi5pbm5lckhUTUwgPSBtLm91dGNvbWVDb2VmO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBtYXRjaERpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBhZGRNYXRjaFRvQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYsIGJldHNsaXBNYXRjaGVzLCBlKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xvc2VCdG4gPSBtYXRjaERpdi5xdWVyeVNlbGVjdG9yKCcud2VsY29tZV9faXRlbS1jbG9zZScpO1xuICAgICAgICAgICAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTWF0Y2hGcm9tQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHJvd1dyYXApO1xuICAgICAgICB9XG4gICAgICAgIHNldENvdW50ZXIoYWRkZWQpO1xuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgIH1cblxuICAgIGxldCBoYXNTZW50Q2xpY2tFdmVudCA9IGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gYWRkTWF0Y2hUb0JldHNsaXAobWF0Y2gsIG1hdGNoRGl2LCBiZXRzbGlwTWF0Y2hlcywgZSkge1xuICAgICAgICBpZiAoIXVzZXJJZCB8fCBiZXRzbGlwTWF0Y2hlcy5zb21lKGIgPT4gYi5ldmVudF9pZCA9PT0gbWF0Y2gubWF0Y2hJZCB8fCAoZSAmJiBlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3dlbGNvbWVfX2l0ZW0tY2xvc2UnKSkpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmYXZEYXRhID0gZmF2RGF0YUJ5TWF0Y2hbbWF0Y2gubWF0Y2hJZF07XG4gICAgICAgIGlmICghZmF2RGF0YSB8fCAhZmF2RGF0YS5tYXRjaElkKSByZXR1cm47XG5cbiAgICAgICAgaWYgKCFoYXNTZW50Q2xpY2tFdmVudCkge1xuICAgICAgICAgICAgaGFzU2VudENsaWNrRXZlbnQgPSB0cnVlO1xuXG4gICAgICAgICAgICByZXF1ZXN0KCcvZXZlbnRzJywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdXNlcmlkOiB1c2VySWQsIGV2ZW50SWQ6IG1hdGNoLm1hdGNoSWQgfSlcbiAgICAgICAgICAgIH0pLmNhdGNoKGNvbnNvbGUuZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkVG9CZXRzbGlwKGZhdkRhdGEpO1xuICAgICAgICBtYXRjaERpdi5jbGFzc0xpc3QuYWRkKCdfZG9uZScpO1xuICAgICAgICB1cGRhdGVDb3VudGVyKDEpO1xuXG4gICAgICAgIGNvbnN0IGFjdGl2ZUNvdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlbGNvbWVfX2l0ZW0uX2RvbmUnKS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHRvdGFsQ291bnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VsY29tZV9faXRlbScpLmxlbmd0aDtcblxuICAgICAgICBpZiAoYWN0aXZlQ291bnQgPT09IHRvdGFsQ291bnQgJiYgIXN3aXRjaEJ0bi5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIikpIHtcbiAgICAgICAgICAgIHN3aXRjaEJ0bi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzd2l0Y2hlckFjdGl2ZVwiLCBcIjFcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVNYXRjaEZyb21CZXRzbGlwKG1hdGNoLCBtYXRjaERpdikge1xuICAgICAgICBpZiAoIXVzZXJJZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGZhdkRhdGEgPSBmYXZEYXRhQnlNYXRjaFttYXRjaC5tYXRjaElkXTtcbiAgICAgICAgaWYgKCFmYXZEYXRhIHx8ICFmYXZEYXRhLm1hdGNoSWQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBpc1JlbW92ZWQgPSByZW1vdmVGcm9tQmV0c2xpcChmYXZEYXRhKTtcbiAgICAgICAgaWYgKGlzUmVtb3ZlZCkge1xuICAgICAgICAgICAgbWF0Y2hEaXYuY2xhc3NMaXN0LnJlbW92ZSgnX2RvbmUnKTtcbiAgICAgICAgICAgIHVwZGF0ZUNvdW50ZXIoLTEpO1xuXG4gICAgICAgICAgICBpZiAoc3dpdGNoQnRuLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZVwiKSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaEJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic3dpdGNoZXJBY3RpdmVcIiwgXCIwXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlQ291bnRlcihkaWZmKSB7XG4gICAgICAgIGNvbnN0IGN1cnJDb3VudGVyID0gK2NvdW50ZXJTcGFuLmlubmVySFRNTDtcbiAgICAgICAgc2V0Q291bnRlcihjdXJyQ291bnRlciArIGRpZmYpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldENvdW50ZXIodmFsdWUpIHtcbiAgICAgICAgY291bnRlclNwYW4uaW5uZXJIVE1MID0gdmFsdWU7XG5cbiAgICAgICAgY29uc3QgbGFzdERpZ2l0ID0gdmFsdWUgJSAxMDtcbiAgICAgICAgbGV0IHRyYW5zbGF0aW9uS2V5ID0gKGxhc3REaWdpdCA9PT0gMSkgPyAnZXZlbnQxJyA6IChsYXN0RGlnaXQgPj0gMiAmJiBsYXN0RGlnaXQgPD0gNCkgPyAnZXZlbnQyJyA6ICdldmVudDMnO1xuXG5cbiAgICAgICAgZXZlbnRzU3Bhbi5pbm5lckhUTUwgPSBgJHt0cmFuc2xhdGVLZXkodHJhbnNsYXRpb25LZXkpfWA7XG4gICAgICAgIHdlbGNvbWVCZXQuY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZScsIHZhbHVlIDw9IDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE1hdGNoRGF0YShtYXRjaCwgc2VydmljZUlkID0gMCkge1xuICAgICAgICBpZiAoc2VydmljZUlkID4gMSkgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiBmZXRjaCgnaHR0cHM6Ly93d3cuZmF2YmV0LnVhL3NlcnZpY2UvbGluZW91dC9mcm9udGVuZF9hcGkyLycsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIFwianNvbnJwY1wiOiBcIjIuMFwiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogMTYsXG4gICAgICAgICAgICAgICAgXCJtZXRob2RcIjogXCJmcm9udGVuZC9tYXJrZXQvZ2V0XCIsXG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImJ5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGFuZ1wiOiAndWsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXJ2aWNlX2lkXCI6IHNlcnZpY2VJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZXZlbnRfaWRcIjogbWF0Y2gubWF0Y2hJZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oZmF2RGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29lZkRhdGFBcnJheSA9IGZhdkRhdGEucmVzdWx0LmZpbHRlcihvID0+XG4gICAgICAgICAgICAgICAgICAgIG8ubWFya2V0X25hbWUgPT09IG1hdGNoLm1hcmtldE5hbWUgJiZcbiAgICAgICAgICAgICAgICAgICAgby5yZXN1bHRfdHlwZV9uYW1lID09PSBtYXRjaC5tYXJrZXRUeXBlXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmICghY29lZkRhdGFBcnJheS5sZW5ndGgpIHJldHVybiBnZXRNYXRjaERhdGEobWF0Y2gsIHNlcnZpY2VJZCArIDEpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGZvdW5kT3V0Y29tZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkQ29lZkRhdGEgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgY29lZkRhdGFBcnJheS5zb21lKGNvZWZEYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0Y29tZSA9IGNvZWZEYXRhLm91dGNvbWVzLmZpbmQobyA9PiBvLm91dGNvbWVfbmFtZSA9PT0gbWF0Y2gub3V0Y29tZU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3V0Y29tZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRPdXRjb21lID0gb3V0Y29tZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29lZkRhdGEgPSBjb2VmRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICghZm91bmRPdXRjb21lIHx8ICFzZWxlY3RlZENvZWZEYXRhKSByZXR1cm4gZ2V0TWF0Y2hEYXRhKG1hdGNoLCBzZXJ2aWNlSWQgKyAxKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0Y29tZUlkOiBmb3VuZE91dGNvbWUub3V0Y29tZV9pZCxcbiAgICAgICAgICAgICAgICAgICAgb3V0Y29tZUNvZWY6IGZvdW5kT3V0Y29tZS5vdXRjb21lX2NvZWYsXG4gICAgICAgICAgICAgICAgICAgIG1hcmtldElkOiBzZWxlY3RlZENvZWZEYXRhLm1hcmtldF9pZCxcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZUlkOiBzZXJ2aWNlSWQsXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoSWQ6IG1hdGNoLm1hdGNoSWQsXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGZhdkRhdGFCeU1hdGNoW21hdGNoLm1hdGNoSWRdID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXREYXRlKGRhdGUpIHtcbiAgICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICByZXR1cm4gYCR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCAnMCcpfS4ke1N0cmluZyhkLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpfWA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkVG9CZXRzbGlwKG1hdGNoKSB7XG4gICAgICAgIGlmICghd2luZG93LmFkZEJldHNsaXBPdXRjb21lcykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IG91dGNvbWUgPSB7XG4gICAgICAgICAgICBzZXJ2aWNlSWQ6IG1hdGNoLnNlcnZpY2VJZCxcbiAgICAgICAgICAgIGV2ZW50SWQ6IG1hdGNoLm1hdGNoSWQsXG4gICAgICAgICAgICBtYXJrZXRJZDogbWF0Y2gubWFya2V0SWQsXG4gICAgICAgICAgICBvdXRjb21lSWQ6IG1hdGNoLm91dGNvbWVJZFxuICAgICAgICB9O1xuICAgICAgICB3aW5kb3cuYWRkQmV0c2xpcE91dGNvbWVzKFtvdXRjb21lXSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRnJvbUJldHNsaXAobWF0Y2gpIHtcbiAgICAgICAgaWYgKCF3aW5kb3cucmVtb3ZlQmV0c2xpcEl0ZW1zKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3Qgb3V0Y29tZUlkID0gbWF0Y2gub3V0Y29tZUlkO1xuICAgICAgICBjb25zdCByZXN1bHQgPSB3aW5kb3cucmVtb3ZlQmV0c2xpcEl0ZW1zKFtvdXRjb21lSWRdKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCZXRzbGlwSXRlbXMoKSB7XG4gICAgICAgIGlmICghd2luZG93LmdldEJldHNsaXBJdGVtcykgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG5cbiAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRCZXRzbGlwSXRlbXMoKVxuICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiBbXSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgSW5pdFBhZ2UoKTtcbiAgICAgICAgaWYgKHdpbmRvdy5zdG9yZSkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSB3aW5kb3cuc3RvcmUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICAgIHVzZXJJZCA9IHN0YXRlLmF1dGguaXNBdXRob3JpemVkICYmIHN0YXRlLmF1dGguaWQgfHwgJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgYyA9IDA7XG4gICAgICAgICAgICBjb25zdCBpID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjIDwgNTAgJiYgISF3aW5kb3cuZ191c2VyX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IHdpbmRvdy5nX3VzZXJfaWQ7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrVXNlckF1dGgoKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrVXNlckF1dGgoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja1VzZXJBdXRoKCkge1xuICAgICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgICAgICB1bmF1dGhNc2dzLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LmFkZCgnaGlkZScpKTtcbiAgICAgICAgICAgIHN3aXRjaFdyYXAuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBzd2l0Y2hXcmFwLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuICAgICAgICAgICAgdW5hdXRoTXNncy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0U2xpZGVyKCkge1xuICAgICAgICBsZXQgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICBsZXQgc3RhcnRYO1xuICAgICAgICBsZXQgc2Nyb2xsTGVmdDtcblxuICAgICAgICBjb25zdCBkcmFnZ2FibGVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJhZ2dhYmxlQ29udGFpbmVyJyk7XG4gICAgICAgIGNvbnN0IGl0ZW1zV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWxjb21lX19yb3ctd3JhcCcpO1xuICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VsY29tZV9fcm93Jyk7XG5cbiAgICAgICAgY29uc3Qgd2lkdGhzID0ge1xuICAgICAgICAgICAgNTogJzIwOThweCcsXG4gICAgICAgICAgICA0OiAnMTY2OHB4JyxcbiAgICAgICAgICAgIDM6ICcxMjU4cHgnLFxuICAgICAgICAgICAgMjogJzgyOHB4JyxcbiAgICAgICAgICAgIDE6ICc0MThweCcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnMjA5OHB4J1xuICAgICAgICB9O1xuXG4gICAgICAgIHJvdy5zdHlsZS5tYXhXaWR0aCA9IHdpZHRoc1tpdGVtc1dyYXAubGVuZ3RoXSB8fCB3aWR0aHMuZGVmYXVsdDtcblxuICAgICAgICBkcmFnZ2FibGVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG4gICAgICAgICAgICBpc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHN0YXJ0WCA9IGUucGFnZVggLSBkcmFnZ2FibGVDb250YWluZXIub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIHNjcm9sbExlZnQgPSBkcmFnZ2FibGVDb250YWluZXIuc2Nyb2xsTGVmdDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZHJhZ2dhYmxlQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiBpc0RyYWdnaW5nID0gZmFsc2UpO1xuICAgICAgICBkcmFnZ2FibGVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IGlzRHJhZ2dpbmcgPSBmYWxzZSk7XG4gICAgICAgIGRyYWdnYWJsZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBlID0+IHtcbiAgICAgICAgICAgIGlmICghaXNEcmFnZ2luZykgcmV0dXJuO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgeCA9IGUucGFnZVggLSBkcmFnZ2FibGVDb250YWluZXIub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIGNvbnN0IHdhbGsgPSAoeCAtIHN0YXJ0WCkgKiAyO1xuICAgICAgICAgICAgZHJhZ2dhYmxlQ29udGFpbmVyLnNjcm9sbExlZnQgPSBzY3JvbGxMZWZ0IC0gd2FsaztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQuY2xvc2VzdCgnLndlbGNvbWVfX2l0ZW0nKTtcbiAgICAgICAgaWYgKHRhcmdldCAmJiAhdXNlcklkKSB7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvbG9naW4nO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmKHRhcmdldCl7XG4gICAgICAgIC8vICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnX2RvbmUnKTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhlLnRhcmdldC5jbG9zZXN0KCcud2VsY29tZV9fY2xvc2UtJykpO1xuICAgIH0pO1xuXG5cbiAgICBsZXQgbWFpblBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWxsd2luX19wYWdlJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBtYWluUGFnZS5jbGFzc0xpc3QuYWRkKCdvdmVyZmxvdycpLCAxMDAwKTtcblxuICAgIGxvYWRUcmFuc2xhdGlvbnMoKS50aGVuKGluaXQpO1xuXG5cbiAgICAvL2ZvciB0ZXN0XG4gICAgY29uc3QgbG5nQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sbmctYnRuXCIpXG5cbiAgICBsbmdCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJsb2NhbGVcIikpIHtcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oXCJsb2NhbGVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFwibG9jYWxlXCIsIFwiZW5cIik7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51LWJ0blwiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVudS10ZXN0XCIpPy5jbGFzc0xpc3QudG9nZ2xlKFwiaGlkZVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICBjb25zdCBhdXRoQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hdXRoLWJ0blwiKVxuICAgIGNvbnN0IGJldEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmV0LWJ0blwiKVxuXG4gICAgYXV0aEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT57XG4gICAgICAgIGlmKHVzZXJJZCl7XG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFwidXNlcklkXCIpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShcInVzZXJJZFwiLCBcIjEwMDMwMDI2OFwiKVxuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgIH0pO1xuXG4gICAgYmV0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PntcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53ZWxjb21lX19iZXRcIikuY2xhc3NMaXN0LnRvZ2dsZShcImhpZGVcIik7XG4gICAgfSlcblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcmFnZ2FibGVDb250YWluZXInKTtcblxuICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGNsb3NlID0gZS50YXJnZXQuY2xvc2VzdCgnLndlbGNvbWVfX2l0ZW0tY2xvc2UnKTtcbiAgICAgICAgaWYgKGNsb3NlKSB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gY2xvc2UuY2xvc2VzdCgnLndlbGNvbWVfX2l0ZW0nKTtcbiAgICAgICAgICAgIGlmIChpdGVtICYmIGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdfZG9uZScpKSBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ19kb25lJyk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXRlbSA9IGUudGFyZ2V0LmNsb3Nlc3QoJy53ZWxjb21lX19pdGVtJyk7XG4gICAgICAgIGlmIChpdGVtICYmICFpdGVtLmNsYXNzTGlzdC5jb250YWlucygnX2RvbmUnKSkgaXRlbS5jbGFzc0xpc3QuYWRkKCdfZG9uZScpO1xuICAgIH0pO1xuXG5cbn0pKCk7XG4iLCIiXX0=
