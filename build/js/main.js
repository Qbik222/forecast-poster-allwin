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
      if (window.location.href.startsWith("https://www.allwin.hr/")) {
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

        // console.log(match)

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
    return fetch('https://www.allwin.ua/service/lineout/frontend_api2/', {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzZWNvbmQuanMiXSwibmFtZXMiOlsiX3Nlc3Npb25TdG9yYWdlJGdldEl0IiwiX2RvY3VtZW50JHF1ZXJ5U2VsZWN0IiwiYXBpVVJMIiwidW5hdXRoTXNncyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImNvdW50ZXJTcGFuIiwicXVlcnlTZWxlY3RvciIsImV2ZW50c1NwYW4iLCJ3ZWxjb21lQmV0Iiwic3dpdGNoV3JhcCIsInN3aXRjaEJ0biIsInVrTGVuZyIsImVuTGVuZyIsImxvY2FsZSIsInNlc3Npb25TdG9yYWdlIiwiZ2V0SXRlbSIsImkxOG5EYXRhIiwidXNlcklkIiwiZWxlbWVudHNCeU1hdGNoaUQiLCJhbGxNYXRjaGVzIiwiZmF2RGF0YUJ5TWF0Y2giLCJzYXZlZFN3aXRjaGVyU3RhdGUiLCJsb2NhbFN0b3JhZ2UiLCJjbGFzc0xpc3QiLCJhZGQiLCJhZGRFdmVudExpc3RlbmVyIiwic3R5bGUiLCJwb2ludGVyRXZlbnRzIiwic2V0VGltZW91dCIsImlzQWN0aXZlIiwidG9nZ2xlIiwic2V0SXRlbSIsImdldEJldHNsaXBJdGVtcyIsInRoZW4iLCJiZXRzbGlwTWF0Y2hlcyIsImZvckVhY2giLCJtYXRjaCIsIm1hdGNoRGl2IiwibWF0Y2hJZCIsImFkZE1hdGNoVG9CZXRzbGlwIiwiX2l0ZXJhdG9yIiwiX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIiLCJfc3RlcCIsInMiLCJuIiwiZG9uZSIsInZhbHVlIiwicmVtb3ZlTWF0Y2hGcm9tQmV0c2xpcCIsImVyciIsImUiLCJmIiwiY29uc29sZSIsImVycm9yIiwibG9hZFRyYW5zbGF0aW9ucyIsImZldGNoIiwiY29uY2F0IiwicmVzIiwianNvbiIsInRyYW5zbGF0ZSIsIm11dGF0aW9uT2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwib2JzZXJ2ZSIsImdldEVsZW1lbnRCeUlkIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsImVsZW1zIiwiZWxlbSIsImtleSIsImdldEF0dHJpYnV0ZSIsImlubmVySFRNTCIsInRyYW5zbGF0ZUtleSIsInJlbW92ZUF0dHJpYnV0ZSIsIm1haW5QYWdlIiwiZGVmYXVsdFZhbHVlIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwicmVxdWVzdCIsImxpbmsiLCJleHRyYU9wdGlvbnMiLCJfb2JqZWN0U3ByZWFkIiwiaGVhZGVycyIsIm9rIiwiRXJyb3IiLCJyZXBvcnRFcnJvciIsImRpc3BsYXkiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJzdGFydHNXaXRoIiwiUHJvbWlzZSIsInJlamVjdCIsInJlcG9ydERhdGEiLCJvcmlnaW4iLCJ1c2VyaWQiLCJlcnJvclRleHQiLCJ0ZXh0IiwibWVzc2FnZSIsInR5cGUiLCJuYW1lIiwic3RhY2siLCJtZXRob2QiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsIndhcm4iLCJpbml0QWRkQWxsQnRuIiwiYWRkQWxsQnRuIiwiX2l0ZXJhdG9yMiIsIl9zdGVwMiIsIkluaXRQYWdlIiwibWF0Y2hlcyIsInNvcnQiLCJhIiwiYiIsIkRhdGUiLCJtYXRjaERhdGUiLCJpbml0U2xpZGVyIiwiaW5pdE1hdGNoZXMiLCJjb250YWluZXIiLCJhZGRlZCIsImkiLCJyb3dXcmFwIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsIl9sb29wIiwiaiIsInNvbWUiLCJldmVudF9pZCIsInRpdGxlIiwiZm9ybWF0RGF0ZSIsInRlYW0xIiwidGVhbTIiLCJvdXRjb21lVHJhbnNsYXRpb24iLCJkZWZhdWx0Q29lZiIsImFwcGVuZENoaWxkIiwiZ2V0TWF0Y2hEYXRhIiwibSIsImNvZkRpdiIsIm91dGNvbWVDb2VmIiwiY2xvc2VCdG4iLCJzdG9wUHJvcGFnYXRpb24iLCJzZXRDb3VudGVyIiwiaGFzU2VudENsaWNrRXZlbnQiLCJ0YXJnZXQiLCJjb250YWlucyIsImZhdkRhdGEiLCJldmVudElkIiwiYWRkVG9CZXRzbGlwIiwidXBkYXRlQ291bnRlciIsImFjdGl2ZUNvdW50IiwidG90YWxDb3VudCIsImlzUmVtb3ZlZCIsInJlbW92ZUZyb21CZXRzbGlwIiwicmVtb3ZlIiwiZGlmZiIsImN1cnJDb3VudGVyIiwibGFzdERpZ2l0IiwidHJhbnNsYXRpb25LZXkiLCJzZXJ2aWNlSWQiLCJjb2VmRGF0YUFycmF5IiwicmVzdWx0IiwiZmlsdGVyIiwibyIsIm1hcmtldF9uYW1lIiwibWFya2V0TmFtZSIsInJlc3VsdF90eXBlX25hbWUiLCJtYXJrZXRUeXBlIiwiZm91bmRPdXRjb21lIiwic2VsZWN0ZWRDb2VmRGF0YSIsImNvZWZEYXRhIiwib3V0Y29tZSIsIm91dGNvbWVzIiwiZmluZCIsIm91dGNvbWVfbmFtZSIsIm91dGNvbWVOYW1lIiwib3V0Y29tZUlkIiwib3V0Y29tZV9pZCIsIm91dGNvbWVfY29lZiIsIm1hcmtldElkIiwibWFya2V0X2lkIiwiZGF0ZSIsImQiLCJTdHJpbmciLCJnZXREYXRlIiwicGFkU3RhcnQiLCJnZXRNb250aCIsImFkZEJldHNsaXBPdXRjb21lcyIsInJlbW92ZUJldHNsaXBJdGVtcyIsInJlc29sdmUiLCJpbml0Iiwic3RvcmUiLCJzdGF0ZSIsImdldFN0YXRlIiwiYXV0aCIsImlzQXV0aG9yaXplZCIsImlkIiwiYyIsInNldEludGVydmFsIiwiZ191c2VyX2lkIiwiY2hlY2tVc2VyQXV0aCIsImNsZWFySW50ZXJ2YWwiLCJlbCIsImlzRHJhZ2dpbmciLCJzdGFydFgiLCJzY3JvbGxMZWZ0IiwiZHJhZ2dhYmxlQ29udGFpbmVyIiwiaXRlbXNXcmFwIiwicm93Iiwid2lkdGhzIiwibWF4V2lkdGgiLCJwYWdlWCIsIm9mZnNldExlZnQiLCJwcmV2ZW50RGVmYXVsdCIsIngiLCJ3YWxrIiwiY2xvc2VzdCIsImxuZ0J0biIsInJlbW92ZUl0ZW0iLCJyZWxvYWQiLCJfZG9jdW1lbnQkcXVlcnlTZWxlY3QyIiwiYXV0aEJ0biIsImJldEJ0biIsImNsb3NlIiwiaXRlbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxDQUFDLFVBQUFBLHFCQUFBLEVBQUFDLHFCQUFBLEVBQVk7RUFDVCxJQUFNQyxNQUFNLEdBQUcsaURBQWlEO0VBRWhFLElBQ0lDLFVBQVUsR0FBR0MsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7SUFDbERDLFdBQVcsR0FBR0YsUUFBUSxDQUFDRyxhQUFhLENBQUMsVUFBVSxDQUFDO0lBQ2hEQyxVQUFVLEdBQUdKLFFBQVEsQ0FBQ0csYUFBYSxDQUFDLFNBQVMsQ0FBQztJQUM5Q0UsVUFBVSxHQUFHTCxRQUFRLENBQUNHLGFBQWEsQ0FBQyxlQUFlLENBQUM7SUFDcERHLFVBQVUsR0FBR04sUUFBUSxDQUFDRyxhQUFhLENBQUMsa0JBQWtCLENBQUM7SUFDdkRJLFNBQVMsR0FBR1AsUUFBUSxDQUFDRyxhQUFhLENBQUMsc0JBQXNCLENBQUM7RUFFOUQsSUFBTUssTUFBTSxHQUFHUixRQUFRLENBQUNHLGFBQWEsQ0FBQyxTQUFTLENBQUM7RUFDaEQsSUFBTU0sTUFBTSxHQUFHVCxRQUFRLENBQUNHLGFBQWEsQ0FBQyxTQUFTLENBQUM7O0VBRWhEO0VBQ0EsSUFBSU8sTUFBTSxHQUFHQyxjQUFjLENBQUNDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJO0VBQ3JELElBQUlKLE1BQU0sRUFBRUUsTUFBTSxHQUFHLElBQUk7RUFDekIsSUFBSUQsTUFBTSxFQUFFQyxNQUFNLEdBQUcsSUFBSTtFQUV6QixJQUFJRyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0VBQ2pCO0VBQ0E7RUFDQSxJQUFJQyxNQUFNLElBQUFsQixxQkFBQSxHQUFHZSxjQUFjLENBQUNDLE9BQU8sQ0FBQyxRQUFRLENBQUMsY0FBQWhCLHFCQUFBLGNBQUFBLHFCQUFBLEdBQUksSUFBSTtFQUNyRCxJQUFJbUIsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO0VBQzFCLElBQUlDLFVBQVUsR0FBRyxFQUFFO0VBQ25CLElBQUlDLGNBQWMsR0FBRyxDQUFDLENBQUM7RUFFdkIsSUFBTUMsa0JBQWtCLEdBQUdDLFlBQVksQ0FBQ1AsT0FBTyxDQUFDLGdCQUFnQixDQUFDO0VBQ2pFLElBQUlNLGtCQUFrQixLQUFLLEdBQUcsRUFBRTtJQUM1QlgsU0FBUyxDQUFDYSxTQUFTLENBQUNDLEdBQUcsQ0FBQyxRQUFRLENBQUM7RUFDckM7RUFFQWQsU0FBUyxDQUFDZSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBTTtJQUN0Q2YsU0FBUyxDQUFDZ0IsS0FBSyxDQUFDQyxhQUFhLEdBQUcsTUFBTTtJQUN0Q0MsVUFBVSxDQUFDLFlBQU07TUFDYmxCLFNBQVMsQ0FBQ2dCLEtBQUssQ0FBQ0MsYUFBYSxHQUFHLEVBQUU7SUFDdEMsQ0FBQyxFQUFFLElBQUksQ0FBQztJQUVSLElBQU1FLFFBQVEsR0FBR25CLFNBQVMsQ0FBQ2EsU0FBUyxDQUFDTyxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ3JEUixZQUFZLENBQUNTLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRUYsUUFBUSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFFNUQsSUFBSSxDQUFDWixNQUFNLEVBQUU7SUFFYmUsZUFBZSxDQUFDLENBQUMsQ0FBQ0MsSUFBSSxDQUFDLFVBQUFDLGNBQWMsRUFBSTtNQUNyQyxJQUFJTCxRQUFRLEVBQUU7UUFDVlYsVUFBVSxDQUFDZ0IsT0FBTyxDQUFDLFVBQUNDLEtBQUssRUFBSztVQUMxQixJQUFNQyxRQUFRLEdBQUduQixpQkFBaUIsQ0FBQ2tCLEtBQUssQ0FBQ0UsT0FBTyxDQUFDO1VBQ2pEQyxpQkFBaUIsQ0FBQ0gsS0FBSyxFQUFFQyxRQUFRLEVBQUVILGNBQWMsQ0FBQztRQUN0RCxDQUFDLENBQUM7TUFDTixDQUFDLE1BQU07UUFBQSxJQUFBTSxTQUFBLEdBQUFDLDBCQUFBLENBQ2lCdEIsVUFBVTtVQUFBdUIsS0FBQTtRQUFBO1VBQTlCLEtBQUFGLFNBQUEsQ0FBQUcsQ0FBQSxNQUFBRCxLQUFBLEdBQUFGLFNBQUEsQ0FBQUksQ0FBQSxJQUFBQyxJQUFBLEdBQWdDO1lBQUEsSUFBckJULEtBQUssR0FBQU0sS0FBQSxDQUFBSSxLQUFBO1lBQ1osSUFBTVQsUUFBUSxHQUFHbkIsaUJBQWlCLENBQUNrQixLQUFLLENBQUNFLE9BQU8sQ0FBQztZQUNqRFMsc0JBQXNCLENBQUNYLEtBQUssRUFBRUMsUUFBUSxDQUFDO1VBQzNDO1FBQUMsU0FBQVcsR0FBQTtVQUFBUixTQUFBLENBQUFTLENBQUEsQ0FBQUQsR0FBQTtRQUFBO1VBQUFSLFNBQUEsQ0FBQVUsQ0FBQTtRQUFBO01BQ0w7SUFDSixDQUFDLENBQUMsU0FBTSxDQUFDLFVBQUFGLEdBQUc7TUFBQSxPQUFJRyxPQUFPLENBQUNDLEtBQUssQ0FBQyw4QkFBOEIsRUFBRUosR0FBRyxDQUFDO0lBQUEsRUFBQztFQUN2RSxDQUFDLENBQUM7RUFFRixTQUFTSyxnQkFBZ0JBLENBQUEsRUFBRztJQUN4QixPQUFPQyxLQUFLLElBQUFDLE1BQUEsQ0FBSXRELE1BQU0sc0JBQUFzRCxNQUFBLENBQW1CMUMsTUFBTSxDQUFFLENBQUMsQ0FBQ29CLElBQUksQ0FBQyxVQUFBdUIsR0FBRztNQUFBLE9BQUlBLEdBQUcsQ0FBQ0MsSUFBSSxDQUFDLENBQUM7SUFBQSxFQUFDLENBQ3JFeEIsSUFBSSxDQUFDLFVBQUF3QixJQUFJLEVBQUk7TUFDVnpDLFFBQVEsR0FBR3lDLElBQUk7TUFDZkMsU0FBUyxDQUFDLENBQUM7TUFFWCxJQUFJQyxnQkFBZ0IsR0FBRyxJQUFJQyxnQkFBZ0IsQ0FBQyxVQUFVQyxTQUFTLEVBQUU7UUFDN0RILFNBQVMsQ0FBQyxDQUFDO01BQ2YsQ0FBQyxDQUFDO01BQ0ZDLGdCQUFnQixDQUFDRyxPQUFPLENBQUMzRCxRQUFRLENBQUM0RCxjQUFjLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtRQUNoRUMsU0FBUyxFQUFFLElBQUk7UUFDZkMsT0FBTyxFQUFFO01BQ2IsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0VBQ1Y7RUFFQSxTQUFTUCxTQUFTQSxDQUFBLEVBQUc7SUFDakIsSUFBTVEsS0FBSyxHQUFHL0QsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQztJQUMzRDhELEtBQUssQ0FBQy9CLE9BQU8sQ0FBQyxVQUFBZ0MsSUFBSSxFQUFJO01BQ2xCLElBQU1DLEdBQUcsR0FBR0QsSUFBSSxDQUFDRSxZQUFZLENBQUMsZ0JBQWdCLENBQUM7TUFDL0NGLElBQUksQ0FBQ0csU0FBUyxHQUFHQyxZQUFZLENBQUNILEdBQUcsQ0FBQztNQUNsQ0QsSUFBSSxDQUFDSyxlQUFlLENBQUMsZ0JBQWdCLENBQUM7SUFDMUMsQ0FBQyxDQUFDO0lBQ0YsSUFBSTNELE1BQU0sS0FBSyxJQUFJLEVBQUU7TUFDakI0RCxRQUFRLENBQUNsRCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDaEM7RUFDSjtFQUVBLFNBQVMrQyxZQUFZQSxDQUFDSCxHQUFHLEVBQXNCO0lBQUEsSUFBcEJNLFlBQVksR0FBQUMsU0FBQSxDQUFBQyxNQUFBLFFBQUFELFNBQUEsUUFBQUUsU0FBQSxHQUFBRixTQUFBLE1BQUdQLEdBQUc7SUFDekMsT0FBT3BELFFBQVEsQ0FBQ29ELEdBQUcsQ0FBQyxJQUFJTSxZQUFZO0VBQ3hDO0VBRUEsSUFBTUksT0FBTyxHQUFHLFNBQVZBLE9BQU9BLENBQUlDLElBQUksRUFBRUMsWUFBWTtJQUFBLE9BQy9CMUIsS0FBSyxDQUFDckQsTUFBTSxHQUFHOEUsSUFBSSxFQUFBRSxhQUFBO01BQ2ZDLE9BQU8sRUFBRTtRQUNMLFFBQVEsRUFBRSxrQkFBa0I7UUFDNUIsY0FBYyxFQUFFO01BQ3BCO0lBQUMsR0FDR0YsWUFBWSxJQUFJLENBQUMsQ0FBQyxDQUN6QixDQUFDLENBQ0cvQyxJQUFJLENBQUMsVUFBQXVCLEdBQUcsRUFBSTtNQUNULElBQUksQ0FBQ0EsR0FBRyxDQUFDMkIsRUFBRSxFQUFFLE1BQU0sSUFBSUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztNQUN6QyxPQUFPNUIsR0FBRyxDQUFDQyxJQUFJLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUMsU0FDSSxDQUFDLFVBQUFULEdBQUcsRUFBSTtNQUNWRyxPQUFPLENBQUNDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRUosR0FBRyxDQUFDO01BRXpDcUMsV0FBVyxDQUFDckMsR0FBRyxDQUFDO01BRWhCN0MsUUFBUSxDQUFDRyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUNvQixLQUFLLENBQUM0RCxPQUFPLEdBQUcsTUFBTTtNQUM5RCxJQUFJQyxNQUFNLENBQUNDLFFBQVEsQ0FBQ0MsSUFBSSxDQUFDQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsRUFBRTtRQUMzREgsTUFBTSxDQUFDQyxRQUFRLENBQUNDLElBQUksR0FBRyw0QkFBNEI7TUFDdkQsQ0FBQyxNQUFNO1FBQ0hGLE1BQU0sQ0FBQ0MsUUFBUSxDQUFDQyxJQUFJLEdBQUcscUJBQXFCO01BQ2hEO01BRUEsT0FBT0UsT0FBTyxDQUFDQyxNQUFNLENBQUM1QyxHQUFHLENBQUM7SUFDOUIsQ0FBQyxDQUFDO0VBQUE7RUFFVixTQUFTcUMsV0FBV0EsQ0FBQ3JDLEdBQUcsRUFBRTtJQUN0QixJQUFNNkMsVUFBVSxHQUFHO01BQ2ZDLE1BQU0sRUFBRVAsTUFBTSxDQUFDQyxRQUFRLENBQUNDLElBQUk7TUFDNUJNLE1BQU0sRUFBRTlFLE1BQU07TUFDZCtFLFNBQVMsRUFBRSxDQUFBaEQsR0FBRyxhQUFIQSxHQUFHLHVCQUFIQSxHQUFHLENBQUVJLEtBQUssTUFBSUosR0FBRyxhQUFIQSxHQUFHLHVCQUFIQSxHQUFHLENBQUVpRCxJQUFJLE1BQUlqRCxHQUFHLGFBQUhBLEdBQUcsdUJBQUhBLEdBQUcsQ0FBRWtELE9BQU8sS0FBSSxlQUFlO01BQ3JFQyxJQUFJLEVBQUUsQ0FBQW5ELEdBQUcsYUFBSEEsR0FBRyx1QkFBSEEsR0FBRyxDQUFFb0QsSUFBSSxLQUFJLGNBQWM7TUFDakNDLEtBQUssRUFBRSxDQUFBckQsR0FBRyxhQUFIQSxHQUFHLHVCQUFIQSxHQUFHLENBQUVxRCxLQUFLLEtBQUk7SUFDekIsQ0FBQztJQUVEL0MsS0FBSyxDQUFDLDBDQUEwQyxFQUFFO01BQzlDZ0QsTUFBTSxFQUFFLE1BQU07TUFDZHBCLE9BQU8sRUFBRTtRQUNMLGNBQWMsRUFBRTtNQUNwQixDQUFDO01BQ0RxQixJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBUyxDQUFDWixVQUFVO0lBQ25DLENBQUMsQ0FBQyxTQUFNLENBQUMxQyxPQUFPLENBQUN1RCxJQUFJLENBQUM7RUFDMUI7RUFFQSxTQUFTQyxhQUFhQSxDQUFBLEVBQUc7SUFDckIsSUFBTUMsU0FBUyxHQUFHekcsUUFBUSxDQUFDRyxhQUFhLENBQUMsYUFBYSxDQUFDO0lBQ3ZEc0csU0FBUyxDQUFDbkYsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQU07TUFDdEMsSUFBSSxDQUFDUixNQUFNLEVBQUU7TUFFYmUsZUFBZSxDQUFDLENBQUMsQ0FBQ0MsSUFBSSxDQUFDLFVBQUFDLGNBQWMsRUFBSTtRQUFBLElBQUEyRSxVQUFBLEdBQUFwRSwwQkFBQSxDQUNqQnRCLFVBQVU7VUFBQTJGLE1BQUE7UUFBQTtVQUE5QixLQUFBRCxVQUFBLENBQUFsRSxDQUFBLE1BQUFtRSxNQUFBLEdBQUFELFVBQUEsQ0FBQWpFLENBQUEsSUFBQUMsSUFBQSxHQUFnQztZQUFBLElBQXJCVCxLQUFLLEdBQUEwRSxNQUFBLENBQUFoRSxLQUFBO1lBQ1osSUFBTVQsUUFBUSxHQUFHbkIsaUJBQWlCLENBQUNrQixLQUFLLENBQUNFLE9BQU8sQ0FBQztZQUNqREMsaUJBQWlCLENBQUNILEtBQUssRUFBRUMsUUFBUSxFQUFFSCxjQUFjLENBQUM7VUFDdEQ7UUFBQyxTQUFBYyxHQUFBO1VBQUE2RCxVQUFBLENBQUE1RCxDQUFBLENBQUFELEdBQUE7UUFBQTtVQUFBNkQsVUFBQSxDQUFBM0QsQ0FBQTtRQUFBO01BQ0wsQ0FBQyxDQUFDLFNBQU0sQ0FBQyxVQUFBRixHQUFHO1FBQUEsT0FBSUcsT0FBTyxDQUFDQyxLQUFLLENBQUMsOEJBQThCLEVBQUVKLEdBQUcsQ0FBQztNQUFBLEVBQUM7SUFDdkUsQ0FBQyxDQUFDO0VBQ047RUFFQSxJQUFNK0QsUUFBUSxHQUFHLFNBQVhBLFFBQVFBLENBQUEsRUFBUztJQUNuQnJELFNBQVMsQ0FBQyxDQUFDO0lBQ1hpRCxhQUFhLENBQUMsQ0FBQztJQUNmN0IsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDN0MsSUFBSSxDQUFDLFVBQUErRSxPQUFPLEVBQUk7TUFDaEM3RixVQUFVLEdBQUcsQ0FBQzZGLE9BQU8sSUFBSSxFQUFFLEVBQUVDLElBQUksQ0FBQyxVQUFDQyxDQUFDLEVBQUVDLENBQUM7UUFBQSxPQUFLLElBQUlDLElBQUksQ0FBQ0YsQ0FBQyxDQUFDRyxTQUFTLENBQUMsR0FBRyxJQUFJRCxJQUFJLENBQUNELENBQUMsQ0FBQ0UsU0FBUyxDQUFDO01BQUEsRUFBQztNQUUxRnJGLGVBQWUsQ0FBQyxDQUFDLENBQUNDLElBQUksQ0FBQyxVQUFBQyxjQUFjLEVBQUk7UUFDckM7UUFDQW9GLFVBQVUsQ0FBQyxDQUFDO01BQ2hCLENBQUMsQ0FBQyxTQUFNLENBQUMsVUFBQXRFLEdBQUc7UUFBQSxPQUFJRyxPQUFPLENBQUNDLEtBQUssQ0FBQyw4QkFBOEIsRUFBRUosR0FBRyxDQUFDO01BQUEsRUFBQztJQUN2RSxDQUFDLENBQUM7RUFDTixDQUFDO0VBRUQsU0FBU3VFLFdBQVdBLENBQUNQLE9BQU8sRUFBRTlFLGNBQWMsRUFBRTtJQUMxQyxJQUFNc0YsU0FBUyxHQUFHckgsUUFBUSxDQUFDRyxhQUFhLENBQUMsZUFBZSxDQUFDO0lBQ3pEa0gsU0FBUyxDQUFDbEQsU0FBUyxHQUFHLEVBQUU7SUFFeEIsSUFBSW1ELEtBQUssR0FBRyxDQUFDO0lBQ2IsS0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdWLE9BQU8sQ0FBQ3BDLE1BQU0sRUFBRThDLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDeEMsSUFBTUMsT0FBTyxHQUFHeEgsUUFBUSxDQUFDeUgsYUFBYSxDQUFDLEtBQUssQ0FBQztNQUM3Q0QsT0FBTyxDQUFDRSxTQUFTLEdBQUcsbUJBQW1CO01BQUMsSUFBQUMsS0FBQSxZQUFBQSxNQUFBLEVBRWM7UUFDbEQsSUFBTTFGLEtBQUssR0FBRzRFLE9BQU8sQ0FBQ2UsQ0FBQyxDQUFDO1FBQ3hCLElBQU0xRixRQUFRLEdBQUdsQyxRQUFRLENBQUN5SCxhQUFhLENBQUMsS0FBSyxDQUFDO1FBQzlDdkYsUUFBUSxDQUFDd0YsU0FBUyxHQUFHLGVBQWU7UUFDcEN6RixLQUFLLENBQUNFLE9BQU8sR0FBSSxDQUFDRixLQUFLLENBQUNFLE9BQVE7UUFDaEMsSUFBSUosY0FBYyxDQUFDOEYsSUFBSSxDQUFDLFVBQUFiLENBQUM7VUFBQSxPQUFJQSxDQUFDLENBQUNjLFFBQVEsSUFBSTdGLEtBQUssQ0FBQ0UsT0FBTztRQUFBLEVBQUMsRUFBRTtVQUN2RG1GLEtBQUssRUFBRTtVQUNQcEYsUUFBUSxDQUFDZCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDbkM7O1FBRUE7O1FBRUFhLFFBQVEsQ0FBQ2lDLFNBQVMsNk1BQUFmLE1BQUEsQ0FJRmdCLFlBQVksQ0FBQ25DLEtBQUssQ0FBQzhGLEtBQUssQ0FBQyxpR0FBQTNFLE1BQUEsQ0FFSDRFLFVBQVUsQ0FBQy9GLEtBQUssQ0FBQ2lGLFNBQVMsQ0FBQyw2RkFBQTlELE1BQUEsQ0FFMUJnQixZQUFZLENBQUNuQyxLQUFLLENBQUNnRyxLQUFLLENBQUMsY0FBQTdFLE1BQUEsQ0FBTWdCLFlBQVksQ0FBQ25DLEtBQUssQ0FBQ2lHLEtBQUssQ0FBQyx1SEFBQTlFLE1BQUEsQ0FFMURnQixZQUFZLENBQUNuQyxLQUFLLENBQUNrRyxrQkFBa0IsQ0FBQyxtRUFBQS9FLE1BQUEsQ0FDdENuQixLQUFLLENBQUNtRyxXQUFXLElBQUksQ0FBQyxxREFFMUQ7UUFFRHJILGlCQUFpQixDQUFDa0IsS0FBSyxDQUFDRSxPQUFPLENBQUMsR0FBR0QsUUFBUTtRQUMzQ3NGLE9BQU8sQ0FBQ2EsV0FBVyxDQUFDbkcsUUFBUSxDQUFDO1FBRTdCb0csWUFBWSxDQUFDckcsS0FBSyxDQUFDLENBQUNILElBQUksQ0FBQyxVQUFBeUcsQ0FBQyxFQUFJO1VBQzFCLElBQUlBLENBQUMsRUFBRTtZQUNILElBQU1DLE1BQU0sR0FBR3RHLFFBQVEsQ0FBQy9CLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQztZQUMzRHFJLE1BQU0sQ0FBQ3JFLFNBQVMsR0FBR29FLENBQUMsQ0FBQ0UsV0FBVztVQUNwQztRQUNKLENBQUMsQ0FBQztRQUVGdkcsUUFBUSxDQUFDWixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQ3dCLENBQUM7VUFBQSxPQUFLVixpQkFBaUIsQ0FBQ0gsS0FBSyxFQUFFQyxRQUFRLEVBQUVILGNBQWMsRUFBRWUsQ0FBQyxDQUFDO1FBQUEsRUFBQztRQUNoRyxJQUFNNEYsUUFBUSxHQUFHeEcsUUFBUSxDQUFDL0IsYUFBYSxDQUFDLHNCQUFzQixDQUFDO1FBQy9EdUksUUFBUSxDQUFDcEgsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUN3QixDQUFDLEVBQUs7VUFDdENBLENBQUMsQ0FBQzZGLGVBQWUsQ0FBQyxDQUFDO1VBQ25CL0Ysc0JBQXNCLENBQUNYLEtBQUssRUFBRUMsUUFBUSxDQUFDO1FBQzNDLENBQUMsQ0FBQztNQUNOLENBQUM7TUEzQ0QsS0FBSyxJQUFJMEYsQ0FBQyxHQUFHTCxDQUFDLEVBQUVLLENBQUMsR0FBR0wsQ0FBQyxHQUFHLENBQUMsSUFBSUssQ0FBQyxHQUFHZixPQUFPLENBQUNwQyxNQUFNLEVBQUVtRCxDQUFDLEVBQUU7UUFBQUQsS0FBQTtNQUFBO01BNENwRE4sU0FBUyxDQUFDZ0IsV0FBVyxDQUFDYixPQUFPLENBQUM7SUFDbEM7SUFDQW9CLFVBQVUsQ0FBQ3RCLEtBQUssQ0FBQztJQUNqQixPQUFPRCxTQUFTO0VBQ3BCO0VBRUEsSUFBSXdCLGlCQUFpQixHQUFHLEtBQUs7RUFFN0IsU0FBU3pHLGlCQUFpQkEsQ0FBQ0gsS0FBSyxFQUFFQyxRQUFRLEVBQUVILGNBQWMsRUFBRWUsQ0FBQyxFQUFFO0lBQzNELElBQUksQ0FBQ2hDLE1BQU0sSUFBSWlCLGNBQWMsQ0FBQzhGLElBQUksQ0FBQyxVQUFBYixDQUFDO01BQUEsT0FBSUEsQ0FBQyxDQUFDYyxRQUFRLEtBQUs3RixLQUFLLENBQUNFLE9BQU8sSUFBS1csQ0FBQyxJQUFJQSxDQUFDLENBQUNnRyxNQUFNLENBQUMxSCxTQUFTLENBQUMySCxRQUFRLENBQUMscUJBQXFCLENBQUU7SUFBQSxFQUFDLEVBQUU7TUFDaEk7SUFDSjtJQUVBLElBQU1DLE9BQU8sR0FBRy9ILGNBQWMsQ0FBQ2dCLEtBQUssQ0FBQ0UsT0FBTyxDQUFDO0lBQzdDLElBQUksQ0FBQzZHLE9BQU8sSUFBSSxDQUFDQSxPQUFPLENBQUM3RyxPQUFPLEVBQUU7SUFFbEMsSUFBSSxDQUFDMEcsaUJBQWlCLEVBQUU7TUFDcEJBLGlCQUFpQixHQUFHLElBQUk7TUFFeEJsRSxPQUFPLENBQUMsU0FBUyxFQUFFO1FBQ2Z3QixNQUFNLEVBQUUsTUFBTTtRQUNkQyxJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBUyxDQUFDO1VBQUVWLE1BQU0sRUFBRTlFLE1BQU07VUFBRW1JLE9BQU8sRUFBRWhILEtBQUssQ0FBQ0U7UUFBUSxDQUFDO01BQ25FLENBQUMsQ0FBQyxTQUFNLENBQUNhLE9BQU8sQ0FBQ0MsS0FBSyxDQUFDO0lBQzNCO0lBRUFpRyxZQUFZLENBQUNGLE9BQU8sQ0FBQztJQUNyQjlHLFFBQVEsQ0FBQ2QsU0FBUyxDQUFDQyxHQUFHLENBQUMsT0FBTyxDQUFDO0lBQy9COEgsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUVoQixJQUFNQyxXQUFXLEdBQUdwSixRQUFRLENBQUNDLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDLENBQUN3RSxNQUFNO0lBQzVFLElBQU00RSxVQUFVLEdBQUdySixRQUFRLENBQUNDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUN3RSxNQUFNO0lBRXJFLElBQUkyRSxXQUFXLEtBQUtDLFVBQVUsSUFBSSxDQUFDOUksU0FBUyxDQUFDYSxTQUFTLENBQUMySCxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7TUFDdkV4SSxTQUFTLENBQUNhLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLFFBQVEsQ0FBQztNQUNqQ0YsWUFBWSxDQUFDUyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDO0lBQy9DO0VBQ0o7RUFFQSxTQUFTZ0Isc0JBQXNCQSxDQUFDWCxLQUFLLEVBQUVDLFFBQVEsRUFBRTtJQUM3QyxJQUFJLENBQUNwQixNQUFNLEVBQUU7SUFFYixJQUFNa0ksT0FBTyxHQUFHL0gsY0FBYyxDQUFDZ0IsS0FBSyxDQUFDRSxPQUFPLENBQUM7SUFDN0MsSUFBSSxDQUFDNkcsT0FBTyxJQUFJLENBQUNBLE9BQU8sQ0FBQzdHLE9BQU8sRUFBRTtJQUVsQyxJQUFNbUgsU0FBUyxHQUFHQyxpQkFBaUIsQ0FBQ1AsT0FBTyxDQUFDO0lBQzVDLElBQUlNLFNBQVMsRUFBRTtNQUNYcEgsUUFBUSxDQUFDZCxTQUFTLENBQUNvSSxNQUFNLENBQUMsT0FBTyxDQUFDO01BQ2xDTCxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFFakIsSUFBSTVJLFNBQVMsQ0FBQ2EsU0FBUyxDQUFDMkgsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ3hDeEksU0FBUyxDQUFDYSxTQUFTLENBQUNvSSxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BDckksWUFBWSxDQUFDUyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDO01BQy9DO0lBQ0o7RUFDSjtFQUVBLFNBQVN1SCxhQUFhQSxDQUFDTSxJQUFJLEVBQUU7SUFDekIsSUFBTUMsV0FBVyxHQUFHLENBQUN4SixXQUFXLENBQUNpRSxTQUFTO0lBQzFDeUUsVUFBVSxDQUFDYyxXQUFXLEdBQUdELElBQUksQ0FBQztFQUNsQztFQUVBLFNBQVNiLFVBQVVBLENBQUNqRyxLQUFLLEVBQUU7SUFDdkJ6QyxXQUFXLENBQUNpRSxTQUFTLEdBQUd4QixLQUFLO0lBRTdCLElBQU1nSCxTQUFTLEdBQUdoSCxLQUFLLEdBQUcsRUFBRTtJQUM1QixJQUFJaUgsY0FBYyxHQUFJRCxTQUFTLEtBQUssQ0FBQyxHQUFJLFFBQVEsR0FBSUEsU0FBUyxJQUFJLENBQUMsSUFBSUEsU0FBUyxJQUFJLENBQUMsR0FBSSxRQUFRLEdBQUcsUUFBUTtJQUc1R3ZKLFVBQVUsQ0FBQytELFNBQVMsTUFBQWYsTUFBQSxDQUFNZ0IsWUFBWSxDQUFDd0YsY0FBYyxDQUFDLENBQUU7SUFDeER2SixVQUFVLENBQUNlLFNBQVMsQ0FBQ08sTUFBTSxDQUFDLE1BQU0sRUFBRWdCLEtBQUssSUFBSSxDQUFDLENBQUM7RUFDbkQ7RUFFQSxTQUFTMkYsWUFBWUEsQ0FBQ3JHLEtBQUssRUFBaUI7SUFBQSxJQUFmNEgsU0FBUyxHQUFBckYsU0FBQSxDQUFBQyxNQUFBLFFBQUFELFNBQUEsUUFBQUUsU0FBQSxHQUFBRixTQUFBLE1BQUcsQ0FBQztJQUN0QyxJQUFJcUYsU0FBUyxHQUFHLENBQUMsRUFBRTtJQUVuQixPQUFPMUcsS0FBSyxDQUFDLHNEQUFzRCxFQUFFO01BQ2pFZ0QsTUFBTSxFQUFFLE1BQU07TUFDZEMsSUFBSSxFQUFFQyxJQUFJLENBQUNDLFNBQVMsQ0FBQztRQUNqQixTQUFTLEVBQUUsS0FBSztRQUNoQixJQUFJLEVBQUUsRUFBRTtRQUNSLFFBQVEsRUFBRSxxQkFBcUI7UUFDL0IsUUFBUSxFQUFFO1VBQ04sSUFBSSxFQUFFO1lBQ0YsTUFBTSxFQUFFLElBQUk7WUFDWixZQUFZLEVBQUV1RCxTQUFTO1lBQ3ZCLFVBQVUsRUFBRTVILEtBQUssQ0FBQ0U7VUFDdEI7UUFDSjtNQUNKLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FDR0wsSUFBSSxDQUFDLFVBQUF1QixHQUFHO01BQUEsT0FBSUEsR0FBRyxDQUFDQyxJQUFJLENBQUMsQ0FBQztJQUFBLEVBQUMsQ0FDdkJ4QixJQUFJLENBQUMsVUFBQWtILE9BQU8sRUFBSTtNQUNiLElBQU1jLGFBQWEsR0FBR2QsT0FBTyxDQUFDZSxNQUFNLENBQUNDLE1BQU0sQ0FBQyxVQUFBQyxDQUFDO1FBQUEsT0FDekNBLENBQUMsQ0FBQ0MsV0FBVyxLQUFLakksS0FBSyxDQUFDa0ksVUFBVSxJQUNsQ0YsQ0FBQyxDQUFDRyxnQkFBZ0IsS0FBS25JLEtBQUssQ0FBQ29JLFVBQVU7TUFBQSxDQUMzQyxDQUFDO01BRUQsSUFBSSxDQUFDUCxhQUFhLENBQUNyRixNQUFNLEVBQUUsT0FBTzZELFlBQVksQ0FBQ3JHLEtBQUssRUFBRTRILFNBQVMsR0FBRyxDQUFDLENBQUM7TUFFcEUsSUFBSVMsWUFBWSxHQUFHLElBQUk7TUFDdkIsSUFBSUMsZ0JBQWdCLEdBQUcsSUFBSTtNQUUzQlQsYUFBYSxDQUFDakMsSUFBSSxDQUFDLFVBQUEyQyxRQUFRLEVBQUk7UUFDM0IsSUFBTUMsT0FBTyxHQUFHRCxRQUFRLENBQUNFLFFBQVEsQ0FBQ0MsSUFBSSxDQUFDLFVBQUFWLENBQUM7VUFBQSxPQUFJQSxDQUFDLENBQUNXLFlBQVksS0FBSzNJLEtBQUssQ0FBQzRJLFdBQVc7UUFBQSxFQUFDO1FBQ2pGLElBQUlKLE9BQU8sRUFBRTtVQUNUSCxZQUFZLEdBQUdHLE9BQU87VUFDdEJGLGdCQUFnQixHQUFHQyxRQUFRO1VBQzNCLE9BQU8sSUFBSTtRQUNmO1FBQ0EsT0FBTyxLQUFLO01BQ2hCLENBQUMsQ0FBQztNQUVGLElBQUksQ0FBQ0YsWUFBWSxJQUFJLENBQUNDLGdCQUFnQixFQUFFLE9BQU9qQyxZQUFZLENBQUNyRyxLQUFLLEVBQUU0SCxTQUFTLEdBQUcsQ0FBQyxDQUFDO01BRWpGLElBQU1FLE1BQU0sR0FBRztRQUNYZSxTQUFTLEVBQUVSLFlBQVksQ0FBQ1MsVUFBVTtRQUNsQ3RDLFdBQVcsRUFBRTZCLFlBQVksQ0FBQ1UsWUFBWTtRQUN0Q0MsUUFBUSxFQUFFVixnQkFBZ0IsQ0FBQ1csU0FBUztRQUNwQ3JCLFNBQVMsRUFBRUEsU0FBUztRQUNwQjFILE9BQU8sRUFBRUYsS0FBSyxDQUFDRTtNQUNuQixDQUFDO01BRURsQixjQUFjLENBQUNnQixLQUFLLENBQUNFLE9BQU8sQ0FBQyxHQUFHNEgsTUFBTTtNQUN0QyxPQUFPQSxNQUFNO0lBQ2pCLENBQUMsQ0FBQztFQUNWO0VBRUEsU0FBUy9CLFVBQVVBLENBQUNtRCxJQUFJLEVBQUU7SUFDdEIsSUFBTUMsQ0FBQyxHQUFHLElBQUluRSxJQUFJLENBQUNrRSxJQUFJLENBQUM7SUFDeEIsVUFBQS9ILE1BQUEsQ0FBVWlJLE1BQU0sQ0FBQ0QsQ0FBQyxDQUFDRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUNDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQUFuSSxNQUFBLENBQUlpSSxNQUFNLENBQUNELENBQUMsQ0FBQ0ksUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQ0QsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7RUFDL0Y7RUFFQSxTQUFTckMsWUFBWUEsQ0FBQ2pILEtBQUssRUFBRTtJQUN6QixJQUFJLENBQUNtRCxNQUFNLENBQUNxRyxrQkFBa0IsRUFBRTtJQUVoQyxJQUFNaEIsT0FBTyxHQUFHO01BQ1paLFNBQVMsRUFBRTVILEtBQUssQ0FBQzRILFNBQVM7TUFDMUJaLE9BQU8sRUFBRWhILEtBQUssQ0FBQ0UsT0FBTztNQUN0QjhJLFFBQVEsRUFBRWhKLEtBQUssQ0FBQ2dKLFFBQVE7TUFDeEJILFNBQVMsRUFBRTdJLEtBQUssQ0FBQzZJO0lBQ3JCLENBQUM7SUFDRDFGLE1BQU0sQ0FBQ3FHLGtCQUFrQixDQUFDLENBQUNoQixPQUFPLENBQUMsQ0FBQztFQUN4QztFQUVBLFNBQVNsQixpQkFBaUJBLENBQUN0SCxLQUFLLEVBQUU7SUFDOUIsSUFBSSxDQUFDbUQsTUFBTSxDQUFDc0csa0JBQWtCLEVBQUUsT0FBTyxLQUFLO0lBRTVDLElBQU1aLFNBQVMsR0FBRzdJLEtBQUssQ0FBQzZJLFNBQVM7SUFDakMsSUFBTWYsTUFBTSxHQUFHM0UsTUFBTSxDQUFDc0csa0JBQWtCLENBQUMsQ0FBQ1osU0FBUyxDQUFDLENBQUM7SUFDckQsT0FBT2YsTUFBTTtFQUNqQjtFQUVBLFNBQVNsSSxlQUFlQSxDQUFBLEVBQUc7SUFDdkIsSUFBSSxDQUFDdUQsTUFBTSxDQUFDdkQsZUFBZSxFQUFFLE9BQU8yRCxPQUFPLENBQUNtRyxPQUFPLENBQUMsRUFBRSxDQUFDO0lBRXZELE9BQU92RyxNQUFNLENBQUN2RCxlQUFlLENBQUMsQ0FBQyxDQUMxQkMsSUFBSSxDQUFDLFVBQUFpSSxNQUFNO01BQUEsT0FBSUEsTUFBTTtJQUFBLEVBQUMsU0FDakIsQ0FBQztNQUFBLE9BQU0sRUFBRTtJQUFBLEVBQUM7RUFDeEI7RUFFQSxTQUFTNkIsSUFBSUEsQ0FBQSxFQUFHO0lBQ1poRixRQUFRLENBQUMsQ0FBQztJQUNWLElBQUl4QixNQUFNLENBQUN5RyxLQUFLLEVBQUU7TUFDZCxJQUFNQyxLQUFLLEdBQUcxRyxNQUFNLENBQUN5RyxLQUFLLENBQUNFLFFBQVEsQ0FBQyxDQUFDO01BQ3JDakwsTUFBTSxHQUFHZ0wsS0FBSyxDQUFDRSxJQUFJLENBQUNDLFlBQVksSUFBSUgsS0FBSyxDQUFDRSxJQUFJLENBQUNFLEVBQUUsSUFBSSxFQUFFO0lBQzNELENBQUMsTUFBTTtNQUNILElBQUlDLENBQUMsR0FBRyxDQUFDO01BQ1QsSUFBTTVFLENBQUMsR0FBRzZFLFdBQVcsQ0FBQyxZQUFNO1FBQ3hCLElBQUlELENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDL0csTUFBTSxDQUFDaUgsU0FBUyxFQUFFO1VBQzlCdkwsTUFBTSxHQUFHc0UsTUFBTSxDQUFDaUgsU0FBUztVQUN6QkMsYUFBYSxDQUFDLENBQUM7VUFDZkMsYUFBYSxDQUFDaEYsQ0FBQyxDQUFDO1FBQ3BCLENBQUMsTUFBTTtVQUNINEUsQ0FBQyxFQUFFO1FBQ1A7TUFDSixDQUFDLEVBQUUsR0FBRyxDQUFDO0lBQ1g7SUFFQUcsYUFBYSxDQUFDLENBQUM7RUFDbkI7RUFFQSxTQUFTQSxhQUFhQSxDQUFBLEVBQUc7SUFDckIsSUFBSXhMLE1BQU0sRUFBRTtNQUNSZixVQUFVLENBQUNpQyxPQUFPLENBQUMsVUFBQXdLLEVBQUU7UUFBQSxPQUFJQSxFQUFFLENBQUNwTCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxNQUFNLENBQUM7TUFBQSxFQUFDO01BQ2xEZixVQUFVLENBQUNjLFNBQVMsQ0FBQ29JLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDdkMsQ0FBQyxNQUFNO01BQ0g7TUFDQXpKLFVBQVUsQ0FBQ2lDLE9BQU8sQ0FBQyxVQUFBd0ssRUFBRTtRQUFBLE9BQUlBLEVBQUUsQ0FBQ3BMLFNBQVMsQ0FBQ29JLE1BQU0sQ0FBQyxNQUFNLENBQUM7TUFBQSxFQUFDO0lBQ3pEO0VBQ0o7RUFFQSxTQUFTckMsVUFBVUEsQ0FBQSxFQUFHO0lBQ2xCLElBQUlzRixVQUFVLEdBQUcsS0FBSztJQUN0QixJQUFJQyxNQUFNO0lBQ1YsSUFBSUMsVUFBVTtJQUVkLElBQU1DLGtCQUFrQixHQUFHNU0sUUFBUSxDQUFDNEQsY0FBYyxDQUFDLG9CQUFvQixDQUFDO0lBQ3hFLElBQU1pSixTQUFTLEdBQUc3TSxRQUFRLENBQUNDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDO0lBQ2pFLElBQU02TSxHQUFHLEdBQUc5TSxRQUFRLENBQUNHLGFBQWEsQ0FBQyxlQUFlLENBQUM7SUFFbkQsSUFBTTRNLE1BQU0sR0FBRztNQUNYLENBQUMsRUFBRSxRQUFRO01BQ1gsQ0FBQyxFQUFFLFFBQVE7TUFDWCxDQUFDLEVBQUUsUUFBUTtNQUNYLENBQUMsRUFBRSxPQUFPO01BQ1YsQ0FBQyxFQUFFLE9BQU87TUFDVixXQUFTO0lBQ2IsQ0FBQztJQUVERCxHQUFHLENBQUN2TCxLQUFLLENBQUN5TCxRQUFRLEdBQUdELE1BQU0sQ0FBQ0YsU0FBUyxDQUFDcEksTUFBTSxDQUFDLElBQUlzSSxNQUFNLFdBQVE7SUFFL0RILGtCQUFrQixDQUFDdEwsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFVBQUF3QixDQUFDLEVBQUk7TUFDbEQySixVQUFVLEdBQUcsSUFBSTtNQUNqQkMsTUFBTSxHQUFHNUosQ0FBQyxDQUFDbUssS0FBSyxHQUFHTCxrQkFBa0IsQ0FBQ00sVUFBVTtNQUNoRFAsVUFBVSxHQUFHQyxrQkFBa0IsQ0FBQ0QsVUFBVTtJQUM5QyxDQUFDLENBQUM7SUFFRkMsa0JBQWtCLENBQUN0TCxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUU7TUFBQSxPQUFNbUwsVUFBVSxHQUFHLEtBQUs7SUFBQSxFQUFDO0lBQzNFRyxrQkFBa0IsQ0FBQ3RMLGdCQUFnQixDQUFDLFNBQVMsRUFBRTtNQUFBLE9BQU1tTCxVQUFVLEdBQUcsS0FBSztJQUFBLEVBQUM7SUFDeEVHLGtCQUFrQixDQUFDdEwsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFVBQUF3QixDQUFDLEVBQUk7TUFDbEQsSUFBSSxDQUFDMkosVUFBVSxFQUFFO01BQ2pCM0osQ0FBQyxDQUFDcUssY0FBYyxDQUFDLENBQUM7TUFDbEIsSUFBTUMsQ0FBQyxHQUFHdEssQ0FBQyxDQUFDbUssS0FBSyxHQUFHTCxrQkFBa0IsQ0FBQ00sVUFBVTtNQUNqRCxJQUFNRyxJQUFJLEdBQUcsQ0FBQ0QsQ0FBQyxHQUFHVixNQUFNLElBQUksQ0FBQztNQUM3QkUsa0JBQWtCLENBQUNELFVBQVUsR0FBR0EsVUFBVSxHQUFHVSxJQUFJO0lBQ3JELENBQUMsQ0FBQztFQUNOO0VBRUFyTixRQUFRLENBQUNzQixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQXdCLENBQUMsRUFBSTtJQUNwQyxJQUFNZ0csTUFBTSxHQUFHaEcsQ0FBQyxDQUFDZ0csTUFBTSxDQUFDd0UsT0FBTyxDQUFDLGdCQUFnQixDQUFDO0lBQ2pELElBQUl4RSxNQUFNLElBQUksQ0FBQ2hJLE1BQU0sRUFBRTtNQUNuQnNFLE1BQU0sQ0FBQ0MsUUFBUSxDQUFDQyxJQUFJLEdBQUcsUUFBUTtJQUNuQztJQUNBO0lBQ0E7SUFDQTtJQUNBO0VBQ0osQ0FBQyxDQUFDO0VBR0YsSUFBSWhCLFFBQVEsR0FBR3RFLFFBQVEsQ0FBQ0csYUFBYSxDQUFDLGVBQWUsQ0FBQztFQUN0RHNCLFVBQVUsQ0FBQztJQUFBLE9BQU02QyxRQUFRLENBQUNsRCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxVQUFVLENBQUM7RUFBQSxHQUFFLElBQUksQ0FBQztFQUUxRDZCLGdCQUFnQixDQUFDLENBQUMsQ0FBQ3BCLElBQUksQ0FBQzhKLElBQUksQ0FBQzs7RUFHN0I7RUFDQSxJQUFNMkIsTUFBTSxHQUFHdk4sUUFBUSxDQUFDRyxhQUFhLENBQUMsVUFBVSxDQUFDO0VBRWpEb04sTUFBTSxDQUFDak0sZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQU07SUFDbkMsSUFBSVgsY0FBYyxDQUFDQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7TUFDbENELGNBQWMsQ0FBQzZNLFVBQVUsQ0FBQyxRQUFRLENBQUM7SUFDdkMsQ0FBQyxNQUFNO01BQ0g3TSxjQUFjLENBQUNpQixPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQztJQUMxQztJQUNBd0QsTUFBTSxDQUFDQyxRQUFRLENBQUNvSSxNQUFNLENBQUMsQ0FBQztFQUM1QixDQUFDLENBQUM7RUFFRixDQUFBNU4scUJBQUEsR0FBQUcsUUFBUSxDQUFDRyxhQUFhLENBQUMsV0FBVyxDQUFDLGNBQUFOLHFCQUFBLGVBQW5DQSxxQkFBQSxDQUFxQ3lCLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFNO0lBQUEsSUFBQW9NLHNCQUFBO0lBQzdELENBQUFBLHNCQUFBLEdBQUExTixRQUFRLENBQUNHLGFBQWEsQ0FBQyxZQUFZLENBQUMsY0FBQXVOLHNCQUFBLGVBQXBDQSxzQkFBQSxDQUFzQ3RNLFNBQVMsQ0FBQ08sTUFBTSxDQUFDLE1BQU0sQ0FBQztFQUNsRSxDQUFDLENBQUM7RUFFTixJQUFNZ00sT0FBTyxHQUFHM04sUUFBUSxDQUFDRyxhQUFhLENBQUMsV0FBVyxDQUFDO0VBQ25ELElBQU15TixNQUFNLEdBQUc1TixRQUFRLENBQUNHLGFBQWEsQ0FBQyxVQUFVLENBQUM7RUFFakR3TixPQUFPLENBQUNyTSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBSztJQUNuQyxJQUFHUixNQUFNLEVBQUM7TUFDTkgsY0FBYyxDQUFDNk0sVUFBVSxDQUFDLFFBQVEsQ0FBQztJQUN2QyxDQUFDLE1BQUk7TUFDRDdNLGNBQWMsQ0FBQ2lCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDO0lBQ2pEO0lBQ0F3RCxNQUFNLENBQUNDLFFBQVEsQ0FBQ29JLE1BQU0sQ0FBQyxDQUFDO0VBQzVCLENBQUMsQ0FBQztFQUVGRyxNQUFNLENBQUN0TSxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBSztJQUNsQ3RCLFFBQVEsQ0FBQ0csYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDaUIsU0FBUyxDQUFDTyxNQUFNLENBQUMsTUFBTSxDQUFDO0VBQ3BFLENBQUMsQ0FBQztFQUVGLElBQU0wRixTQUFTLEdBQUdySCxRQUFRLENBQUM0RCxjQUFjLENBQUMsb0JBQW9CLENBQUM7RUFFL0R5RCxTQUFTLENBQUMvRixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQ3dCLENBQUMsRUFBSztJQUN2QyxJQUFNK0ssS0FBSyxHQUFHL0ssQ0FBQyxDQUFDZ0csTUFBTSxDQUFDd0UsT0FBTyxDQUFDLHNCQUFzQixDQUFDO0lBQ3RELElBQUlPLEtBQUssRUFBRTtNQUNQLElBQU1DLEtBQUksR0FBR0QsS0FBSyxDQUFDUCxPQUFPLENBQUMsZ0JBQWdCLENBQUM7TUFDNUMsSUFBSVEsS0FBSSxJQUFJQSxLQUFJLENBQUMxTSxTQUFTLENBQUMySCxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUrRSxLQUFJLENBQUMxTSxTQUFTLENBQUNvSSxNQUFNLENBQUMsT0FBTyxDQUFDO01BQzVFMUcsQ0FBQyxDQUFDNkYsZUFBZSxDQUFDLENBQUM7TUFDbkI7SUFDSjtJQUVBLElBQU1tRixJQUFJLEdBQUdoTCxDQUFDLENBQUNnRyxNQUFNLENBQUN3RSxPQUFPLENBQUMsZ0JBQWdCLENBQUM7SUFDL0MsSUFBSVEsSUFBSSxJQUFJLENBQUNBLElBQUksQ0FBQzFNLFNBQVMsQ0FBQzJILFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRStFLElBQUksQ0FBQzFNLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLE9BQU8sQ0FBQztFQUM5RSxDQUFDLENBQUM7QUFHTixDQUFDLEVBQUUsQ0FBQztBQzdmSiIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBhcGlVUkwgPSAnaHR0cHM6Ly9mYXYtcHJvbS5jb20vYXBpX2ZvcmVjYXN0X3Bvc3Rlcl9hbGx3aW4nO1xuXG4gICAgY29uc3RcbiAgICAgICAgdW5hdXRoTXNncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hdXRoQnRuJyksXG4gICAgICAgIGNvdW50ZXJTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50ZXInKSxcbiAgICAgICAgZXZlbnRzU3BhbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ldmVudHMnKSxcbiAgICAgICAgd2VsY29tZUJldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWxjb21lX19iZXQnKSxcbiAgICAgICAgc3dpdGNoV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2VsY29tZV9fc3dpdGNoXCIpLFxuICAgICAgICBzd2l0Y2hCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndlbGNvbWVfX3N3aXRjaC1idG5cIik7XG5cbiAgICBjb25zdCB1a0xlbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdWtMZW5nJyk7XG4gICAgY29uc3QgZW5MZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2VuTGVuZycpO1xuXG4gICAgLy8gbGV0IGxvY2FsZSA9ICd1ayc7XG4gICAgbGV0IGxvY2FsZSA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJsb2NhbGVcIikgfHwgXCJ1a1wiXG4gICAgaWYgKHVrTGVuZykgbG9jYWxlID0gJ3VrJztcbiAgICBpZiAoZW5MZW5nKSBsb2NhbGUgPSAnZW4nO1xuXG4gICAgbGV0IGkxOG5EYXRhID0ge307XG4gICAgLy8gbGV0IHVzZXJJZDtcbiAgICAvLyB1c2VySWQgPSAxMDAzMDAyNjg7XG4gICAgbGV0IHVzZXJJZCA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ1c2VySWRcIikgPz8gbnVsbFxuICAgIGxldCBlbGVtZW50c0J5TWF0Y2hpRCA9IHt9O1xuICAgIGxldCBhbGxNYXRjaGVzID0gW107XG4gICAgbGV0IGZhdkRhdGFCeU1hdGNoID0ge307XG5cbiAgICBjb25zdCBzYXZlZFN3aXRjaGVyU3RhdGUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInN3aXRjaGVyQWN0aXZlXCIpO1xuICAgIGlmIChzYXZlZFN3aXRjaGVyU3RhdGUgPT09IFwiMVwiKSB7XG4gICAgICAgIHN3aXRjaEJ0bi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgIH1cblxuICAgIHN3aXRjaEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBzd2l0Y2hCdG4uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwibm9uZVwiO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaEJ0bi5zdHlsZS5wb2ludGVyRXZlbnRzID0gXCJcIjtcbiAgICAgICAgfSwgMjAwMCk7XG5cbiAgICAgICAgY29uc3QgaXNBY3RpdmUgPSBzd2l0Y2hCdG4uY2xhc3NMaXN0LnRvZ2dsZShcImFjdGl2ZVwiKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzd2l0Y2hlckFjdGl2ZVwiLCBpc0FjdGl2ZSA/IFwiMVwiIDogXCIwXCIpO1xuXG4gICAgICAgIGlmICghdXNlcklkKSByZXR1cm47XG5cbiAgICAgICAgZ2V0QmV0c2xpcEl0ZW1zKCkudGhlbihiZXRzbGlwTWF0Y2hlcyA9PiB7XG4gICAgICAgICAgICBpZiAoaXNBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICBhbGxNYXRjaGVzLmZvckVhY2goKG1hdGNoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoRGl2ID0gZWxlbWVudHNCeU1hdGNoaURbbWF0Y2gubWF0Y2hJZF07XG4gICAgICAgICAgICAgICAgICAgIGFkZE1hdGNoVG9CZXRzbGlwKG1hdGNoLCBtYXRjaERpdiwgYmV0c2xpcE1hdGNoZXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIGFsbE1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hEaXYgPSBlbGVtZW50c0J5TWF0Y2hpRFttYXRjaC5tYXRjaElkXTtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTWF0Y2hGcm9tQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgYmV0c2xpcCBpdGVtczonLCBlcnIpKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGxvYWRUcmFuc2xhdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChgJHthcGlVUkx9L25ldy10cmFuc2xhdGVzLyR7bG9jYWxlfWApLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihqc29uID0+IHtcbiAgICAgICAgICAgICAgICBpMThuRGF0YSA9IGpzb247XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JlY2FzdFBvc3RlcicpLCB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10cmFuc2xhdGVdJyk7XG4gICAgICAgIGVsZW1zLmZvckVhY2goZWxlbSA9PiB7XG4gICAgICAgICAgICBjb25zdCBrZXkgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGUnKTtcbiAgICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gdHJhbnNsYXRlS2V5KGtleSk7XG4gICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGUnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChsb2NhbGUgPT09ICdlbicpIHtcbiAgICAgICAgICAgIG1haW5QYWdlLmNsYXNzTGlzdC5hZGQoJ2VuJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cmFuc2xhdGVLZXkoa2V5LCBkZWZhdWx0VmFsdWUgPSBrZXkpIHtcbiAgICAgICAgcmV0dXJuIGkxOG5EYXRhW2tleV0gfHwgZGVmYXVsdFZhbHVlO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcXVlc3QgPSAobGluaywgZXh0cmFPcHRpb25zKSA9PlxuICAgICAgICBmZXRjaChhcGlVUkwgKyBsaW5rLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLi4uKGV4dHJhT3B0aW9ucyB8fCB7fSlcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcignQVBJIGVycm9yJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5qc29uKCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignQVBJIHJlcXVlc3QgZmFpbGVkOicsIGVycik7XG5cbiAgICAgICAgICAgICAgICByZXBvcnRFcnJvcihlcnIpO1xuXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFsbHdpbl9fcGFnZScpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLnN0YXJ0c1dpdGgoXCJodHRwczovL3d3dy5hbGx3aW4uaHIvXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9wcm9tb2NpamUvcHJvbW9jaWphL3N0dWIvJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvcHJvbW9zL3Byb21vL3N0dWIvJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gcmVwb3J0RXJyb3IoZXJyKSB7XG4gICAgICAgIGNvbnN0IHJlcG9ydERhdGEgPSB7XG4gICAgICAgICAgICBvcmlnaW46IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgICAgICAgdXNlcmlkOiB1c2VySWQsXG4gICAgICAgICAgICBlcnJvclRleHQ6IGVycj8uZXJyb3IgfHwgZXJyPy50ZXh0IHx8IGVycj8ubWVzc2FnZSB8fCAnVW5rbm93biBlcnJvcicsXG4gICAgICAgICAgICB0eXBlOiBlcnI/Lm5hbWUgfHwgJ1Vua25vd25FcnJvcicsXG4gICAgICAgICAgICBzdGFjazogZXJyPy5zdGFjayB8fCAnJ1xuICAgICAgICB9O1xuXG4gICAgICAgIGZldGNoKCdodHRwczovL2Zhdi1wcm9tLmNvbS9hcGktY21zL3JlcG9ydHMvYWRkJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHJlcG9ydERhdGEpXG4gICAgICAgIH0pLmNhdGNoKGNvbnNvbGUud2Fybik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdEFkZEFsbEJ0bigpIHtcbiAgICAgICAgY29uc3QgYWRkQWxsQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByZWRpY3RCdG4nKTtcbiAgICAgICAgYWRkQWxsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF1c2VySWQpIHJldHVybjtcblxuICAgICAgICAgICAgZ2V0QmV0c2xpcEl0ZW1zKCkudGhlbihiZXRzbGlwTWF0Y2hlcyA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBtYXRjaCBvZiBhbGxNYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoRGl2ID0gZWxlbWVudHNCeU1hdGNoaURbbWF0Y2gubWF0Y2hJZF07XG4gICAgICAgICAgICAgICAgICAgIGFkZE1hdGNoVG9CZXRzbGlwKG1hdGNoLCBtYXRjaERpdiwgYmV0c2xpcE1hdGNoZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKCdFcnJvciBnZXR0aW5nIGJldHNsaXAgaXRlbXM6JywgZXJyKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IEluaXRQYWdlID0gKCkgPT4ge1xuICAgICAgICB0cmFuc2xhdGUoKTtcbiAgICAgICAgaW5pdEFkZEFsbEJ0bigpO1xuICAgICAgICByZXF1ZXN0KCcvbWF0Y2hlcycpLnRoZW4obWF0Y2hlcyA9PiB7XG4gICAgICAgICAgICBhbGxNYXRjaGVzID0gKG1hdGNoZXMgfHwgW10pLnNvcnQoKGEsIGIpID0+IG5ldyBEYXRlKGEubWF0Y2hEYXRlKSAtIG5ldyBEYXRlKGIubWF0Y2hEYXRlKSk7XG5cbiAgICAgICAgICAgIGdldEJldHNsaXBJdGVtcygpLnRoZW4oYmV0c2xpcE1hdGNoZXMgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGluaXRNYXRjaGVzKGFsbE1hdGNoZXMsIGJldHNsaXBNYXRjaGVzKTtcbiAgICAgICAgICAgICAgICBpbml0U2xpZGVyKCk7XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcignRXJyb3IgZ2V0dGluZyBiZXRzbGlwIGl0ZW1zOicsIGVycikpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0TWF0Y2hlcyhtYXRjaGVzLCBiZXRzbGlwTWF0Y2hlcykge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VsY29tZV9fcm93Jyk7XG4gICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAgICAgICBsZXQgYWRkZWQgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdGNoZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvd1dyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHJvd1dyYXAuY2xhc3NOYW1lID0gJ3dlbGNvbWVfX3Jvdy13cmFwJztcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IGk7IGogPCBpICsgMiAmJiBqIDwgbWF0Y2hlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gbWF0Y2hlc1tqXTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIG1hdGNoRGl2LmNsYXNzTmFtZSA9ICd3ZWxjb21lX19pdGVtJztcbiAgICAgICAgICAgICAgICBtYXRjaC5tYXRjaElkID0gKCttYXRjaC5tYXRjaElkKTtcbiAgICAgICAgICAgICAgICBpZiAoYmV0c2xpcE1hdGNoZXMuc29tZShiID0+IGIuZXZlbnRfaWQgPT0gbWF0Y2gubWF0Y2hJZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkZWQrKztcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hEaXYuY2xhc3NMaXN0LmFkZCgnX2RvbmUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhtYXRjaClcblxuICAgICAgICAgICAgICAgIG1hdGNoRGl2LmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1jbG9zZVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS10aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+JHt0cmFuc2xhdGVLZXkobWF0Y2gudGl0bGUpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLWRhdGVcIj4ke2Zvcm1hdERhdGUobWF0Y2gubWF0Y2hEYXRlKX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1tYXgtdGl0bGVcIj4ke3RyYW5zbGF0ZUtleShtYXRjaC50ZWFtMSl9IOKAkyAke3RyYW5zbGF0ZUtleShtYXRjaC50ZWFtMil9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0taW5mb1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1iaWRcIj4ke3RyYW5zbGF0ZUtleShtYXRjaC5vdXRjb21lVHJhbnNsYXRpb24pfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1jb2ZcIj4ke21hdGNoLmRlZmF1bHRDb2VmIHx8IDB9PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgYDtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnRzQnlNYXRjaGlEW21hdGNoLm1hdGNoSWRdID0gbWF0Y2hEaXY7XG4gICAgICAgICAgICAgICAgcm93V3JhcC5hcHBlbmRDaGlsZChtYXRjaERpdik7XG5cbiAgICAgICAgICAgICAgICBnZXRNYXRjaERhdGEobWF0Y2gpLnRoZW4obSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2ZEaXYgPSBtYXRjaERpdi5xdWVyeVNlbGVjdG9yKCcud2VsY29tZV9faXRlbS1jb2YnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZkRpdi5pbm5lckhUTUwgPSBtLm91dGNvbWVDb2VmO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBtYXRjaERpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBhZGRNYXRjaFRvQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYsIGJldHNsaXBNYXRjaGVzLCBlKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xvc2VCdG4gPSBtYXRjaERpdi5xdWVyeVNlbGVjdG9yKCcud2VsY29tZV9faXRlbS1jbG9zZScpO1xuICAgICAgICAgICAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTWF0Y2hGcm9tQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHJvd1dyYXApO1xuICAgICAgICB9XG4gICAgICAgIHNldENvdW50ZXIoYWRkZWQpO1xuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgIH1cblxuICAgIGxldCBoYXNTZW50Q2xpY2tFdmVudCA9IGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gYWRkTWF0Y2hUb0JldHNsaXAobWF0Y2gsIG1hdGNoRGl2LCBiZXRzbGlwTWF0Y2hlcywgZSkge1xuICAgICAgICBpZiAoIXVzZXJJZCB8fCBiZXRzbGlwTWF0Y2hlcy5zb21lKGIgPT4gYi5ldmVudF9pZCA9PT0gbWF0Y2gubWF0Y2hJZCB8fCAoZSAmJiBlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3dlbGNvbWVfX2l0ZW0tY2xvc2UnKSkpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmYXZEYXRhID0gZmF2RGF0YUJ5TWF0Y2hbbWF0Y2gubWF0Y2hJZF07XG4gICAgICAgIGlmICghZmF2RGF0YSB8fCAhZmF2RGF0YS5tYXRjaElkKSByZXR1cm47XG5cbiAgICAgICAgaWYgKCFoYXNTZW50Q2xpY2tFdmVudCkge1xuICAgICAgICAgICAgaGFzU2VudENsaWNrRXZlbnQgPSB0cnVlO1xuXG4gICAgICAgICAgICByZXF1ZXN0KCcvZXZlbnRzJywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdXNlcmlkOiB1c2VySWQsIGV2ZW50SWQ6IG1hdGNoLm1hdGNoSWQgfSlcbiAgICAgICAgICAgIH0pLmNhdGNoKGNvbnNvbGUuZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRkVG9CZXRzbGlwKGZhdkRhdGEpO1xuICAgICAgICBtYXRjaERpdi5jbGFzc0xpc3QuYWRkKCdfZG9uZScpO1xuICAgICAgICB1cGRhdGVDb3VudGVyKDEpO1xuXG4gICAgICAgIGNvbnN0IGFjdGl2ZUNvdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlbGNvbWVfX2l0ZW0uX2RvbmUnKS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHRvdGFsQ291bnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VsY29tZV9faXRlbScpLmxlbmd0aDtcblxuICAgICAgICBpZiAoYWN0aXZlQ291bnQgPT09IHRvdGFsQ291bnQgJiYgIXN3aXRjaEJ0bi5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIikpIHtcbiAgICAgICAgICAgIHN3aXRjaEJ0bi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzd2l0Y2hlckFjdGl2ZVwiLCBcIjFcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVNYXRjaEZyb21CZXRzbGlwKG1hdGNoLCBtYXRjaERpdikge1xuICAgICAgICBpZiAoIXVzZXJJZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGZhdkRhdGEgPSBmYXZEYXRhQnlNYXRjaFttYXRjaC5tYXRjaElkXTtcbiAgICAgICAgaWYgKCFmYXZEYXRhIHx8ICFmYXZEYXRhLm1hdGNoSWQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBpc1JlbW92ZWQgPSByZW1vdmVGcm9tQmV0c2xpcChmYXZEYXRhKTtcbiAgICAgICAgaWYgKGlzUmVtb3ZlZCkge1xuICAgICAgICAgICAgbWF0Y2hEaXYuY2xhc3NMaXN0LnJlbW92ZSgnX2RvbmUnKTtcbiAgICAgICAgICAgIHVwZGF0ZUNvdW50ZXIoLTEpO1xuXG4gICAgICAgICAgICBpZiAoc3dpdGNoQnRuLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZVwiKSkge1xuICAgICAgICAgICAgICAgIHN3aXRjaEJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic3dpdGNoZXJBY3RpdmVcIiwgXCIwXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlQ291bnRlcihkaWZmKSB7XG4gICAgICAgIGNvbnN0IGN1cnJDb3VudGVyID0gK2NvdW50ZXJTcGFuLmlubmVySFRNTDtcbiAgICAgICAgc2V0Q291bnRlcihjdXJyQ291bnRlciArIGRpZmYpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldENvdW50ZXIodmFsdWUpIHtcbiAgICAgICAgY291bnRlclNwYW4uaW5uZXJIVE1MID0gdmFsdWU7XG5cbiAgICAgICAgY29uc3QgbGFzdERpZ2l0ID0gdmFsdWUgJSAxMDtcbiAgICAgICAgbGV0IHRyYW5zbGF0aW9uS2V5ID0gKGxhc3REaWdpdCA9PT0gMSkgPyAnZXZlbnQxJyA6IChsYXN0RGlnaXQgPj0gMiAmJiBsYXN0RGlnaXQgPD0gNCkgPyAnZXZlbnQyJyA6ICdldmVudDMnO1xuXG5cbiAgICAgICAgZXZlbnRzU3Bhbi5pbm5lckhUTUwgPSBgJHt0cmFuc2xhdGVLZXkodHJhbnNsYXRpb25LZXkpfWA7XG4gICAgICAgIHdlbGNvbWVCZXQuY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZScsIHZhbHVlIDw9IDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE1hdGNoRGF0YShtYXRjaCwgc2VydmljZUlkID0gMCkge1xuICAgICAgICBpZiAoc2VydmljZUlkID4gMSkgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiBmZXRjaCgnaHR0cHM6Ly93d3cuYWxsd2luLnVhL3NlcnZpY2UvbGluZW91dC9mcm9udGVuZF9hcGkyLycsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIFwianNvbnJwY1wiOiBcIjIuMFwiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogMTYsXG4gICAgICAgICAgICAgICAgXCJtZXRob2RcIjogXCJmcm9udGVuZC9tYXJrZXQvZ2V0XCIsXG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImJ5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGFuZ1wiOiAndWsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXJ2aWNlX2lkXCI6IHNlcnZpY2VJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZXZlbnRfaWRcIjogbWF0Y2gubWF0Y2hJZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oZmF2RGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29lZkRhdGFBcnJheSA9IGZhdkRhdGEucmVzdWx0LmZpbHRlcihvID0+XG4gICAgICAgICAgICAgICAgICAgIG8ubWFya2V0X25hbWUgPT09IG1hdGNoLm1hcmtldE5hbWUgJiZcbiAgICAgICAgICAgICAgICAgICAgby5yZXN1bHRfdHlwZV9uYW1lID09PSBtYXRjaC5tYXJrZXRUeXBlXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmICghY29lZkRhdGFBcnJheS5sZW5ndGgpIHJldHVybiBnZXRNYXRjaERhdGEobWF0Y2gsIHNlcnZpY2VJZCArIDEpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGZvdW5kT3V0Y29tZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkQ29lZkRhdGEgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgY29lZkRhdGFBcnJheS5zb21lKGNvZWZEYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0Y29tZSA9IGNvZWZEYXRhLm91dGNvbWVzLmZpbmQobyA9PiBvLm91dGNvbWVfbmFtZSA9PT0gbWF0Y2gub3V0Y29tZU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3V0Y29tZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRPdXRjb21lID0gb3V0Y29tZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29lZkRhdGEgPSBjb2VmRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICghZm91bmRPdXRjb21lIHx8ICFzZWxlY3RlZENvZWZEYXRhKSByZXR1cm4gZ2V0TWF0Y2hEYXRhKG1hdGNoLCBzZXJ2aWNlSWQgKyAxKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0Y29tZUlkOiBmb3VuZE91dGNvbWUub3V0Y29tZV9pZCxcbiAgICAgICAgICAgICAgICAgICAgb3V0Y29tZUNvZWY6IGZvdW5kT3V0Y29tZS5vdXRjb21lX2NvZWYsXG4gICAgICAgICAgICAgICAgICAgIG1hcmtldElkOiBzZWxlY3RlZENvZWZEYXRhLm1hcmtldF9pZCxcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZUlkOiBzZXJ2aWNlSWQsXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoSWQ6IG1hdGNoLm1hdGNoSWQsXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGZhdkRhdGFCeU1hdGNoW21hdGNoLm1hdGNoSWRdID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXREYXRlKGRhdGUpIHtcbiAgICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICByZXR1cm4gYCR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCAnMCcpfS4ke1N0cmluZyhkLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpfWA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkVG9CZXRzbGlwKG1hdGNoKSB7XG4gICAgICAgIGlmICghd2luZG93LmFkZEJldHNsaXBPdXRjb21lcykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IG91dGNvbWUgPSB7XG4gICAgICAgICAgICBzZXJ2aWNlSWQ6IG1hdGNoLnNlcnZpY2VJZCxcbiAgICAgICAgICAgIGV2ZW50SWQ6IG1hdGNoLm1hdGNoSWQsXG4gICAgICAgICAgICBtYXJrZXRJZDogbWF0Y2gubWFya2V0SWQsXG4gICAgICAgICAgICBvdXRjb21lSWQ6IG1hdGNoLm91dGNvbWVJZFxuICAgICAgICB9O1xuICAgICAgICB3aW5kb3cuYWRkQmV0c2xpcE91dGNvbWVzKFtvdXRjb21lXSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRnJvbUJldHNsaXAobWF0Y2gpIHtcbiAgICAgICAgaWYgKCF3aW5kb3cucmVtb3ZlQmV0c2xpcEl0ZW1zKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3Qgb3V0Y29tZUlkID0gbWF0Y2gub3V0Y29tZUlkO1xuICAgICAgICBjb25zdCByZXN1bHQgPSB3aW5kb3cucmVtb3ZlQmV0c2xpcEl0ZW1zKFtvdXRjb21lSWRdKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCZXRzbGlwSXRlbXMoKSB7XG4gICAgICAgIGlmICghd2luZG93LmdldEJldHNsaXBJdGVtcykgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG5cbiAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRCZXRzbGlwSXRlbXMoKVxuICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiBbXSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgSW5pdFBhZ2UoKTtcbiAgICAgICAgaWYgKHdpbmRvdy5zdG9yZSkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSB3aW5kb3cuc3RvcmUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICAgIHVzZXJJZCA9IHN0YXRlLmF1dGguaXNBdXRob3JpemVkICYmIHN0YXRlLmF1dGguaWQgfHwgJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgYyA9IDA7XG4gICAgICAgICAgICBjb25zdCBpID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjIDwgNTAgJiYgISF3aW5kb3cuZ191c2VyX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IHdpbmRvdy5nX3VzZXJfaWQ7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrVXNlckF1dGgoKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrVXNlckF1dGgoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja1VzZXJBdXRoKCkge1xuICAgICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgICAgICB1bmF1dGhNc2dzLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LmFkZCgnaGlkZScpKTtcbiAgICAgICAgICAgIHN3aXRjaFdyYXAuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBzd2l0Y2hXcmFwLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuICAgICAgICAgICAgdW5hdXRoTXNncy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0U2xpZGVyKCkge1xuICAgICAgICBsZXQgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICBsZXQgc3RhcnRYO1xuICAgICAgICBsZXQgc2Nyb2xsTGVmdDtcblxuICAgICAgICBjb25zdCBkcmFnZ2FibGVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJhZ2dhYmxlQ29udGFpbmVyJyk7XG4gICAgICAgIGNvbnN0IGl0ZW1zV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWxjb21lX19yb3ctd3JhcCcpO1xuICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VsY29tZV9fcm93Jyk7XG5cbiAgICAgICAgY29uc3Qgd2lkdGhzID0ge1xuICAgICAgICAgICAgNTogJzIwOThweCcsXG4gICAgICAgICAgICA0OiAnMTY2OHB4JyxcbiAgICAgICAgICAgIDM6ICcxMjU4cHgnLFxuICAgICAgICAgICAgMjogJzgyOHB4JyxcbiAgICAgICAgICAgIDE6ICc0MThweCcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnMjA5OHB4J1xuICAgICAgICB9O1xuXG4gICAgICAgIHJvdy5zdHlsZS5tYXhXaWR0aCA9IHdpZHRoc1tpdGVtc1dyYXAubGVuZ3RoXSB8fCB3aWR0aHMuZGVmYXVsdDtcblxuICAgICAgICBkcmFnZ2FibGVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG4gICAgICAgICAgICBpc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHN0YXJ0WCA9IGUucGFnZVggLSBkcmFnZ2FibGVDb250YWluZXIub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIHNjcm9sbExlZnQgPSBkcmFnZ2FibGVDb250YWluZXIuc2Nyb2xsTGVmdDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZHJhZ2dhYmxlQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiBpc0RyYWdnaW5nID0gZmFsc2UpO1xuICAgICAgICBkcmFnZ2FibGVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IGlzRHJhZ2dpbmcgPSBmYWxzZSk7XG4gICAgICAgIGRyYWdnYWJsZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBlID0+IHtcbiAgICAgICAgICAgIGlmICghaXNEcmFnZ2luZykgcmV0dXJuO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgeCA9IGUucGFnZVggLSBkcmFnZ2FibGVDb250YWluZXIub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIGNvbnN0IHdhbGsgPSAoeCAtIHN0YXJ0WCkgKiAyO1xuICAgICAgICAgICAgZHJhZ2dhYmxlQ29udGFpbmVyLnNjcm9sbExlZnQgPSBzY3JvbGxMZWZ0IC0gd2FsaztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQuY2xvc2VzdCgnLndlbGNvbWVfX2l0ZW0nKTtcbiAgICAgICAgaWYgKHRhcmdldCAmJiAhdXNlcklkKSB7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvbG9naW4nO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmKHRhcmdldCl7XG4gICAgICAgIC8vICAgICB0YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZSgnX2RvbmUnKTtcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhlLnRhcmdldC5jbG9zZXN0KCcud2VsY29tZV9fY2xvc2UtJykpO1xuICAgIH0pO1xuXG5cbiAgICBsZXQgbWFpblBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWxsd2luX19wYWdlJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBtYWluUGFnZS5jbGFzc0xpc3QuYWRkKCdvdmVyZmxvdycpLCAxMDAwKTtcblxuICAgIGxvYWRUcmFuc2xhdGlvbnMoKS50aGVuKGluaXQpO1xuXG5cbiAgICAvL2ZvciB0ZXN0XG4gICAgY29uc3QgbG5nQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sbmctYnRuXCIpXG5cbiAgICBsbmdCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJsb2NhbGVcIikpIHtcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oXCJsb2NhbGVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFwibG9jYWxlXCIsIFwiZW5cIik7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZW51LWJ0blwiKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVudS10ZXN0XCIpPy5jbGFzc0xpc3QudG9nZ2xlKFwiaGlkZVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICBjb25zdCBhdXRoQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hdXRoLWJ0blwiKVxuICAgIGNvbnN0IGJldEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmV0LWJ0blwiKVxuXG4gICAgYXV0aEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT57XG4gICAgICAgIGlmKHVzZXJJZCl7XG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFwidXNlcklkXCIpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShcInVzZXJJZFwiLCBcIjEwMDMwMDI2OFwiKVxuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgIH0pO1xuXG4gICAgYmV0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PntcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53ZWxjb21lX19iZXRcIikuY2xhc3NMaXN0LnRvZ2dsZShcImhpZGVcIik7XG4gICAgfSlcblxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcmFnZ2FibGVDb250YWluZXInKTtcblxuICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGNsb3NlID0gZS50YXJnZXQuY2xvc2VzdCgnLndlbGNvbWVfX2l0ZW0tY2xvc2UnKTtcbiAgICAgICAgaWYgKGNsb3NlKSB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gY2xvc2UuY2xvc2VzdCgnLndlbGNvbWVfX2l0ZW0nKTtcbiAgICAgICAgICAgIGlmIChpdGVtICYmIGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdfZG9uZScpKSBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ19kb25lJyk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXRlbSA9IGUudGFyZ2V0LmNsb3Nlc3QoJy53ZWxjb21lX19pdGVtJyk7XG4gICAgICAgIGlmIChpdGVtICYmICFpdGVtLmNsYXNzTGlzdC5jb250YWlucygnX2RvbmUnKSkgaXRlbS5jbGFzc0xpc3QuYWRkKCdfZG9uZScpO1xuICAgIH0pO1xuXG5cbn0pKCk7XG4iLCIiXX0=
