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
(function (_sessionStorage$getIt, _Number) {
  var apiURL = 'https://fav-prom.com/api_forecast_poster';
  var unauthMsgs = document.querySelectorAll('.authBtn'),
    participateBtns = document.querySelectorAll('.predictBtn'),
    counterSpan = document.querySelector('.counter'),
    eventsSpan = document.querySelector('.events'),
    welcomeBet = document.querySelector('.welcome__bet'),
    switchWrap = document.querySelector(".welcome__switch");
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
  userId = (_Number = Number(sessionStorage.getItem("userId"))) !== null && _Number !== void 0 ? _Number : 103031597;
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
      switchWrap.classList.remove("hide");
      var addAllBtn = document.querySelector('.predictBtn');
      addAllBtn.classList.remove('hide');
      var container = document.querySelector('.welcome__row');
      container.classList.remove('hide');
    } else {
      switchWrap.classList.add("hide");
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
  document.querySelector(".auth-btn").addEventListener("click", function () {
    userId = userId === 103031597 ? 0 : 103031597;
    sessionStorage.setItem("userId", userId);
    window.location.reload();
  });
})();
"use strict";
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzZWNvbmQuanMiXSwibmFtZXMiOlsiX3Nlc3Npb25TdG9yYWdlJGdldEl0IiwiX051bWJlciIsImFwaVVSTCIsInVuYXV0aE1zZ3MiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJwYXJ0aWNpcGF0ZUJ0bnMiLCJjb3VudGVyU3BhbiIsInF1ZXJ5U2VsZWN0b3IiLCJldmVudHNTcGFuIiwid2VsY29tZUJldCIsInN3aXRjaFdyYXAiLCJ1a0xlbmciLCJlbkxlbmciLCJsb2NhbGUiLCJzZXNzaW9uU3RvcmFnZSIsImdldEl0ZW0iLCJpMThuRGF0YSIsInVzZXJJZCIsImVsZW1lbnRzQnlNYXRjaGlEIiwiYWxsTWF0Y2hlcyIsImZhdkRhdGFCeU1hdGNoIiwiTnVtYmVyIiwibG9hZFRyYW5zbGF0aW9ucyIsImZldGNoIiwiY29uY2F0IiwidGhlbiIsInJlcyIsImpzb24iLCJ0cmFuc2xhdGUiLCJtdXRhdGlvbk9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm9ic2VydmUiLCJnZXRFbGVtZW50QnlJZCIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJlbGVtcyIsImxlbmd0aCIsImZvckVhY2giLCJlbGVtIiwia2V5IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwidHJhbnNsYXRlS2V5IiwicmVtb3ZlQXR0cmlidXRlIiwibWFpblBhZ2UiLCJjbGFzc0xpc3QiLCJhZGQiLCJkZWZhdWx0VmFsdWUiLCJyZXF1ZXN0IiwibGluayIsImV4dHJhT3B0aW9ucyIsIl9vYmplY3RTcHJlYWQiLCJoZWFkZXJzIiwiaW5pdEFkZEFsbEJ0biIsImFkZEFsbEJ0biIsImFkZEV2ZW50TGlzdGVuZXIiLCJnZXRCZXRzbGlwSXRlbXMiLCJiZXRzbGlwTWF0Y2hlcyIsIl9pdGVyYXRvciIsIl9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyIiwiX3N0ZXAiLCJzIiwibiIsImRvbmUiLCJtYXRjaCIsInZhbHVlIiwibWF0Y2hEaXYiLCJtYXRjaElkIiwiYWRkTWF0Y2hUb0JldHNsaXAiLCJlcnIiLCJlIiwiZiIsImNvbnNvbGUiLCJlcnJvciIsIkluaXRQYWdlIiwibWF0Y2hlcyIsImxvZyIsInNvcnQiLCJhIiwiYiIsIkRhdGUiLCJhY3RpdmVEYXRlIiwiaW5pdE1hdGNoZXMiLCJpbml0U2xpZGVyIiwiY29udGFpbmVyIiwiYWRkZWQiLCJpIiwicm93V3JhcCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJfbG9vcCIsImoiLCJzb21lIiwiZXZlbnRfaWQiLCJ0aXRsZSIsImZvcm1hdERhdGUiLCJtYXRjaERhdGUiLCJ0ZWFtMSIsInRlYW0yIiwib3V0Y29tZVRyYW5zbGF0aW9uIiwiZGVmYXVsdENvZWYiLCJhcHBlbmRDaGlsZCIsImNsb3NlQnRuIiwic3RvcFByb3BhZ2F0aW9uIiwicmVtb3ZlTWF0Y2hGcm9tQmV0c2xpcCIsInNldENvdW50ZXIiLCJ0YXJnZXQiLCJjb250YWlucyIsImZhdkRhdGEiLCJtZXRob2QiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInVzZXJpZCIsImV2ZW50SWQiLCJyZXNwb25zZSIsInN1Y2Nlc3MiLCJldmVudCIsImFkZFRvQmV0c2xpcCIsInVwZGF0ZUNvdW50ZXIiLCJpc1JlbW92ZWQiLCJyZW1vdmVGcm9tQmV0c2xpcCIsInJlbW92ZSIsImRpZmYiLCJjdXJyQ291bnRlciIsImxhc3REaWdpdCIsInRyYW5zbGF0aW9uS2V5IiwiZXZlbnRUcmFuc2xhdGlvbiIsImdldE1hdGNoRGF0YSIsInNlcnZpY2VJZCIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsImNvZWZEYXRhIiwicmVzdWx0IiwiZmluZCIsIm8iLCJtYXJrZXRfbmFtZSIsIm1hcmtldE5hbWUiLCJyZXN1bHRfdHlwZV9uYW1lIiwibWFya2V0VHlwZSIsIm91dGNvbWUiLCJvdXRjb21lcyIsIm91dGNvbWVfbmFtZSIsIm91dGNvbWVOYW1lIiwib3V0Y29tZUlkIiwib3V0Y29tZV9pZCIsIm91dGNvbWVDb2VmIiwib3V0Y29tZV9jb2VmIiwibWFya2V0SWQiLCJtYXJrZXRfaWQiLCJtIiwiZGF0ZSIsImQiLCJkYXkiLCJTdHJpbmciLCJnZXREYXRlIiwicGFkU3RhcnQiLCJtb250aCIsImdldE1vbnRoIiwid2luZG93IiwiYWRkQmV0c2xpcE91dGNvbWVzIiwicmVtb3ZlQmV0c2xpcEl0ZW1zIiwiUHJvbWlzZSIsInJlc29sdmUiLCJpbml0Iiwic3RvcmUiLCJzdGF0ZSIsImdldFN0YXRlIiwiYXV0aCIsImlzQXV0aG9yaXplZCIsImlkIiwiYyIsInNldEludGVydmFsIiwiZ191c2VyX2lkIiwiY2hlY2tVc2VyQXV0aCIsImNsZWFySW50ZXJ2YWwiLCJfaXRlcmF0b3IyIiwiX3N0ZXAyIiwidW5hdXRoTWVzIiwiX2l0ZXJhdG9yMyIsIl9zdGVwMyIsInBhcnRpY2lwYXRlQnRuIiwiX2l0ZXJhdG9yNCIsIl9zdGVwNCIsInNldFRpbWVvdXQiLCJpc0RyYWdnaW5nIiwic3RhcnRYIiwic2Nyb2xsTGVmdCIsImRyYWdnYWJsZUNvbnRhaW5lciIsIml0ZW1zV3JhcCIsInJvdyIsIml0ZW1zV3JhcExlbmd0aCIsInN0eWxlIiwibWF4V2lkdGgiLCJwYWdlWCIsIm9mZnNldExlZnQiLCJwcmV2ZW50RGVmYXVsdCIsIngiLCJ3YWxrIiwic3dpdGNoQnRuIiwidG9nZ2xlIiwic2V0SXRlbSIsImxvY2F0aW9uIiwicmVsb2FkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLENBQUMsVUFBQUEscUJBQUEsRUFBQUMsT0FBQSxFQUFZO0VBQ1QsSUFBTUMsTUFBTSxHQUFHLDBDQUEwQztFQUV6RCxJQUNJQyxVQUFVLEdBQUdDLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsVUFBVSxDQUFDO0lBQ2xEQyxlQUFlLEdBQUdGLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsYUFBYSxDQUFDO0lBQzFERSxXQUFXLEdBQUdILFFBQVEsQ0FBQ0ksYUFBYSxDQUFDLFVBQVUsQ0FBQztJQUNoREMsVUFBVSxHQUFHTCxRQUFRLENBQUNJLGFBQWEsQ0FBQyxTQUFTLENBQUM7SUFDOUNFLFVBQVUsR0FBR04sUUFBUSxDQUFDSSxhQUFhLENBQUMsZUFBZSxDQUFDO0lBQ3BERyxVQUFVLEdBQUdQLFFBQVEsQ0FBQ0ksYUFBYSxDQUFDLGtCQUFrQixDQUFDO0VBRTNELElBQU1JLE1BQU0sR0FBR1IsUUFBUSxDQUFDSSxhQUFhLENBQUMsU0FBUyxDQUFDO0VBQ2hELElBQU1LLE1BQU0sR0FBR1QsUUFBUSxDQUFDSSxhQUFhLENBQUMsU0FBUyxDQUFDO0VBRWhELElBQUlNLE1BQU0sSUFBQWQscUJBQUEsR0FBR2UsY0FBYyxDQUFDQyxPQUFPLENBQUMsUUFBUSxDQUFDLGNBQUFoQixxQkFBQSxjQUFBQSxxQkFBQSxHQUFJLElBQUk7RUFFckQsSUFBSVksTUFBTSxFQUFFRSxNQUFNLEdBQUcsSUFBSTtFQUN6QixJQUFJRCxNQUFNLEVBQUVDLE1BQU0sR0FBRyxJQUFJO0VBRXpCLElBQUlHLFFBQVEsR0FBRyxDQUFDLENBQUM7RUFDakIsSUFBSUMsTUFBTTtFQUNWLElBQUlDLGlCQUFpQixHQUFHLENBQUMsQ0FBQztFQUMxQixJQUFJQyxVQUFVLEdBQUcsRUFBRTtFQUNuQixJQUFJQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO0VBQ3ZCSCxNQUFNLElBQUFqQixPQUFBLEdBQUdxQixNQUFNLENBQUNQLGNBQWMsQ0FBQ0MsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQUFmLE9BQUEsY0FBQUEsT0FBQSxHQUFJLFNBQVM7RUFFOUQsU0FBU3NCLGdCQUFnQkEsQ0FBQSxFQUFHO0lBQ3hCLE9BQU9DLEtBQUssSUFBQUMsTUFBQSxDQUFJdkIsTUFBTSxzQkFBQXVCLE1BQUEsQ0FBbUJYLE1BQU0sQ0FBRSxDQUFDLENBQUNZLElBQUksQ0FBQyxVQUFBQyxHQUFHO01BQUEsT0FBSUEsR0FBRyxDQUFDQyxJQUFJLENBQUMsQ0FBQztJQUFBLEVBQUMsQ0FDckVGLElBQUksQ0FBQyxVQUFBRSxJQUFJLEVBQUk7TUFDVlgsUUFBUSxHQUFHVyxJQUFJO01BQ2ZDLFNBQVMsQ0FBQyxDQUFDO01BRVgsSUFBSUMsZ0JBQWdCLEdBQUcsSUFBSUMsZ0JBQWdCLENBQUMsVUFBVUMsU0FBUyxFQUFFO1FBQzdESCxTQUFTLENBQUMsQ0FBQztNQUNmLENBQUMsQ0FBQztNQUNGQyxnQkFBZ0IsQ0FBQ0csT0FBTyxDQUFDN0IsUUFBUSxDQUFDOEIsY0FBYyxDQUFDLGdCQUFnQixDQUFDLEVBQUU7UUFDaEVDLFNBQVMsRUFBRSxJQUFJO1FBQ2ZDLE9BQU8sRUFBRTtNQUNiLENBQUMsQ0FBQztJQUVOLENBQUMsQ0FBQztFQUNWO0VBRUEsU0FBU1AsU0FBU0EsQ0FBQSxFQUFHO0lBQ2pCLElBQU1RLEtBQUssR0FBR2pDLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUM7SUFDM0QsSUFBSWdDLEtBQUssSUFBSUEsS0FBSyxDQUFDQyxNQUFNLEVBQUU7TUFDdkJELEtBQUssQ0FBQ0UsT0FBTyxDQUFDLFVBQUFDLElBQUksRUFBSTtRQUNsQixJQUFNQyxHQUFHLEdBQUdELElBQUksQ0FBQ0UsWUFBWSxDQUFDLGdCQUFnQixDQUFDO1FBQy9DRixJQUFJLENBQUNHLFNBQVMsR0FBR0MsWUFBWSxDQUFDSCxHQUFHLENBQUM7UUFDbENELElBQUksQ0FBQ0ssZUFBZSxDQUFDLGdCQUFnQixDQUFDO01BQzFDLENBQUMsQ0FBQztJQUNOO0lBQ0EsSUFBSS9CLE1BQU0sS0FBSyxJQUFJLEVBQUU7TUFDakJnQyxRQUFRLENBQUNDLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLElBQUksQ0FBQztJQUNoQztFQUNKO0VBRUEsU0FBU0osWUFBWUEsQ0FBQ0gsR0FBRyxFQUFFUSxZQUFZLEVBQUU7SUFDckMsSUFBSSxDQUFDUixHQUFHLEVBQUU7TUFDTjtJQUNKO0lBQ0FRLFlBQVksR0FBR0EsWUFBWSxJQUFJUixHQUFHO0lBQ2xDLE9BQU94QixRQUFRLENBQUN3QixHQUFHLENBQUMsSUFBSVEsWUFBWTtFQUN4QztFQUVBLElBQU1DLE9BQU8sR0FBRyxTQUFWQSxPQUFPQSxDQUFhQyxJQUFJLEVBQUVDLFlBQVksRUFBRTtJQUMxQyxPQUFPNUIsS0FBSyxDQUFDdEIsTUFBTSxHQUFHaUQsSUFBSSxFQUFBRSxhQUFBO01BQ3RCQyxPQUFPLEVBQUU7UUFDTCxRQUFRLEVBQUUsa0JBQWtCO1FBQzVCLGNBQWMsRUFBRTtNQUNwQjtJQUFDLEdBQ0dGLFlBQVksSUFBSSxDQUFDLENBQUMsQ0FDekIsQ0FBQyxDQUFDMUIsSUFBSSxDQUFDLFVBQUFDLEdBQUc7TUFBQSxPQUFJQSxHQUFHLENBQUNDLElBQUksQ0FBQyxDQUFDO0lBQUEsRUFBQztFQUM5QixDQUFDO0VBRUQsU0FBUzJCLGFBQWFBLENBQUEsRUFBRztJQUNyQixJQUFNQyxTQUFTLEdBQUdwRCxRQUFRLENBQUNJLGFBQWEsQ0FBQyxhQUFhLENBQUM7SUFDdkRnRCxTQUFTLENBQUNDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFNO01BQ3RDLElBQUksQ0FBQ3ZDLE1BQU0sRUFBRTtRQUNUO01BQ0o7TUFFQXdDLGVBQWUsQ0FBQyxDQUFDLENBQUNoQyxJQUFJLENBQUMsVUFBQWlDLGNBQWMsRUFBSTtRQUFBLElBQUFDLFNBQUEsR0FBQUMsMEJBQUEsQ0FDakJ6QyxVQUFVO1VBQUEwQyxLQUFBO1FBQUE7VUFBOUIsS0FBQUYsU0FBQSxDQUFBRyxDQUFBLE1BQUFELEtBQUEsR0FBQUYsU0FBQSxDQUFBSSxDQUFBLElBQUFDLElBQUEsR0FBZ0M7WUFBQSxJQUFyQkMsS0FBSyxHQUFBSixLQUFBLENBQUFLLEtBQUE7WUFDWixJQUFNQyxRQUFRLEdBQUdqRCxpQkFBaUIsQ0FBQytDLEtBQUssQ0FBQ0csT0FBTyxDQUFDO1lBQ2pEQyxpQkFBaUIsQ0FBQ0osS0FBSyxFQUFFRSxRQUFRLEVBQUVULGNBQWMsQ0FBQztVQUN0RDtRQUFDLFNBQUFZLEdBQUE7VUFBQVgsU0FBQSxDQUFBWSxDQUFBLENBQUFELEdBQUE7UUFBQTtVQUFBWCxTQUFBLENBQUFhLENBQUE7UUFBQTtNQUNMLENBQUMsQ0FBQyxTQUFNLENBQUMsVUFBQUYsR0FBRztRQUFBLE9BQUlHLE9BQU8sQ0FBQ0MsS0FBSyxDQUFDLDhCQUE4QixFQUFFSixHQUFHLENBQUM7TUFBQSxFQUFDO0lBQ3ZFLENBQUMsQ0FBQztFQUNOO0VBRUEsSUFBTUssUUFBUSxHQUFHLFNBQVhBLFFBQVFBLENBQUEsRUFBUztJQUNuQi9DLFNBQVMsQ0FBQyxDQUFDO0lBQ1gwQixhQUFhLENBQUMsQ0FBQztJQUNmTCxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUN4QixJQUFJLENBQUMsVUFBQW1ELE9BQU8sRUFBSTtNQUNoQ0gsT0FBTyxDQUFDSSxHQUFHLENBQUNELE9BQU8sQ0FBQztNQUNwQnpELFVBQVUsR0FBRyxDQUFDeUQsT0FBTyxJQUFJLEVBQUUsRUFBRUUsSUFBSSxDQUFDLFVBQUNDLENBQUMsRUFBRUMsQ0FBQztRQUFBLE9BQUssSUFBSUMsSUFBSSxDQUFDRixDQUFDLENBQUNHLFVBQVUsQ0FBQyxHQUFHLElBQUlELElBQUksQ0FBQ0QsQ0FBQyxDQUFDRSxVQUFVLENBQUM7TUFBQSxFQUFDO01BRTVGekIsZUFBZSxDQUFDLENBQUMsQ0FBQ2hDLElBQUksQ0FBQyxVQUFBaUMsY0FBYyxFQUFJO1FBQ3JDeUIsV0FBVyxDQUFDaEUsVUFBVSxFQUFFdUMsY0FBYyxDQUFDO1FBQ3ZDMEIsVUFBVSxDQUFDLENBQUM7TUFDaEIsQ0FBQyxDQUFDLFNBQU0sQ0FBQyxVQUFBZCxHQUFHO1FBQUEsT0FBSUcsT0FBTyxDQUFDQyxLQUFLLENBQUMsOEJBQThCLEVBQUVKLEdBQUcsQ0FBQztNQUFBLEVBQUM7SUFDdkUsQ0FBQyxDQUFDO0VBQ04sQ0FBQztFQUVELFNBQVNhLFdBQVdBLENBQUNQLE9BQU8sRUFBRWxCLGNBQWMsRUFBRTtJQUMxQyxJQUFNMkIsU0FBUyxHQUFHbEYsUUFBUSxDQUFDSSxhQUFhLENBQUMsZUFBZSxDQUFDO0lBQ3pEOEUsU0FBUyxDQUFDM0MsU0FBUyxHQUFHLEVBQUU7SUFFeEIsSUFBSTRDLEtBQUssR0FBRyxDQUFDO0lBQ2IsS0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdYLE9BQU8sQ0FBQ3ZDLE1BQU0sRUFBRWtELENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDeEMsSUFBTUMsT0FBTyxHQUFHckYsUUFBUSxDQUFDc0YsYUFBYSxDQUFDLEtBQUssQ0FBQztNQUM3Q0QsT0FBTyxDQUFDRSxTQUFTLEdBQUcsbUJBQW1CO01BQUMsSUFBQUMsS0FBQSxZQUFBQSxNQUFBLEVBRWM7UUFDbEQsSUFBTTFCLEtBQUssR0FBR1csT0FBTyxDQUFDZ0IsQ0FBQyxDQUFDO1FBQ3hCLElBQU16QixRQUFRLEdBQUdoRSxRQUFRLENBQUNzRixhQUFhLENBQUMsS0FBSyxDQUFDO1FBQzlDdEIsUUFBUSxDQUFDdUIsU0FBUyxHQUFHLGVBQWU7UUFDcEN6QixLQUFLLENBQUNHLE9BQU8sR0FBSSxDQUFDSCxLQUFLLENBQUNHLE9BQVE7UUFDaEMsSUFBSVYsY0FBYyxDQUFDbUMsSUFBSSxDQUFDLFVBQUFiLENBQUM7VUFBQSxPQUFJQSxDQUFDLENBQUNjLFFBQVEsSUFBSTdCLEtBQUssQ0FBQ0csT0FBTztRQUFBLEVBQUMsRUFBRTtVQUN2RGtCLEtBQUssRUFBRTtVQUNQbkIsUUFBUSxDQUFDckIsU0FBUyxDQUFDQyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQ25DO1FBRUFvQixRQUFRLENBQUN6QixTQUFTLGlVQUFBbEIsTUFBQSxDQUtGbUIsWUFBWSxDQUFDc0IsS0FBSyxDQUFDOEIsS0FBSyxDQUFDLGlHQUFBdkUsTUFBQSxDQUVId0UsVUFBVSxDQUFDL0IsS0FBSyxDQUFDZ0MsU0FBUyxDQUFDLDZGQUFBekUsTUFBQSxDQUUxQm1CLFlBQVksQ0FBQ3NCLEtBQUssQ0FBQ2lDLEtBQUssQ0FBQyxjQUFBMUUsTUFBQSxDQUFNbUIsWUFBWSxDQUFDc0IsS0FBSyxDQUFDa0MsS0FBSyxDQUFDLHVIQUFBM0UsTUFBQSxDQUUxRG1CLFlBQVksQ0FBQ3NCLEtBQUssQ0FBQ21DLGtCQUFrQixDQUFDLG1FQUFBNUUsTUFBQSxDQUN0Q3lDLEtBQUssQ0FBQ29DLFdBQVcsSUFBSSxDQUFDLGlEQUU5RDtRQUVHbkYsaUJBQWlCLENBQUMrQyxLQUFLLENBQUNHLE9BQU8sQ0FBQyxHQUFHRCxRQUFRO1FBQzNDcUIsT0FBTyxDQUFDYyxXQUFXLENBQUNuQyxRQUFRLENBQUM7O1FBRTdCO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUFBLFFBQVEsQ0FBQ1gsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUNlLENBQUM7VUFBQSxPQUFLRixpQkFBaUIsQ0FBQ0osS0FBSyxFQUFFRSxRQUFRLEVBQUVULGNBQWMsRUFBRWEsQ0FBQyxDQUFDO1FBQUEsRUFBQztRQUNoRyxJQUFNZ0MsUUFBUSxHQUFHcEMsUUFBUSxDQUFDNUQsYUFBYSxDQUFDLHNCQUFzQixDQUFDO1FBQy9EZ0csUUFBUSxDQUFDL0MsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUNlLENBQUMsRUFBSztVQUN0Q0EsQ0FBQyxDQUFDaUMsZUFBZSxDQUFDLENBQUM7VUFDbkJDLHNCQUFzQixDQUFDeEMsS0FBSyxFQUFFRSxRQUFRLENBQUM7UUFDM0MsQ0FBQyxDQUFDO01BQ04sQ0FBQztNQTVDRCxLQUFLLElBQUl5QixDQUFDLEdBQUdMLENBQUMsRUFBRUssQ0FBQyxHQUFHTCxDQUFDLEdBQUcsQ0FBQyxJQUFJSyxDQUFDLEdBQUdoQixPQUFPLENBQUN2QyxNQUFNLEVBQUV1RCxDQUFDLEVBQUU7UUFBQUQsS0FBQTtNQUFBO01BNkNwRE4sU0FBUyxDQUFDaUIsV0FBVyxDQUFDZCxPQUFPLENBQUM7SUFDbEM7SUFFQWtCLFVBQVUsQ0FBQ3BCLEtBQUssQ0FBQztJQUNqQixPQUFPRCxTQUFTO0VBQ3BCO0VBRUEsU0FBU2hCLGlCQUFpQkEsQ0FBQ0osS0FBSyxFQUFFRSxRQUFRLEVBQUVULGNBQWMsRUFBRWEsQ0FBQyxFQUFFO0lBQzNELElBQUlBLENBQUMsRUFBRTtNQUNIRSxPQUFPLENBQUNJLEdBQUcsQ0FBQyxxQkFBcUIsR0FBR04sQ0FBQyxDQUFDb0MsTUFBTSxDQUFDN0QsU0FBUyxDQUFDO0lBQzNEO0lBQ0EyQixPQUFPLENBQUNJLEdBQUcsQ0FBQ1osS0FBSyxDQUFDO0lBQ2xCUSxPQUFPLENBQUNJLEdBQUcsQ0FBQ1YsUUFBUSxDQUFDO0lBQ3JCTSxPQUFPLENBQUNJLEdBQUcsQ0FBQ25CLGNBQWMsQ0FBQztJQUMzQixJQUFJLENBQUN6QyxNQUFNLElBQUl5QyxjQUFjLENBQUNtQyxJQUFJLENBQUMsVUFBQWIsQ0FBQztNQUFBLE9BQUlBLENBQUMsQ0FBQ2MsUUFBUSxJQUFJN0IsS0FBSyxDQUFDRyxPQUFPLElBQUtHLENBQUMsSUFBSUEsQ0FBQyxDQUFDb0MsTUFBTSxDQUFDN0QsU0FBUyxDQUFDOEQsUUFBUSxDQUFDLHFCQUFxQixDQUFFO0lBQUEsRUFBQyxFQUFFO01BQy9IO0lBQ0o7SUFFQW5DLE9BQU8sQ0FBQ0ksR0FBRyxDQUFDekQsY0FBYyxDQUFDO0lBRTNCLElBQU15RixPQUFPLEdBQUd6RixjQUFjLENBQUM2QyxLQUFLLENBQUNHLE9BQU8sQ0FBQztJQUM3Q0ssT0FBTyxDQUFDSSxHQUFHLENBQUMsbUJBQW1CLEVBQUV6RCxjQUFjLENBQUM7SUFDaEQsSUFBSSxDQUFDeUYsT0FBTyxJQUFJLENBQUNBLE9BQU8sQ0FBQ3pDLE9BQU8sRUFBRTtNQUM5QkssT0FBTyxDQUFDSSxHQUFHLENBQUMsMkJBQTJCLEdBQUdaLEtBQUssQ0FBQ0csT0FBTyxDQUFDO01BQ3hEO0lBQ0o7SUFFQW5CLE9BQU8sQ0FBQyxTQUFTLEVBQUU7TUFDZjZELE1BQU0sRUFBRSxNQUFNO01BQ2RDLElBQUksRUFBRUMsSUFBSSxDQUFDQyxTQUFTLENBQUM7UUFDakJDLE1BQU0sRUFBRWpHLE1BQU07UUFDZGtHLE9BQU8sRUFBRWxELEtBQUssQ0FBQ0c7TUFDbkIsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDM0MsSUFBSSxDQUFDLFVBQUEyRixRQUFRLEVBQUk7TUFDaEIsSUFBSUEsUUFBUSxDQUFDQyxPQUFPLEVBQUU7UUFDbEI1QyxPQUFPLENBQUNJLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRXVDLFFBQVEsQ0FBQ0UsS0FBSyxDQUFDO1FBQzdDQyxZQUFZLENBQUNWLE9BQU8sQ0FBQztRQUNyQjFDLFFBQVEsQ0FBQ3JCLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLE9BQU8sQ0FBQztRQUMvQnlFLGFBQWEsQ0FBQyxDQUFDLENBQUM7TUFDcEIsQ0FBQyxNQUFNO1FBQ0gvQyxPQUFPLENBQUNDLEtBQUssQ0FBQyx5QkFBeUIsRUFBRTBDLFFBQVEsQ0FBQzFDLEtBQUssQ0FBQztNQUM1RDtJQUNKLENBQUMsQ0FBQyxTQUFNLENBQUMsVUFBQUEsS0FBSyxFQUFJO01BQ2RELE9BQU8sQ0FBQ0MsS0FBSyxDQUFDLHVCQUF1QixFQUFFQSxLQUFLLENBQUM7SUFDakQsQ0FBQyxDQUFDO0VBQ047RUFHQSxTQUFTK0Isc0JBQXNCQSxDQUFDeEMsS0FBSyxFQUFFRSxRQUFRLEVBQUU7SUFDN0MsSUFBSSxDQUFDbEQsTUFBTSxFQUFFO01BQ1Q7SUFDSjtJQUVBLElBQU00RixPQUFPLEdBQUd6RixjQUFjLENBQUM2QyxLQUFLLENBQUNHLE9BQU8sQ0FBQztJQUM3QyxJQUFJLENBQUN5QyxPQUFPLElBQUksQ0FBQ0EsT0FBTyxDQUFDekMsT0FBTyxFQUFFO01BQzlCSyxPQUFPLENBQUNJLEdBQUcsQ0FBQywyQkFBMkIsR0FBR1osS0FBSyxDQUFDRyxPQUFPLENBQUM7TUFDeEQ7SUFDSjtJQUVBLElBQU1xRCxTQUFTLEdBQUdDLGlCQUFpQixDQUFDYixPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzlDLElBQUlZLFNBQVMsRUFBRTtNQUNYdEQsUUFBUSxDQUFDckIsU0FBUyxDQUFDNkUsTUFBTSxDQUFDLE9BQU8sQ0FBQztNQUNsQ0gsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JCO0VBQ0o7RUFFQSxTQUFTQSxhQUFhQSxDQUFDSSxJQUFJLEVBQUU7SUFDekIsSUFBTUMsV0FBVyxHQUFHLENBQUN2SCxXQUFXLENBQUNvQyxTQUFTO0lBQzFDZ0UsVUFBVSxDQUFDbUIsV0FBVyxHQUFHRCxJQUFJLENBQUM7RUFDbEM7RUFFQSxTQUFTbEIsVUFBVUEsQ0FBQ3hDLEtBQUssRUFBRTtJQUN2QjVELFdBQVcsQ0FBQ29DLFNBQVMsR0FBR3dCLEtBQUs7SUFFN0IsSUFBTTRELFNBQVMsR0FBRzVELEtBQUssR0FBRyxFQUFFO0lBQzVCLElBQUk2RCxjQUFjO0lBQ2xCLElBQUlELFNBQVMsS0FBSyxDQUFDLEVBQUU7TUFDakJDLGNBQWMsR0FBRyxRQUFRO0lBQzdCLENBQUMsTUFBTSxJQUFJRCxTQUFTLElBQUksQ0FBQyxJQUFJQSxTQUFTLElBQUksQ0FBQyxFQUFFO01BQ3pDQyxjQUFjLEdBQUcsUUFBUTtJQUM3QixDQUFDLE1BQU07TUFDSEEsY0FBYyxHQUFHLFFBQVE7SUFDN0I7SUFFQSxJQUFNQyxnQkFBZ0IsR0FBR3JGLFlBQVksQ0FBQ29GLGNBQWMsQ0FBQztJQUNyRHZILFVBQVUsQ0FBQ2tDLFNBQVMsR0FBR3NGLGdCQUFnQjtJQUV2QyxJQUFJOUQsS0FBSyxHQUFHLENBQUMsRUFBRTtNQUNYekQsVUFBVSxDQUFDcUMsU0FBUyxDQUFDNkUsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUN2QyxDQUFDLE1BQU07TUFDSGxILFVBQVUsQ0FBQ3FDLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUNwQztFQUNKO0VBRUEsU0FBU2tGLFlBQVlBLENBQUNoRSxLQUFLLEVBQWU7SUFBQSxJQUFiaUUsU0FBUyxHQUFBQyxTQUFBLENBQUE5RixNQUFBLFFBQUE4RixTQUFBLFFBQUFDLFNBQUEsR0FBQUQsU0FBQSxNQUFDLENBQUM7SUFDcEMsSUFBSUQsU0FBUyxHQUFHLENBQUMsRUFBRTtNQUNmekQsT0FBTyxDQUFDSSxHQUFHLENBQUMsaUNBQWlDLENBQUM7TUFDOUM7SUFDSjtJQUVBLE9BQU90RCxLQUFLLENBQUMsaUNBQWlDLEVBQUU7TUFDNUN1RixNQUFNLEVBQUUsTUFBTTtNQUNkQyxJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBUyxDQUFDO1FBQ2pCLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLElBQUksRUFBRSxFQUFFO1FBQ1IsUUFBUSxFQUFFLHFCQUFxQjtRQUMvQixRQUFRLEVBQUU7VUFDTixJQUFJLEVBQUU7WUFDRixNQUFNLEVBQUUsSUFBSTtZQUNaLFlBQVksRUFBRWlCLFNBQVM7WUFDdkIsVUFBVSxFQUFFakUsS0FBSyxDQUFDRztVQUN0QjtRQUNKO01BQ0osQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUNHM0MsSUFBSSxDQUFDLFVBQUFDLEdBQUc7TUFBQSxPQUFJQSxHQUFHLENBQUNDLElBQUksQ0FBQyxDQUFDO0lBQUEsRUFBQyxDQUN2QkYsSUFBSSxDQUFDLFVBQUFvRixPQUFPLEVBQUk7TUFDYixJQUFNd0IsUUFBUSxHQUFHeEIsT0FBTyxDQUFDeUIsTUFBTSxDQUFDQyxJQUFJLENBQUMsVUFBQUMsQ0FBQztRQUFBLE9BQUlBLENBQUMsQ0FBQ0MsV0FBVyxLQUFLeEUsS0FBSyxDQUFDeUUsVUFBVSxJQUFJRixDQUFDLENBQUNHLGdCQUFnQixLQUFLMUUsS0FBSyxDQUFDMkUsVUFBVTtNQUFBLEVBQUM7TUFDeEgsSUFBSVAsUUFBUSxFQUFFO1FBQ1YsSUFBTVEsT0FBTyxHQUFHUixRQUFRLENBQUNTLFFBQVEsQ0FBQ1AsSUFBSSxDQUFDLFVBQUFDLENBQUM7VUFBQSxPQUFJQSxDQUFDLENBQUNPLFlBQVksSUFBSTlFLEtBQUssQ0FBQytFLFdBQVc7UUFBQSxFQUFDO1FBQ2hGLElBQUksQ0FBQ0gsT0FBTyxFQUFFO1VBQ1YsT0FBT1osWUFBWSxDQUFDaEUsS0FBSyxFQUFFaUUsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUM3QztRQUNBLE9BQU87VUFDSGUsU0FBUyxFQUFFSixPQUFPLENBQUNLLFVBQVU7VUFDN0JDLFdBQVcsRUFBRU4sT0FBTyxDQUFDTyxZQUFZO1VBQ2pDQyxRQUFRLEVBQUVoQixRQUFRLENBQUNpQixTQUFTO1VBQzVCcEIsU0FBUyxFQUFFQSxTQUFTO1VBQ3BCOUQsT0FBTyxFQUFFSCxLQUFLLENBQUNHO1FBQ25CLENBQUM7TUFDTCxDQUFDLE1BQU07UUFDSCxPQUFPNkQsWUFBWSxDQUFDaEUsS0FBSyxFQUFFaUUsU0FBUyxHQUFHLENBQUMsQ0FBQztNQUM3QztJQUNKLENBQUMsQ0FBQyxDQUNEekcsSUFBSSxDQUFDLFVBQUE4SCxDQUFDLEVBQUk7TUFDUDlFLE9BQU8sQ0FBQ0ksR0FBRyxDQUFDMEUsQ0FBQyxDQUFDO01BQ2RuSSxjQUFjLENBQUNtSSxDQUFDLENBQUNuRixPQUFPLENBQUMsR0FBR21GLENBQUM7TUFDN0IsT0FBT0EsQ0FBQztJQUNaLENBQUMsQ0FBQyxTQUNJLENBQUMsVUFBQTdFLEtBQUssRUFBSTtNQUNaRCxPQUFPLENBQUNJLEdBQUcsQ0FBQ0gsS0FBSyxDQUFDO0lBQ3RCLENBQUMsQ0FBQztFQUNWO0VBRUEsU0FBU3NCLFVBQVVBLENBQUN3RCxJQUFJLEVBQUU7SUFDdEIsSUFBSSxDQUFDQSxJQUFJLEVBQUU7TUFDUDtJQUNKO0lBQ0EsSUFBTUMsQ0FBQyxHQUFHLElBQUl4RSxJQUFJLENBQUN1RSxJQUFJLENBQUM7SUFDeEIsSUFBTUUsR0FBRyxHQUFHQyxNQUFNLENBQUNGLENBQUMsQ0FBQ0csT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUNoRCxJQUFNQyxLQUFLLEdBQUdILE1BQU0sQ0FBQ0YsQ0FBQyxDQUFDTSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDRixRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUN2RCxVQUFBckksTUFBQSxDQUFVa0ksR0FBRyxPQUFBbEksTUFBQSxDQUFJc0ksS0FBSztFQUMxQjtFQUVBLFNBQVN2QyxZQUFZQSxDQUFDdEQsS0FBSyxFQUFFO0lBQ3pCLElBQUksQ0FBQytGLE1BQU0sQ0FBQ0Msa0JBQWtCLEVBQUU7TUFDNUJ4RixPQUFPLENBQUNJLEdBQUcsQ0FBQyx5Q0FBeUMsQ0FBQztNQUN0RDtJQUNKO0lBQ0EsSUFBTWdFLE9BQU8sR0FBRztNQUNaLFdBQVcsRUFBRTVFLEtBQUssQ0FBQ2lFLFNBQVM7TUFDNUIsU0FBUyxFQUFFakUsS0FBSyxDQUFDRyxPQUFPO01BQ3hCLFVBQVUsRUFBRUgsS0FBSyxDQUFDb0YsUUFBUTtNQUMxQixXQUFXLEVBQUVwRixLQUFLLENBQUNnRjtJQUN2QixDQUFDO0lBQ0RlLE1BQU0sQ0FBQ0Msa0JBQWtCLENBQUMsQ0FBQ3BCLE9BQU8sQ0FBQyxDQUFDO0VBQ3hDO0VBRUEsU0FBU25CLGlCQUFpQkEsQ0FBQ3pELEtBQUssRUFBRTtJQUM5QixJQUFJLENBQUMrRixNQUFNLENBQUNFLGtCQUFrQixFQUFFO01BQzVCekYsT0FBTyxDQUFDSSxHQUFHLENBQUMsc0NBQXNDLENBQUM7TUFDbkQsT0FBTyxLQUFLLENBQUMsQ0FBQztJQUNsQjtJQUVBLElBQU1vRSxTQUFTLEdBQUdoRixLQUFLLENBQUNnRixTQUFTLENBQUMsQ0FBQzs7SUFFbkM7SUFDQSxJQUFNWCxNQUFNLEdBQUcwQixNQUFNLENBQUNFLGtCQUFrQixDQUFDLENBQUNqQixTQUFTLENBQUMsQ0FBQztJQUVyRCxJQUFJWCxNQUFNLElBQUlBLE1BQU0sWUFBWTZCLE9BQU8sRUFBRTtNQUNyQzdCLE1BQU0sQ0FDRDdHLElBQUksQ0FBQztRQUFBLE9BQU1nRCxPQUFPLENBQUNJLEdBQUcsMEdBQUFyRCxNQUFBLENBQStCeUgsU0FBUyxDQUFFLENBQUM7TUFBQSxFQUFDLFNBQzdELENBQUMsVUFBQTNFLEdBQUc7UUFBQSxPQUFJRyxPQUFPLENBQUNDLEtBQUssbUlBQUFsRCxNQUFBLENBQW9DeUgsU0FBUyxRQUFLM0UsR0FBRyxDQUFDO01BQUEsRUFBQztJQUMxRixDQUFDLE1BQU07TUFDSEcsT0FBTyxDQUFDSSxHQUFHLG9GQUFBckQsTUFBQSxDQUFtQjhHLE1BQU0sb0NBQUE5RyxNQUFBLENBQWtCeUgsU0FBUyxDQUFFLENBQUM7SUFDdEU7SUFFQSxPQUFPWCxNQUFNO0VBQ2pCO0VBRUEsU0FBUzdFLGVBQWVBLENBQUEsRUFBRztJQUN2QixJQUFJLENBQUN1RyxNQUFNLENBQUN2RyxlQUFlLEVBQUU7TUFDekJnQixPQUFPLENBQUNJLEdBQUcsQ0FBQyxzQ0FBc0MsQ0FBQztNQUNuRCxPQUFPc0YsT0FBTyxDQUFDQyxPQUFPLENBQUMsRUFBRSxDQUFDO0lBQzlCO0lBRUEsT0FBT0osTUFBTSxDQUFDdkcsZUFBZSxDQUFDLENBQUMsQ0FDMUJoQyxJQUFJLENBQUMsVUFBQTZHLE1BQU0sRUFBSTtNQUNaN0QsT0FBTyxDQUFDSSxHQUFHLENBQUMsZ0JBQWdCLEVBQUV5RCxNQUFNLENBQUM7TUFDckMsT0FBT0EsTUFBTTtJQUNqQixDQUFDLENBQUMsU0FDSSxDQUFDLFVBQUE1RCxLQUFLLEVBQUk7TUFDWkQsT0FBTyxDQUFDQyxLQUFLLENBQUMsMkJBQTJCLEVBQUVBLEtBQUssQ0FBQztNQUNqRCxPQUFPLEVBQUU7SUFDYixDQUFDLENBQUM7RUFDVjtFQUVBLFNBQVMyRixJQUFJQSxDQUFBLEVBQUc7SUFDWjFGLFFBQVEsQ0FBQyxDQUFDO0lBRVYsSUFBSXFGLE1BQU0sQ0FBQ00sS0FBSyxFQUFFO01BQ2QsSUFBSUMsS0FBSyxHQUFHUCxNQUFNLENBQUNNLEtBQUssQ0FBQ0UsUUFBUSxDQUFDLENBQUM7TUFDbkN2SixNQUFNLEdBQUdzSixLQUFLLENBQUNFLElBQUksQ0FBQ0MsWUFBWSxJQUFJSCxLQUFLLENBQUNFLElBQUksQ0FBQ0UsRUFBRSxJQUFJLEVBQUU7SUFDM0QsQ0FBQyxNQUFNO01BQ0gsSUFBSUMsQ0FBQyxHQUFHLENBQUM7TUFDVCxJQUFJckYsQ0FBQyxHQUFHc0YsV0FBVyxDQUFDLFlBQVk7UUFDNUIsSUFBSUQsQ0FBQyxHQUFHLEVBQUUsRUFBRTtVQUNSLElBQUksQ0FBQyxDQUFDWixNQUFNLENBQUNjLFNBQVMsRUFBRTtZQUNwQjdKLE1BQU0sR0FBRytJLE1BQU0sQ0FBQ2MsU0FBUztZQUN6QkMsYUFBYSxDQUFDLENBQUM7WUFDZkMsYUFBYSxDQUFDekYsQ0FBQyxDQUFDO1VBQ3BCO1FBQ0osQ0FBQyxNQUFNO1VBQ0h5RixhQUFhLENBQUN6RixDQUFDLENBQUM7UUFDcEI7TUFDSixDQUFDLEVBQUUsR0FBRyxDQUFDO0lBQ1g7SUFFQXdGLGFBQWEsQ0FBQyxDQUFDO0VBQ25CO0VBRUEsSUFBSUEsYUFBYSxHQUFHLFNBQWhCQSxhQUFhQSxDQUFBLEVBQVM7SUFDdEIsSUFBSTlKLE1BQU0sRUFBRTtNQUFBLElBQUFnSyxVQUFBLEdBQUFySCwwQkFBQSxDQUNnQjFELFVBQVU7UUFBQWdMLE1BQUE7TUFBQTtRQUFsQyxLQUFBRCxVQUFBLENBQUFuSCxDQUFBLE1BQUFvSCxNQUFBLEdBQUFELFVBQUEsQ0FBQWxILENBQUEsSUFBQUMsSUFBQSxHQUFvQztVQUFBLElBQXpCbUgsU0FBUyxHQUFBRCxNQUFBLENBQUFoSCxLQUFBO1VBQ2hCaUgsU0FBUyxDQUFDckksU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ25DO01BQUMsU0FBQXVCLEdBQUE7UUFBQTJHLFVBQUEsQ0FBQTFHLENBQUEsQ0FBQUQsR0FBQTtNQUFBO1FBQUEyRyxVQUFBLENBQUF6RyxDQUFBO01BQUE7TUFDRDlELFVBQVUsQ0FBQ29DLFNBQVMsQ0FBQzZFLE1BQU0sQ0FBQyxNQUFNLENBQUM7TUFDbkMsSUFBTXBFLFNBQVMsR0FBR3BELFFBQVEsQ0FBQ0ksYUFBYSxDQUFDLGFBQWEsQ0FBQztNQUN2RGdELFNBQVMsQ0FBQ1QsU0FBUyxDQUFDNkUsTUFBTSxDQUFDLE1BQU0sQ0FBQztNQUNsQyxJQUFNdEMsU0FBUyxHQUFHbEYsUUFBUSxDQUFDSSxhQUFhLENBQUMsZUFBZSxDQUFDO01BQ3pEOEUsU0FBUyxDQUFDdkMsU0FBUyxDQUFDNkUsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUN0QyxDQUFDLE1BQU07TUFDSGpILFVBQVUsQ0FBQ29DLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLE1BQU0sQ0FBQztNQUFBLElBQUFxSSxVQUFBLEdBQUF4SCwwQkFBQSxDQUNMdkQsZUFBZTtRQUFBZ0wsTUFBQTtNQUFBO1FBQTFDLEtBQUFELFVBQUEsQ0FBQXRILENBQUEsTUFBQXVILE1BQUEsR0FBQUQsVUFBQSxDQUFBckgsQ0FBQSxJQUFBQyxJQUFBLEdBQTRDO1VBQUEsSUFBbkNzSCxjQUFjLEdBQUFELE1BQUEsQ0FBQW5ILEtBQUE7VUFDbkJvSCxjQUFjLENBQUN4SSxTQUFTLENBQUNDLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDeEM7TUFBQyxTQUFBdUIsR0FBQTtRQUFBOEcsVUFBQSxDQUFBN0csQ0FBQSxDQUFBRCxHQUFBO01BQUE7UUFBQThHLFVBQUEsQ0FBQTVHLENBQUE7TUFBQTtNQUFBLElBQUErRyxVQUFBLEdBQUEzSCwwQkFBQSxDQUN1QjFELFVBQVU7UUFBQXNMLE1BQUE7TUFBQTtRQUFsQyxLQUFBRCxVQUFBLENBQUF6SCxDQUFBLE1BQUEwSCxNQUFBLEdBQUFELFVBQUEsQ0FBQXhILENBQUEsSUFBQUMsSUFBQSxHQUFvQztVQUFBLElBQXpCbUgsVUFBUyxHQUFBSyxNQUFBLENBQUF0SCxLQUFBO1VBQ2hCaUgsVUFBUyxDQUFDckksU0FBUyxDQUFDNkUsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUN0QztNQUFDLFNBQUFyRCxHQUFBO1FBQUFpSCxVQUFBLENBQUFoSCxDQUFBLENBQUFELEdBQUE7TUFBQTtRQUFBaUgsVUFBQSxDQUFBL0csQ0FBQTtNQUFBO0lBQ0w7RUFDSixDQUFDO0VBRURsRCxnQkFBZ0IsQ0FBQyxDQUFDLENBQ2JHLElBQUksQ0FBQzRJLElBQUksQ0FBQztFQUVmLElBQUl4SCxRQUFRLEdBQUcxQyxRQUFRLENBQUNJLGFBQWEsQ0FBQyxZQUFZLENBQUM7RUFDbkRrTCxVQUFVLENBQUM7SUFBQSxPQUFNNUksUUFBUSxDQUFDQyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxVQUFVLENBQUM7RUFBQSxHQUFFLElBQUksQ0FBQztFQUUxRCxTQUFTcUMsVUFBVUEsQ0FBQSxFQUFHO0lBQ2xCLElBQUlzRyxVQUFVLEdBQUcsS0FBSztJQUN0QixJQUFJQyxNQUFNO0lBQ1YsSUFBSUMsVUFBVTtJQUVkLElBQU1DLGtCQUFrQixHQUFHMUwsUUFBUSxDQUFDOEIsY0FBYyxDQUFDLG9CQUFvQixDQUFDO0lBQ3hFLElBQU02SixTQUFTLEdBQUczTCxRQUFRLENBQUNDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDO0lBQ2pFLElBQU0yTCxHQUFHLEdBQUc1TCxRQUFRLENBQUNJLGFBQWEsQ0FBQyxlQUFlLENBQUM7SUFDbkQsSUFBTXlMLGVBQWUsR0FBR0YsU0FBUyxDQUFDekosTUFBTTtJQUV4QyxRQUFRMkosZUFBZTtNQUNuQixLQUFLLENBQUM7UUFDRkQsR0FBRyxDQUFDRSxLQUFLLENBQUNDLFFBQVEsR0FBRyxRQUFRO1FBQzdCO01BQ0osS0FBSyxDQUFDO1FBQ0ZILEdBQUcsQ0FBQ0UsS0FBSyxDQUFDQyxRQUFRLEdBQUcsUUFBUTtRQUM3QjtNQUNKLEtBQUssQ0FBQztRQUNGSCxHQUFHLENBQUNFLEtBQUssQ0FBQ0MsUUFBUSxHQUFHLFFBQVE7UUFDN0I7TUFDSixLQUFLLENBQUM7UUFDRkgsR0FBRyxDQUFDRSxLQUFLLENBQUNDLFFBQVEsR0FBRyxPQUFPO1FBQzVCO01BQ0osS0FBSyxDQUFDO1FBQ0ZILEdBQUcsQ0FBQ0UsS0FBSyxDQUFDQyxRQUFRLEdBQUcsT0FBTztRQUM1QjtNQUNKO1FBQ0lILEdBQUcsQ0FBQ0UsS0FBSyxDQUFDQyxRQUFRLEdBQUcsUUFBUTtRQUM3QjtJQUNSO0lBRUFMLGtCQUFrQixDQUFDckksZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFVBQUNlLENBQUMsRUFBSztNQUNwRG1ILFVBQVUsR0FBRyxJQUFJO01BQ2pCQyxNQUFNLEdBQUdwSCxDQUFDLENBQUM0SCxLQUFLLEdBQUdOLGtCQUFrQixDQUFDTyxVQUFVO01BQ2hEUixVQUFVLEdBQUdDLGtCQUFrQixDQUFDRCxVQUFVO0lBRTlDLENBQUMsQ0FBQztJQUVGQyxrQkFBa0IsQ0FBQ3JJLGdCQUFnQixDQUFDLFlBQVksRUFBRSxZQUFNO01BQ3BEa0ksVUFBVSxHQUFHLEtBQUs7SUFDdEIsQ0FBQyxDQUFDO0lBRUZHLGtCQUFrQixDQUFDckksZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFlBQU07TUFDakRrSSxVQUFVLEdBQUcsS0FBSztJQUN0QixDQUFDLENBQUM7SUFFRkcsa0JBQWtCLENBQUNySSxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsVUFBQ2UsQ0FBQyxFQUFLO01BQ3BELElBQUksQ0FBQ21ILFVBQVUsRUFBRTtNQUNqQm5ILENBQUMsQ0FBQzhILGNBQWMsQ0FBQyxDQUFDO01BQ2xCLElBQU1DLENBQUMsR0FBRy9ILENBQUMsQ0FBQzRILEtBQUssR0FBR04sa0JBQWtCLENBQUNPLFVBQVU7TUFDakQsSUFBTUcsSUFBSSxHQUFHLENBQUNELENBQUMsR0FBR1gsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDO01BQy9CRSxrQkFBa0IsQ0FBQ0QsVUFBVSxHQUFHQSxVQUFVLEdBQUdXLElBQUk7SUFDckQsQ0FBQyxDQUFDO0VBQ047O0VBRUE7RUFDQSxJQUFNQyxTQUFTLEdBQUdyTSxRQUFRLENBQUNJLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQztFQUVoRWlNLFNBQVMsQ0FBQ2hKLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFVO0lBQzFDZ0osU0FBUyxDQUFDMUosU0FBUyxDQUFDMkosTUFBTSxDQUFDLFFBQVEsQ0FBQztFQUN4QyxDQUFDLENBQUM7RUFFRnRNLFFBQVEsQ0FBQ0ksYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDaUQsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQUs7SUFDL0RyRCxRQUFRLENBQUM0RyxJQUFJLENBQUNqRSxTQUFTLENBQUMySixNQUFNLENBQUMsTUFBTSxDQUFDO0VBQzFDLENBQUMsQ0FBQztFQUVGdE0sUUFBUSxDQUFDSSxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUNpRCxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBTTtJQUMvRDNDLE1BQU0sR0FBR0EsTUFBTSxLQUFLLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSTtJQUN0Q0MsY0FBYyxDQUFDNEwsT0FBTyxDQUFDLFFBQVEsRUFBRTdMLE1BQU0sQ0FBQztJQUN4Q21KLE1BQU0sQ0FBQzJDLFFBQVEsQ0FBQ0MsTUFBTSxDQUFDLENBQUM7RUFDNUIsQ0FBQyxDQUFDO0VBRUZ6TSxRQUFRLENBQUNJLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQ2lELGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFNO0lBQ2hFdkMsTUFBTSxHQUFHQSxNQUFNLEtBQUssU0FBUyxHQUFHLENBQUMsR0FBRyxTQUFTO0lBQzdDSCxjQUFjLENBQUM0TCxPQUFPLENBQUMsUUFBUSxFQUFFekwsTUFBTSxDQUFDO0lBQ3hDK0ksTUFBTSxDQUFDMkMsUUFBUSxDQUFDQyxNQUFNLENBQUMsQ0FBQztFQUU1QixDQUFDLENBQUM7QUFXTixDQUFDLEVBQUUsQ0FBQztBQ3pmSiIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBhcGlVUkwgPSAnaHR0cHM6Ly9mYXYtcHJvbS5jb20vYXBpX2ZvcmVjYXN0X3Bvc3Rlcic7XG5cbiAgICBjb25zdFxuICAgICAgICB1bmF1dGhNc2dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmF1dGhCdG4nKSxcbiAgICAgICAgcGFydGljaXBhdGVCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnByZWRpY3RCdG4nKSxcbiAgICAgICAgY291bnRlclNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY291bnRlcicpLFxuICAgICAgICBldmVudHNTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmV2ZW50cycpLFxuICAgICAgICB3ZWxjb21lQmV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX2JldCcpLFxuICAgICAgICBzd2l0Y2hXcmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53ZWxjb21lX19zd2l0Y2hcIik7XG5cbiAgICBjb25zdCB1a0xlbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdWtMZW5nJyk7XG4gICAgY29uc3QgZW5MZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2VuTGVuZycpO1xuXG4gICAgbGV0IGxvY2FsZSA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJsb2NhbGVcIikgPz8gJ3VrJztcblxuICAgIGlmICh1a0xlbmcpIGxvY2FsZSA9ICd1ayc7XG4gICAgaWYgKGVuTGVuZykgbG9jYWxlID0gJ2VuJztcblxuICAgIGxldCBpMThuRGF0YSA9IHt9O1xuICAgIGxldCB1c2VySWQ7XG4gICAgbGV0IGVsZW1lbnRzQnlNYXRjaGlEID0ge307XG4gICAgbGV0IGFsbE1hdGNoZXMgPSBbXTtcbiAgICBsZXQgZmF2RGF0YUJ5TWF0Y2ggPSB7fTtcbiAgICB1c2VySWQgPSBOdW1iZXIoc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShcInVzZXJJZFwiKSkgPz8gMTAzMDMxNTk3IDtcblxuICAgIGZ1bmN0aW9uIGxvYWRUcmFuc2xhdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChgJHthcGlVUkx9L25ldy10cmFuc2xhdGVzLyR7bG9jYWxlfWApLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihqc29uID0+IHtcbiAgICAgICAgICAgICAgICBpMThuRGF0YSA9IGpzb247XG4gICAgICAgICAgICAgICAgdHJhbnNsYXRlKCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbXV0YXRpb25PYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JlY2FzdFBvc3RlcicpLCB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlKCkge1xuICAgICAgICBjb25zdCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRyYW5zbGF0ZV0nKVxuICAgICAgICBpZiAoZWxlbXMgJiYgZWxlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBlbGVtcy5mb3JFYWNoKGVsZW0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpO1xuICAgICAgICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gdHJhbnNsYXRlS2V5KGtleSk7XG4gICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNsYXRlJyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGlmIChsb2NhbGUgPT09ICdlbicpIHtcbiAgICAgICAgICAgIG1haW5QYWdlLmNsYXNzTGlzdC5hZGQoJ2VuJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0cmFuc2xhdGVLZXkoa2V5LCBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0VmFsdWUgPSBkZWZhdWx0VmFsdWUgfHwga2V5O1xuICAgICAgICByZXR1cm4gaTE4bkRhdGFba2V5XSB8fCBkZWZhdWx0VmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3QgcmVxdWVzdCA9IGZ1bmN0aW9uIChsaW5rLCBleHRyYU9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGFwaVVSTCArIGxpbmssIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAuLi4oZXh0cmFPcHRpb25zIHx8IHt9KVxuICAgICAgICB9KS50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRBZGRBbGxCdG4oKSB7XG4gICAgICAgIGNvbnN0IGFkZEFsbEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcmVkaWN0QnRuJyk7XG4gICAgICAgIGFkZEFsbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBnZXRCZXRzbGlwSXRlbXMoKS50aGVuKGJldHNsaXBNYXRjaGVzID0+IHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IG1hdGNoIG9mIGFsbE1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hEaXYgPSBlbGVtZW50c0J5TWF0Y2hpRFttYXRjaC5tYXRjaElkXTtcbiAgICAgICAgICAgICAgICAgICAgYWRkTWF0Y2hUb0JldHNsaXAobWF0Y2gsIG1hdGNoRGl2LCBiZXRzbGlwTWF0Y2hlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgYmV0c2xpcCBpdGVtczonLCBlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgSW5pdFBhZ2UgPSAoKSA9PiB7XG4gICAgICAgIHRyYW5zbGF0ZSgpO1xuICAgICAgICBpbml0QWRkQWxsQnRuKCk7XG4gICAgICAgIHJlcXVlc3QoJy9tYXRjaGVzJykudGhlbihtYXRjaGVzID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1hdGNoZXMpO1xuICAgICAgICAgICAgYWxsTWF0Y2hlcyA9IChtYXRjaGVzIHx8IFtdKS5zb3J0KChhLCBiKSA9PiBuZXcgRGF0ZShhLmFjdGl2ZURhdGUpIC0gbmV3IERhdGUoYi5hY3RpdmVEYXRlKSk7XG5cbiAgICAgICAgICAgIGdldEJldHNsaXBJdGVtcygpLnRoZW4oYmV0c2xpcE1hdGNoZXMgPT4ge1xuICAgICAgICAgICAgICAgIGluaXRNYXRjaGVzKGFsbE1hdGNoZXMsIGJldHNsaXBNYXRjaGVzKTtcbiAgICAgICAgICAgICAgICBpbml0U2xpZGVyKCk7XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcignRXJyb3IgZ2V0dGluZyBiZXRzbGlwIGl0ZW1zOicsIGVycikpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0TWF0Y2hlcyhtYXRjaGVzLCBiZXRzbGlwTWF0Y2hlcykge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VsY29tZV9fcm93Jyk7XG4gICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAgICAgICBsZXQgYWRkZWQgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdGNoZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvd1dyYXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHJvd1dyYXAuY2xhc3NOYW1lID0gJ3dlbGNvbWVfX3Jvdy13cmFwJztcblxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IGk7IGogPCBpICsgMiAmJiBqIDwgbWF0Y2hlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gbWF0Y2hlc1tqXTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgICAgIG1hdGNoRGl2LmNsYXNzTmFtZSA9ICd3ZWxjb21lX19pdGVtJztcbiAgICAgICAgICAgICAgICBtYXRjaC5tYXRjaElkID0gKCttYXRjaC5tYXRjaElkKTtcbiAgICAgICAgICAgICAgICBpZiAoYmV0c2xpcE1hdGNoZXMuc29tZShiID0+IGIuZXZlbnRfaWQgPT0gbWF0Y2gubWF0Y2hJZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkZWQrKztcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hEaXYuY2xhc3NMaXN0LmFkZCgnX2RvbmUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBtYXRjaERpdi5pbm5lckhUTUwgPSBgXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tY2xvc2VcIj48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1yb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tdGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiaHR0cHM6Ly9mYXYtcHJvbS5jb20vaHRtbC9mb3JlY2FzdC1wb3N0ZXIvaW1nL3dlbGNvbWUvZmF2LnN2Z1wiIGFsdD1cIkZBVkJFVFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+JHt0cmFuc2xhdGVLZXkobWF0Y2gudGl0bGUpfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLWRhdGVcIj4ke2Zvcm1hdERhdGUobWF0Y2gubWF0Y2hEYXRlKX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1tYXgtdGl0bGVcIj4ke3RyYW5zbGF0ZUtleShtYXRjaC50ZWFtMSl9IOKAkyAke3RyYW5zbGF0ZUtleShtYXRjaC50ZWFtMil9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0taW5mb1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1iaWRcIj4ke3RyYW5zbGF0ZUtleShtYXRjaC5vdXRjb21lVHJhbnNsYXRpb24pfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1jb2ZcIj4ke21hdGNoLmRlZmF1bHRDb2VmIHx8IDB9PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICBgO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudHNCeU1hdGNoaURbbWF0Y2gubWF0Y2hJZF0gPSBtYXRjaERpdjtcbiAgICAgICAgICAgICAgICByb3dXcmFwLmFwcGVuZENoaWxkKG1hdGNoRGl2KTtcblxuICAgICAgICAgICAgICAgIC8vIGdldE1hdGNoRGF0YShtYXRjaCkudGhlbihtID0+IHtcbiAgICAgICAgICAgICAgICAvLyAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNvbnN0IGNvZkRpdiA9IG1hdGNoRGl2LnF1ZXJ5U2VsZWN0b3IoJy53ZWxjb21lX19pdGVtLWNvZicpO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgY29mRGl2LmlubmVySFRNTCA9IG0ub3V0Y29tZUNvZWY7XG4gICAgICAgICAgICAgICAgLy8gICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhgTm8gb3V0Y29tZSBkYXRhIGZvciAke21hdGNoLm1hdGNoSWR9YCk7XG4gICAgICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgICAgICAvLyB9KTtcblxuICAgICAgICAgICAgICAgIG1hdGNoRGl2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IGFkZE1hdGNoVG9CZXRzbGlwKG1hdGNoLCBtYXRjaERpdiwgYmV0c2xpcE1hdGNoZXMsIGUpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjbG9zZUJ0biA9IG1hdGNoRGl2LnF1ZXJ5U2VsZWN0b3IoJy53ZWxjb21lX19pdGVtLWNsb3NlJyk7XG4gICAgICAgICAgICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVNYXRjaEZyb21CZXRzbGlwKG1hdGNoLCBtYXRjaERpdik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocm93V3JhcCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRDb3VudGVyKGFkZGVkKTtcbiAgICAgICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRNYXRjaFRvQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYsIGJldHNsaXBNYXRjaGVzLCBlKSB7XG4gICAgICAgIGlmIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnVGFyZ2V0IGNsYXNzIGxpc3Q6ICcgKyBlLnRhcmdldC5jbGFzc0xpc3QpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKG1hdGNoKTtcbiAgICAgICAgY29uc29sZS5sb2cobWF0Y2hEaXYpO1xuICAgICAgICBjb25zb2xlLmxvZyhiZXRzbGlwTWF0Y2hlcyk7XG4gICAgICAgIGlmICghdXNlcklkIHx8IGJldHNsaXBNYXRjaGVzLnNvbWUoYiA9PiBiLmV2ZW50X2lkID09IG1hdGNoLm1hdGNoSWQgfHwgKGUgJiYgZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd3ZWxjb21lX19pdGVtLWNsb3NlJykpKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coZmF2RGF0YUJ5TWF0Y2gpO1xuXG4gICAgICAgIGNvbnN0IGZhdkRhdGEgPSBmYXZEYXRhQnlNYXRjaFttYXRjaC5tYXRjaElkXTtcbiAgICAgICAgY29uc29sZS5sb2coJ0ZBViBEQVRBIEJZIE1BVENIJywgZmF2RGF0YUJ5TWF0Y2gpXG4gICAgICAgIGlmICghZmF2RGF0YSB8fCAhZmF2RGF0YS5tYXRjaElkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTm8gZmF2IGRhdGEgZm9yIG1hdGNoIGlkICcgKyBtYXRjaC5tYXRjaElkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3QoJy9ldmVudHMnLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICB1c2VyaWQ6IHVzZXJJZCxcbiAgICAgICAgICAgICAgICBldmVudElkOiBtYXRjaC5tYXRjaElkXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KS50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0V2ZW50IGNyZWF0ZWQ6JywgcmVzcG9uc2UuZXZlbnQpO1xuICAgICAgICAgICAgICAgIGFkZFRvQmV0c2xpcChmYXZEYXRhKTtcbiAgICAgICAgICAgICAgICBtYXRjaERpdi5jbGFzc0xpc3QuYWRkKCdfZG9uZScpO1xuICAgICAgICAgICAgICAgIHVwZGF0ZUNvdW50ZXIoMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgZXZlbnQ6JywgcmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBjcmVhdGluZyBldmVudDonLCBlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlTWF0Y2hGcm9tQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYpIHtcbiAgICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZhdkRhdGEgPSBmYXZEYXRhQnlNYXRjaFttYXRjaC5tYXRjaElkXTtcbiAgICAgICAgaWYgKCFmYXZEYXRhIHx8ICFmYXZEYXRhLm1hdGNoSWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBmYXYgZGF0YSBmb3IgbWF0Y2ggaWQgJyArIG1hdGNoLm1hdGNoSWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNSZW1vdmVkID0gcmVtb3ZlRnJvbUJldHNsaXAoZmF2RGF0YSk7IC8vIERpcmVjdGx5IGFzc2lnbiByZXN1bHRcbiAgICAgICAgaWYgKGlzUmVtb3ZlZCkge1xuICAgICAgICAgICAgbWF0Y2hEaXYuY2xhc3NMaXN0LnJlbW92ZSgnX2RvbmUnKTtcbiAgICAgICAgICAgIHVwZGF0ZUNvdW50ZXIoLTEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlQ291bnRlcihkaWZmKSB7XG4gICAgICAgIGNvbnN0IGN1cnJDb3VudGVyID0gK2NvdW50ZXJTcGFuLmlubmVySFRNTDtcbiAgICAgICAgc2V0Q291bnRlcihjdXJyQ291bnRlciArIGRpZmYpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldENvdW50ZXIodmFsdWUpIHtcbiAgICAgICAgY291bnRlclNwYW4uaW5uZXJIVE1MID0gdmFsdWU7XG5cbiAgICAgICAgY29uc3QgbGFzdERpZ2l0ID0gdmFsdWUgJSAxMDtcbiAgICAgICAgbGV0IHRyYW5zbGF0aW9uS2V5O1xuICAgICAgICBpZiAobGFzdERpZ2l0ID09PSAxKSB7XG4gICAgICAgICAgICB0cmFuc2xhdGlvbktleSA9ICdldmVudDEnO1xuICAgICAgICB9IGVsc2UgaWYgKGxhc3REaWdpdCA+PSAyICYmIGxhc3REaWdpdCA8PSA0KSB7XG4gICAgICAgICAgICB0cmFuc2xhdGlvbktleSA9ICdldmVudDInO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJhbnNsYXRpb25LZXkgPSAnZXZlbnQzJztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV2ZW50VHJhbnNsYXRpb24gPSB0cmFuc2xhdGVLZXkodHJhbnNsYXRpb25LZXkpO1xuICAgICAgICBldmVudHNTcGFuLmlubmVySFRNTCA9IGV2ZW50VHJhbnNsYXRpb247XG5cbiAgICAgICAgaWYgKHZhbHVlID4gMCkge1xuICAgICAgICAgICAgd2VsY29tZUJldC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3ZWxjb21lQmV0LmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldE1hdGNoRGF0YShtYXRjaCwgc2VydmljZUlkPTApIHtcbiAgICAgICAgaWYgKHNlcnZpY2VJZCA+IDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBkYXRhIGZvciAwIGFuZCAxIHNlcnZpY2UgaWRzJylcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmZXRjaCgnL3NlcnZpY2UvbGluZW91dC9mcm9udGVuZF9hcGkyLycsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIFwianNvbnJwY1wiOiBcIjIuMFwiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogMTYsXG4gICAgICAgICAgICAgICAgXCJtZXRob2RcIjogXCJmcm9udGVuZC9tYXJrZXQvZ2V0XCIsXG4gICAgICAgICAgICAgICAgXCJwYXJhbXNcIjoge1xuICAgICAgICAgICAgICAgICAgICBcImJ5XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGFuZ1wiOiAndWsnLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZXJ2aWNlX2lkXCI6IHNlcnZpY2VJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZXZlbnRfaWRcIjogbWF0Y2gubWF0Y2hJZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oZmF2RGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29lZkRhdGEgPSBmYXZEYXRhLnJlc3VsdC5maW5kKG8gPT4gby5tYXJrZXRfbmFtZSA9PT0gbWF0Y2gubWFya2V0TmFtZSAmJiBvLnJlc3VsdF90eXBlX25hbWUgPT09IG1hdGNoLm1hcmtldFR5cGUpO1xuICAgICAgICAgICAgICAgIGlmIChjb2VmRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBvdXRjb21lID0gY29lZkRhdGEub3V0Y29tZXMuZmluZChvID0+IG8ub3V0Y29tZV9uYW1lID09IG1hdGNoLm91dGNvbWVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvdXRjb21lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0TWF0Y2hEYXRhKG1hdGNoLCBzZXJ2aWNlSWQgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0Y29tZUlkOiBvdXRjb21lLm91dGNvbWVfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRjb21lQ29lZjogb3V0Y29tZS5vdXRjb21lX2NvZWYsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJrZXRJZDogY29lZkRhdGEubWFya2V0X2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZUlkOiBzZXJ2aWNlSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaElkOiBtYXRjaC5tYXRjaElkLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRNYXRjaERhdGEobWF0Y2gsIHNlcnZpY2VJZCArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhtKVxuICAgICAgICAgICAgICAgIGZhdkRhdGFCeU1hdGNoW20ubWF0Y2hJZF0gPSBtO1xuICAgICAgICAgICAgICAgIHJldHVybiBtO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0RGF0ZShkYXRlKSB7XG4gICAgICAgIGlmICghZGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgY29uc3QgZGF5ID0gU3RyaW5nKGQuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgICBjb25zdCBtb250aCA9IFN0cmluZyhkLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpO1xuICAgICAgICByZXR1cm4gYCR7ZGF5fS4ke21vbnRofWA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkVG9CZXRzbGlwKG1hdGNoKSB7XG4gICAgICAgIGlmICghd2luZG93LmFkZEJldHNsaXBPdXRjb21lcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIGFkZEJldHNsaXBPdXRjb21lcyBtZXRob2QgaXMgZGVmaW5lZCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG91dGNvbWUgPSB7XG4gICAgICAgICAgICAnc2VydmljZUlkJzogbWF0Y2guc2VydmljZUlkLFxuICAgICAgICAgICAgJ2V2ZW50SWQnOiBtYXRjaC5tYXRjaElkLFxuICAgICAgICAgICAgJ21hcmtldElkJzogbWF0Y2gubWFya2V0SWQsXG4gICAgICAgICAgICAnb3V0Y29tZUlkJzogbWF0Y2gub3V0Y29tZUlkXG4gICAgICAgIH07XG4gICAgICAgIHdpbmRvdy5hZGRCZXRzbGlwT3V0Y29tZXMoW291dGNvbWVdKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVGcm9tQmV0c2xpcChtYXRjaCkge1xuICAgICAgICBpZiAoIXdpbmRvdy5yZW1vdmVCZXRzbGlwSXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQnNC10YLQvtC0IHJlbW92ZUJldHNsaXBJdGVtcyDQvdC1INC30L3QsNC50LTQtdC90L4nKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8g0JfQvdCw0YfQtdC90L3RjyDQt9CwINC30LDQvNC+0LLRh9GD0LLQsNC90L3Rj9C8XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvdXRjb21lSWQgPSBtYXRjaC5vdXRjb21lSWQ7IC8vINCe0YLRgNC40LzRg9GU0LzQviDRgtGW0LvRjNC60LggaWRcblxuICAgICAgICAvLyDQktC40LrQu9C40LrQsNGU0LzQviDQvdC+0LLQuNC5INC80LXRgtC+0LQg0Lcg0LzQsNGB0LjQstC+0Lwg0LDQudC00ZZcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gd2luZG93LnJlbW92ZUJldHNsaXBJdGVtcyhbb3V0Y29tZUlkXSk7XG5cbiAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICByZXN1bHRcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiBjb25zb2xlLmxvZyhg0KPRgdC/0ZbRiNC90L4g0LLQuNC00LDQu9C10L3QviBvdXRjb21lSWQgJHtvdXRjb21lSWR9YCkpXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKGDQn9C+0LzQuNC70LrQsCDQv9GA0Lgg0LLQuNC00LDQu9C10L3QvdGWIG91dGNvbWVJZCAke291dGNvbWVJZH06YCwgZXJyKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhg0JzQtdGC0L7QtCDQv9C+0LLQtdGA0L3Rg9CyICR7cmVzdWx0fSDQtNC70Y8gb3V0Y29tZUlkICR7b3V0Y29tZUlkfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRCZXRzbGlwSXRlbXMoKSB7XG4gICAgICAgIGlmICghd2luZG93LmdldEJldHNsaXBJdGVtcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIGdldEJldHNsaXBJdGVtcyBtZXRob2QgaXMgZGVmaW5lZCcpO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gd2luZG93LmdldEJldHNsaXBJdGVtcygpXG4gICAgICAgICAgICAudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdCZXRzbGlwIGl0ZW1zOicsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluIGdldEJldHNsaXBJdGVtczonLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAgICAgSW5pdFBhZ2UoKTtcblxuICAgICAgICBpZiAod2luZG93LnN0b3JlKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSB3aW5kb3cuc3RvcmUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICAgIHVzZXJJZCA9IHN0YXRlLmF1dGguaXNBdXRob3JpemVkICYmIHN0YXRlLmF1dGguaWQgfHwgJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgYyA9IDA7XG4gICAgICAgICAgICB2YXIgaSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYyA8IDUwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIXdpbmRvdy5nX3VzZXJfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IHdpbmRvdy5nX3VzZXJfaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja1VzZXJBdXRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hlY2tVc2VyQXV0aCgpO1xuICAgIH1cblxuICAgIGxldCBjaGVja1VzZXJBdXRoID0gKCkgPT4ge1xuICAgICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHVuYXV0aE1lcyBvZiB1bmF1dGhNc2dzKSB7XG4gICAgICAgICAgICAgICAgdW5hdXRoTWVzLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaFdyYXAuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIilcbiAgICAgICAgICAgIGNvbnN0IGFkZEFsbEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcmVkaWN0QnRuJyk7XG4gICAgICAgICAgICBhZGRBbGxCdG4uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX3JvdycpO1xuICAgICAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaFdyYXAuY2xhc3NMaXN0LmFkZChcImhpZGVcIilcbiAgICAgICAgICAgIGZvciAobGV0IHBhcnRpY2lwYXRlQnRuIG9mIHBhcnRpY2lwYXRlQnRucykge1xuICAgICAgICAgICAgICAgIHBhcnRpY2lwYXRlQnRuLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgdW5hdXRoTWVzIG9mIHVuYXV0aE1zZ3MpIHtcbiAgICAgICAgICAgICAgICB1bmF1dGhNZXMuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZFRyYW5zbGF0aW9ucygpXG4gICAgICAgIC50aGVuKGluaXQpO1xuXG4gICAgbGV0IG1haW5QYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZhdl9fcGFnZScpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gbWFpblBhZ2UuY2xhc3NMaXN0LmFkZCgnb3ZlcmZsb3cnKSwgMTAwMCk7XG5cbiAgICBmdW5jdGlvbiBpbml0U2xpZGVyKCkge1xuICAgICAgICBsZXQgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICBsZXQgc3RhcnRYO1xuICAgICAgICBsZXQgc2Nyb2xsTGVmdDtcblxuICAgICAgICBjb25zdCBkcmFnZ2FibGVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJhZ2dhYmxlQ29udGFpbmVyJyk7XG4gICAgICAgIGNvbnN0IGl0ZW1zV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWxjb21lX19yb3ctd3JhcCcpXG4gICAgICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWxjb21lX19yb3cnKVxuICAgICAgICBjb25zdCBpdGVtc1dyYXBMZW5ndGggPSBpdGVtc1dyYXAubGVuZ3RoO1xuXG4gICAgICAgIHN3aXRjaCAoaXRlbXNXcmFwTGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgcm93LnN0eWxlLm1heFdpZHRoID0gJzIwOThweCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgcm93LnN0eWxlLm1heFdpZHRoID0gJzE2NjhweCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgcm93LnN0eWxlLm1heFdpZHRoID0gJzEyNThweCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcm93LnN0eWxlLm1heFdpZHRoID0gJzgyOHB4JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByb3cuc3R5bGUubWF4V2lkdGggPSAnNDE4cHgnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByb3cuc3R5bGUubWF4V2lkdGggPSAnMjA5OHB4JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGRyYWdnYWJsZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZSkgPT4ge1xuICAgICAgICAgICAgaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgICAgICAgICBzdGFydFggPSBlLnBhZ2VYIC0gZHJhZ2dhYmxlQ29udGFpbmVyLm9mZnNldExlZnQ7XG4gICAgICAgICAgICBzY3JvbGxMZWZ0ID0gZHJhZ2dhYmxlQ29udGFpbmVyLnNjcm9sbExlZnQ7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZHJhZ2dhYmxlQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgICAgICBpc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRyYWdnYWJsZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKCkgPT4ge1xuICAgICAgICAgICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICBkcmFnZ2FibGVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmICghaXNEcmFnZ2luZykgcmV0dXJuO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgeCA9IGUucGFnZVggLSBkcmFnZ2FibGVDb250YWluZXIub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIGNvbnN0IHdhbGsgPSAoeCAtIHN0YXJ0WCkgKiAyOyAvLyDQo9Cy0LXQu9C40YfRjNGC0LUg0LzQvdC+0LbQuNGC0LXQu9GMLCDRh9GC0L7QsdGLINC40LfQvNC10L3QuNGC0Ywg0YHQutC+0YDQvtGB0YLRjCDQv9GA0L7QutGA0YPRgtC60LhcbiAgICAgICAgICAgIGRyYWdnYWJsZUNvbnRhaW5lci5zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdCAtIHdhbGs7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIHRlc3RcbiAgICBjb25zdCBzd2l0Y2hCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndlbGNvbWVfX3N3aXRjaC1idG5cIilcblxuICAgIHN3aXRjaEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgc3dpdGNoQnRuLmNsYXNzTGlzdC50b2dnbGUoXCJhY3RpdmVcIilcbiAgICB9KVxuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kYXJrLWJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT57XG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShcImRhcmtcIilcbiAgICB9KVxuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sbmctYnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGxvY2FsZSA9IGxvY2FsZSA9PT0gJ3VrJyA/ICdlbicgOiAndWsnO1xuICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFwibG9jYWxlXCIsIGxvY2FsZSk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hdXRoLWJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICB1c2VySWQgPSB1c2VySWQgPT09IDEwMzAzMTU5NyA/IDAgOiAxMDMwMzE1OTc7XG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oXCJ1c2VySWRcIiwgdXNlcklkKTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICAgIFxuICAgIH0pO1xuXG5cblxuXG5cblxuXG5cblxuXG59KSgpO1xuIiwiIl19
