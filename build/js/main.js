"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
(function () {
  var apiURL = 'https://fav-prom.com/api_forecast_poster';
  var unauthMsgs = document.querySelectorAll('.authBtn'),
    participateBtns = document.querySelectorAll('.predictBtn'),
    counterSpan = document.querySelector('.counter'),
    eventsSpan = document.querySelector('.events'),
    welcomeBet = document.querySelector('.welcome__bet');
  var ukLeng = document.querySelector('#ukLeng');
  var enLeng = document.querySelector('#enLeng');
  var locale = 'uk';
  if (ukLeng) locale = 'uk';
  if (enLeng) locale = 'en';
  var i18nData = {};
  var userId;
  var elementsByMatchiD = {};
  var allMatches = [];
  var favDataByMatch = {};
  userId = 103031597;
  function loadTranslations() {
    return fetch("".concat(apiURL, "/translates/").concat(locale)).then(function (res) {
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
    if (elems && elems.length) {
      elems.forEach(function (elem) {
        var key = elem.getAttribute('data-translate');
        elem.innerHTML = translateKey(key);
        elem.removeAttribute('data-translate');
      });
    }
    if (locale === 'en') {
      mainPage.classList.add('en');
    }
  }
  function translateKey(key, defaultValue) {
    if (!key) {
      return;
    }
    defaultValue = defaultValue || key;
    return i18nData[key] || defaultValue;
  }
  var request = function request(link, extraOptions) {
    return fetch(apiURL + link, _objectSpread({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }, extraOptions || {})).then(function (res) {
      return res.json();
    });
  };
  function initAddAllBtn() {
    var addAllBtn = document.querySelector('.predictBtn');
    addAllBtn.addEventListener('click', function () {
      if (!userId) {
        return;
      }
      getBetslipItems().then(function (betslipMatches) {
        var _iterator = _createForOfIteratorHelper(allMatches),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var match = _step.value;
            var matchDiv = elementsByMatchiD[match.matchId];
            addMatchToBetslip(match, matchDiv, betslipMatches);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
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
      console.log(matches);
      allMatches = (matches || []).sort(function (a, b) {
        return new Date(a.activeDate) - new Date(b.activeDate);
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
        matchDiv.innerHTML = "\n                <div class=\"welcome__item-close\"></div>\n                <div class=\"welcome__item-row\">\n                    <div class=\"welcome__item-title\">\n                        <img src=\"https://fav-prom.com/html/forecast-poster/img/welcome/fav.svg\" alt=\"FAVBET\">\n                        <span>".concat(translateKey(match.title), "</span>\n                    </div>\n                    <div class=\"welcome__item-date\">").concat(formatDate(match.matchDate), "</div>\n                </div>\n                <div class=\"welcome__item-max-title\">").concat(translateKey(match.team1), " \u2013 ").concat(translateKey(match.team2), "</div>\n                <div class=\"welcome__item-info\">\n                    <div class=\"welcome__item-bid\">").concat(translateKey(match.outcomeTranslation), "</div>\n                    <div class=\"welcome__item-cof\">").concat(match.defaultCoef || 0, "</div>\n                </div>\n            ");
        elementsByMatchiD[match.matchId] = matchDiv;
        rowWrap.appendChild(matchDiv);
        getMatchData(match).then(function (m) {
          if (m) {
            var cofDiv = matchDiv.querySelector('.welcome__item-cof');
            cofDiv.innerHTML = m.outcomeCoef;
          } else {
            console.log("No outcome data for ".concat(match.matchId));
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
  function addMatchToBetslip(match, matchDiv, betslipMatches, e) {
    if (e) {
      console.log('Target class list: ' + e.target.classList);
    }
    console.log(match);
    console.log(matchDiv);
    console.log(betslipMatches);
    if (!userId || betslipMatches.some(function (b) {
      return b.event_id == match.matchId || e && e.target.classList.contains('welcome__item-close');
    })) {
      return;
    }
    console.log(favDataByMatch);
    var favData = favDataByMatch[match.matchId];
    if (!favData || !favData.matchId) {
      console.log('No fav data for match id ' + match.matchId);
      return;
    }
    request('/events', {
      method: 'POST',
      body: JSON.stringify({
        userid: userId,
        eventId: match.matchId
      })
    }).then(function (response) {
      if (response.success) {
        console.log('Event created:', response.event);
        addToBetslip(favData);
        matchDiv.classList.add('_done');
        updateCounter(1);
      } else {
        console.error('Failed to create event:', response.error);
      }
    })["catch"](function (error) {
      console.error('Error creating event:', error);
    });
  }
  function removeMatchFromBetslip(match, matchDiv) {
    if (!userId) {
      return;
    }
    var favData = favDataByMatch[match.matchId];
    if (!favData || !favData.matchId) {
      console.log('No fav data for match id ' + match.matchId);
      return;
    }
    var isRemoved = removeFromBetslip(favData); // Directly assign result
    if (isRemoved) {
      matchDiv.classList.remove('_done');
      updateCounter(-1);
    }
  }
  function updateCounter(diff) {
    var currCounter = +counterSpan.innerHTML;
    setCounter(currCounter + diff);
  }
  function setCounter(value) {
    counterSpan.innerHTML = value;
    var lastDigit = value % 10;
    var translationKey;
    if (lastDigit === 1) {
      translationKey = 'event1';
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      translationKey = 'event2';
    } else {
      translationKey = 'event3';
    }
    var eventTranslation = translateKey(translationKey);
    eventsSpan.innerHTML = eventTranslation;
    if (value > 0) {
      welcomeBet.classList.remove('hide');
    } else {
      welcomeBet.classList.add('hide');
    }
  }
  function getMatchData(match) {
    var serviceId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (serviceId > 1) {
      console.log('No data for 0 and 1 service ids');
      return;
    }
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
      var coefData = favData.result.find(function (o) {
        return o.market_name === match.marketName && o.result_type_name === match.marketType;
      });
      if (coefData) {
        var outcome = coefData.outcomes.find(function (o) {
          return o.outcome_name == match.outcomeName;
        });
        if (!outcome) {
          return getMatchData(match, serviceId + 1);
        }
        return {
          outcomeId: outcome.outcome_id,
          outcomeCoef: outcome.outcome_coef,
          marketId: coefData.market_id,
          serviceId: serviceId,
          matchId: match.matchId
        };
      } else {
        return getMatchData(match, serviceId + 1);
      }
    }).then(function (m) {
      favDataByMatch[m.matchId] = m;
      return m;
    })["catch"](function (error) {
      console.log(error);
    });
  }
  function formatDate(date) {
    if (!date) {
      return;
    }
    var d = new Date(date);
    var day = String(d.getDate()).padStart(2, '0');
    var month = String(d.getMonth() + 1).padStart(2, '0');
    return "".concat(day, ".").concat(month);
  }
  function addToBetslip(match) {
    if (!window.addBetslipOutcomes) {
      console.log('No addBetslipOutcomes method is defined');
      return;
    }
    var outcome = {
      'serviceId': match.serviceId,
      'eventId': match.matchId,
      'marketId': match.marketId,
      'outcomeId': match.outcomeId
    };
    window.addBetslipOutcomes([outcome]);
  }
  function removeFromBetslip(match) {
    if (!window.removeBetslipItems) {
      console.log('Метод removeBetslipItems не знайдено');
      return false; // Значення за замовчуванням
    }
    var outcomeId = match.outcomeId; // Отримуємо тільки id

    // Викликаємо новий метод з масивом айді
    var result = window.removeBetslipItems([outcomeId]);
    if (result && result instanceof Promise) {
      result.then(function () {
        return console.log("\u0423\u0441\u043F\u0456\u0448\u043D\u043E \u0432\u0438\u0434\u0430\u043B\u0435\u043D\u043E outcomeId ".concat(outcomeId));
      })["catch"](function (err) {
        return console.error("\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u0432\u0438\u0434\u0430\u043B\u0435\u043D\u043D\u0456 outcomeId ".concat(outcomeId, ":"), err);
      });
    } else {
      console.log("\u041C\u0435\u0442\u043E\u0434 \u043F\u043E\u0432\u0435\u0440\u043D\u0443\u0432 ".concat(result, " \u0434\u043B\u044F outcomeId ").concat(outcomeId));
    }
    return result;
  }
  function getBetslipItems() {
    if (!window.getBetslipItems) {
      console.log('No getBetslipItems method is defined');
      return Promise.resolve([]);
    }
    return window.getBetslipItems().then(function (result) {
      console.log('Betslip items:', result);
      return result;
    })["catch"](function (error) {
      console.error('Error in getBetslipItems:', error);
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
        if (c < 50) {
          if (!!window.g_user_id) {
            userId = window.g_user_id;
            checkUserAuth();
            clearInterval(i);
          }
        } else {
          clearInterval(i);
        }
      }, 200);
    }
    checkUserAuth();
  }
  var checkUserAuth = function checkUserAuth() {
    if (userId) {
      var _iterator2 = _createForOfIteratorHelper(unauthMsgs),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var unauthMes = _step2.value;
          unauthMes.classList.add('hide');
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var addAllBtn = document.querySelector('.predictBtn');
      addAllBtn.classList.remove('hide');
      var container = document.querySelector('.welcome__row');
      container.classList.remove('hide');
    } else {
      var _iterator3 = _createForOfIteratorHelper(participateBtns),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var participateBtn = _step3.value;
          participateBtn.classList.add('hide');
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      var _iterator4 = _createForOfIteratorHelper(unauthMsgs),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _unauthMes = _step4.value;
          _unauthMes.classList.remove('hide');
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  };
  loadTranslations().then(init);
  var mainPage = document.querySelector('.fav__page');
  setTimeout(function () {
    return mainPage.classList.add('overflow');
  }, 1000);
  function initSlider() {
    var isDragging = false;
    var startX;
    var scrollLeft;
    var draggableContainer = document.getElementById('draggableContainer');
    var itemsWrap = document.querySelectorAll('.welcome__row-wrap');
    var row = document.querySelector('.welcome__row');
    var itemsWrapLength = itemsWrap.length;
    switch (itemsWrapLength) {
      case 5:
        row.style.maxWidth = '2098px';
        break;
      case 4:
        row.style.maxWidth = '1668px';
        break;
      case 3:
        row.style.maxWidth = '1258px';
        break;
      case 2:
        row.style.maxWidth = '828px';
        break;
      case 1:
        row.style.maxWidth = '418px';
        break;
      default:
        row.style.maxWidth = '2098px';
        break;
    }
    draggableContainer.addEventListener('mousedown', function (e) {
      isDragging = true;
      startX = e.pageX - draggableContainer.offsetLeft;
      scrollLeft = draggableContainer.scrollLeft;
    });
    draggableContainer.addEventListener('mouseleave', function () {
      isDragging = false;
    });
    draggableContainer.addEventListener('mouseup', function () {
      isDragging = false;
    });
    draggableContainer.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      e.preventDefault();
      var x = e.pageX - draggableContainer.offsetLeft;
      var walk = (x - startX) * 2; // Увеличьте множитель, чтобы изменить скорость прокрутки
      draggableContainer.scrollLeft = scrollLeft - walk;
    });
  }
})();
"use strict";
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzZWNvbmQuanMiXSwibmFtZXMiOlsiYXBpVVJMIiwidW5hdXRoTXNncyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInBhcnRpY2lwYXRlQnRucyIsImNvdW50ZXJTcGFuIiwicXVlcnlTZWxlY3RvciIsImV2ZW50c1NwYW4iLCJ3ZWxjb21lQmV0IiwidWtMZW5nIiwiZW5MZW5nIiwibG9jYWxlIiwiaTE4bkRhdGEiLCJ1c2VySWQiLCJlbGVtZW50c0J5TWF0Y2hpRCIsImFsbE1hdGNoZXMiLCJmYXZEYXRhQnlNYXRjaCIsImxvYWRUcmFuc2xhdGlvbnMiLCJmZXRjaCIsImNvbmNhdCIsInRoZW4iLCJyZXMiLCJqc29uIiwidHJhbnNsYXRlIiwibXV0YXRpb25PYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJvYnNlcnZlIiwiZ2V0RWxlbWVudEJ5SWQiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwiZWxlbXMiLCJsZW5ndGgiLCJmb3JFYWNoIiwiZWxlbSIsImtleSIsImdldEF0dHJpYnV0ZSIsImlubmVySFRNTCIsInRyYW5zbGF0ZUtleSIsInJlbW92ZUF0dHJpYnV0ZSIsIm1haW5QYWdlIiwiY2xhc3NMaXN0IiwiYWRkIiwiZGVmYXVsdFZhbHVlIiwicmVxdWVzdCIsImxpbmsiLCJleHRyYU9wdGlvbnMiLCJfb2JqZWN0U3ByZWFkIiwiaGVhZGVycyIsImluaXRBZGRBbGxCdG4iLCJhZGRBbGxCdG4iLCJhZGRFdmVudExpc3RlbmVyIiwiZ2V0QmV0c2xpcEl0ZW1zIiwiYmV0c2xpcE1hdGNoZXMiLCJfaXRlcmF0b3IiLCJfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlciIsIl9zdGVwIiwicyIsIm4iLCJkb25lIiwibWF0Y2giLCJ2YWx1ZSIsIm1hdGNoRGl2IiwibWF0Y2hJZCIsImFkZE1hdGNoVG9CZXRzbGlwIiwiZXJyIiwiZSIsImYiLCJjb25zb2xlIiwiZXJyb3IiLCJJbml0UGFnZSIsIm1hdGNoZXMiLCJsb2ciLCJzb3J0IiwiYSIsImIiLCJEYXRlIiwiYWN0aXZlRGF0ZSIsImluaXRNYXRjaGVzIiwiaW5pdFNsaWRlciIsImNvbnRhaW5lciIsImFkZGVkIiwiaSIsInJvd1dyYXAiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiX2xvb3AiLCJqIiwic29tZSIsImV2ZW50X2lkIiwidGl0bGUiLCJmb3JtYXREYXRlIiwibWF0Y2hEYXRlIiwidGVhbTEiLCJ0ZWFtMiIsIm91dGNvbWVUcmFuc2xhdGlvbiIsImRlZmF1bHRDb2VmIiwiYXBwZW5kQ2hpbGQiLCJnZXRNYXRjaERhdGEiLCJtIiwiY29mRGl2Iiwib3V0Y29tZUNvZWYiLCJjbG9zZUJ0biIsInN0b3BQcm9wYWdhdGlvbiIsInJlbW92ZU1hdGNoRnJvbUJldHNsaXAiLCJzZXRDb3VudGVyIiwidGFyZ2V0IiwiY29udGFpbnMiLCJmYXZEYXRhIiwibWV0aG9kIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ1c2VyaWQiLCJldmVudElkIiwicmVzcG9uc2UiLCJzdWNjZXNzIiwiZXZlbnQiLCJhZGRUb0JldHNsaXAiLCJ1cGRhdGVDb3VudGVyIiwiaXNSZW1vdmVkIiwicmVtb3ZlRnJvbUJldHNsaXAiLCJyZW1vdmUiLCJkaWZmIiwiY3VyckNvdW50ZXIiLCJsYXN0RGlnaXQiLCJ0cmFuc2xhdGlvbktleSIsImV2ZW50VHJhbnNsYXRpb24iLCJzZXJ2aWNlSWQiLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJjb2VmRGF0YSIsInJlc3VsdCIsImZpbmQiLCJvIiwibWFya2V0X25hbWUiLCJtYXJrZXROYW1lIiwicmVzdWx0X3R5cGVfbmFtZSIsIm1hcmtldFR5cGUiLCJvdXRjb21lIiwib3V0Y29tZXMiLCJvdXRjb21lX25hbWUiLCJvdXRjb21lTmFtZSIsIm91dGNvbWVJZCIsIm91dGNvbWVfaWQiLCJvdXRjb21lX2NvZWYiLCJtYXJrZXRJZCIsIm1hcmtldF9pZCIsImRhdGUiLCJkIiwiZGF5IiwiU3RyaW5nIiwiZ2V0RGF0ZSIsInBhZFN0YXJ0IiwibW9udGgiLCJnZXRNb250aCIsIndpbmRvdyIsImFkZEJldHNsaXBPdXRjb21lcyIsInJlbW92ZUJldHNsaXBJdGVtcyIsIlByb21pc2UiLCJyZXNvbHZlIiwiaW5pdCIsInN0b3JlIiwic3RhdGUiLCJnZXRTdGF0ZSIsImF1dGgiLCJpc0F1dGhvcml6ZWQiLCJpZCIsImMiLCJzZXRJbnRlcnZhbCIsImdfdXNlcl9pZCIsImNoZWNrVXNlckF1dGgiLCJjbGVhckludGVydmFsIiwiX2l0ZXJhdG9yMiIsIl9zdGVwMiIsInVuYXV0aE1lcyIsIl9pdGVyYXRvcjMiLCJfc3RlcDMiLCJwYXJ0aWNpcGF0ZUJ0biIsIl9pdGVyYXRvcjQiLCJfc3RlcDQiLCJzZXRUaW1lb3V0IiwiaXNEcmFnZ2luZyIsInN0YXJ0WCIsInNjcm9sbExlZnQiLCJkcmFnZ2FibGVDb250YWluZXIiLCJpdGVtc1dyYXAiLCJyb3ciLCJpdGVtc1dyYXBMZW5ndGgiLCJzdHlsZSIsIm1heFdpZHRoIiwicGFnZVgiLCJvZmZzZXRMZWZ0IiwicHJldmVudERlZmF1bHQiLCJ4Iiwid2FsayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxDQUFDLFlBQVk7RUFDVCxJQUFNQSxNQUFNLEdBQUcsMENBQTBDO0VBRXpELElBQ0lDLFVBQVUsR0FBR0MsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7SUFDbERDLGVBQWUsR0FBR0YsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7SUFDMURFLFdBQVcsR0FBR0gsUUFBUSxDQUFDSSxhQUFhLENBQUMsVUFBVSxDQUFDO0lBQ2hEQyxVQUFVLEdBQUdMLFFBQVEsQ0FBQ0ksYUFBYSxDQUFDLFNBQVMsQ0FBQztJQUM5Q0UsVUFBVSxHQUFHTixRQUFRLENBQUNJLGFBQWEsQ0FBQyxlQUFlLENBQUM7RUFFeEQsSUFBTUcsTUFBTSxHQUFHUCxRQUFRLENBQUNJLGFBQWEsQ0FBQyxTQUFTLENBQUM7RUFDaEQsSUFBTUksTUFBTSxHQUFHUixRQUFRLENBQUNJ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OlsiKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBhcGlVUkwgPSAnaHR0cHM6Ly9mYXYtcHJvbS5jb20vYXBpX2ZvcmVjYXN0X3Bvc3Rlcic7XG5cbiAgICBjb25zdFxuICAgICAgICB1bmF1dGhNc2dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmF1dGhCdG4nKSxcbiAgICAgICAgcGFydGljaXBhdGVCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnByZWRpY3RCdG4nKSxcbiAgICAgICAgY291bnRlclNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY291bnRlcicpLFxuICAgICAgICBldmVudHNTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmV2ZW50cycpLFxuICAgICAgICB3ZWxjb21lQmV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX2JldCcpO1xuXG4gICAgY29uc3QgdWtMZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VrTGVuZycpO1xuICAgIGNvbnN0IGVuTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlbkxlbmcnKTtcblxuICAgIGxldCBsb2NhbGUgPSAndWsnO1xuXG4gICAgaWYgKHVrTGVuZykgbG9jYWxlID0gJ3VrJztcbiAgICBpZiAoZW5MZW5nKSBsb2NhbGUgPSAnZW4nO1xuXG4gICAgbGV0IGkxOG5EYXRhID0ge307XG4gICAgbGV0IHVzZXJJZDtcbiAgICBsZXQgZWxlbWVudHNCeU1hdGNoaUQgPSB7fTtcbiAgICBsZXQgYWxsTWF0Y2hlcyA9IFtdO1xuICAgIGxldCBmYXZEYXRhQnlNYXRjaCA9IHt9O1xuICAgIHVzZXJJZCA9IDEwMzAzMTU5NztcblxuICAgIGZ1bmN0aW9uIGxvYWRUcmFuc2xhdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChgJHthcGlVUkx9L3RyYW5zbGF0ZXMvJHtsb2NhbGV9YCkudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgIC50aGVuKGpzb24gPT4ge1xuICAgICAgICAgICAgICAgIGkxOG5EYXRhID0ganNvbjtcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGUoKTtcblxuICAgICAgICAgICAgICAgIHZhciBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBtdXRhdGlvbk9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZvcmVjYXN0UG9zdGVyJyksIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cmFuc2xhdGUoKSB7XG4gICAgICAgIGNvbnN0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdHJhbnNsYXRlXScpXG4gICAgICAgIGlmIChlbGVtcyAmJiBlbGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGVsZW1zLmZvckVhY2goZWxlbSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRlJyk7XG4gICAgICAgICAgICAgICAgZWxlbS5pbm5lckhUTUwgPSB0cmFuc2xhdGVLZXkoa2V5KTtcbiAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGUnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gJ2VuJykge1xuICAgICAgICAgICAgbWFpblBhZ2UuY2xhc3NMaXN0LmFkZCgnZW4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZUtleShrZXksIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHRWYWx1ZSA9IGRlZmF1bHRWYWx1ZSB8fCBrZXk7XG4gICAgICAgIHJldHVybiBpMThuRGF0YVtrZXldIHx8IGRlZmF1bHRWYWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gZnVuY3Rpb24gKGxpbmssIGV4dHJhT3B0aW9ucykge1xuICAgICAgICByZXR1cm4gZmV0Y2goYXBpVVJMICsgbGluaywge1xuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC4uLihleHRyYU9wdGlvbnMgfHwge30pXG4gICAgICAgIH0pLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdEFkZEFsbEJ0bigpIHtcbiAgICAgICAgY29uc3QgYWRkQWxsQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByZWRpY3RCdG4nKTtcbiAgICAgICAgYWRkQWxsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGdldEJldHNsaXBJdGVtcygpLnRoZW4oYmV0c2xpcE1hdGNoZXMgPT4ge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbWF0Y2ggb2YgYWxsTWF0Y2hlcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaERpdiA9IGVsZW1lbnRzQnlNYXRjaGlEW21hdGNoLm1hdGNoSWRdO1xuICAgICAgICAgICAgICAgICAgICBhZGRNYXRjaFRvQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYsIGJldHNsaXBNYXRjaGVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcignRXJyb3IgZ2V0dGluZyBiZXRzbGlwIGl0ZW1zOicsIGVycikpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBJbml0UGFnZSA9ICgpID0+IHtcbiAgICAgICAgdHJhbnNsYXRlKCk7XG4gICAgICAgIGluaXRBZGRBbGxCdG4oKTtcbiAgICAgICAgcmVxdWVzdCgnL21hdGNoZXMnKS50aGVuKG1hdGNoZXMgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2cobWF0Y2hlcyk7XG4gICAgICAgICAgICBhbGxNYXRjaGVzID0gKG1hdGNoZXMgfHwgW10pLnNvcnQoKGEsIGIpID0+IG5ldyBEYXRlKGEuYWN0aXZlRGF0ZSkgLSBuZXcgRGF0ZShiLmFjdGl2ZURhdGUpKTtcblxuICAgICAgICAgICAgZ2V0QmV0c2xpcEl0ZW1zKCkudGhlbihiZXRzbGlwTWF0Y2hlcyA9PiB7XG4gICAgICAgICAgICAgICAgaW5pdE1hdGNoZXMoYWxsTWF0Y2hlcywgYmV0c2xpcE1hdGNoZXMpO1xuICAgICAgICAgICAgICAgIGluaXRTbGlkZXIoKTtcbiAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKCdFcnJvciBnZXR0aW5nIGJldHNsaXAgaXRlbXM6JywgZXJyKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRNYXRjaGVzKG1hdGNoZXMsIGJldHNsaXBNYXRjaGVzKSB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWxjb21lX19yb3cnKTtcbiAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgICAgIGxldCBhZGRlZCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Y2hlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICAgICAgY29uc3Qgcm93V3JhcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgcm93V3JhcC5jbGFzc05hbWUgPSAnd2VsY29tZV9fcm93LXdyYXAnO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gaTsgaiA8IGkgKyAyICYmIGogPCBtYXRjaGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBtYXRjaGVzW2pdO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgbWF0Y2hEaXYuY2xhc3NOYW1lID0gJ3dlbGNvbWVfX2l0ZW0nO1xuICAgICAgICAgICAgICAgIG1hdGNoLm1hdGNoSWQgPSAoK21hdGNoLm1hdGNoSWQpO1xuICAgICAgICAgICAgICAgIGlmIChiZXRzbGlwTWF0Y2hlcy5zb21lKGIgPT4gYi5ldmVudF9pZCA9PSBtYXRjaC5tYXRjaElkKSkge1xuICAgICAgICAgICAgICAgICAgICBhZGRlZCsrO1xuICAgICAgICAgICAgICAgICAgICBtYXRjaERpdi5jbGFzc0xpc3QuYWRkKCdfZG9uZScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG1hdGNoRGl2LmlubmVySFRNTCA9IGBcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1jbG9zZVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS10aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCJodHRwczovL2Zhdi1wcm9tLmNvbS9odG1sL2ZvcmVjYXN0LXBvc3Rlci9pbWcvd2VsY29tZS9mYXYuc3ZnXCIgYWx0PVwiRkFWQkVUXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj4ke3RyYW5zbGF0ZUtleShtYXRjaC50aXRsZSl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tZGF0ZVwiPiR7Zm9ybWF0RGF0ZShtYXRjaC5tYXRjaERhdGUpfTwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLW1heC10aXRsZVwiPiR7dHJhbnNsYXRlS2V5KG1hdGNoLnRlYW0xKX0g4oCTICR7dHJhbnNsYXRlS2V5KG1hdGNoLnRlYW0yKX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1pbmZvXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLWJpZFwiPiR7dHJhbnNsYXRlS2V5KG1hdGNoLm91dGNvbWVUcmFuc2xhdGlvbil9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLWNvZlwiPiR7bWF0Y2guZGVmYXVsdENvZWYgfHwgMH08L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIGA7XG5cbiAgICAgICAgICAgICAgICBlbGVtZW50c0J5TWF0Y2hpRFttYXRjaC5tYXRjaElkXSA9IG1hdGNoRGl2O1xuICAgICAgICAgICAgICAgIHJvd1dyYXAuYXBwZW5kQ2hpbGQobWF0Y2hEaXYpO1xuXG4gICAgICAgICAgICAgICAgZ2V0TWF0Y2hEYXRhKG1hdGNoKS50aGVuKG0gPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29mRGl2ID0gbWF0Y2hEaXYucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX2l0ZW0tY29mJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2ZEaXYuaW5uZXJIVE1MID0gbS5vdXRjb21lQ29lZjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBObyBvdXRjb21lIGRhdGEgZm9yICR7bWF0Y2gubWF0Y2hJZH1gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgbWF0Y2hEaXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gYWRkTWF0Y2hUb0JldHNsaXAobWF0Y2gsIG1hdGNoRGl2LCBiZXRzbGlwTWF0Y2hlcywgZSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNsb3NlQnRuID0gbWF0Y2hEaXYucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX2l0ZW0tY2xvc2UnKTtcbiAgICAgICAgICAgICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZU1hdGNoRnJvbUJldHNsaXAobWF0Y2gsIG1hdGNoRGl2KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChyb3dXcmFwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldENvdW50ZXIoYWRkZWQpO1xuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZE1hdGNoVG9CZXRzbGlwKG1hdGNoLCBtYXRjaERpdiwgYmV0c2xpcE1hdGNoZXMsIGUpIHtcbiAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdUYXJnZXQgY2xhc3MgbGlzdDogJyArIGUudGFyZ2V0LmNsYXNzTGlzdCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2cobWF0Y2gpO1xuICAgICAgICBjb25zb2xlLmxvZyhtYXRjaERpdik7XG4gICAgICAgIGNvbnNvbGUubG9nKGJldHNsaXBNYXRjaGVzKTtcbiAgICAgICAgaWYgKCF1c2VySWQgfHwgYmV0c2xpcE1hdGNoZXMuc29tZShiID0+IGIuZXZlbnRfaWQgPT0gbWF0Y2gubWF0Y2hJZCB8fCAoZSAmJiBlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3dlbGNvbWVfX2l0ZW0tY2xvc2UnKSkpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhmYXZEYXRhQnlNYXRjaCk7XG5cbiAgICAgICAgY29uc3QgZmF2RGF0YSA9IGZhdkRhdGFCeU1hdGNoW21hdGNoLm1hdGNoSWRdO1xuICAgICAgICBpZiAoIWZhdkRhdGEgfHwgIWZhdkRhdGEubWF0Y2hJZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIGZhdiBkYXRhIGZvciBtYXRjaCBpZCAnICsgbWF0Y2gubWF0Y2hJZCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0KCcvZXZlbnRzJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdXNlcmlkOiB1c2VySWQsXG4gICAgICAgICAgICAgICAgZXZlbnRJZDogbWF0Y2gubWF0Y2hJZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFdmVudCBjcmVhdGVkOicsIHJlc3BvbnNlLmV2ZW50KTtcbiAgICAgICAgICAgICAgICBhZGRUb0JldHNsaXAoZmF2RGF0YSk7XG4gICAgICAgICAgICAgICAgbWF0Y2hEaXYuY2xhc3NMaXN0LmFkZCgnX2RvbmUnKTtcbiAgICAgICAgICAgICAgICB1cGRhdGVDb3VudGVyKDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIGV2ZW50OicsIHJlc3BvbnNlLmVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgY3JlYXRpbmcgZXZlbnQ6JywgZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIHJlbW92ZU1hdGNoRnJvbUJldHNsaXAobWF0Y2gsIG1hdGNoRGl2KSB7XG4gICAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmYXZEYXRhID0gZmF2RGF0YUJ5TWF0Y2hbbWF0Y2gubWF0Y2hJZF07XG4gICAgICAgIGlmICghZmF2RGF0YSB8fCAhZmF2RGF0YS5tYXRjaElkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTm8gZmF2IGRhdGEgZm9yIG1hdGNoIGlkICcgKyBtYXRjaC5tYXRjaElkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzUmVtb3ZlZCA9IHJlbW92ZUZyb21CZXRzbGlwKGZhdkRhdGEpOyAvLyBEaXJlY3RseSBhc3NpZ24gcmVzdWx0XG4gICAgICAgIGlmIChpc1JlbW92ZWQpIHtcbiAgICAgICAgICAgIG1hdGNoRGl2LmNsYXNzTGlzdC5yZW1vdmUoJ19kb25lJyk7XG4gICAgICAgICAgICB1cGRhdGVDb3VudGVyKC0xKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNvdW50ZXIoZGlmZikge1xuICAgICAgICBjb25zdCBjdXJyQ291bnRlciA9ICtjb3VudGVyU3Bhbi5pbm5lckhUTUw7XG4gICAgICAgIHNldENvdW50ZXIoY3VyckNvdW50ZXIgKyBkaWZmKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRDb3VudGVyKHZhbHVlKSB7XG4gICAgICAgIGNvdW50ZXJTcGFuLmlubmVySFRNTCA9IHZhbHVlO1xuXG4gICAgICAgIGNvbnN0IGxhc3REaWdpdCA9IHZhbHVlICUgMTA7XG4gICAgICAgIGxldCB0cmFuc2xhdGlvbktleTtcbiAgICAgICAgaWYgKGxhc3REaWdpdCA9PT0gMSkge1xuICAgICAgICAgICAgdHJhbnNsYXRpb25LZXkgPSAnZXZlbnQxJztcbiAgICAgICAgfSBlbHNlIGlmIChsYXN0RGlnaXQgPj0gMiAmJiBsYXN0RGlnaXQgPD0gNCkge1xuICAgICAgICAgICAgdHJhbnNsYXRpb25LZXkgPSAnZXZlbnQyJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyYW5zbGF0aW9uS2V5ID0gJ2V2ZW50Myc7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBldmVudFRyYW5zbGF0aW9uID0gdHJhbnNsYXRlS2V5KHRyYW5zbGF0aW9uS2V5KTtcbiAgICAgICAgZXZlbnRzU3Bhbi5pbm5lckhUTUwgPSBldmVudFRyYW5zbGF0aW9uO1xuXG4gICAgICAgIGlmICh2YWx1ZSA+IDApIHtcbiAgICAgICAgICAgIHdlbGNvbWVCZXQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2VsY29tZUJldC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRNYXRjaERhdGEobWF0Y2gsIHNlcnZpY2VJZD0wKSB7XG4gICAgICAgIGlmIChzZXJ2aWNlSWQgPiAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTm8gZGF0YSBmb3IgMCBhbmQgMSBzZXJ2aWNlIGlkcycpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmV0Y2goJy9zZXJ2aWNlL2xpbmVvdXQvZnJvbnRlbmRfYXBpMi8nLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICBcImpzb25ycGNcIjogXCIyLjBcIixcbiAgICAgICAgICAgICAgICBcImlkXCI6IDE2LFxuICAgICAgICAgICAgICAgIFwibWV0aG9kXCI6IFwiZnJvbnRlbmQvbWFya2V0L2dldFwiLFxuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJieVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhbmdcIjogJ3VrJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VydmljZV9pZFwiOiBzZXJ2aWNlSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImV2ZW50X2lkXCI6IG1hdGNoLm1hdGNoSWRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgIC50aGVuKGZhdkRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvZWZEYXRhID0gZmF2RGF0YS5yZXN1bHQuZmluZChvID0+IG8ubWFya2V0X25hbWUgPT09IG1hdGNoLm1hcmtldE5hbWUgJiYgby5yZXN1bHRfdHlwZV9uYW1lID09PSBtYXRjaC5tYXJrZXRUeXBlKTtcbiAgICAgICAgICAgICAgICBpZiAoY29lZkRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0Y29tZSA9IGNvZWZEYXRhLm91dGNvbWVzLmZpbmQobyA9PiBvLm91dGNvbWVfbmFtZSA9PSBtYXRjaC5vdXRjb21lTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghb3V0Y29tZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldE1hdGNoRGF0YShtYXRjaCwgc2VydmljZUlkICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGNvbWVJZDogb3V0Y29tZS5vdXRjb21lX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0Y29tZUNvZWY6IG91dGNvbWUub3V0Y29tZV9jb2VmLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2V0SWQ6IGNvZWZEYXRhLm1hcmtldF9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2VJZDogc2VydmljZUlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hJZDogbWF0Y2gubWF0Y2hJZCxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0TWF0Y2hEYXRhKG1hdGNoLCBzZXJ2aWNlSWQgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4obSA9PiB7XG4gICAgICAgICAgICAgICAgZmF2RGF0YUJ5TWF0Y2hbbS5tYXRjaElkXSA9IG07XG4gICAgICAgICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXREYXRlKGRhdGUpIHtcbiAgICAgICAgaWYgKCFkYXRlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICBjb25zdCBkYXkgPSBTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gU3RyaW5nKGQuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICAgIHJldHVybiBgJHtkYXl9LiR7bW9udGh9YDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRUb0JldHNsaXAobWF0Y2gpIHtcbiAgICAgICAgaWYgKCF3aW5kb3cuYWRkQmV0c2xpcE91dGNvbWVzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTm8gYWRkQmV0c2xpcE91dGNvbWVzIG1ldGhvZCBpcyBkZWZpbmVkJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3V0Y29tZSA9IHtcbiAgICAgICAgICAgICdzZXJ2aWNlSWQnOiBtYXRjaC5zZXJ2aWNlSWQsXG4gICAgICAgICAgICAnZXZlbnRJZCc6IG1hdGNoLm1hdGNoSWQsXG4gICAgICAgICAgICAnbWFya2V0SWQnOiBtYXRjaC5tYXJrZXRJZCxcbiAgICAgICAgICAgICdvdXRjb21lSWQnOiBtYXRjaC5vdXRjb21lSWRcbiAgICAgICAgfTtcbiAgICAgICAgd2luZG93LmFkZEJldHNsaXBPdXRjb21lcyhbb3V0Y29tZV0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUZyb21CZXRzbGlwKG1hdGNoKSB7XG4gICAgICAgIGlmICghd2luZG93LnJlbW92ZUJldHNsaXBJdGVtcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cc0LXRgtC+0LQgcmVtb3ZlQmV0c2xpcEl0ZW1zINC90LUg0LfQvdCw0LnQtNC10L3QvicpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyDQl9C90LDRh9C10L3QvdGPINC30LAg0LfQsNC80L7QstGH0YPQstCw0L3QvdGP0LxcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG91dGNvbWVJZCA9IG1hdGNoLm91dGNvbWVJZDsgLy8g0J7RgtGA0LjQvNGD0ZTQvNC+INGC0ZbQu9GM0LrQuCBpZFxuXG4gICAgICAgIC8vINCS0LjQutC70LjQutCw0ZTQvNC+INC90L7QstC40Lkg0LzQtdGC0L7QtCDQtyDQvNCw0YHQuNCy0L7QvCDQsNC50LTRllxuICAgICAgICBjb25zdCByZXN1bHQgPSB3aW5kb3cucmVtb3ZlQmV0c2xpcEl0ZW1zKFtvdXRjb21lSWRdKTtcblxuICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIHJlc3VsdFxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IGNvbnNvbGUubG9nKGDQo9GB0L/RltGI0L3QviDQstC40LTQsNC70LXQvdC+IG91dGNvbWVJZCAke291dGNvbWVJZH1gKSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoYNCf0L7QvNC40LvQutCwINC/0YDQuCDQstC40LTQsNC70LXQvdC90ZYgb3V0Y29tZUlkICR7b3V0Y29tZUlkfTpgLCBlcnIpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQnNC10YLQvtC0INC/0L7QstC10YDQvdGD0LIgJHtyZXN1bHR9INC00LvRjyBvdXRjb21lSWQgJHtvdXRjb21lSWR9YCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEJldHNsaXBJdGVtcygpIHtcbiAgICAgICAgaWYgKCF3aW5kb3cuZ2V0QmV0c2xpcEl0ZW1zKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTm8gZ2V0QmV0c2xpcEl0ZW1zIG1ldGhvZCBpcyBkZWZpbmVkJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2V0QmV0c2xpcEl0ZW1zKClcbiAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0JldHNsaXAgaXRlbXM6JywgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgaW4gZ2V0QmV0c2xpcEl0ZW1zOicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICBJbml0UGFnZSgpO1xuXG4gICAgICAgIGlmICh3aW5kb3cuc3RvcmUpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IHdpbmRvdy5zdG9yZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgICAgdXNlcklkID0gc3RhdGUuYXV0aC5pc0F1dGhvcml6ZWQgJiYgc3RhdGUuYXV0aC5pZCB8fCAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBjID0gMDtcbiAgICAgICAgICAgIHZhciBpID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChjIDwgNTApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEhd2luZG93LmdfdXNlcl9pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkID0gd2luZG93LmdfdXNlcl9pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrVXNlckF1dGgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja1VzZXJBdXRoKCk7XG4gICAgfVxuXG4gICAgbGV0IGNoZWNrVXNlckF1dGggPSAoKSA9PiB7XG4gICAgICAgIGlmICh1c2VySWQpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdW5hdXRoTWVzIG9mIHVuYXV0aE1zZ3MpIHtcbiAgICAgICAgICAgICAgICB1bmF1dGhNZXMuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYWRkQWxsQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByZWRpY3RCdG4nKTtcbiAgICAgICAgICAgIGFkZEFsbEJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VsY29tZV9fcm93Jyk7XG4gICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgcGFydGljaXBhdGVCdG4gb2YgcGFydGljaXBhdGVCdG5zKSB7XG4gICAgICAgICAgICAgICAgcGFydGljaXBhdGVCdG4uY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChjb25zdCB1bmF1dGhNZXMgb2YgdW5hdXRoTXNncykge1xuICAgICAgICAgICAgICAgIHVuYXV0aE1lcy5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2FkVHJhbnNsYXRpb25zKClcbiAgICAgICAgLnRoZW4oaW5pdCk7XG5cbiAgICBsZXQgbWFpblBhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmF2X19wYWdlJyk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBtYWluUGFnZS5jbGFzc0xpc3QuYWRkKCdvdmVyZmxvdycpLCAxMDAwKTtcblxuICAgIGZ1bmN0aW9uIGluaXRTbGlkZXIoKSB7XG4gICAgICAgIGxldCBpc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgIGxldCBzdGFydFg7XG4gICAgICAgIGxldCBzY3JvbGxMZWZ0O1xuXG4gICAgICAgIGNvbnN0IGRyYWdnYWJsZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcmFnZ2FibGVDb250YWluZXInKTtcbiAgICAgICAgY29uc3QgaXRlbXNXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndlbGNvbWVfX3Jvdy13cmFwJylcbiAgICAgICAgY29uc3Qgcm93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX3JvdycpXG4gICAgICAgIGNvbnN0IGl0ZW1zV3JhcExlbmd0aCA9IGl0ZW1zV3JhcC5sZW5ndGg7XG5cbiAgICAgICAgc3dpdGNoIChpdGVtc1dyYXBMZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICByb3cuc3R5bGUubWF4V2lkdGggPSAnMjA5OHB4JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICByb3cuc3R5bGUubWF4V2lkdGggPSAnMTY2OHB4JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICByb3cuc3R5bGUubWF4V2lkdGggPSAnMTI1OHB4JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByb3cuc3R5bGUubWF4V2lkdGggPSAnODI4cHgnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJvdy5zdHlsZS5tYXhXaWR0aCA9ICc0MThweCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJvdy5zdHlsZS5tYXhXaWR0aCA9ICcyMDk4cHgnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgZHJhZ2dhYmxlQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIChlKSA9PiB7XG4gICAgICAgICAgICBpc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHN0YXJ0WCA9IGUucGFnZVggLSBkcmFnZ2FibGVDb250YWluZXIub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIHNjcm9sbExlZnQgPSBkcmFnZ2FibGVDb250YWluZXIuc2Nyb2xsTGVmdDtcblxuICAgICAgICB9KTtcblxuICAgICAgICBkcmFnZ2FibGVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgICAgIGlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZHJhZ2dhYmxlQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoKSA9PiB7XG4gICAgICAgICAgICBpc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRyYWdnYWJsZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFpc0RyYWdnaW5nKSByZXR1cm47XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb25zdCB4ID0gZS5wYWdlWCAtIGRyYWdnYWJsZUNvbnRhaW5lci5vZmZzZXRMZWZ0O1xuICAgICAgICAgICAgY29uc3Qgd2FsayA9ICh4IC0gc3RhcnRYKSAqIDI7IC8vINCj0LLQtdC70LjRh9GM0YLQtSDQvNC90L7QttC40YLQtdC70YwsINGH0YLQvtCx0Ysg0LjQt9C80LXQvdC40YLRjCDRgdC60L7RgNC+0YHRgtGMINC/0YDQvtC60YDRg9GC0LrQuFxuICAgICAgICAgICAgZHJhZ2dhYmxlQ29udGFpbmVyLnNjcm9sbExlZnQgPSBzY3JvbGxMZWZ0IC0gd2FsaztcbiAgICAgICAgfSk7XG4gICAgfVxufSkoKTtcbiIsIiJdfQ==
