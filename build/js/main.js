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
(function (_sessionStorage$getIt) {
  var apiURL = 'https://fav-prom.com/api_forecast_poster';
  var unauthMsgs = document.querySelectorAll('.authBtn'),
    participateBtns = document.querySelectorAll('.predictBtn'),
    counterSpan = document.querySelector('.counter'),
    eventsSpan = document.querySelector('.events'),
    welcomeBet = document.querySelector('.welcome__bet');
  var ukLeng = document.querySelector('#ukLeng');
  var enLeng = document.querySelector('#enLeng');
  var locale = (_sessionStorage$getIt = sessionStorage.getItem("locale")) !== null && _sessionStorage$getIt !== void 0 ? _sessionStorage$getIt : 'uk';
  if (ukLeng) locale = 'uk';
  if (enLeng) locale = 'en';
  var i18nData = {};
  var userId;
  var elementsByMatchiD = {};
  var allMatches = [];
  var favDataByMatch = {};
  userId = 103031597;
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

        // getMatchData(match).then(m => {
        //     if (m) {
        //         const cofDiv = matchDiv.querySelector('.welcome__item-cof');
        //         cofDiv.innerHTML = m.outcomeCoef;
        //     } else {
        //         console.log(`No outcome data for ${match.matchId}`);
        //     }
        // });

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
    console.log('FAV DATA BY MATCH', favDataByMatch);
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
      console.log(m);
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

  // test
  var switchBtn = document.querySelector(".welcome__switch-btn");
  switchBtn.addEventListener("click", function () {
    switchBtn.classList.toggle("active");
  });
  document.querySelector(".dark-btn").addEventListener("click", function () {
    document.body.classList.toggle("dark");
  });
  document.querySelector(".lng-btn").addEventListener("click", function () {
    locale = locale === 'uk' ? 'en' : 'uk';
    sessionStorage.setItem("locale", locale);
    window.location.reload();
  });
})();
"use strict";
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzZWNvbmQuanMiXSwibmFtZXMiOlsiX3Nlc3Npb25TdG9yYWdlJGdldEl0IiwiYXBpVVJMIiwidW5hdXRoTXNncyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInBhcnRpY2lwYXRlQnRucyIsImNvdW50ZXJTcGFuIiwicXVlcnlTZWxlY3RvciIsImV2ZW50c1NwYW4iLCJ3ZWxjb21lQmV0IiwidWtMZW5nIiwiZW5MZW5nIiwibG9jYWxlIiwic2Vzc2lvblN0b3JhZ2UiLCJnZXRJdGVtIiwiaTE4bkRhdGEiLCJ1c2VySWQiLCJlbGVtZW50c0J5TWF0Y2hpRCIsImFsbE1hdGNoZXMiLCJmYXZEYXRhQnlNYXRjaCIsImxvYWRUcmFuc2xhdGlvbnMiLCJmZXRjaCIsImNvbmNhdCIsInRoZW4iLCJyZXMiLCJqc29uIiwidHJhbnNsYXRlIiwibXV0YXRpb25PYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnMiLCJvYnNlcnZlIiwiZ2V0RWxlbWVudEJ5SWQiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwiZWxlbXMiLCJsZW5ndGgiLCJmb3JFYWNoIiwiZWxlbSIsImtleSIsImdldEF0dHJpYnV0ZSIsImlubmVySFRNTCIsInRyYW5zbGF0ZUtleSIsInJlbW92ZUF0dHJpYnV0ZSIsIm1haW5QYWdlIiwiY2xhc3NMaXN0IiwiYWRkIiwiZGVmYXVsdFZhbHVlIiwicmVxdWVzdCIsImxpbmsiLCJleHRyYU9wdGlvbnMiLCJfb2JqZWN0U3ByZWFkIiwiaGVhZGVycyIsImluaXRBZGRBbGxCdG4iLCJhZGRBbGxCdG4iLCJhZGRFdmVudExpc3RlbmVyIiwiZ2V0QmV0c2xpcEl0ZW1zIiwiYmV0c2xpcE1hdGNoZXMiLCJfaXRlcmF0b3IiLCJfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlciIsIl9zdGVwIiwicyIsIm4iLCJkb25lIiwibWF0Y2giLCJ2YWx1ZSIsIm1hdGNoRGl2IiwibWF0Y2hJZCIsImFkZE1hdGNoVG9CZXRzbGlwIiwiZXJyIiwiZSIsImYiLCJjb25zb2xlIiwiZXJyb3IiLCJJbml0UGFnZSIsIm1hdGNoZXMiLCJsb2ciLCJzb3J0IiwiYSIsImIiLCJEYXRlIiwiYWN0aXZlRGF0ZSIsImluaXRNYXRjaGVzIiwiaW5pdFNsaWRlciIsImNvbnRhaW5lciIsImFkZGVkIiwiaSIsInJvd1dyYXAiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiX2xvb3AiLCJqIiwic29tZSIsImV2ZW50X2lkIiwidGl0bGUiLCJmb3JtYXREYXRlIiwibWF0Y2hEYXRlIiwidGVhbTEiLCJ0ZWFtMiIsIm91dGNvbWVUcmFuc2xhdGlvbiIsImRlZmF1bHRDb2VmIiwiYXBwZW5kQ2hpbGQiLCJjbG9zZUJ0biIsInN0b3BQcm9wYWdhdGlvbiIsInJlbW92ZU1hdGNoRnJvbUJldHNsaXAiLCJzZXRDb3VudGVyIiwidGFyZ2V0IiwiY29udGFpbnMiLCJmYXZEYXRhIiwibWV0aG9kIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ1c2VyaWQiLCJldmVudElkIiwicmVzcG9uc2UiLCJzdWNjZXNzIiwiZXZlbnQiLCJhZGRUb0JldHNsaXAiLCJ1cGRhdGVDb3VudGVyIiwiaXNSZW1vdmVkIiwicmVtb3ZlRnJvbUJldHNsaXAiLCJyZW1vdmUiLCJkaWZmIiwiY3VyckNvdW50ZXIiLCJsYXN0RGlnaXQiLCJ0cmFuc2xhdGlvbktleSIsImV2ZW50VHJhbnNsYXRpb24iLCJnZXRNYXRjaERhdGEiLCJzZXJ2aWNlSWQiLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJjb2VmRGF0YSIsInJlc3VsdCIsImZpbmQiLCJvIiwibWFya2V0X25hbWUiLCJtYXJrZXROYW1lIiwicmVzdWx0X3R5cGVfbmFtZSIsIm1hcmtldFR5cGUiLCJvdXRjb21lIiwib3V0Y29tZXMiLCJvdXRjb21lX25hbWUiLCJvdXRjb21lTmFtZSIsIm91dGNvbWVJZCIsIm91dGNvbWVfaWQiLCJvdXRjb21lQ29lZiIsIm91dGNvbWVfY29lZiIsIm1hcmtldElkIiwibWFya2V0X2lkIiwibSIsImRhdGUiLCJkIiwiZGF5IiwiU3RyaW5nIiwiZ2V0RGF0ZSIsInBhZFN0YXJ0IiwibW9udGgiLCJnZXRNb250aCIsIndpbmRvdyIsImFkZEJldHNsaXBPdXRjb21lcyIsInJlbW92ZUJldHNsaXBJdGVtcyIsIlByb21pc2UiLCJyZXNvbHZlIiwiaW5pdCIsInN0b3JlIiwic3RhdGUiLCJnZXRTdGF0ZSIsImF1dGgiLCJpc0F1dGhvcml6ZWQiLCJpZCIsImMiLCJzZXRJbnRlcnZhbCIsImdfdXNlcl9pZCIsImNoZWNrVXNlckF1dGgiLCJjbGVhckludGVydmFsIiwiX2l0ZXJhdG9yMiIsIl9zdGVwMiIsInVuYXV0aE1lcyIsIl9pdGVyYXRvcjMiLCJfc3RlcDMiLCJwYXJ0aWNpcGF0ZUJ0biIsIl9pdGVyYXRvcjQiLCJfc3RlcDQiLCJzZXRUaW1lb3V0IiwiaXNEcmFnZ2luZyIsInN0YXJ0WCIsInNjcm9sbExlZnQiLCJkcmFnZ2FibGVDb250YWluZXIiLCJpdGVtc1dyYXAiLCJyb3ciLCJpdGVtc1dyYXBMZW5ndGgiLCJzdHlsZSIsIm1heFdpZHRoIiwicGFnZVgiLCJvZmZzZXRMZWZ0IiwicHJldmVudERlZmF1bHQiLCJ4Iiwid2FsayIsInN3aXRjaEJ0biIsInRvZ2dsZSIsInNldEl0ZW0iLCJsb2NhdGlvbiIsInJlbG9hZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxDQUFDLFVBQUFBLHFCQUFBLEVBQVk7RUFDVCxJQUFNQyxNQUFNLEdBQUcsMENBQTBDO0VBRXpELElBQ0lDLFVBQVUsR0FBR0MsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7SUFDbERDLGVBQWUsR0FBR0YsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7SUFDMURFLFdBQVcsR0FBR0gsUUFBUSxDQUFDSSxhQUFhLENBQUMsVUFBVSxDQUFDO0lBQ2hEQyxVQUFVLEdBQUdMLFFBQVEsQ0FBQ0ksYUFBYSxDQUFDLFNBQVMsQ0FBQztJQUM5Q0UsVUFBVSxHQUFHTixRQUFRLENBQUNJLGFB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Q0FBQyxzQkFBc0IsQ0FBQztFQUVoRStMLFNBQVMsQ0FBQ2hKLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFVO0lBQzFDZ0osU0FBUyxDQUFDMUosU0FBUyxDQUFDMkosTUFBTSxDQUFDLFFBQVEsQ0FBQztFQUN4QyxDQUFDLENBQUM7RUFFRnBNLFFBQVEsQ0FBQ0ksYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDK0MsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQUs7SUFDL0RuRCxRQUFRLENBQUMwRyxJQUFJLENBQUNqRSxTQUFTLENBQUMySixNQUFNLENBQUMsTUFBTSxDQUFDO0VBQzFDLENBQUMsQ0FBQztFQUVGcE0sUUFBUSxDQUFDSSxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMrQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBTTtJQUMvRDFDLE1BQU0sR0FBR0EsTUFBTSxLQUFLLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSTtJQUN0Q0MsY0FBYyxDQUFDMkwsT0FBTyxDQUFDLFFBQVEsRUFBRTVMLE1BQU0sQ0FBQztJQUN4Q2tKLE1BQU0sQ0FBQzJDLFFBQVEsQ0FBQ0MsTUFBTSxDQUFDLENBQUM7RUFDNUIsQ0FBQyxDQUFDO0FBSU4sQ0FBQyxFQUFFLENBQUM7QUN4ZUoiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYXBpVVJMID0gJ2h0dHBzOi8vZmF2LXByb20uY29tL2FwaV9mb3JlY2FzdF9wb3N0ZXInO1xuXG4gICAgY29uc3RcbiAgICAgICAgdW5hdXRoTXNncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hdXRoQnRuJyksXG4gICAgICAgIHBhcnRpY2lwYXRlQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcmVkaWN0QnRuJyksXG4gICAgICAgIGNvdW50ZXJTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50ZXInKSxcbiAgICAgICAgZXZlbnRzU3BhbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ldmVudHMnKSxcbiAgICAgICAgd2VsY29tZUJldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWxjb21lX19iZXQnKTtcblxuICAgIGNvbnN0IHVrTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN1a0xlbmcnKTtcbiAgICBjb25zdCBlbkxlbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZW5MZW5nJyk7XG5cbiAgICBsZXQgbG9jYWxlID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcImxvY2FsZVwiKSA/PyAndWsnO1xuXG4gICAgaWYgKHVrTGVuZykgbG9jYWxlID0gJ3VrJztcbiAgICBpZiAoZW5MZW5nKSBsb2NhbGUgPSAnZW4nO1xuXG4gICAgbGV0IGkxOG5EYXRhID0ge307XG4gICAgbGV0IHVzZXJJZDtcbiAgICBsZXQgZWxlbWVudHNCeU1hdGNoaUQgPSB7fTtcbiAgICBsZXQgYWxsTWF0Y2hlcyA9IFtdO1xuICAgIGxldCBmYXZEYXRhQnlNYXRjaCA9IHt9O1xuICAgIHVzZXJJZCA9IDEwMzAzMTU5NztcblxuICAgIGZ1bmN0aW9uIGxvYWRUcmFuc2xhdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChgJHthcGlVUkx9L25ldy10cmFuc2xhdGVzLyR7bG9jYWxlfWApLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihqc29uID0+IHtcbiAgICAgICAgICAgICAgICBpMThuRGF0YSA9IGpzb247XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JlY2FzdFBvc3RlcicpLCB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlKCkge1xuICAgICAgICBjb25zdCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRyYW5zbGF0ZV0nKVxuICAgICAgICBpZiAoZWxlbXMgJiYgZWxlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBlbGVtcy5mb3JFYWNoKGVsZW0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpO1xuICAgICAgICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gdHJhbnNsYXRlS2V5KGtleSk7XG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRlJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGlmIChsb2NhbGUgPT09ICdlbicpIHtcbiAgICAgICAgICAgIG1haW5QYWdlLmNsYXNzTGlzdC5hZGQoJ2VuJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cmFuc2xhdGVLZXkoa2V5LCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0VmFsdWUgPSBkZWZhdWx0VmFsdWUgfHwga2V5O1xuICAgICAgICByZXR1cm4gaTE4bkRhdGFba2V5XSB8fCBkZWZhdWx0VmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3QgcmVxdWVzdCA9IGZ1bmN0aW9uIChsaW5rLCBleHRyYU9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGFwaVVSTCArIGxpbmssIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAuLi4oZXh0cmFPcHRpb25zIHx8IHt9KVxuICAgICAgICB9KS50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRBZGRBbGxCdG4oKSB7XG4gICAgICAgIGNvbnN0IGFkZEFsbEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcmVkaWN0QnRuJyk7XG4gICAgICAgIGFkZEFsbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBnZXRCZXRzbGlwSXRlbXMoKS50aGVuKGJldHNsaXBNYXRjaGVzID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIGFsbE1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hEaXYgPSBlbGVtZW50c0J5TWF0Y2hpRFttYXRjaC5tYXRjaElkXTtcbiAgICAgICAgICAgICAgICAgICAgYWRkTWF0Y2hUb0JldHNsaXAobWF0Y2gsIG1hdGNoRGl2LCBiZXRzbGlwTWF0Y2hlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgYmV0c2xpcCBpdGVtczonLCBlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgSW5pdFBhZ2UgPSAoKSA9PiB7XG4gICAgICAgIHRyYW5zbGF0ZSgpO1xuICAgICAgICBpbml0QWRkQWxsQnRuKCk7XG4gICAgICAgIHJlcXVlc3QoJy9tYXRjaGVzJykudGhlbihtYXRjaGVzID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1hdGNoZXMpO1xuICAgICAgICAgICAgYWxsTWF0Y2hlcyA9IChtYXRjaGVzIHx8IFtdKS5zb3J0KChhLCBiKSA9PiBuZXcgRGF0ZShhLmFjdGl2ZURhdGUpIC0gbmV3IERhdGUoYi5hY3RpdmVEYXRlKSk7XG5cbiAgICAgICAgICAgIGdldEJldHNsaXBJdGVtcygpLnRoZW4oYmV0c2xpcE1hdGNoZXMgPT4ge1xuICAgICAgICAgICAgICAgIGluaXRNYXRjaGVzKGFsbE1hdGNoZXMsIGJldHNsaXBNYXRjaGVzKTtcbiAgICAgICAgICAgICAgICBpbml0U2xpZGVyKCk7XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcignRXJyb3IgZ2V0dGluZyBiZXRzbGlwIGl0ZW1zOicsIGVycikpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0TWF0Y2hlcyhtYXRjaGVzLCBiZXRzbGlwTWF0Y2hlcykge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VsY29tZV9fcm93Jyk7XG4gICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAgICAgICBsZXQgYWRkZWQgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdGNoZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvd1dyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHJvd1dyYXAuY2xhc3NOYW1lID0gJ3dlbGNvbWVfX3Jvdy13cmFwJztcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IGk7IGogPCBpICsgMiAmJiBqIDwgbWF0Y2hlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gbWF0Y2hlc1tqXTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIG1hdGNoRGl2LmNsYXNzTmFtZSA9ICd3ZWxjb21lX19pdGVtJztcbiAgICAgICAgICAgICAgICBtYXRjaC5tYXRjaElkID0gKCttYXRjaC5tYXRjaElkKTtcbiAgICAgICAgICAgICAgICBpZiAoYmV0c2xpcE1hdGNoZXMuc29tZShiID0+IGIuZXZlbnRfaWQgPT0gbWF0Y2gubWF0Y2hJZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkZWQrKztcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hEaXYuY2xhc3NMaXN0LmFkZCgnX2RvbmUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBtYXRjaERpdi5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tY2xvc2VcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1yb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tdGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiaHR0cHM6Ly9mYXYtcHJvbS5jb20vaHRtbC9mb3JlY2FzdC1wb3N0ZXIvaW1nL3dlbGNvbWUvZmF2LnN2Z1wiIGFsdD1cIkZBVkJFVFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+JHt0cmFuc2xhdGVLZXkobWF0Y2gudGl0bGUpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLWRhdGVcIj4ke2Zvcm1hdERhdGUobWF0Y2gubWF0Y2hEYXRlKX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1tYXgtdGl0bGVcIj4ke3RyYW5zbGF0ZUtleShtYXRjaC50ZWFtMSl9IOKAkyAke3RyYW5zbGF0ZUtleShtYXRjaC50ZWFtMil9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0taW5mb1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1iaWRcIj4ke3RyYW5zbGF0ZUtleShtYXRjaC5vdXRjb21lVHJhbnNsYXRpb24pfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1jb2ZcIj4ke21hdGNoLmRlZmF1bHRDb2VmIHx8IDB9PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBgO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudHNCeU1hdGNoaURbbWF0Y2gubWF0Y2hJZF0gPSBtYXRjaERpdjtcbiAgICAgICAgICAgICAgICByb3dXcmFwLmFwcGVuZENoaWxkKG1hdGNoRGl2KTtcblxuICAgICAgICAgICAgICAgIC8vIGdldE1hdGNoRGF0YShtYXRjaCkudGhlbihtID0+IHtcbiAgICAgICAgICAgICAgICAvLyAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNvbnN0IGNvZkRpdiA9IG1hdGNoRGl2LnF1ZXJ5U2VsZWN0b3IoJy53ZWxjb21lX19pdGVtLWNvZicpO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgY29mRGl2LmlubmVySFRNTCA9IG0ub3V0Y29tZUNvZWY7XG4gICAgICAgICAgICAgICAgLy8gICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhgTm8gb3V0Y29tZSBkYXRhIGZvciAke21hdGNoLm1hdGNoSWR9YCk7XG4gICAgICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgICAgICAvLyB9KTtcblxuICAgICAgICAgICAgICAgIG1hdGNoRGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGFkZE1hdGNoVG9CZXRzbGlwKG1hdGNoLCBtYXRjaERpdiwgYmV0c2xpcE1hdGNoZXMsIGUpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9zZUJ0biA9IG1hdGNoRGl2LnF1ZXJ5U2VsZWN0b3IoJy53ZWxjb21lX19pdGVtLWNsb3NlJyk7XG4gICAgICAgICAgICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVNYXRjaEZyb21CZXRzbGlwKG1hdGNoLCBtYXRjaERpdik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocm93V3JhcCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRDb3VudGVyKGFkZGVkKTtcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRNYXRjaFRvQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYsIGJldHNsaXBNYXRjaGVzLCBlKSB7XG4gICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnVGFyZ2V0IGNsYXNzIGxpc3Q6ICcgKyBlLnRhcmdldC5jbGFzc0xpc3QpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKG1hdGNoKTtcbiAgICAgICAgY29uc29sZS5sb2cobWF0Y2hEaXYpO1xuICAgICAgICBjb25zb2xlLmxvZyhiZXRzbGlwTWF0Y2hlcyk7XG4gICAgICAgIGlmICghdXNlcklkIHx8IGJldHNsaXBNYXRjaGVzLnNvbWUoYiA9PiBiLmV2ZW50X2lkID09IG1hdGNoLm1hdGNoSWQgfHwgKGUgJiYgZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd3ZWxjb21lX19pdGVtLWNsb3NlJykpKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coZmF2RGF0YUJ5TWF0Y2gpO1xuXG4gICAgICAgIGNvbnN0IGZhdkRhdGEgPSBmYXZEYXRhQnlNYXRjaFttYXRjaC5tYXRjaElkXTtcbiAgICAgICAgY29uc29sZS5sb2coJ0ZBViBEQVRBIEJZIE1BVENIJywgZmF2RGF0YUJ5TWF0Y2gpXG4gICAgICAgIGlmICghZmF2RGF0YSB8fCAhZmF2RGF0YS5tYXRjaElkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTm8gZmF2IGRhdGEgZm9yIG1hdGNoIGlkICcgKyBtYXRjaC5tYXRjaElkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3QoJy9ldmVudHMnLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB1c2VyaWQ6IHVzZXJJZCxcbiAgICAgICAgICAgICAgICBldmVudElkOiBtYXRjaC5tYXRjaElkXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0V2ZW50IGNyZWF0ZWQ6JywgcmVzcG9uc2UuZXZlbnQpO1xuICAgICAgICAgICAgICAgIGFkZFRvQmV0c2xpcChmYXZEYXRhKTtcbiAgICAgICAgICAgICAgICBtYXRjaERpdi5jbGFzc0xpc3QuYWRkKCdfZG9uZScpO1xuICAgICAgICAgICAgICAgIHVwZGF0ZUNvdW50ZXIoMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgZXZlbnQ6JywgcmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBjcmVhdGluZyBldmVudDonLCBlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlTWF0Y2hGcm9tQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYpIHtcbiAgICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZhdkRhdGEgPSBmYXZEYXRhQnlNYXRjaFttYXRjaC5tYXRjaElkXTtcbiAgICAgICAgaWYgKCFmYXZEYXRhIHx8ICFmYXZEYXRhLm1hdGNoSWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBmYXYgZGF0YSBmb3IgbWF0Y2ggaWQgJyArIG1hdGNoLm1hdGNoSWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNSZW1vdmVkID0gcmVtb3ZlRnJvbUJldHNsaXAoZmF2RGF0YSk7IC8vIERpcmVjdGx5IGFzc2lnbiByZXN1bHRcbiAgICAgICAgaWYgKGlzUmVtb3ZlZCkge1xuICAgICAgICAgICAgbWF0Y2hEaXYuY2xhc3NMaXN0LnJlbW92ZSgnX2RvbmUnKTtcbiAgICAgICAgICAgIHVwZGF0ZUNvdW50ZXIoLTEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlQ291bnRlcihkaWZmKSB7XG4gICAgICAgIGNvbnN0IGN1cnJDb3VudGVyID0gK2NvdW50ZXJTcGFuLmlubmVySFRNTDtcbiAgICAgICAgc2V0Q291bnRlcihjdXJyQ291bnRlciArIGRpZmYpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldENvdW50ZXIodmFsdWUpIHtcbiAgICAgICAgY291bnRlclNwYW4uaW5uZXJIVE1MID0gdmFsdWU7XG5cbiAgICAgICAgY29uc3QgbGFzdERpZ2l0ID0gdmFsdWUgJSAxMDtcbiAgICAgICAgbGV0IHRyYW5zbGF0aW9uS2V5O1xuICAgICAgICBpZiAobGFzdERpZ2l0ID09PSAxKSB7XG4gICAgICAgICAgICB0cmFuc2xhdGlvbktleSA9ICdldmVudDEnO1xuICAgICAgICB9IGVsc2UgaWYgKGxhc3REaWdpdCA+PSAyICYmIGxhc3REaWdpdCA8PSA0KSB7XG4gICAgICAgICAgICB0cmFuc2xhdGlvbktleSA9ICdldmVudDInO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJhbnNsYXRpb25LZXkgPSAnZXZlbnQzJztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV2ZW50VHJhbnNsYXRpb24gPSB0cmFuc2xhdGVLZXkodHJhbnNsYXRpb25LZXkpO1xuICAgICAgICBldmVudHNTcGFuLmlubmVySFRNTCA9IGV2ZW50VHJhbnNsYXRpb247XG5cbiAgICAgICAgaWYgKHZhbHVlID4gMCkge1xuICAgICAgICAgICAgd2VsY29tZUJldC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3ZWxjb21lQmV0LmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE1hdGNoRGF0YShtYXRjaCwgc2VydmljZUlkPTApIHtcbiAgICAgICAgaWYgKHNlcnZpY2VJZCA+IDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBkYXRhIGZvciAwIGFuZCAxIHNlcnZpY2UgaWRzJylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmZXRjaCgnL3NlcnZpY2UvbGluZW91dC9mcm9udGVuZF9hcGkyLycsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIFwianNvbnJwY1wiOiBcIjIuMFwiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogMTYsXG4gICAgICAgICAgICAgICAgXCJtZXRob2RcIjogXCJmcm9udGVuZC9tYXJrZXQvZ2V0XCIsXG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImJ5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGFuZ1wiOiAndWsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXJ2aWNlX2lkXCI6IHNlcnZpY2VJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZXZlbnRfaWRcIjogbWF0Y2gubWF0Y2hJZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oZmF2RGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29lZkRhdGEgPSBmYXZEYXRhLnJlc3VsdC5maW5kKG8gPT4gby5tYXJrZXRfbmFtZSA9PT0gbWF0Y2gubWFya2V0TmFtZSAmJiBvLnJlc3VsdF90eXBlX25hbWUgPT09IG1hdGNoLm1hcmtldFR5cGUpO1xuICAgICAgICAgICAgICAgIGlmIChjb2VmRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvdXRjb21lID0gY29lZkRhdGEub3V0Y29tZXMuZmluZChvID0+IG8ub3V0Y29tZV9uYW1lID09IG1hdGNoLm91dGNvbWVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvdXRjb21lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0TWF0Y2hEYXRhKG1hdGNoLCBzZXJ2aWNlSWQgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0Y29tZUlkOiBvdXRjb21lLm91dGNvbWVfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRjb21lQ29lZjogb3V0Y29tZS5vdXRjb21lX2NvZWYsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXRJZDogY29lZkRhdGEubWFya2V0X2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZUlkOiBzZXJ2aWNlSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaElkOiBtYXRjaC5tYXRjaElkLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRNYXRjaERhdGEobWF0Y2gsIHNlcnZpY2VJZCArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtKVxuICAgICAgICAgICAgICAgIGZhdkRhdGFCeU1hdGNoW20ubWF0Y2hJZF0gPSBtO1xuICAgICAgICAgICAgICAgIHJldHVybiBtO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0RGF0ZShkYXRlKSB7XG4gICAgICAgIGlmICghZGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgY29uc3QgZGF5ID0gU3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgICBjb25zdCBtb250aCA9IFN0cmluZyhkLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgICByZXR1cm4gYCR7ZGF5fS4ke21vbnRofWA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkVG9CZXRzbGlwKG1hdGNoKSB7XG4gICAgICAgIGlmICghd2luZG93LmFkZEJldHNsaXBPdXRjb21lcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIGFkZEJldHNsaXBPdXRjb21lcyBtZXRob2QgaXMgZGVmaW5lZCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG91dGNvbWUgPSB7XG4gICAgICAgICAgICAnc2VydmljZUlkJzogbWF0Y2guc2VydmljZUlkLFxuICAgICAgICAgICAgJ2V2ZW50SWQnOiBtYXRjaC5tYXRjaElkLFxuICAgICAgICAgICAgJ21hcmtldElkJzogbWF0Y2gubWFya2V0SWQsXG4gICAgICAgICAgICAnb3V0Y29tZUlkJzogbWF0Y2gub3V0Y29tZUlkXG4gICAgICAgIH07XG4gICAgICAgIHdpbmRvdy5hZGRCZXRzbGlwT3V0Y29tZXMoW291dGNvbWVdKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVGcm9tQmV0c2xpcChtYXRjaCkge1xuICAgICAgICBpZiAoIXdpbmRvdy5yZW1vdmVCZXRzbGlwSXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQnNC10YLQvtC0IHJlbW92ZUJldHNsaXBJdGVtcyDQvdC1INC30L3QsNC50LTQtdC90L4nKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8g0JfQvdCw0YfQtdC90L3RjyDQt9CwINC30LDQvNC+0LLRh9GD0LLQsNC90L3Rj9C8XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvdXRjb21lSWQgPSBtYXRjaC5vdXRjb21lSWQ7IC8vINCe0YLRgNC40LzRg9GU0LzQviDRgtGW0LvRjNC60LggaWRcblxuICAgICAgICAvLyDQktC40LrQu9C40LrQsNGU0LzQviDQvdC+0LLQuNC5INC80LXRgtC+0LQg0Lcg0LzQsNGB0LjQstC+0Lwg0LDQudC00ZZcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gd2luZG93LnJlbW92ZUJldHNsaXBJdGVtcyhbb3V0Y29tZUlkXSk7XG5cbiAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICByZXN1bHRcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiBjb25zb2xlLmxvZyhg0KPRgdC/0ZbRiNC90L4g0LLQuNC00LDQu9C10L3QviBvdXRjb21lSWQgJHtvdXRjb21lSWR9YCkpXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKGDQn9C+0LzQuNC70LrQsCDQv9GA0Lgg0LLQuNC00LDQu9C10L3QvdGWIG91dGNvbWVJZCAke291dGNvbWVJZH06YCwgZXJyKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhg0JzQtdGC0L7QtCDQv9C+0LLQtdGA0L3Rg9CyICR7cmVzdWx0fSDQtNC70Y8gb3V0Y29tZUlkICR7b3V0Y29tZUlkfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCZXRzbGlwSXRlbXMoKSB7XG4gICAgICAgIGlmICghd2luZG93LmdldEJldHNsaXBJdGVtcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIGdldEJldHNsaXBJdGVtcyBtZXRob2QgaXMgZGVmaW5lZCcpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gd2luZG93LmdldEJldHNsaXBJdGVtcygpXG4gICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdCZXRzbGlwIGl0ZW1zOicsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluIGdldEJldHNsaXBJdGVtczonLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgSW5pdFBhZ2UoKTtcblxuICAgICAgICBpZiAod2luZG93LnN0b3JlKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSB3aW5kb3cuc3RvcmUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICAgIHVzZXJJZCA9IHN0YXRlLmF1dGguaXNBdXRob3JpemVkICYmIHN0YXRlLmF1dGguaWQgfHwgJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgYyA9IDA7XG4gICAgICAgICAgICB2YXIgaSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYyA8IDUwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIXdpbmRvdy5nX3VzZXJfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IHdpbmRvdy5nX3VzZXJfaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja1VzZXJBdXRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hlY2tVc2VyQXV0aCgpO1xuICAgIH1cblxuICAgIGxldCBjaGVja1VzZXJBdXRoID0gKCkgPT4ge1xuICAgICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHVuYXV0aE1lcyBvZiB1bmF1dGhNc2dzKSB7XG4gICAgICAgICAgICAgICAgdW5hdXRoTWVzLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGFkZEFsbEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcmVkaWN0QnRuJyk7XG4gICAgICAgICAgICBhZGRBbGxCdG4uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX3JvdycpO1xuICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IHBhcnRpY2lwYXRlQnRuIG9mIHBhcnRpY2lwYXRlQnRucykge1xuICAgICAgICAgICAgICAgIHBhcnRpY2lwYXRlQnRuLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgdW5hdXRoTWVzIG9mIHVuYXV0aE1zZ3MpIHtcbiAgICAgICAgICAgICAgICB1bmF1dGhNZXMuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZFRyYW5zbGF0aW9ucygpXG4gICAgICAgIC50aGVuKGluaXQpO1xuXG4gICAgbGV0IG1haW5QYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZhdl9fcGFnZScpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gbWFpblBhZ2UuY2xhc3NMaXN0LmFkZCgnb3ZlcmZsb3cnKSwgMTAwMCk7XG5cbiAgICBmdW5jdGlvbiBpbml0U2xpZGVyKCkge1xuICAgICAgICBsZXQgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICBsZXQgc3RhcnRYO1xuICAgICAgICBsZXQgc2Nyb2xsTGVmdDtcblxuICAgICAgICBjb25zdCBkcmFnZ2FibGVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJhZ2dhYmxlQ29udGFpbmVyJyk7XG4gICAgICAgIGNvbnN0IGl0ZW1zV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWxjb21lX19yb3ctd3JhcCcpXG4gICAgICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWxjb21lX19yb3cnKVxuICAgICAgICBjb25zdCBpdGVtc1dyYXBMZW5ndGggPSBpdGVtc1dyYXAubGVuZ3RoO1xuXG4gICAgICAgIHN3aXRjaCAoaXRlbXNXcmFwTGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgcm93LnN0eWxlLm1heFdpZHRoID0gJzIwOThweCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgcm93LnN0eWxlLm1heFdpZHRoID0gJzE2NjhweCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgcm93LnN0eWxlLm1heFdpZHRoID0gJzEyNThweCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcm93LnN0eWxlLm1heFdpZHRoID0gJzgyOHB4JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByb3cuc3R5bGUubWF4V2lkdGggPSAnNDE4cHgnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByb3cuc3R5bGUubWF4V2lkdGggPSAnMjA5OHB4JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGRyYWdnYWJsZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZSkgPT4ge1xuICAgICAgICAgICAgaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgICAgICAgICBzdGFydFggPSBlLnBhZ2VYIC0gZHJhZ2dhYmxlQ29udGFpbmVyLm9mZnNldExlZnQ7XG4gICAgICAgICAgICBzY3JvbGxMZWZ0ID0gZHJhZ2dhYmxlQ29udGFpbmVyLnNjcm9sbExlZnQ7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZHJhZ2dhYmxlQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgICAgICBpc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRyYWdnYWJsZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKCkgPT4ge1xuICAgICAgICAgICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICBkcmFnZ2FibGVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmICghaXNEcmFnZ2luZykgcmV0dXJuO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgeCA9IGUucGFnZVggLSBkcmFnZ2FibGVDb250YWluZXIub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIGNvbnN0IHdhbGsgPSAoeCAtIHN0YXJ0WCkgKiAyOyAvLyDQo9Cy0LXQu9C40YfRjNGC0LUg0LzQvdC+0LbQuNGC0LXQu9GMLCDRh9GC0L7QsdGLINC40LfQvNC10L3QuNGC0Ywg0YHQutC+0YDQvtGB0YLRjCDQv9GA0L7QutGA0YPRgtC60LhcbiAgICAgICAgICAgIGRyYWdnYWJsZUNvbnRhaW5lci5zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdCAtIHdhbGs7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIHRlc3RcbiAgICBjb25zdCBzd2l0Y2hCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndlbGNvbWVfX3N3aXRjaC1idG5cIilcblxuICAgIHN3aXRjaEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgc3dpdGNoQnRuLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIilcbiAgICB9KVxuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kYXJrLWJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT57XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcImRhcmtcIilcbiAgICB9KVxuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sbmctYnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGxvY2FsZSA9IGxvY2FsZSA9PT0gJ3VrJyA/ICdlbicgOiAndWsnO1xuICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFwibG9jYWxlXCIsIGxvY2FsZSk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgIH0pO1xuXG5cblxufSkoKTtcbiIsIiJdfQ==
