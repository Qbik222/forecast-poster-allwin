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
(function () {
  var apiURL = 'https://fav-prom.com/api_forecast_poster';
  var unauthMsgs = document.querySelectorAll('.authBtn'),
    counterSpan = document.querySelector('.counter'),
    eventsSpan = document.querySelector('.events'),
    welcomeBet = document.querySelector('.welcome__bet'),
    switchWrap = document.querySelector(".welcome__switch"),
    switchBtn = document.querySelector(".welcome__switch-btn");
  var ukLeng = document.querySelector('#ukLeng');
  var enLeng = document.querySelector('#enLeng');
  var locale = 'uk';
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
      document.querySelector('.fav__page').style.display = 'none';
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
        matchDiv.innerHTML = "\n                <div class=\"welcome__item-close\"></div>\n                <div class=\"welcome__item-row\">\n                    <div class=\"welcome__item-title\">\n                        <img src=\"https://fav-prom.com/html/forecast-poster/img/welcome/fav.svg\" alt=\"FAVBET\">\n                        <span>".concat(translateKey(match.title), "</span>\n                    </div>\n                    <div class=\"welcome__item-date\">").concat(formatDate(match.matchDate), "</div>\n                </div>\n                <div class=\"welcome__item-max-title\">").concat(translateKey(match.team1), " \u2013 ").concat(translateKey(match.team2), "</div>\n                <div class=\"welcome__item-info\">\n                    <div class=\"welcome__item-bid\">").concat(translateKey(match.outcomeTranslation), "</div>\n                    <div class=\"welcome__item-cof\">").concat(match.defaultCoef || 0, "</div>\n                </div>\n                ");
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
      switchWrap.classList.add("hide");
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
  });
  var mainPage = document.querySelector('.fav__page');
  setTimeout(function () {
    return mainPage.classList.add('overflow');
  }, 1000);
  loadTranslations().then(init);
})();
"use strict";
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzZWNvbmQuanMiXSwibmFtZXMiOlsiYXBpVVJMIiwidW5hdXRoTXNncyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImNvdW50ZXJTcGFuIiwicXVlcnlTZWxlY3RvciIsImV2ZW50c1NwYW4iLCJ3ZWxjb21lQmV0Iiwic3dpdGNoV3JhcCIsInN3aXRjaEJ0biIsInVrTGVuZyIsImVuTGVuZyIsImxvY2FsZSIsImkxOG5EYXRhIiwidXNlcklkIiwiZWxlbWVudHNCeU1hdGNoaUQiLCJhbGxNYXRjaGVzIiwiZmF2RGF0YUJ5TWF0Y2giLCJzYXZlZFN3aXRjaGVyU3RhdGUiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiY2xhc3NMaXN0IiwiYWRkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0eWxlIiwicG9pbnRlckV2ZW50cyIsInNldFRpbWVvdXQiLCJpc0FjdGl2ZSIsInRvZ2dsZSIsInNldEl0ZW0iLCJnZXRCZXRzbGlwSXRlbXMiLCJ0aGVuIiwiYmV0c2xpcE1hdGNoZXMiLCJmb3JFYWNoIiwibWF0Y2giLCJtYXRjaERpdiIsIm1hdGNoSWQiLCJhZGRNYXRjaFRvQmV0c2xpcCIsIl9pdGVyYXRvciIsIl9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyIiwiX3N0ZXAiLCJzIiwibiIsImRvbmUiLCJ2YWx1ZSIsInJlbW92ZU1hdGNoRnJvbUJldHNsaXAiLCJlcnIiLCJlIiwiZiIsImNvbnNvbGUiLCJlcnJvciIsImxvYWRUcmFuc2xhdGlvbnMiLCJmZXRjaCIsImNvbmNhdCIsInJlcyIsImpzb24iLCJ0cmFuc2xhdGUiLCJtdXRhdGlvbk9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm9ic2VydmUiLCJnZXRFbGVtZW50QnlJZCIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJlbGVtcyIsImVsZW0iLCJrZXkiLCJnZXRBdHRyaWJ1dGUiLCJpbm5lckhUTUwiLCJ0cmFuc2xhdGVLZXkiLCJyZW1vdmVBdHRyaWJ1dGUiLCJtYWluUGFnZSIsImRlZmF1bHRWYWx1ZSIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsInJlcXVlc3QiLCJsaW5rIiwiZXh0cmFPcHRpb25zIiwiX29iamVjdFNwcmVhZCIsImhlYWRlcnMiLCJvayIsIkVycm9yIiwicmVwb3J0RXJyb3IiLCJkaXNwbGF5Iiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwic3RhcnRzV2l0aCIsIlByb21pc2UiLCJyZWplY3QiLCJyZXBvcnREYXRhIiwib3JpZ2luIiwidXNlcmlkIiwiZXJyb3JUZXh0IiwidGV4dCIsIm1lc3NhZ2UiLCJ0eXBlIiwibmFtZSIsInN0YWNrIiwibWV0aG9kIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ3YXJuIiwiaW5pdEFkZEFsbEJ0biIsImFkZEFsbEJ0biIsIl9pdGVyYXRvcjIiLCJfc3RlcDIiLCJJbml0UGFnZSIsIm1hdGNoZXMiLCJzb3J0IiwiYSIsImIiLCJEYXRlIiwibWF0Y2hEYXRlIiwiaW5pdE1hdGNoZXMiLCJpbml0U2xpZGVyIiwiY29udGFpbmVyIiwiYWRkZWQiLCJpIiwicm93V3JhcCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJfbG9vcCIsImoiLCJzb21lIiwiZXZlbnRfaWQiLCJ0aXRsZSIsImZvcm1hdERhdGUiLCJ0ZWFtMSIsInRlYW0yIiwib3V0Y29tZVRyYW5zbGF0aW9uIiwiZGVmYXVsdENvZWYiLCJhcHBlbmRDaGlsZCIsImdldE1hdGNoRGF0YSIsIm0iLCJjb2ZEaXYiLCJvdXRjb21lQ29lZiIsImNsb3NlQnRuIiwic3RvcFByb3BhZ2F0aW9uIiwic2V0Q291bnRlciIsImhhc1NlbnRDbGlja0V2ZW50IiwidGFyZ2V0IiwiY29udGFpbnMiLCJmYXZEYXRhIiwiZXZlbnRJZCIsImFkZFRvQmV0c2xpcCIsInVwZGF0ZUNvdW50ZXIiLCJhY3RpdmVDb3VudCIsInRvdGFsQ291bnQiLCJpc1JlbW92ZWQiLCJyZW1vdmVGcm9tQmV0c2xpcCIsInJlbW92ZSIsImRpZmYiLCJjdXJyQ291bnRlciIsImxhc3REaWdpdCIsInRyYW5zbGF0aW9uS2V5Iiwic2VydmljZUlkIiwiY29lZkRhdGFBcnJheSIsInJlc3VsdCIsImZpbHRlciIsIm8iLCJtYXJrZXRfbmFtZSIsIm1hcmtldE5hbWUiLCJyZXN1bHRfdHlwZV9uYW1lIiwibWFya2V0VHlwZSIsImZvdW5kT3V0Y29tZSIsInNlbGVjdGVkQ29lZkRhdGEiLCJjb2VmRGF0YSIsIm91dGNvbWUiLCJvdXRjb21lcyIsImZpbmQiLCJvdXRjb21lX25hbWUiLCJvdXRjb21lTmFtZSIsIm91dGNvbWVJZCIsIm91dGNvbWVfaWQiLCJvdXRjb21lX2NvZWYiLCJtYXJrZXRJZCIsIm1hcmtldF9pZCIsImRhdGUiLCJkIiwiU3RyaW5nIiwiZ2V0RGF0ZSIsInBhZFN0YXJ0IiwiZ2V0TW9udGgiLCJhZGRCZXRzbGlwT3V0Y29tZXMiLCJyZW1vdmVCZXRzbGlwSXRlbXMiLCJyZXNvbHZlIiwiaW5pdCIsInN0b3JlIiwic3RhdGUiLCJnZXRTdGF0ZSIsImF1dGgiLCJpc0F1dGhvcml6ZWQiLCJpZCIsImMiLCJzZXRJbnRlcnZhbCIsImdfdXNlcl9pZCIsImNoZWNrVXNlckF1dGgiLCJjbGVhckludGVydmFsIiwiZWwiLCJpc0RyYWdnaW5nIiwic3RhcnRYIiwic2Nyb2xsTGVmdCIsImRyYWdnYWJsZUNvbnRhaW5lciIsIml0ZW1zV3JhcCIsInJvdyIsIndpZHRocyIsIm1heFdpZHRoIiwicGFnZVgiLCJvZmZzZXRMZWZ0IiwicHJldmVudERlZmF1bHQiLCJ4Iiwid2FsayIsImNsb3Nlc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsQ0FBQyxZQUFZO0VBQ1QsSUFBTUEsTUFBTSxHQUFHLDBDQUEwQztFQUV6RCxJQUNJQyxVQUFVLEdBQUdDLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsVUFBVSxDQUFDO0lBQ2xEQyxXQUFXLEdBQUdGLFFBQVEsQ0FBQ0csYUFBYSxDQUFDLFVBQVUsQ0FBQztJQUNoREMsVUFBVSxHQUFHSixRQUFR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QUk7SUFDckQsQ0FBQyxDQUFDO0VBQ047RUFFQXBOLFFBQVEsQ0FBQ3FCLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFBd0IsQ0FBQyxFQUFJO0lBQ3BDLElBQU1nRyxNQUFNLEdBQUdoRyxDQUFDLENBQUNnRyxNQUFNLENBQUN3RSxPQUFPLENBQUMsZ0JBQWdCLENBQUM7SUFDakQsSUFBSXhFLE1BQU0sSUFBSSxDQUFDakksTUFBTSxFQUFFO01BQ25CdUUsTUFBTSxDQUFDQyxRQUFRLENBQUNDLElBQUksR0FBRyxRQUFRO0lBQ25DO0VBQ0osQ0FBQyxDQUFDO0VBRUYsSUFBSWhCLFFBQVEsR0FBR3JFLFFBQVEsQ0FBQ0csYUFBYSxDQUFDLFlBQVksQ0FBQztFQUNuRHFCLFVBQVUsQ0FBQztJQUFBLE9BQU02QyxRQUFRLENBQUNsRCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxVQUFVLENBQUM7RUFBQSxHQUFFLElBQUksQ0FBQztFQUUxRDZCLGdCQUFnQixDQUFDLENBQUMsQ0FBQ3BCLElBQUksQ0FBQzhKLElBQUksQ0FBQztBQUNqQyxDQUFDLEVBQUUsQ0FBQztBQ2xjSiIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBhcGlVUkwgPSAnaHR0cHM6Ly9mYXYtcHJvbS5jb20vYXBpX2ZvcmVjYXN0X3Bvc3Rlcic7XG5cbiAgICBjb25zdFxuICAgICAgICB1bmF1dGhNc2dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmF1dGhCdG4nKSxcbiAgICAgICAgY291bnRlclNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY291bnRlcicpLFxuICAgICAgICBldmVudHNTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmV2ZW50cycpLFxuICAgICAgICB3ZWxjb21lQmV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX2JldCcpLFxuICAgICAgICBzd2l0Y2hXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53ZWxjb21lX19zd2l0Y2hcIiksXG4gICAgICAgIHN3aXRjaEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2VsY29tZV9fc3dpdGNoLWJ0blwiKTtcblxuICAgIGNvbnN0IHVrTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN1a0xlbmcnKTtcbiAgICBjb25zdCBlbkxlbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZW5MZW5nJyk7XG5cbiAgICBsZXQgbG9jYWxlID0gJ3VrJztcbiAgICBpZiAodWtMZW5nKSBsb2NhbGUgPSAndWsnO1xuICAgIGlmIChlbkxlbmcpIGxvY2FsZSA9ICdlbic7XG5cbiAgICBsZXQgaTE4bkRhdGEgPSB7fTtcbiAgICBsZXQgdXNlcklkO1xuICAgIC8vIHVzZXJJZCA9IDEwMDMwMDI2ODtcbiAgICBsZXQgZWxlbWVudHNCeU1hdGNoaUQgPSB7fTtcbiAgICBsZXQgYWxsTWF0Y2hlcyA9IFtdO1xuICAgIGxldCBmYXZEYXRhQnlNYXRjaCA9IHt9O1xuXG4gICAgY29uc3Qgc2F2ZWRTd2l0Y2hlclN0YXRlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzd2l0Y2hlckFjdGl2ZVwiKTtcbiAgICBpZiAoc2F2ZWRTd2l0Y2hlclN0YXRlID09PSBcIjFcIikge1xuICAgICAgICBzd2l0Y2hCdG4uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICB9XG5cbiAgICBzd2l0Y2hCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgc3dpdGNoQnRuLnN0eWxlLnBvaW50ZXJFdmVudHMgPSBcIm5vbmVcIjtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2hCdG4uc3R5bGUucG9pbnRlckV2ZW50cyA9IFwiXCI7XG4gICAgICAgIH0sIDIwMDApO1xuXG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gc3dpdGNoQnRuLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIik7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic3dpdGNoZXJBY3RpdmVcIiwgaXNBY3RpdmUgPyBcIjFcIiA6IFwiMFwiKTtcblxuICAgICAgICBpZiAoIXVzZXJJZCkgcmV0dXJuO1xuXG4gICAgICAgIGdldEJldHNsaXBJdGVtcygpLnRoZW4oYmV0c2xpcE1hdGNoZXMgPT4ge1xuICAgICAgICAgICAgaWYgKGlzQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgYWxsTWF0Y2hlcy5mb3JFYWNoKChtYXRjaCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaERpdiA9IGVsZW1lbnRzQnlNYXRjaGlEW21hdGNoLm1hdGNoSWRdO1xuICAgICAgICAgICAgICAgICAgICBhZGRNYXRjaFRvQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYsIGJldHNsaXBNYXRjaGVzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBtYXRjaCBvZiBhbGxNYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoRGl2ID0gZWxlbWVudHNCeU1hdGNoaURbbWF0Y2gubWF0Y2hJZF07XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZU1hdGNoRnJvbUJldHNsaXAobWF0Y2gsIG1hdGNoRGl2KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKCdFcnJvciBnZXR0aW5nIGJldHNsaXAgaXRlbXM6JywgZXJyKSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBsb2FkVHJhbnNsYXRpb25zKCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goYCR7YXBpVVJMfS9uZXctdHJhbnNsYXRlcy8ke2xvY2FsZX1gKS50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oanNvbiA9PiB7XG4gICAgICAgICAgICAgICAgaTE4bkRhdGEgPSBqc29uO1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9yZWNhc3RQb3N0ZXInKSwge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cmFuc2xhdGUoKSB7XG4gICAgICAgIGNvbnN0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdHJhbnNsYXRlXScpO1xuICAgICAgICBlbGVtcy5mb3JFYWNoKGVsZW0gPT4ge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRlJyk7XG4gICAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IHRyYW5zbGF0ZUtleShrZXkpO1xuICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRlJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAobG9jYWxlID09PSAnZW4nKSB7XG4gICAgICAgICAgICBtYWluUGFnZS5jbGFzc0xpc3QuYWRkKCdlbicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlS2V5KGtleSwgZGVmYXVsdFZhbHVlID0ga2V5KSB7XG4gICAgICAgIHJldHVybiBpMThuRGF0YVtrZXldIHx8IGRlZmF1bHRWYWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gKGxpbmssIGV4dHJhT3B0aW9ucykgPT5cbiAgICAgICAgZmV0Y2goYXBpVVJMICsgbGluaywge1xuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC4uLihleHRyYU9wdGlvbnMgfHwge30pXG4gICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoJ0FQSSBlcnJvcicpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXMuanNvbigpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0FQSSByZXF1ZXN0IGZhaWxlZDonLCBlcnIpO1xuXG4gICAgICAgICAgICAgICAgcmVwb3J0RXJyb3IoZXJyKTtcblxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mYXZfX3BhZ2UnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5zdGFydHNXaXRoKFwiaHR0cHM6Ly93d3cuZmF2YmV0LmhyL1wiKSkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvcHJvbW9jaWplL3Byb21vY2lqYS9zdHViLyc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3Byb21vcy9wcm9tby9zdHViLyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHJlcG9ydEVycm9yKGVycikge1xuICAgICAgICBjb25zdCByZXBvcnREYXRhID0ge1xuICAgICAgICAgICAgb3JpZ2luOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgICAgICAgIHVzZXJpZDogdXNlcklkLFxuICAgICAgICAgICAgZXJyb3JUZXh0OiBlcnI/LmVycm9yIHx8IGVycj8udGV4dCB8fCBlcnI/Lm1lc3NhZ2UgfHwgJ1Vua25vd24gZXJyb3InLFxuICAgICAgICAgICAgdHlwZTogZXJyPy5uYW1lIHx8ICdVbmtub3duRXJyb3InLFxuICAgICAgICAgICAgc3RhY2s6IGVycj8uc3RhY2sgfHwgJydcbiAgICAgICAgfTtcblxuICAgICAgICBmZXRjaCgnaHR0cHM6Ly9mYXYtcHJvbS5jb20vYXBpLWNtcy9yZXBvcnRzL2FkZCcsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShyZXBvcnREYXRhKVxuICAgICAgICB9KS5jYXRjaChjb25zb2xlLndhcm4pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRBZGRBbGxCdG4oKSB7XG4gICAgICAgIGNvbnN0IGFkZEFsbEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcmVkaWN0QnRuJyk7XG4gICAgICAgIGFkZEFsbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGlmICghdXNlcklkKSByZXR1cm47XG5cbiAgICAgICAgICAgIGdldEJldHNsaXBJdGVtcygpLnRoZW4oYmV0c2xpcE1hdGNoZXMgPT4ge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbWF0Y2ggb2YgYWxsTWF0Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaERpdiA9IGVsZW1lbnRzQnlNYXRjaGlEW21hdGNoLm1hdGNoSWRdO1xuICAgICAgICAgICAgICAgICAgICBhZGRNYXRjaFRvQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYsIGJldHNsaXBNYXRjaGVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcignRXJyb3IgZ2V0dGluZyBiZXRzbGlwIGl0ZW1zOicsIGVycikpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBJbml0UGFnZSA9ICgpID0+IHtcbiAgICAgICAgdHJhbnNsYXRlKCk7XG4gICAgICAgIGluaXRBZGRBbGxCdG4oKTtcbiAgICAgICAgcmVxdWVzdCgnL21hdGNoZXMnKS50aGVuKG1hdGNoZXMgPT4ge1xuICAgICAgICAgICAgYWxsTWF0Y2hlcyA9IChtYXRjaGVzIHx8IFtdKS5zb3J0KChhLCBiKSA9PiBuZXcgRGF0ZShhLm1hdGNoRGF0ZSkgLSBuZXcgRGF0ZShiLm1hdGNoRGF0ZSkpO1xuXG4gICAgICAgICAgICBnZXRCZXRzbGlwSXRlbXMoKS50aGVuKGJldHNsaXBNYXRjaGVzID0+IHtcbiAgICAgICAgICAgICAgICBpbml0TWF0Y2hlcyhhbGxNYXRjaGVzLCBiZXRzbGlwTWF0Y2hlcyk7XG4gICAgICAgICAgICAgICAgaW5pdFNsaWRlcigpO1xuICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgYmV0c2xpcCBpdGVtczonLCBlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdE1hdGNoZXMobWF0Y2hlcywgYmV0c2xpcE1hdGNoZXMpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX3JvdycpO1xuICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgICAgbGV0IGFkZGVkID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRjaGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgICAgICBjb25zdCByb3dXcmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICByb3dXcmFwLmNsYXNzTmFtZSA9ICd3ZWxjb21lX19yb3ctd3JhcCc7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSBpOyBqIDwgaSArIDIgJiYgaiA8IG1hdGNoZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IG1hdGNoZXNbal07XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBtYXRjaERpdi5jbGFzc05hbWUgPSAnd2VsY29tZV9faXRlbSc7XG4gICAgICAgICAgICAgICAgbWF0Y2gubWF0Y2hJZCA9ICgrbWF0Y2gubWF0Y2hJZCk7XG4gICAgICAgICAgICAgICAgaWYgKGJldHNsaXBNYXRjaGVzLnNvbWUoYiA9PiBiLmV2ZW50X2lkID09IG1hdGNoLm1hdGNoSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGVkKys7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoRGl2LmNsYXNzTGlzdC5hZGQoJ19kb25lJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbWF0Y2hEaXYuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLWNsb3NlXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tcm93XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cImh0dHBzOi8vZmF2LXByb20uY29tL2h0bWwvZm9yZWNhc3QtcG9zdGVyL2ltZy93ZWxjb21lL2Zhdi5zdmdcIiBhbHQ9XCJGQVZCRVRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiR7dHJhbnNsYXRlS2V5KG1hdGNoLnRpdGxlKX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1kYXRlXCI+JHtmb3JtYXREYXRlKG1hdGNoLm1hdGNoRGF0ZSl9PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tbWF4LXRpdGxlXCI+JHt0cmFuc2xhdGVLZXkobWF0Y2gudGVhbTEpfSDigJMgJHt0cmFuc2xhdGVLZXkobWF0Y2gudGVhbTIpfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLWluZm9cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tYmlkXCI+JHt0cmFuc2xhdGVLZXkobWF0Y2gub3V0Y29tZVRyYW5zbGF0aW9uKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tY29mXCI+JHttYXRjaC5kZWZhdWx0Q29lZiB8fCAwfTwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIGA7XG5cbiAgICAgICAgICAgICAgICBlbGVtZW50c0J5TWF0Y2hpRFttYXRjaC5tYXRjaElkXSA9IG1hdGNoRGl2O1xuICAgICAgICAgICAgICAgIHJvd1dyYXAuYXBwZW5kQ2hpbGQobWF0Y2hEaXYpO1xuXG4gICAgICAgICAgICAgICAgZ2V0TWF0Y2hEYXRhKG1hdGNoKS50aGVuKG0gPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29mRGl2ID0gbWF0Y2hEaXYucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX2l0ZW0tY29mJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2ZEaXYuaW5uZXJIVE1MID0gbS5vdXRjb21lQ29lZjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgbWF0Y2hEaXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gYWRkTWF0Y2hUb0JldHNsaXAobWF0Y2gsIG1hdGNoRGl2LCBiZXRzbGlwTWF0Y2hlcywgZSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsb3NlQnRuID0gbWF0Y2hEaXYucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX2l0ZW0tY2xvc2UnKTtcbiAgICAgICAgICAgICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZU1hdGNoRnJvbUJldHNsaXAobWF0Y2gsIG1hdGNoRGl2KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChyb3dXcmFwKTtcbiAgICAgICAgfVxuICAgICAgICBzZXRDb3VudGVyKGFkZGVkKTtcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgICB9XG5cbiAgICBsZXQgaGFzU2VudENsaWNrRXZlbnQgPSBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIGFkZE1hdGNoVG9CZXRzbGlwKG1hdGNoLCBtYXRjaERpdiwgYmV0c2xpcE1hdGNoZXMsIGUpIHtcbiAgICAgICAgaWYgKCF1c2VySWQgfHwgYmV0c2xpcE1hdGNoZXMuc29tZShiID0+IGIuZXZlbnRfaWQgPT09IG1hdGNoLm1hdGNoSWQgfHwgKGUgJiYgZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd3ZWxjb21lX19pdGVtLWNsb3NlJykpKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmF2RGF0YSA9IGZhdkRhdGFCeU1hdGNoW21hdGNoLm1hdGNoSWRdO1xuICAgICAgICBpZiAoIWZhdkRhdGEgfHwgIWZhdkRhdGEubWF0Y2hJZCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICghaGFzU2VudENsaWNrRXZlbnQpIHtcbiAgICAgICAgICAgIGhhc1NlbnRDbGlja0V2ZW50ID0gdHJ1ZTtcblxuICAgICAgICAgICAgcmVxdWVzdCgnL2V2ZW50cycsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHVzZXJpZDogdXNlcklkLCBldmVudElkOiBtYXRjaC5tYXRjaElkIH0pXG4gICAgICAgICAgICB9KS5jYXRjaChjb25zb2xlLmVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkZFRvQmV0c2xpcChmYXZEYXRhKTtcbiAgICAgICAgbWF0Y2hEaXYuY2xhc3NMaXN0LmFkZCgnX2RvbmUnKTtcbiAgICAgICAgdXBkYXRlQ291bnRlcigxKTtcblxuICAgICAgICBjb25zdCBhY3RpdmVDb3VudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWxjb21lX19pdGVtLl9kb25lJykubGVuZ3RoO1xuICAgICAgICBjb25zdCB0b3RhbENvdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlbGNvbWVfX2l0ZW0nKS5sZW5ndGg7XG5cbiAgICAgICAgaWYgKGFjdGl2ZUNvdW50ID09PSB0b3RhbENvdW50ICYmICFzd2l0Y2hCdG4uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlXCIpKSB7XG4gICAgICAgICAgICBzd2l0Y2hCdG4uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwic3dpdGNoZXJBY3RpdmVcIiwgXCIxXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlTWF0Y2hGcm9tQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYpIHtcbiAgICAgICAgaWYgKCF1c2VySWQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBmYXZEYXRhID0gZmF2RGF0YUJ5TWF0Y2hbbWF0Y2gubWF0Y2hJZF07XG4gICAgICAgIGlmICghZmF2RGF0YSB8fCAhZmF2RGF0YS5tYXRjaElkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgaXNSZW1vdmVkID0gcmVtb3ZlRnJvbUJldHNsaXAoZmF2RGF0YSk7XG4gICAgICAgIGlmIChpc1JlbW92ZWQpIHtcbiAgICAgICAgICAgIG1hdGNoRGl2LmNsYXNzTGlzdC5yZW1vdmUoJ19kb25lJyk7XG4gICAgICAgICAgICB1cGRhdGVDb3VudGVyKC0xKTtcblxuICAgICAgICAgICAgaWYgKHN3aXRjaEJ0bi5jbGFzc0xpc3QuY29udGFpbnMoXCJhY3RpdmVcIikpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2hCdG4uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInN3aXRjaGVyQWN0aXZlXCIsIFwiMFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNvdW50ZXIoZGlmZikge1xuICAgICAgICBjb25zdCBjdXJyQ291bnRlciA9ICtjb3VudGVyU3Bhbi5pbm5lckhUTUw7XG4gICAgICAgIHNldENvdW50ZXIoY3VyckNvdW50ZXIgKyBkaWZmKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRDb3VudGVyKHZhbHVlKSB7XG4gICAgICAgIGNvdW50ZXJTcGFuLmlubmVySFRNTCA9IHZhbHVlO1xuXG4gICAgICAgIGNvbnN0IGxhc3REaWdpdCA9IHZhbHVlICUgMTA7XG4gICAgICAgIGxldCB0cmFuc2xhdGlvbktleSA9IChsYXN0RGlnaXQgPT09IDEpID8gJ2V2ZW50MScgOiAobGFzdERpZ2l0ID49IDIgJiYgbGFzdERpZ2l0IDw9IDQpID8gJ2V2ZW50MicgOiAnZXZlbnQzJztcblxuICAgICAgICBldmVudHNTcGFuLmlubmVySFRNTCA9IHRyYW5zbGF0ZUtleSh0cmFuc2xhdGlvbktleSk7XG4gICAgICAgIHdlbGNvbWVCZXQuY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZScsIHZhbHVlIDw9IDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE1hdGNoRGF0YShtYXRjaCwgc2VydmljZUlkID0gMCkge1xuICAgICAgICBpZiAoc2VydmljZUlkID4gMSkgcmV0dXJuO1xuXG4gICAgICAgIHJldHVybiBmZXRjaCgnL3NlcnZpY2UvbGluZW91dC9mcm9udGVuZF9hcGkyLycsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIFwianNvbnJwY1wiOiBcIjIuMFwiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogMTYsXG4gICAgICAgICAgICAgICAgXCJtZXRob2RcIjogXCJmcm9udGVuZC9tYXJrZXQvZ2V0XCIsXG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImJ5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGFuZ1wiOiAndWsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXJ2aWNlX2lkXCI6IHNlcnZpY2VJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZXZlbnRfaWRcIjogbWF0Y2gubWF0Y2hJZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oZmF2RGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29lZkRhdGFBcnJheSA9IGZhdkRhdGEucmVzdWx0LmZpbHRlcihvID0+XG4gICAgICAgICAgICAgICAgICAgIG8ubWFya2V0X25hbWUgPT09IG1hdGNoLm1hcmtldE5hbWUgJiZcbiAgICAgICAgICAgICAgICAgICAgby5yZXN1bHRfdHlwZV9uYW1lID09PSBtYXRjaC5tYXJrZXRUeXBlXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmICghY29lZkRhdGFBcnJheS5sZW5ndGgpIHJldHVybiBnZXRNYXRjaERhdGEobWF0Y2gsIHNlcnZpY2VJZCArIDEpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGZvdW5kT3V0Y29tZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkQ29lZkRhdGEgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgY29lZkRhdGFBcnJheS5zb21lKGNvZWZEYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0Y29tZSA9IGNvZWZEYXRhLm91dGNvbWVzLmZpbmQobyA9PiBvLm91dGNvbWVfbmFtZSA9PT0gbWF0Y2gub3V0Y29tZU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3V0Y29tZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmRPdXRjb21lID0gb3V0Y29tZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkQ29lZkRhdGEgPSBjb2VmRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICghZm91bmRPdXRjb21lIHx8ICFzZWxlY3RlZENvZWZEYXRhKSByZXR1cm4gZ2V0TWF0Y2hEYXRhKG1hdGNoLCBzZXJ2aWNlSWQgKyAxKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0Y29tZUlkOiBmb3VuZE91dGNvbWUub3V0Y29tZV9pZCxcbiAgICAgICAgICAgICAgICAgICAgb3V0Y29tZUNvZWY6IGZvdW5kT3V0Y29tZS5vdXRjb21lX2NvZWYsXG4gICAgICAgICAgICAgICAgICAgIG1hcmtldElkOiBzZWxlY3RlZENvZWZEYXRhLm1hcmtldF9pZCxcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZUlkOiBzZXJ2aWNlSWQsXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoSWQ6IG1hdGNoLm1hdGNoSWQsXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGZhdkRhdGFCeU1hdGNoW21hdGNoLm1hdGNoSWRdID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXREYXRlKGRhdGUpIHtcbiAgICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICByZXR1cm4gYCR7U3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCAnMCcpfS4ke1N0cmluZyhkLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpfWA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkVG9CZXRzbGlwKG1hdGNoKSB7XG4gICAgICAgIGlmICghd2luZG93LmFkZEJldHNsaXBPdXRjb21lcykgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IG91dGNvbWUgPSB7XG4gICAgICAgICAgICBzZXJ2aWNlSWQ6IG1hdGNoLnNlcnZpY2VJZCxcbiAgICAgICAgICAgIGV2ZW50SWQ6IG1hdGNoLm1hdGNoSWQsXG4gICAgICAgICAgICBtYXJrZXRJZDogbWF0Y2gubWFya2V0SWQsXG4gICAgICAgICAgICBvdXRjb21lSWQ6IG1hdGNoLm91dGNvbWVJZFxuICAgICAgICB9O1xuICAgICAgICB3aW5kb3cuYWRkQmV0c2xpcE91dGNvbWVzKFtvdXRjb21lXSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRnJvbUJldHNsaXAobWF0Y2gpIHtcbiAgICAgICAgaWYgKCF3aW5kb3cucmVtb3ZlQmV0c2xpcEl0ZW1zKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgY29uc3Qgb3V0Y29tZUlkID0gbWF0Y2gub3V0Y29tZUlkO1xuICAgICAgICBjb25zdCByZXN1bHQgPSB3aW5kb3cucmVtb3ZlQmV0c2xpcEl0ZW1zKFtvdXRjb21lSWRdKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCZXRzbGlwSXRlbXMoKSB7XG4gICAgICAgIGlmICghd2luZG93LmdldEJldHNsaXBJdGVtcykgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG5cbiAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRCZXRzbGlwSXRlbXMoKVxuICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHJlc3VsdClcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiBbXSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgSW5pdFBhZ2UoKTtcbiAgICAgICAgaWYgKHdpbmRvdy5zdG9yZSkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSB3aW5kb3cuc3RvcmUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICAgIHVzZXJJZCA9IHN0YXRlLmF1dGguaXNBdXRob3JpemVkICYmIHN0YXRlLmF1dGguaWQgfHwgJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgYyA9IDA7XG4gICAgICAgICAgICBjb25zdCBpID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjIDwgNTAgJiYgISF3aW5kb3cuZ191c2VyX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IHdpbmRvdy5nX3VzZXJfaWQ7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrVXNlckF1dGgoKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrVXNlckF1dGgoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja1VzZXJBdXRoKCkge1xuICAgICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgICAgICB1bmF1dGhNc2dzLmZvckVhY2goZWwgPT4gZWwuY2xhc3NMaXN0LmFkZCgnaGlkZScpKTtcbiAgICAgICAgICAgIHN3aXRjaFdyYXAuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2hXcmFwLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuICAgICAgICAgICAgdW5hdXRoTXNncy5mb3JFYWNoKGVsID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0U2xpZGVyKCkge1xuICAgICAgICBsZXQgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICBsZXQgc3RhcnRYO1xuICAgICAgICBsZXQgc2Nyb2xsTGVmdDtcblxuICAgICAgICBjb25zdCBkcmFnZ2FibGVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJhZ2dhYmxlQ29udGFpbmVyJyk7XG4gICAgICAgIGNvbnN0IGl0ZW1zV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWxjb21lX19yb3ctd3JhcCcpO1xuICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VsY29tZV9fcm93Jyk7XG5cbiAgICAgICAgY29uc3Qgd2lkdGhzID0ge1xuICAgICAgICAgICAgNTogJzIwOThweCcsXG4gICAgICAgICAgICA0OiAnMTY2OHB4JyxcbiAgICAgICAgICAgIDM6ICcxMjU4cHgnLFxuICAgICAgICAgICAgMjogJzgyOHB4JyxcbiAgICAgICAgICAgIDE6ICc0MThweCcsXG4gICAgICAgICAgICBkZWZhdWx0OiAnMjA5OHB4J1xuICAgICAgICB9O1xuXG4gICAgICAgIHJvdy5zdHlsZS5tYXhXaWR0aCA9IHdpZHRoc1tpdGVtc1dyYXAubGVuZ3RoXSB8fCB3aWR0aHMuZGVmYXVsdDtcblxuICAgICAgICBkcmFnZ2FibGVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG4gICAgICAgICAgICBpc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHN0YXJ0WCA9IGUucGFnZVggLSBkcmFnZ2FibGVDb250YWluZXIub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIHNjcm9sbExlZnQgPSBkcmFnZ2FibGVDb250YWluZXIuc2Nyb2xsTGVmdDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZHJhZ2dhYmxlQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiBpc0RyYWdnaW5nID0gZmFsc2UpO1xuICAgICAgICBkcmFnZ2FibGVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IGlzRHJhZ2dpbmcgPSBmYWxzZSk7XG4gICAgICAgIGRyYWdnYWJsZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBlID0+IHtcbiAgICAgICAgICAgIGlmICghaXNEcmFnZ2luZykgcmV0dXJuO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgeCA9IGUucGFnZVggLSBkcmFnZ2FibGVDb250YWluZXIub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIGNvbnN0IHdhbGsgPSAoeCAtIHN0YXJ0WCkgKiAyO1xuICAgICAgICAgICAgZHJhZ2dhYmxlQ29udGFpbmVyLnNjcm9sbExlZnQgPSBzY3JvbGxMZWZ0IC0gd2FsaztcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQuY2xvc2VzdCgnLndlbGNvbWVfX2l0ZW0nKTtcbiAgICAgICAgaWYgKHRhcmdldCAmJiAhdXNlcklkKSB7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvbG9naW4nO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgbWFpblBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmF2X19wYWdlJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBtYWluUGFnZS5jbGFzc0xpc3QuYWRkKCdvdmVyZmxvdycpLCAxMDAwKTtcblxuICAgIGxvYWRUcmFuc2xhdGlvbnMoKS50aGVuKGluaXQpO1xufSkoKTtcbiIsIiJdfQ==
