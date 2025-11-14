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
(function (_document$querySelect) {
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
  var userId;
  // userId = 100300268;
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
        initMatches(allMatches, betslipMatches);
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
    eventsSpan.innerHTML = translateKey(translationKey);
    welcomeBet.classList.toggle('hide', value <= 0);
  }
  function getMatchData(match) {
    var serviceId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (serviceId > 1) return;
    return fetch('/service/lineout/frontend_api2/', {
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
    // if (target && !userId) {
    //     window.location.href = '/login';
    // }
    if (target) {
      target.classList.toggle('_done');
    }
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
})();
"use strict";
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzZWNvbmQuanMiXSwibmFtZXMiOlsiX2RvY3VtZW50JHF1ZXJ5U2VsZWN0IiwiYXBpVVJMIiwidW5hdXRoTXNncyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImNvdW50ZXJTcGFuIiwicXVlcnlTZWxlY3RvciIsImV2ZW50c1NwYW4iLCJ3ZWxjb21lQmV0Iiwic3dpdGNoV3JhcCIsInN3aXRjaEJ0biIsInVrTGVuZyIsImVuTGVuZyIsImxvY2FsZSIsInNlc3Npb25TdG9yYWdlIiwiZ2V0SXRlbSIsImkxOG5EYXRhIiwidXNlcklkIiwiZWxlbWVudHNCeU1hdGNoaUQiLCJhbGxNYXRjaGVzIiwiZmF2RGF0YUJ5TWF0Y2giLCJzYXZlZFN3aXRjaGVyU3RhdGUiLCJsb2NhbFN0b3JhZ2UiLCJjbGFzc0xpc3QiLCJhZGQiLCJhZGRFdmVudExpc3RlbmVyIiwic3R5bGUiLCJwb2ludGVyRXZlbnRzIiwic2V0VGltZW91dCIsImlzQWN0aXZlIiwidG9nZ2xlIiwic2V0SXRlbSIsImdldEJldHNsaXBJdGVtcyIsInRoZW4iLCJiZXRzbGlwTWF0Y2hlcyIsImZvckVhY2giLCJtYXRjaCIsIm1hdGNoRGl2IiwibWF0Y2hJZCIsImFkZE1hdGNoVG9CZXRzbGlwIiwiX2l0ZXJhdG9yIiwiX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIiLCJfc3RlcCIsInMiLCJuIiwiZG9uZSIsInZhbHVlIiwicmVtb3ZlTWF0Y2hGcm9tQmV0c2xpcCIsImVyciIsImUiLCJmIiwiY29uc29sZSIsImVycm9yIiwibG9hZFRyYW5zbGF0aW9ucyIsImZldGNoIiwiY29uY2F0IiwicmVzIiwianNvbiIsInRyYW5zbGF0ZSIsIm11dGF0aW9uT2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwib2JzZXJ2ZSIsImdldEVsZW1lbnRCeUlkIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsImVsZW1zIiwiZWxlbSIsImtleSIsImdldEF0dHJpYnV0ZSIsImlubmVySFRNTCIsInRyYW5zbGF0ZUtleSIsInJlbW92ZUF0dHJpYnV0ZSIsIm1haW5QYWdlIiwiZGVmYXVsdFZhbHVlIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwicmVxdWVzdCIsImxpbmsiLCJleHRyYU9wdGlvbnMiLCJfb2JqZWN0U3ByZWFkIiwiaGVhZGVycyIsIm9rIiwiRXJyb3IiLCJyZXBvcnRFcnJvciIsImRpc3BsYXkiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJzdGFydHNXaXRoIiwiUHJvbWlzZSIsInJlamVjdCIsInJlcG9ydERhdGEiLCJvcmlnaW4iLCJ1c2VyaWQiLCJlcnJvclRleHQiLCJ0ZXh0IiwibWVzc2FnZSIsInR5cGUiLCJuYW1lIiwic3RhY2siLCJtZXRob2QiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsIndhcm4iLCJpbml0QWRkQWxsQnRuIiwiYWRkQWxsQnRuIiwiX2l0ZXJhdG9yMiIsIl9zdGVwMiIsIkluaXRQYWdlIiwibWF0Y2hlcyIsInNvcnQiLCJhIiwiYiIsIkRhdGUiLCJtYXRjaERhdGUiLCJpbml0TWF0Y2hlcyIsImluaXRTbGlkZXIiLCJjb250YWluZXIiLCJhZGRlZCIsImkiLCJyb3dXcmFwIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsIl9sb29wIiwiaiIsInNvbWUiLCJldmVudF9pZCIsInRpdGxlIiwiZm9ybWF0RGF0ZSIsInRlYW0xIiwidGVhbTIiLCJvdXRjb21lVHJhbnNsYXRpb24iLCJkZWZhdWx0Q29lZiIsImFwcGVuZENoaWxkIiwiZ2V0TWF0Y2hEYXRhIiwibSIsImNvZkRpdiIsIm91dGNvbWVDb2VmIiwiY2xvc2VCdG4iLCJzdG9wUHJvcGFnYXRpb24iLCJzZXRDb3VudGVyIiwiaGFzU2VudENsaWNrRXZlbnQiLCJ0YXJnZXQiLCJjb250YWlucyIsImZhdkRhdGEiLCJldmVudElkIiwiYWRkVG9CZXRzbGlwIiwidXBkYXRlQ291bnRlciIsImFjdGl2ZUNvdW50IiwidG90YWxDb3VudCIsImlzUmVtb3ZlZCIsInJlbW92ZUZyb21CZXRzbGlwIiwicmVtb3ZlIiwiZGlmZiIsImN1cnJDb3VudGVyIiwibGFzdERpZ2l0IiwidHJhbnNsYXRpb25LZXkiLCJzZXJ2aWNlSWQiLCJjb2VmRGF0YUFycmF5IiwicmVzdWx0IiwiZmlsdGVyIiwibyIsIm1hcmtldF9uYW1lIiwibWFya2V0TmFtZSIsInJlc3VsdF90eXBlX25hbWUiLCJtYXJrZXRUeXBlIiwiZm91bmRPdXRjb21lIiwic2VsZWN0ZWRDb2VmRGF0YSIsImNvZWZEYXRhIiwib3V0Y29tZSIsIm91dGNvbWVzIiwiZmluZCIsIm91dGNvbWVfbmFtZSIsIm91dGNvbWVOYW1lIiwib3V0Y29tZUlkIiwib3V0Y29tZV9pZCIsIm91dGNvbWVfY29lZiIsIm1hcmtldElkIiwibWFya2V0X2lkIiwiZGF0ZSIsImQiLCJTdHJpbmciLCJnZXREYXRlIiwicGFkU3RhcnQiLCJnZXRNb250aCIsImFkZEJldHNsaXBPdXRjb21lcyIsInJlbW92ZUJldHNsaXBJdGVtcyIsInJlc29sdmUiLCJpbml0Iiwic3RvcmUiLCJzdGF0ZSIsImdldFN0YXRlIiwiYXV0aCIsImlzQXV0aG9yaXplZCIsImlkIiwiYyIsInNldEludGVydmFsIiwiZ191c2VyX2lkIiwiY2hlY2tVc2VyQXV0aCIsImNsZWFySW50ZXJ2YWwiLCJlbCIsImlzRHJhZ2dpbmciLCJzdGFydFgiLCJzY3JvbGxMZWZ0IiwiZHJhZ2dhYmxlQ29udGFpbmVyIiwiaXRlbXNXcmFwIiwicm93Iiwid2lkdGhzIiwibWF4V2lkdGgiLCJwYWdlWCIsIm9mZnNldExlZnQiLCJwcmV2ZW50RGVmYXVsdCIsIngiLCJ3YWxrIiwiY2xvc2VzdCIsImxuZ0J0biIsInJlbW92ZUl0ZW0iLCJyZWxvYWQiLCJfZG9jdW1lbnQkcXVlcnlTZWxlY3QyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLENBQUMsVUFBQUEscUJBQUEsRUFBWTtFQUNULElBQU1DLE1BQU0sR0FBRyxpREFBaUQ7RUFFaEUsSUFDSUMsVUFBVSxH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QztFQUVGLENBQUE1TixxQkFBQSxHQUFBRyxRQUFRLENBQUNHLGFBQWEsQ0FBQyxXQUFXLENBQUMsY0FBQU4scUJBQUEsZUFBbkNBLHFCQUFBLENBQXFDeUIsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQU07SUFBQSxJQUFBb00sc0JBQUE7SUFDN0QsQ0FBQUEsc0JBQUEsR0FBQTFOLFFBQVEsQ0FBQ0csYUFBYSxDQUFDLFlBQVksQ0FBQyxjQUFBdU4sc0JBQUEsZUFBcENBLHNCQUFBLENBQXNDdE0sU0FBUyxDQUFDTyxNQUFNLENBQUMsTUFBTSxDQUFDO0VBQ2xFLENBQUMsQ0FBQztBQUNWLENBQUMsRUFBRSxDQUFDO0FDeGRKIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGFwaVVSTCA9ICdodHRwczovL2Zhdi1wcm9tLmNvbS9hcGlfZm9yZWNhc3RfcG9zdGVyX2FsbHdpbic7XG5cbiAgICBjb25zdFxuICAgICAgICB1bmF1dGhNc2dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmF1dGhCdG4nKSxcbiAgICAgICAgY291bnRlclNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY291bnRlcicpLFxuICAgICAgICBldmVudHNTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmV2ZW50cycpLFxuICAgICAgICB3ZWxjb21lQmV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX2JldCcpLFxuICAgICAgICBzd2l0Y2hXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53ZWxjb21lX19zd2l0Y2hcIiksXG4gICAgICAgIHN3aXRjaEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2VsY29tZV9fc3dpdGNoLWJ0blwiKTtcblxuICAgIGNvbnN0IHVrTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN1a0xlbmcnKTtcbiAgICBjb25zdCBlbkxlbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZW5MZW5nJyk7XG5cbiAgICAvLyBsZXQgbG9jYWxlID0gJ3VrJztcbiAgICBsZXQgbG9jYWxlID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcImxvY2FsZVwiKSB8fCBcInVrXCJcbiAgICBpZiAodWtMZW5nKSBsb2NhbGUgPSAndWsnO1xuICAgIGlmIChlbkxlbmcpIGxvY2FsZSA9ICdlbic7XG5cbiAgICBsZXQgaTE4bkRhdGEgPSB7fTtcbiAgICBsZXQgdXNlcklkO1xuICAgIC8vIHVzZXJJZCA9IDEwMDMwMDI2ODtcbiAgICBsZXQgZWxlbWVudHNCeU1hdGNoaUQgPSB7fTtcbiAgICBsZXQgYWxsTWF0Y2hlcyA9IFtdO1xuICAgIGxldCBmYXZEYXRhQnlNYXRjaCA9IHt9O1xuXG4gICAgY29uc3Qgc2F2ZWRTd2l0Y2hlclN0YXRlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzd2l0Y2hlckFjdGl2ZVwiKTtcbiAgICBpZiAoc2F2ZWRTd2l0Y2hlclN0YXRlID09PSBcIjFcIikge1xuICAgICAgICBzd2l0Y2hCdG4uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICB9XG5cbiAgICBzd2l0Y2hCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgc3dpdGNoQnRuLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2hCdG4uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiXCI7XG4gICAgICAgIH0sIDIwMDApO1xuXG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gc3dpdGNoQnRuLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIik7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic3dpdGNoZXJBY3RpdmVcIiwgaXNBY3RpdmUgPyBcIjFcIiA6IFwiMFwiKTtcblxuICAgICAgICBpZiAoIXVzZXJJZCkgcmV0dXJuO1xuXG4gICAgICAgIGdldEJldHNsaXBJdGVtcygpLnRoZW4oYmV0c2xpcE1hdGNoZXMgPT4ge1xuICAgICAgICAgICAgaWYgKGlzQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgYWxsTWF0Y2hlcy5mb3JFYWNoKChtYXRjaCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaERpdiA9IGVsZW1lbnRzQnlNYXRjaGlEW21hdGNoLm1hdGNoSWRdO1xuICAgICAgICAgICAgICAgICAgICBhZGRNYXRjaFRvQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYsIGJldHNsaXBNYXRjaGVzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBtYXRjaCBvZiBhbGxNYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoRGl2ID0gZWxlbWVudHNCeU1hdGNoaURbbWF0Y2gubWF0Y2hJZF07XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZU1hdGNoRnJvbUJldHNsaXAobWF0Y2gsIG1hdGNoRGl2KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKCdFcnJvciBnZXR0aW5nIGJldHNsaXAgaXRlbXM6JywgZXJyKSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBsb2FkVHJhbnNsYXRpb25zKCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goYCR7YXBpVVJMfS9uZXctdHJhbnNsYXRlcy8ke2xvY2FsZX1gKS50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oanNvbiA9PiB7XG4gICAgICAgICAgICAgICAgaTE4bkRhdGEgPSBqc29uO1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9yZWNhc3RQb3N0ZXInKSwge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cmFuc2xhdGUoKSB7XG4gICAgICAgIGNvbnN0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdHJhbnNsYXRlXScpO1xuICAgICAgICBlbGVtcy5mb3JFYWNoKGVsZW0gPT4ge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRlJyk7XG4gICAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IHRyYW5zbGF0ZUtleShrZXkpO1xuICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRlJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAobG9jYWxlID09PSAnZW4nKSB7XG4gICAgICAgICAgICBtYWluUGFnZS5jbGFzc0xpc3QuYWRkKCdlbicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlS2V5KGtleSwgZGVmYXVsdFZhbHVlID0ga2V5KSB7XG4gICAgICAgIHJldHVybiBpMThuRGF0YVtrZXldIHx8IGRlZmF1bHRWYWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gKGxpbmssIGV4dHJhT3B0aW9ucykgPT5cbiAgICAgICAgZmV0Y2goYXBpVVJMICsgbGluaywge1xuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC4uLihleHRyYU9wdGlvbnMgfHwge30pXG4gICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoJ0FQSSBlcnJvcicpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0FQSSByZXF1ZXN0IGZhaWxlZDonLCBlcnIpO1xuXG4gICAgICAgICAgICAgICAgcmVwb3J0RXJyb3IoZXJyKTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hbGx3aW5fX3BhZ2UnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5zdGFydHNXaXRoKFwiaHR0cHM6Ly93d3cuZmF2YmV0LmhyL1wiKSkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvcHJvbW9jaWplL3Byb21vY2lqYS9zdHViLyc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3Byb21vcy9wcm9tby9zdHViLyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHJlcG9ydEVycm9yKGVycikge1xuICAgICAgICBjb25zdCByZXBvcnREYXRhID0ge1xuICAgICAgICAgICAgb3JpZ2luOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgICAgICAgIHVzZXJpZDogdXNlcklkLFxuICAgICAgICAgICAgZXJyb3JUZXh0OiBlcnI/LmVycm9yIHx8IGVycj8udGV4dCB8fCBlcnI/Lm1lc3NhZ2UgfHwgJ1Vua25vd24gZXJyb3InLFxuICAgICAgICAgICAgdHlwZTogZXJyPy5uYW1lIHx8ICdVbmtub3duRXJyb3InLFxuICAgICAgICAgICAgc3RhY2s6IGVycj8uc3RhY2sgfHwgJydcbiAgICAgICAgfTtcblxuICAgICAgICBmZXRjaCgnaHR0cHM6Ly9mYXYtcHJvbS5jb20vYXBpLWNtcy9yZXBvcnRzL2FkZCcsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShyZXBvcnREYXRhKVxuICAgICAgICB9KS5jYXRjaChjb25zb2xlLndhcm4pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRBZGRBbGxCdG4oKSB7XG4gICAgICAgIGNvbnN0IGFkZEFsbEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcmVkaWN0QnRuJyk7XG4gICAgICAgIGFkZEFsbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGlmICghdXNlcklkKSByZXR1cm47XG5cbiAgICAgICAgICAgIGdldEJldHNsaXBJdGVtcygpLnRoZW4oYmV0c2xpcE1hdGNoZXMgPT4ge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbWF0Y2ggb2YgYWxsTWF0Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaERpdiA9IGVsZW1lbnRzQnlNYXRjaGlEW21hdGNoLm1hdGNoSWRdO1xuICAgICAgICAgICAgICAgICAgICBhZGRNYXRjaFRvQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYsIGJldHNsaXBNYXRjaGVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcignRXJyb3IgZ2V0dGluZyBiZXRzbGlwIGl0ZW1zOicsIGVycikpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBJbml0UGFnZSA9ICgpID0+IHtcbiAgICAgICAgdHJhbnNsYXRlKCk7XG4gICAgICAgIGluaXRBZGRBbGxCdG4oKTtcbiAgICAgICAgcmVxdWVzdCgnL21hdGNoZXMnKS50aGVuKG1hdGNoZXMgPT4ge1xuICAgICAgICAgICAgYWxsTWF0Y2hlcyA9IChtYXRjaGVzIHx8IFtdKS5zb3J0KChhLCBiKSA9PiBuZXcgRGF0ZShhLm1hdGNoRGF0ZSkgLSBuZXcgRGF0ZShiLm1hdGNoRGF0ZSkpO1xuXG4gICAgICAgICAgICBnZXRCZXRzbGlwSXRlbXMoKS50aGVuKGJldHNsaXBNYXRjaGVzID0+IHtcbiAgICAgICAgICAgICAgICBpbml0TWF0Y2hlcyhhbGxNYXRjaGVzLCBiZXRzbGlwTWF0Y2hlcyk7XG4gICAgICAgICAgICAgICAgaW5pdFNsaWRlcigpO1xuICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgYmV0c2xpcCBpdGVtczonLCBlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdE1hdGNoZXMobWF0Y2hlcywgYmV0c2xpcE1hdGNoZXMpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX3JvdycpO1xuICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgICAgbGV0IGFkZGVkID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRjaGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgICAgICBjb25zdCByb3dXcmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICByb3dXcmFwLmNsYXNzTmFtZSA9ICd3ZWxjb21lX19yb3ctd3JhcCc7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSBpOyBqIDwgaSArIDIgJiYgaiA8IG1hdGNoZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IG1hdGNoZXNbal07XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBtYXRjaERpdi5jbGFzc05hbWUgPSAnd2VsY29tZV9faXRlbSc7XG4gICAgICAgICAgICAgICAgbWF0Y2gubWF0Y2hJZCA9ICgrbWF0Y2gubWF0Y2hJZCk7XG4gICAgICAgICAgICAgICAgaWYgKGJldHNsaXBNYXRjaGVzLnNvbWUoYiA9PiBiLmV2ZW50X2lkID09IG1hdGNoLm1hdGNoSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGVkKys7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoRGl2LmNsYXNzTGlzdC5hZGQoJ19kb25lJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbWF0Y2hEaXYuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLWNsb3NlXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tcm93XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj4ke3RyYW5zbGF0ZUtleShtYXRjaC50aXRsZSl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tZGF0ZVwiPiR7Zm9ybWF0RGF0ZShtYXRjaC5tYXRjaERhdGUpfTwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLW1heC10aXRsZVwiPiR7dHJhbnNsYXRlS2V5KG1hdGNoLnRlYW0xKX0g4oCTICR7dHJhbnNsYXRlS2V5KG1hdGNoLnRlYW0yKX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1pbmZvXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLWJpZFwiPiR7dHJhbnNsYXRlS2V5KG1hdGNoLm91dGNvbWVUcmFuc2xhdGlvbil9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLWNvZlwiPiR7bWF0Y2guZGVmYXVsdENvZWYgfHwgMH08L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICBgO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudHNCeU1hdGNoaURbbWF0Y2gubWF0Y2hJZF0gPSBtYXRjaERpdjtcbiAgICAgICAgICAgICAgICByb3dXcmFwLmFwcGVuZENoaWxkKG1hdGNoRGl2KTtcblxuICAgICAgICAgICAgICAgIGdldE1hdGNoRGF0YShtYXRjaCkudGhlbihtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvZkRpdiA9IG1hdGNoRGl2LnF1ZXJ5U2VsZWN0b3IoJy53ZWxjb21lX19pdGVtLWNvZicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29mRGl2LmlubmVySFRNTCA9IG0ub3V0Y29tZUNvZWY7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIG1hdGNoRGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGFkZE1hdGNoVG9CZXRzbGlwKG1hdGNoLCBtYXRjaERpdiwgYmV0c2xpcE1hdGNoZXMsIGUpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9zZUJ0biA9IG1hdGNoRGl2LnF1ZXJ5U2VsZWN0b3IoJy53ZWxjb21lX19pdGVtLWNsb3NlJyk7XG4gICAgICAgICAgICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVNYXRjaEZyb21CZXRzbGlwKG1hdGNoLCBtYXRjaERpdik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocm93V3JhcCk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0Q291bnRlcihhZGRlZCk7XG4gICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgfVxuXG4gICAgbGV0IGhhc1NlbnRDbGlja0V2ZW50ID0gZmFsc2U7XG5cbiAgICBmdW5jdGlvbiBhZGRNYXRjaFRvQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYsIGJldHNsaXBNYXRjaGVzLCBlKSB7XG4gICAgICAgIGlmICghdXNlcklkIHx8IGJldHNsaXBNYXRjaGVzLnNvbWUoYiA9PiBiLmV2ZW50X2lkID09PSBtYXRjaC5tYXRjaElkIHx8IChlICYmIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnd2VsY29tZV9faXRlbS1jbG9zZScpKSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZhdkRhdGEgPSBmYXZEYXRhQnlNYXRjaFttYXRjaC5tYXRjaElkXTtcbiAgICAgICAgaWYgKCFmYXZEYXRhIHx8ICFmYXZEYXRhLm1hdGNoSWQpIHJldHVybjtcblxuICAgICAgICBpZiAoIWhhc1NlbnRDbGlja0V2ZW50KSB7XG4gICAgICAgICAgICBoYXNTZW50Q2xpY2tFdmVudCA9IHRydWU7XG5cbiAgICAgICAgICAgIHJlcXVlc3QoJy9ldmVudHMnLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB1c2VyaWQ6IHVzZXJJZCwgZXZlbnRJZDogbWF0Y2gubWF0Y2hJZCB9KVxuICAgICAgICAgICAgfSkuY2F0Y2goY29uc29sZS5lcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICBhZGRUb0JldHNsaXAoZmF2RGF0YSk7XG4gICAgICAgIG1hdGNoRGl2LmNsYXNzTGlzdC5hZGQoJ19kb25lJyk7XG4gICAgICAgIHVwZGF0ZUNvdW50ZXIoMSk7XG5cbiAgICAgICAgY29uc3QgYWN0aXZlQ291bnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VsY29tZV9faXRlbS5fZG9uZScpLmxlbmd0aDtcbiAgICAgICAgY29uc3QgdG90YWxDb3VudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWxjb21lX19pdGVtJykubGVuZ3RoO1xuXG4gICAgICAgIGlmIChhY3RpdmVDb3VudCA9PT0gdG90YWxDb3VudCAmJiAhc3dpdGNoQnRuLmNsYXNzTGlzdC5jb250YWlucyhcImFjdGl2ZVwiKSkge1xuICAgICAgICAgICAgc3dpdGNoQnRuLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInN3aXRjaGVyQWN0aXZlXCIsIFwiMVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZU1hdGNoRnJvbUJldHNsaXAobWF0Y2gsIG1hdGNoRGl2KSB7XG4gICAgICAgIGlmICghdXNlcklkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZmF2RGF0YSA9IGZhdkRhdGFCeU1hdGNoW21hdGNoLm1hdGNoSWRdO1xuICAgICAgICBpZiAoIWZhdkRhdGEgfHwgIWZhdkRhdGEubWF0Y2hJZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGlzUmVtb3ZlZCA9IHJlbW92ZUZyb21CZXRzbGlwKGZhdkRhdGEpO1xuICAgICAgICBpZiAoaXNSZW1vdmVkKSB7XG4gICAgICAgICAgICBtYXRjaERpdi5jbGFzc0xpc3QucmVtb3ZlKCdfZG9uZScpO1xuICAgICAgICAgICAgdXBkYXRlQ291bnRlcigtMSk7XG5cbiAgICAgICAgICAgIGlmIChzd2l0Y2hCdG4uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoQnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzd2l0Y2hlckFjdGl2ZVwiLCBcIjBcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVDb3VudGVyKGRpZmYpIHtcbiAgICAgICAgY29uc3QgY3VyckNvdW50ZXIgPSArY291bnRlclNwYW4uaW5uZXJIVE1MO1xuICAgICAgICBzZXRDb3VudGVyKGN1cnJDb3VudGVyICsgZGlmZik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0Q291bnRlcih2YWx1ZSkge1xuICAgICAgICBjb3VudGVyU3Bhbi5pbm5lckhUTUwgPSB2YWx1ZTtcblxuICAgICAgICBjb25zdCBsYXN0RGlnaXQgPSB2YWx1ZSAlIDEwO1xuICAgICAgICBsZXQgdHJhbnNsYXRpb25LZXkgPSAobGFzdERpZ2l0ID09PSAxKSA/ICdldmVudDEnIDogKGxhc3REaWdpdCA+PSAyICYmIGxhc3REaWdpdCA8PSA0KSA/ICdldmVudDInIDogJ2V2ZW50Myc7XG5cbiAgICAgICAgZXZlbnRzU3Bhbi5pbm5lckhUTUwgPSB0cmFuc2xhdGVLZXkodHJhbnNsYXRpb25LZXkpO1xuICAgICAgICB3ZWxjb21lQmV0LmNsYXNzTGlzdC50b2dnbGUoJ2hpZGUnLCB2YWx1ZSA8PSAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRNYXRjaERhdGEobWF0Y2gsIHNlcnZpY2VJZCA9IDApIHtcbiAgICAgICAgaWYgKHNlcnZpY2VJZCA+IDEpIHJldHVybjtcblxuICAgICAgICByZXR1cm4gZmV0Y2goJy9zZXJ2aWNlL2xpbmVvdXQvZnJvbnRlbmRfYXBpMi8nLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICBcImpzb25ycGNcIjogXCIyLjBcIixcbiAgICAgICAgICAgICAgICBcImlkXCI6IDE2LFxuICAgICAgICAgICAgICAgIFwibWV0aG9kXCI6IFwiZnJvbnRlbmQvbWFya2V0L2dldFwiLFxuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJieVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhbmdcIjogJ3VrJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VydmljZV9pZFwiOiBzZXJ2aWNlSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImV2ZW50X2lkXCI6IG1hdGNoLm1hdGNoSWRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgIC50aGVuKGZhdkRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvZWZEYXRhQXJyYXkgPSBmYXZEYXRhLnJlc3VsdC5maWx0ZXIobyA9PlxuICAgICAgICAgICAgICAgICAgICBvLm1hcmtldF9uYW1lID09PSBtYXRjaC5tYXJrZXROYW1lICYmXG4gICAgICAgICAgICAgICAgICAgIG8ucmVzdWx0X3R5cGVfbmFtZSA9PT0gbWF0Y2gubWFya2V0VHlwZVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWNvZWZEYXRhQXJyYXkubGVuZ3RoKSByZXR1cm4gZ2V0TWF0Y2hEYXRhKG1hdGNoLCBzZXJ2aWNlSWQgKyAxKTtcblxuICAgICAgICAgICAgICAgIGxldCBmb3VuZE91dGNvbWUgPSBudWxsO1xuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZENvZWZEYXRhID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIGNvZWZEYXRhQXJyYXkuc29tZShjb2VmRGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG91dGNvbWUgPSBjb2VmRGF0YS5vdXRjb21lcy5maW5kKG8gPT4gby5vdXRjb21lX25hbWUgPT09IG1hdGNoLm91dGNvbWVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG91dGNvbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kT3V0Y29tZSA9IG91dGNvbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZENvZWZEYXRhID0gY29lZkRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWZvdW5kT3V0Y29tZSB8fCAhc2VsZWN0ZWRDb2VmRGF0YSkgcmV0dXJuIGdldE1hdGNoRGF0YShtYXRjaCwgc2VydmljZUlkICsgMSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgICAgIG91dGNvbWVJZDogZm91bmRPdXRjb21lLm91dGNvbWVfaWQsXG4gICAgICAgICAgICAgICAgICAgIG91dGNvbWVDb2VmOiBmb3VuZE91dGNvbWUub3V0Y29tZV9jb2VmLFxuICAgICAgICAgICAgICAgICAgICBtYXJrZXRJZDogc2VsZWN0ZWRDb2VmRGF0YS5tYXJrZXRfaWQsXG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2VJZDogc2VydmljZUlkLFxuICAgICAgICAgICAgICAgICAgICBtYXRjaElkOiBtYXRjaC5tYXRjaElkLFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBmYXZEYXRhQnlNYXRjaFttYXRjaC5tYXRjaElkXSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0RGF0ZShkYXRlKSB7XG4gICAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgcmV0dXJuIGAke1N0cmluZyhkLmdldERhdGUoKSkucGFkU3RhcnQoMiwgJzAnKX0uJHtTdHJpbmcoZC5nZXRNb250aCgpICsgMSkucGFkU3RhcnQoMiwgJzAnKX1gO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFRvQmV0c2xpcChtYXRjaCkge1xuICAgICAgICBpZiAoIXdpbmRvdy5hZGRCZXRzbGlwT3V0Y29tZXMpIHJldHVybjtcblxuICAgICAgICBjb25zdCBvdXRjb21lID0ge1xuICAgICAgICAgICAgc2VydmljZUlkOiBtYXRjaC5zZXJ2aWNlSWQsXG4gICAgICAgICAgICBldmVudElkOiBtYXRjaC5tYXRjaElkLFxuICAgICAgICAgICAgbWFya2V0SWQ6IG1hdGNoLm1hcmtldElkLFxuICAgICAgICAgICAgb3V0Y29tZUlkOiBtYXRjaC5vdXRjb21lSWRcbiAgICAgICAgfTtcbiAgICAgICAgd2luZG93LmFkZEJldHNsaXBPdXRjb21lcyhbb3V0Y29tZV0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUZyb21CZXRzbGlwKG1hdGNoKSB7XG4gICAgICAgIGlmICghd2luZG93LnJlbW92ZUJldHNsaXBJdGVtcykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IG91dGNvbWVJZCA9IG1hdGNoLm91dGNvbWVJZDtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gd2luZG93LnJlbW92ZUJldHNsaXBJdGVtcyhbb3V0Y29tZUlkXSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QmV0c2xpcEl0ZW1zKCkge1xuICAgICAgICBpZiAoIXdpbmRvdy5nZXRCZXRzbGlwSXRlbXMpIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuXG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2V0QmV0c2xpcEl0ZW1zKClcbiAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiByZXN1bHQpXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4gW10pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIEluaXRQYWdlKCk7XG4gICAgICAgIGlmICh3aW5kb3cuc3RvcmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gd2luZG93LnN0b3JlLmdldFN0YXRlKCk7XG4gICAgICAgICAgICB1c2VySWQgPSBzdGF0ZS5hdXRoLmlzQXV0aG9yaXplZCAmJiBzdGF0ZS5hdXRoLmlkIHx8ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGMgPSAwO1xuICAgICAgICAgICAgY29uc3QgaSA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoYyA8IDUwICYmICEhd2luZG93LmdfdXNlcl9pZCkge1xuICAgICAgICAgICAgICAgICAgICB1c2VySWQgPSB3aW5kb3cuZ191c2VyX2lkO1xuICAgICAgICAgICAgICAgICAgICBjaGVja1VzZXJBdXRoKCk7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYysrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1VzZXJBdXRoKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tVc2VyQXV0aCgpIHtcbiAgICAgICAgaWYgKHVzZXJJZCkge1xuICAgICAgICAgICAgdW5hdXRoTXNncy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKSk7XG4gICAgICAgICAgICBzd2l0Y2hXcmFwLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRlXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gc3dpdGNoV3JhcC5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcbiAgICAgICAgICAgIHVuYXV0aE1zZ3MuZm9yRWFjaChlbCA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdFNsaWRlcigpIHtcbiAgICAgICAgbGV0IGlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgbGV0IHN0YXJ0WDtcbiAgICAgICAgbGV0IHNjcm9sbExlZnQ7XG5cbiAgICAgICAgY29uc3QgZHJhZ2dhYmxlQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RyYWdnYWJsZUNvbnRhaW5lcicpO1xuICAgICAgICBjb25zdCBpdGVtc1dyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VsY29tZV9fcm93LXdyYXAnKTtcbiAgICAgICAgY29uc3Qgcm93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX3JvdycpO1xuXG4gICAgICAgIGNvbnN0IHdpZHRocyA9IHtcbiAgICAgICAgICAgIDU6ICcyMDk4cHgnLFxuICAgICAgICAgICAgNDogJzE2NjhweCcsXG4gICAgICAgICAgICAzOiAnMTI1OHB4JyxcbiAgICAgICAgICAgIDI6ICc4MjhweCcsXG4gICAgICAgICAgICAxOiAnNDE4cHgnLFxuICAgICAgICAgICAgZGVmYXVsdDogJzIwOThweCdcbiAgICAgICAgfTtcblxuICAgICAgICByb3cuc3R5bGUubWF4V2lkdGggPSB3aWR0aHNbaXRlbXNXcmFwLmxlbmd0aF0gfHwgd2lkdGhzLmRlZmF1bHQ7XG5cbiAgICAgICAgZHJhZ2dhYmxlQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGUgPT4ge1xuICAgICAgICAgICAgaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgICAgICAgICBzdGFydFggPSBlLnBhZ2VYIC0gZHJhZ2dhYmxlQ29udGFpbmVyLm9mZnNldExlZnQ7XG4gICAgICAgICAgICBzY3JvbGxMZWZ0ID0gZHJhZ2dhYmxlQ29udGFpbmVyLnNjcm9sbExlZnQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRyYWdnYWJsZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4gaXNEcmFnZ2luZyA9IGZhbHNlKTtcbiAgICAgICAgZHJhZ2dhYmxlQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoKSA9PiBpc0RyYWdnaW5nID0gZmFsc2UpO1xuICAgICAgICBkcmFnZ2FibGVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZSA9PiB7XG4gICAgICAgICAgICBpZiAoIWlzRHJhZ2dpbmcpIHJldHVybjtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnN0IHggPSBlLnBhZ2VYIC0gZHJhZ2dhYmxlQ29udGFpbmVyLm9mZnNldExlZnQ7XG4gICAgICAgICAgICBjb25zdCB3YWxrID0gKHggLSBzdGFydFgpICogMjtcbiAgICAgICAgICAgIGRyYWdnYWJsZUNvbnRhaW5lci5zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdCAtIHdhbGs7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0LmNsb3Nlc3QoJy53ZWxjb21lX19pdGVtJyk7XG4gICAgICAgIC8vIGlmICh0YXJnZXQgJiYgIXVzZXJJZCkge1xuICAgICAgICAvLyAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2xvZ2luJztcbiAgICAgICAgLy8gfVxuICAgICAgICBpZih0YXJnZXQpe1xuICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoJ19kb25lJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coZS50YXJnZXQuY2xvc2VzdCgnLndlbGNvbWVfX2Nsb3NlLScpKTtcbiAgICB9KTtcblxuXG4gICAgbGV0IG1haW5QYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFsbHdpbl9fcGFnZScpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gbWFpblBhZ2UuY2xhc3NMaXN0LmFkZCgnb3ZlcmZsb3cnKSwgMTAwMCk7XG5cbiAgICBsb2FkVHJhbnNsYXRpb25zKCkudGhlbihpbml0KTtcblxuXG4gICAgLy9mb3IgdGVzdFxuICAgIGNvbnN0IGxuZ0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG5nLWJ0blwiKVxuXG4gICAgbG5nQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGlmIChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwibG9jYWxlXCIpKSB7XG4gICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFwibG9jYWxlXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShcImxvY2FsZVwiLCBcImVuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubWVudS1idG5cIik/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lbnUtdGVzdFwiKT8uY2xhc3NMaXN0LnRvZ2dsZShcImhpZGVcIik7XG4gICAgICAgIH0pO1xufSkoKTtcbiIsIiJdfQ==
