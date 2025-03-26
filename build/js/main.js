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
  document.querySelector(".bet-btn").addEventListener("click", function () {
    document.querySelector(".welcome__bet").classList.toggle("hide");
  });
})();
"use strict";
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzZWNvbmQuanMiXSwibmFtZXMiOlsiX3Nlc3Npb25TdG9yYWdlJGdldEl0IiwiX051bWJlciIsImFwaVVSTCIsInVuYXV0aE1zZ3MiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJwYXJ0aWNpcGF0ZUJ0bnMiLCJjb3VudGVyU3BhbiIsInF1ZXJ5U2VsZWN0b3IiLCJldmVudHNTcGFuIiwid2VsY29tZUJldCIsInN3aXRjaFdyYXAiLCJ1a0xlbmciLCJlbkxlbmciLCJsb2NhbGUiLCJzZXNzaW9uU3RvcmFnZSIsImdldEl0ZW0iLCJpMThuRGF0YSIsInVzZXJJZCIsImVsZW1lbnRzQnlNYXRjaGlEIiwiYWxsTWF0Y2hlcyIsImZhdkRhdGFCeU1hdGNoIiwiTnVtYmVyIiwibG9hZFRyYW5zbGF0aW9ucyIsImZldGNoIiwiY29uY2F0IiwidGhlbiIsInJlcyIsImpzb24iLCJ0cmFuc2xhdGUiLCJtdXRhdGlvbk9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm9ic2VydmUiLCJnZXRFbGVtZW50QnlJZCIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJlbGVtcyIsImxlbmd0aCIsImZvckVhY2giLCJlbGVtIiwia2V5IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwidHJhbnNsYXRlS2V5IiwicmVtb3ZlQXR0cmlidXRlIiwibWFpblBhZ2UiLCJjbGFzc0xpc3QiLCJhZGQiLCJkZWZhdWx0VmFsdWUiLCJyZXF1ZXN0IiwibGluayIsImV4dHJhT3B0aW9ucyIsIl9vYmplY3RTcHJlYWQiLCJoZWFkZXJzIiwiaW5pdEFkZEFsbEJ0biIsImFkZEFsbEJ0biIsImFkZEV2ZW50TGlzdGVuZXIiLCJnZXRCZXRzbGlwSXRlbXMiLCJiZXRzbGlwTWF0Y2hlcyIsIl9pdGVyYXRvciIsIl9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyIiwiX3N0ZXAiLCJzIiwibiIsImRvbmUiLCJtYXRjaCIsInZhbHVlIiwibWF0Y2hEaXYiLCJtYXRjaElkIiwiYWRkTWF0Y2hUb0JldHNsaXAiLCJlcnIiLCJlIiwiZiIsImNvbnNvbGUiLCJlcnJvciIsIkluaXRQYWdlIiwibWF0Y2hlcyIsImxvZyIsInNvcnQiLCJhIiwiYiIsIkRhdGUiLCJhY3RpdmVEYXRlIiwiaW5pdE1hdGNoZXMiLCJpbml0U2xpZGVyIiwiY29udGFpbmVyIiwiYWRkZWQiLCJpIiwicm93V3JhcCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJfbG9vcCIsImoiLCJzb21lIiwiZXZlbnRfaWQiLCJ0aXRsZSIsImZvcm1hdERhdGUiLCJtYXRjaERhdGUiLCJ0ZWFtMSIsInRlYW0yIiwib3V0Y29tZVRyYW5zbGF0aW9uIiwiZGVmYXVsdENvZWYiLCJhcHBlbmRDaGlsZCIsImNsb3NlQnRuIiwic3RvcFByb3BhZ2F0aW9uIiwicmVtb3ZlTWF0Y2hGcm9tQmV0c2xpcCIsInNldENvdW50ZXIiLCJ0YXJnZXQiLCJjb250YWlucyIsImZhdkRhdGEiLCJtZXRob2QiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInVzZXJpZCIsImV2ZW50SWQiLCJyZXNwb25zZSIsInN1Y2Nlc3MiLCJldmVudCIsImFkZFRvQmV0c2xpcCIsInVwZGF0ZUNvdW50ZXIiLCJpc1JlbW92ZWQiLCJyZW1vdmVGcm9tQmV0c2xpcCIsInJlbW92ZSIsImRpZmYiLCJjdXJyQ291bnRlciIsImxhc3REaWdpdCIsInRyYW5zbGF0aW9uS2V5IiwiZXZlbnRUcmFuc2xhdGlvbiIsImdldE1hdGNoRGF0YSIsInNlcnZpY2VJZCIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsImNvZWZEYXRhIiwicmVzdWx0IiwiZmluZCIsIm8iLCJtYXJrZXRfbmFtZSIsIm1hcmtldE5hbWUiLCJyZXN1bHRfdHlwZV9uYW1lIiwibWFya2V0VHlwZSIsIm91dGNvbWUiLCJvdXRjb21lcyIsIm91dGNvbWVfbmFtZSIsIm91dGNvbWVOYW1lIiwib3V0Y29tZUlkIiwib3V0Y29tZV9pZCIsIm91dGNvbWVDb2VmIiwib3V0Y29tZV9jb2VmIiwibWFya2V0SWQiLCJtYXJrZXRfaWQiLCJtIiwiZGF0ZSIsImQiLCJkYXkiLCJTdHJpbmciLCJnZXREYXRlIiwicGFkU3RhcnQiLCJtb250aCIsImdldE1vbnRoIiwid2luZG93IiwiYWRkQmV0c2xpcE91dGNvbWVzIiwicmVtb3ZlQmV0c2xpcEl0ZW1zIiwiUHJvbWlzZSIsInJlc29sdmUiLCJpbml0Iiwic3RvcmUiLCJzdGF0ZSIsImdldFN0YXRlIiwiYXV0aCIsImlzQXV0aG9yaXplZCIsImlkIiwiYyIsInNldEludGVydmFsIiwiZ191c2VyX2lkIiwiY2hlY2tVc2VyQXV0aCIsImNsZWFySW50ZXJ2YWwiLCJfaXRlcmF0b3IyIiwiX3N0ZXAyIiwidW5hdXRoTWVzIiwiX2l0ZXJhdG9yMyIsIl9zdGVwMyIsInBhcnRpY2lwYXRlQnRuIiwiX2l0ZXJhdG9yNCIsIl9zdGVwNCIsInNldFRpbWVvdXQiLCJpc0RyYWdnaW5nIiwic3RhcnRYIiwic2Nyb2xsTGVmdCIsImRyYWdnYWJsZUNvbnRhaW5lciIsIml0ZW1zV3JhcCIsInJvdyIsIml0ZW1zV3JhcExlbmd0aCIsInN0eWxlIiwibWF4V2lkdGgiLCJwYWdlWCIsIm9mZnNldExlZnQiLCJwcmV2ZW50RGVmYXVsdCIsIngiLCJ3YWxrIiwic3dpdGNoQnRuIiwidG9nZ2xlIiwic2V0SXRlbSIsImxvY2F0aW9uIiwicmVsb2FkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLENBQUMsVUFBQUEscUJBQUEsRUFBQUMsT0FBQSxFQUFZO0VBQ1QsSUFBTUMsTUFBTSxHQUFHLDBDQUEwQztFQUV6RCxJQUNJQyxVQUFVLEdBQUdDLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsVUFBVSxDQUFDO0lBQ2xEQyxlQUFlLEdBQUdGLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsYUFBYSxDQUFDO0lBQzFERSxXQUFXLEdBQUdILFFBQVEsQ0FBQ0ksYUFBYSxDQUFDLFVBQVUsQ0FBQztJQUNoREMsVUFBVSxHQUFHTCxRQUFRLENBQUNJLGFBQWEsQ0FB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QUFNLEtBQUssU0FBUyxHQUFHLENBQUMsR0FBRyxTQUFTO0lBQzdDSCxjQUFjLENBQUM0TCxPQUFPLENBQUMsUUFBUSxFQUFFekwsTUFBTSxDQUFDO0lBQ3hDK0ksTUFBTSxDQUFDMkMsUUFBUSxDQUFDQyxNQUFNLENBQUMsQ0FBQztFQUU1QixDQUFDLENBQUM7RUFFRnpNLFFBQVEsQ0FBQ0ksYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDaUQsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQU07SUFDL0RyRCxRQUFRLENBQUNJLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQ3VDLFNBQVMsQ0FBQzJKLE1BQU0sQ0FBQyxNQUFNLENBQUM7RUFDcEUsQ0FBQyxDQUFDO0FBWU4sQ0FBQyxFQUFFLENBQUM7QUM5ZkoiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYXBpVVJMID0gJ2h0dHBzOi8vZmF2LXByb20uY29tL2FwaV9mb3JlY2FzdF9wb3N0ZXInO1xuXG4gICAgY29uc3RcbiAgICAgICAgdW5hdXRoTXNncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hdXRoQnRuJyksXG4gICAgICAgIHBhcnRpY2lwYXRlQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcmVkaWN0QnRuJyksXG4gICAgICAgIGNvdW50ZXJTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50ZXInKSxcbiAgICAgICAgZXZlbnRzU3BhbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ldmVudHMnKSxcbiAgICAgICAgd2VsY29tZUJldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWxjb21lX19iZXQnKSxcbiAgICAgICAgc3dpdGNoV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2VsY29tZV9fc3dpdGNoXCIpO1xuXG4gICAgY29uc3QgdWtMZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VrTGVuZycpO1xuICAgIGNvbnN0IGVuTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlbkxlbmcnKTtcblxuICAgIGxldCBsb2NhbGUgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwibG9jYWxlXCIpID8/ICd1ayc7XG5cbiAgICBpZiAodWtMZW5nKSBsb2NhbGUgPSAndWsnO1xuICAgIGlmIChlbkxlbmcpIGxvY2FsZSA9ICdlbic7XG5cbiAgICBsZXQgaTE4bkRhdGEgPSB7fTtcbiAgICBsZXQgdXNlcklkO1xuICAgIGxldCBlbGVtZW50c0J5TWF0Y2hpRCA9IHt9O1xuICAgIGxldCBhbGxNYXRjaGVzID0gW107XG4gICAgbGV0IGZhdkRhdGFCeU1hdGNoID0ge307XG4gICAgdXNlcklkID0gTnVtYmVyKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJ1c2VySWRcIikpID8/IDEwMzAzMTU5NyA7XG5cbiAgICBmdW5jdGlvbiBsb2FkVHJhbnNsYXRpb25zKCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goYCR7YXBpVVJMfS9uZXctdHJhbnNsYXRlcy8ke2xvY2FsZX1gKS50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oanNvbiA9PiB7XG4gICAgICAgICAgICAgICAgaTE4bkRhdGEgPSBqc29uO1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9yZWNhc3RQb3N0ZXInKSwge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10cmFuc2xhdGVdJylcbiAgICAgICAgaWYgKGVsZW1zICYmIGVsZW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgZWxlbXMuZm9yRWFjaChlbGVtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGUnKTtcbiAgICAgICAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IHRyYW5zbGF0ZUtleShrZXkpO1xuICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9jYWxlID09PSAnZW4nKSB7XG4gICAgICAgICAgICBtYWluUGFnZS5jbGFzc0xpc3QuYWRkKCdlbicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlS2V5KGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdFZhbHVlID0gZGVmYXVsdFZhbHVlIHx8IGtleTtcbiAgICAgICAgcmV0dXJuIGkxOG5EYXRhW2tleV0gfHwgZGVmYXVsdFZhbHVlO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcXVlc3QgPSBmdW5jdGlvbiAobGluaywgZXh0cmFPcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChhcGlVUkwgKyBsaW5rLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLi4uKGV4dHJhT3B0aW9ucyB8fCB7fSlcbiAgICAgICAgfSkudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0QWRkQWxsQnRuKCkge1xuICAgICAgICBjb25zdCBhZGRBbGxCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJlZGljdEJ0bicpO1xuICAgICAgICBhZGRBbGxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZ2V0QmV0c2xpcEl0ZW1zKCkudGhlbihiZXRzbGlwTWF0Y2hlcyA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBtYXRjaCBvZiBhbGxNYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoRGl2ID0gZWxlbWVudHNCeU1hdGNoaURbbWF0Y2gubWF0Y2hJZF07XG4gICAgICAgICAgICAgICAgICAgIGFkZE1hdGNoVG9CZXRzbGlwKG1hdGNoLCBtYXRjaERpdiwgYmV0c2xpcE1hdGNoZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKCdFcnJvciBnZXR0aW5nIGJldHNsaXAgaXRlbXM6JywgZXJyKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IEluaXRQYWdlID0gKCkgPT4ge1xuICAgICAgICB0cmFuc2xhdGUoKTtcbiAgICAgICAgaW5pdEFkZEFsbEJ0bigpO1xuICAgICAgICByZXF1ZXN0KCcvbWF0Y2hlcycpLnRoZW4obWF0Y2hlcyA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtYXRjaGVzKTtcbiAgICAgICAgICAgIGFsbE1hdGNoZXMgPSAobWF0Y2hlcyB8fCBbXSkuc29ydCgoYSwgYikgPT4gbmV3IERhdGUoYS5hY3RpdmVEYXRlKSAtIG5ldyBEYXRlKGIuYWN0aXZlRGF0ZSkpO1xuXG4gICAgICAgICAgICBnZXRCZXRzbGlwSXRlbXMoKS50aGVuKGJldHNsaXBNYXRjaGVzID0+IHtcbiAgICAgICAgICAgICAgICBpbml0TWF0Y2hlcyhhbGxNYXRjaGVzLCBiZXRzbGlwTWF0Y2hlcyk7XG4gICAgICAgICAgICAgICAgaW5pdFNsaWRlcigpO1xuICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgYmV0c2xpcCBpdGVtczonLCBlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdE1hdGNoZXMobWF0Y2hlcywgYmV0c2xpcE1hdGNoZXMpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX3JvdycpO1xuICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgICAgbGV0IGFkZGVkID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRjaGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgICAgICBjb25zdCByb3dXcmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICByb3dXcmFwLmNsYXNzTmFtZSA9ICd3ZWxjb21lX19yb3ctd3JhcCc7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSBpOyBqIDwgaSArIDIgJiYgaiA8IG1hdGNoZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IG1hdGNoZXNbal07XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBtYXRjaERpdi5jbGFzc05hbWUgPSAnd2VsY29tZV9faXRlbSc7XG4gICAgICAgICAgICAgICAgbWF0Y2gubWF0Y2hJZCA9ICgrbWF0Y2gubWF0Y2hJZCk7XG4gICAgICAgICAgICAgICAgaWYgKGJldHNsaXBNYXRjaGVzLnNvbWUoYiA9PiBiLmV2ZW50X2lkID09IG1hdGNoLm1hdGNoSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGVkKys7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoRGl2LmNsYXNzTGlzdC5hZGQoJ19kb25lJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbWF0Y2hEaXYuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLWNsb3NlXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tcm93XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cImh0dHBzOi8vZmF2LXByb20uY29tL2h0bWwvZm9yZWNhc3QtcG9zdGVyL2ltZy93ZWxjb21lL2Zhdi5zdmdcIiBhbHQ9XCJGQVZCRVRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiR7dHJhbnNsYXRlS2V5KG1hdGNoLnRpdGxlKX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1kYXRlXCI+JHtmb3JtYXREYXRlKG1hdGNoLm1hdGNoRGF0ZSl9PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tbWF4LXRpdGxlXCI+JHt0cmFuc2xhdGVLZXkobWF0Y2gudGVhbTEpfSDigJMgJHt0cmFuc2xhdGVLZXkobWF0Y2gudGVhbTIpfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLWluZm9cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tYmlkXCI+JHt0cmFuc2xhdGVLZXkobWF0Y2gub3V0Y29tZVRyYW5zbGF0aW9uKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tY29mXCI+JHttYXRjaC5kZWZhdWx0Q29lZiB8fCAwfTwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgYDtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnRzQnlNYXRjaGlEW21hdGNoLm1hdGNoSWRdID0gbWF0Y2hEaXY7XG4gICAgICAgICAgICAgICAgcm93V3JhcC5hcHBlbmRDaGlsZChtYXRjaERpdik7XG5cbiAgICAgICAgICAgICAgICAvLyBnZXRNYXRjaERhdGEobWF0Y2gpLnRoZW4obSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGlmIChtKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBjb25zdCBjb2ZEaXYgPSBtYXRjaERpdi5xdWVyeVNlbGVjdG9yKCcud2VsY29tZV9faXRlbS1jb2YnKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNvZkRpdi5pbm5lckhUTUwgPSBtLm91dGNvbWVDb2VmO1xuICAgICAgICAgICAgICAgIC8vICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coYE5vIG91dGNvbWUgZGF0YSBmb3IgJHttYXRjaC5tYXRjaElkfWApO1xuICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgICAgICAgICBtYXRjaERpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBhZGRNYXRjaFRvQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYsIGJldHNsaXBNYXRjaGVzLCBlKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xvc2VCdG4gPSBtYXRjaERpdi5xdWVyeVNlbGVjdG9yKCcud2VsY29tZV9faXRlbS1jbG9zZScpO1xuICAgICAgICAgICAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTWF0Y2hGcm9tQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHJvd1dyYXApO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0Q291bnRlcihhZGRlZCk7XG4gICAgICAgIHJldHVybiBjb250YWluZXI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkTWF0Y2hUb0JldHNsaXAobWF0Y2gsIG1hdGNoRGl2LCBiZXRzbGlwTWF0Y2hlcywgZSkge1xuICAgICAgICBpZiAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1RhcmdldCBjbGFzcyBsaXN0OiAnICsgZS50YXJnZXQuY2xhc3NMaXN0KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhtYXRjaCk7XG4gICAgICAgIGNvbnNvbGUubG9nKG1hdGNoRGl2KTtcbiAgICAgICAgY29uc29sZS5sb2coYmV0c2xpcE1hdGNoZXMpO1xuICAgICAgICBpZiAoIXVzZXJJZCB8fCBiZXRzbGlwTWF0Y2hlcy5zb21lKGIgPT4gYi5ldmVudF9pZCA9PSBtYXRjaC5tYXRjaElkIHx8IChlICYmIGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnd2VsY29tZV9faXRlbS1jbG9zZScpKSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGZhdkRhdGFCeU1hdGNoKTtcblxuICAgICAgICBjb25zdCBmYXZEYXRhID0gZmF2RGF0YUJ5TWF0Y2hbbWF0Y2gubWF0Y2hJZF07XG4gICAgICAgIGNvbnNvbGUubG9nKCdGQVYgREFUQSBCWSBNQVRDSCcsIGZhdkRhdGFCeU1hdGNoKVxuICAgICAgICBpZiAoIWZhdkRhdGEgfHwgIWZhdkRhdGEubWF0Y2hJZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIGZhdiBkYXRhIGZvciBtYXRjaCBpZCAnICsgbWF0Y2gubWF0Y2hJZCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXF1ZXN0KCcvZXZlbnRzJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgdXNlcmlkOiB1c2VySWQsXG4gICAgICAgICAgICAgICAgZXZlbnRJZDogbWF0Y2gubWF0Y2hJZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFdmVudCBjcmVhdGVkOicsIHJlc3BvbnNlLmV2ZW50KTtcbiAgICAgICAgICAgICAgICBhZGRUb0JldHNsaXAoZmF2RGF0YSk7XG4gICAgICAgICAgICAgICAgbWF0Y2hEaXYuY2xhc3NMaXN0LmFkZCgnX2RvbmUnKTtcbiAgICAgICAgICAgICAgICB1cGRhdGVDb3VudGVyKDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIGV2ZW50OicsIHJlc3BvbnNlLmVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgY3JlYXRpbmcgZXZlbnQ6JywgZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIHJlbW92ZU1hdGNoRnJvbUJldHNsaXAobWF0Y2gsIG1hdGNoRGl2KSB7XG4gICAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmYXZEYXRhID0gZmF2RGF0YUJ5TWF0Y2hbbWF0Y2gubWF0Y2hJZF07XG4gICAgICAgIGlmICghZmF2RGF0YSB8fCAhZmF2RGF0YS5tYXRjaElkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTm8gZmF2IGRhdGEgZm9yIG1hdGNoIGlkICcgKyBtYXRjaC5tYXRjaElkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzUmVtb3ZlZCA9IHJlbW92ZUZyb21CZXRzbGlwKGZhdkRhdGEpOyAvLyBEaXJlY3RseSBhc3NpZ24gcmVzdWx0XG4gICAgICAgIGlmIChpc1JlbW92ZWQpIHtcbiAgICAgICAgICAgIG1hdGNoRGl2LmNsYXNzTGlzdC5yZW1vdmUoJ19kb25lJyk7XG4gICAgICAgICAgICB1cGRhdGVDb3VudGVyKC0xKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNvdW50ZXIoZGlmZikge1xuICAgICAgICBjb25zdCBjdXJyQ291bnRlciA9ICtjb3VudGVyU3Bhbi5pbm5lckhUTUw7XG4gICAgICAgIHNldENvdW50ZXIoY3VyckNvdW50ZXIgKyBkaWZmKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRDb3VudGVyKHZhbHVlKSB7XG4gICAgICAgIGNvdW50ZXJTcGFuLmlubmVySFRNTCA9IHZhbHVlO1xuXG4gICAgICAgIGNvbnN0IGxhc3REaWdpdCA9IHZhbHVlICUgMTA7XG4gICAgICAgIGxldCB0cmFuc2xhdGlvbktleTtcbiAgICAgICAgaWYgKGxhc3REaWdpdCA9PT0gMSkge1xuICAgICAgICAgICAgdHJhbnNsYXRpb25LZXkgPSAnZXZlbnQxJztcbiAgICAgICAgfSBlbHNlIGlmIChsYXN0RGlnaXQgPj0gMiAmJiBsYXN0RGlnaXQgPD0gNCkge1xuICAgICAgICAgICAgdHJhbnNsYXRpb25LZXkgPSAnZXZlbnQyJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyYW5zbGF0aW9uS2V5ID0gJ2V2ZW50Myc7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBldmVudFRyYW5zbGF0aW9uID0gdHJhbnNsYXRlS2V5KHRyYW5zbGF0aW9uS2V5KTtcbiAgICAgICAgZXZlbnRzU3Bhbi5pbm5lckhUTUwgPSBldmVudFRyYW5zbGF0aW9uO1xuXG4gICAgICAgIGlmICh2YWx1ZSA+IDApIHtcbiAgICAgICAgICAgIHdlbGNvbWVCZXQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd2VsY29tZUJldC5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRNYXRjaERhdGEobWF0Y2gsIHNlcnZpY2VJZD0wKSB7XG4gICAgICAgIGlmIChzZXJ2aWNlSWQgPiAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTm8gZGF0YSBmb3IgMCBhbmQgMSBzZXJ2aWNlIGlkcycpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmV0Y2goJy9zZXJ2aWNlL2xpbmVvdXQvZnJvbnRlbmRfYXBpMi8nLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICBcImpzb25ycGNcIjogXCIyLjBcIixcbiAgICAgICAgICAgICAgICBcImlkXCI6IDE2LFxuICAgICAgICAgICAgICAgIFwibWV0aG9kXCI6IFwiZnJvbnRlbmQvbWFya2V0L2dldFwiLFxuICAgICAgICAgICAgICAgIFwicGFyYW1zXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJieVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImxhbmdcIjogJ3VrJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VydmljZV9pZFwiOiBzZXJ2aWNlSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImV2ZW50X2lkXCI6IG1hdGNoLm1hdGNoSWRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAgICAgICAgIC50aGVuKGZhdkRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvZWZEYXRhID0gZmF2RGF0YS5yZXN1bHQuZmluZChvID0+IG8ubWFya2V0X25hbWUgPT09IG1hdGNoLm1hcmtldE5hbWUgJiYgby5yZXN1bHRfdHlwZV9uYW1lID09PSBtYXRjaC5tYXJrZXRUeXBlKTtcbiAgICAgICAgICAgICAgICBpZiAoY29lZkRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0Y29tZSA9IGNvZWZEYXRhLm91dGNvbWVzLmZpbmQobyA9PiBvLm91dGNvbWVfbmFtZSA9PSBtYXRjaC5vdXRjb21lTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghb3V0Y29tZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldE1hdGNoRGF0YShtYXRjaCwgc2VydmljZUlkICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGNvbWVJZDogb3V0Y29tZS5vdXRjb21lX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0Y29tZUNvZWY6IG91dGNvbWUub3V0Y29tZV9jb2VmLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFya2V0SWQ6IGNvZWZEYXRhLm1hcmtldF9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2VJZDogc2VydmljZUlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hJZDogbWF0Y2gubWF0Y2hJZCxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0TWF0Y2hEYXRhKG1hdGNoLCBzZXJ2aWNlSWQgKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4obSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobSlcbiAgICAgICAgICAgICAgICBmYXZEYXRhQnlNYXRjaFttLm1hdGNoSWRdID0gbTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdERhdGUoZGF0ZSkge1xuICAgICAgICBpZiAoIWRhdGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICAgIGNvbnN0IGRheSA9IFN0cmluZyhkLmdldERhdGUoKSkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgICAgY29uc3QgbW9udGggPSBTdHJpbmcoZC5nZXRNb250aCgpICsgMSkucGFkU3RhcnQoMiwgJzAnKTtcbiAgICAgICAgcmV0dXJuIGAke2RheX0uJHttb250aH1gO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFRvQmV0c2xpcChtYXRjaCkge1xuICAgICAgICBpZiAoIXdpbmRvdy5hZGRCZXRzbGlwT3V0Y29tZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBhZGRCZXRzbGlwT3V0Y29tZXMgbWV0aG9kIGlzIGRlZmluZWQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvdXRjb21lID0ge1xuICAgICAgICAgICAgJ3NlcnZpY2VJZCc6IG1hdGNoLnNlcnZpY2VJZCxcbiAgICAgICAgICAgICdldmVudElkJzogbWF0Y2gubWF0Y2hJZCxcbiAgICAgICAgICAgICdtYXJrZXRJZCc6IG1hdGNoLm1hcmtldElkLFxuICAgICAgICAgICAgJ291dGNvbWVJZCc6IG1hdGNoLm91dGNvbWVJZFxuICAgICAgICB9O1xuICAgICAgICB3aW5kb3cuYWRkQmV0c2xpcE91dGNvbWVzKFtvdXRjb21lXSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRnJvbUJldHNsaXAobWF0Y2gpIHtcbiAgICAgICAgaWYgKCF3aW5kb3cucmVtb3ZlQmV0c2xpcEl0ZW1zKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0JzQtdGC0L7QtCByZW1vdmVCZXRzbGlwSXRlbXMg0L3QtSDQt9C90LDQudC00LXQvdC+Jyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vINCX0L3QsNGH0LXQvdC90Y8g0LfQsCDQt9Cw0LzQvtCy0YfRg9Cy0LDQvdC90Y/QvFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb3V0Y29tZUlkID0gbWF0Y2gub3V0Y29tZUlkOyAvLyDQntGC0YDQuNC80YPRlNC80L4g0YLRltC70YzQutC4IGlkXG5cbiAgICAgICAgLy8g0JLQuNC60LvQuNC60LDRlNC80L4g0L3QvtCy0LjQuSDQvNC10YLQvtC0INC3INC80LDRgdC40LLQvtC8INCw0LnQtNGWXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHdpbmRvdy5yZW1vdmVCZXRzbGlwSXRlbXMoW291dGNvbWVJZF0pO1xuXG4gICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgcmVzdWx0XG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gY29uc29sZS5sb2coYNCj0YHQv9GW0YjQvdC+INCy0LjQtNCw0LvQtdC90L4gb3V0Y29tZUlkICR7b3V0Y29tZUlkfWApKVxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihg0J/QvtC80LjQu9C60LAg0L/RgNC4INCy0LjQtNCw0LvQtdC90L3RliBvdXRjb21lSWQgJHtvdXRjb21lSWR9OmAsIGVycikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYNCc0LXRgtC+0LQg0L/QvtCy0LXRgNC90YPQsiAke3Jlc3VsdH0g0LTQu9GPIG91dGNvbWVJZCAke291dGNvbWVJZH1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QmV0c2xpcEl0ZW1zKCkge1xuICAgICAgICBpZiAoIXdpbmRvdy5nZXRCZXRzbGlwSXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBnZXRCZXRzbGlwSXRlbXMgbWV0aG9kIGlzIGRlZmluZWQnKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRCZXRzbGlwSXRlbXMoKVxuICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQmV0c2xpcCBpdGVtczonLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbiBnZXRCZXRzbGlwSXRlbXM6JywgZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgICAgIEluaXRQYWdlKCk7XG5cbiAgICAgICAgaWYgKHdpbmRvdy5zdG9yZSkge1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gd2luZG93LnN0b3JlLmdldFN0YXRlKCk7XG4gICAgICAgICAgICB1c2VySWQgPSBzdGF0ZS5hdXRoLmlzQXV0aG9yaXplZCAmJiBzdGF0ZS5hdXRoLmlkIHx8ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGMgPSAwO1xuICAgICAgICAgICAgdmFyIGkgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGMgPCA1MCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoISF3aW5kb3cuZ191c2VyX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQgPSB3aW5kb3cuZ191c2VyX2lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tVc2VyQXV0aCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrVXNlckF1dGgoKTtcbiAgICB9XG5cbiAgICBsZXQgY2hlY2tVc2VyQXV0aCA9ICgpID0+IHtcbiAgICAgICAgaWYgKHVzZXJJZCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCB1bmF1dGhNZXMgb2YgdW5hdXRoTXNncykge1xuICAgICAgICAgICAgICAgIHVuYXV0aE1lcy5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzd2l0Y2hXcmFwLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRlXCIpXG4gICAgICAgICAgICBjb25zdCBhZGRBbGxCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJlZGljdEJ0bicpO1xuICAgICAgICAgICAgYWRkQWxsQnRuLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWxjb21lX19yb3cnKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2hXcmFwLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpXG4gICAgICAgICAgICBmb3IgKGxldCBwYXJ0aWNpcGF0ZUJ0biBvZiBwYXJ0aWNpcGF0ZUJ0bnMpIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWNpcGF0ZUJ0bi5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHVuYXV0aE1lcyBvZiB1bmF1dGhNc2dzKSB7XG4gICAgICAgICAgICAgICAgdW5hdXRoTWVzLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxvYWRUcmFuc2xhdGlvbnMoKVxuICAgICAgICAudGhlbihpbml0KTtcblxuICAgIGxldCBtYWluUGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mYXZfX3BhZ2UnKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IG1haW5QYWdlLmNsYXNzTGlzdC5hZGQoJ292ZXJmbG93JyksIDEwMDApO1xuXG4gICAgZnVuY3Rpb24gaW5pdFNsaWRlcigpIHtcbiAgICAgICAgbGV0IGlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgbGV0IHN0YXJ0WDtcbiAgICAgICAgbGV0IHNjcm9sbExlZnQ7XG5cbiAgICAgICAgY29uc3QgZHJhZ2dhYmxlQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RyYWdnYWJsZUNvbnRhaW5lcicpO1xuICAgICAgICBjb25zdCBpdGVtc1dyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2VsY29tZV9fcm93LXdyYXAnKVxuICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VsY29tZV9fcm93JylcbiAgICAgICAgY29uc3QgaXRlbXNXcmFwTGVuZ3RoID0gaXRlbXNXcmFwLmxlbmd0aDtcblxuICAgICAgICBzd2l0Y2ggKGl0ZW1zV3JhcExlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgICAgIHJvdy5zdHlsZS5tYXhXaWR0aCA9ICcyMDk4cHgnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIHJvdy5zdHlsZS5tYXhXaWR0aCA9ICcxNjY4cHgnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIHJvdy5zdHlsZS5tYXhXaWR0aCA9ICcxMjU4cHgnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJvdy5zdHlsZS5tYXhXaWR0aCA9ICc4MjhweCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcm93LnN0eWxlLm1heFdpZHRoID0gJzQxOHB4JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcm93LnN0eWxlLm1heFdpZHRoID0gJzIwOThweCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBkcmFnZ2FibGVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlzRHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICAgICAgc3RhcnRYID0gZS5wYWdlWCAtIGRyYWdnYWJsZUNvbnRhaW5lci5vZmZzZXRMZWZ0O1xuICAgICAgICAgICAgc2Nyb2xsTGVmdCA9IGRyYWdnYWJsZUNvbnRhaW5lci5zY3JvbGxMZWZ0O1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRyYWdnYWJsZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgICAgICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICBkcmFnZ2FibGVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IHtcbiAgICAgICAgICAgIGlzRHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZHJhZ2dhYmxlQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWlzRHJhZ2dpbmcpIHJldHVybjtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnN0IHggPSBlLnBhZ2VYIC0gZHJhZ2dhYmxlQ29udGFpbmVyLm9mZnNldExlZnQ7XG4gICAgICAgICAgICBjb25zdCB3YWxrID0gKHggLSBzdGFydFgpICogMjsgLy8g0KPQstC10LvQuNGH0YzRgtC1INC80L3QvtC20LjRgtC10LvRjCwg0YfRgtC+0LHRiyDQuNC30LzQtdC90LjRgtGMINGB0LrQvtGA0L7RgdGC0Ywg0L/RgNC+0LrRgNGD0YLQutC4XG4gICAgICAgICAgICBkcmFnZ2FibGVDb250YWluZXIuc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQgLSB3YWxrO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyB0ZXN0XG4gICAgY29uc3Qgc3dpdGNoQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53ZWxjb21lX19zd2l0Y2gtYnRuXCIpXG5cbiAgICBzd2l0Y2hCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHN3aXRjaEJ0bi5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIpXG4gICAgfSlcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGFyay1idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+e1xuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoXCJkYXJrXCIpXG4gICAgfSlcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG5nLWJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBsb2NhbGUgPSBsb2NhbGUgPT09ICd1aycgPyAnZW4nIDogJ3VrJztcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShcImxvY2FsZVwiLCBsb2NhbGUpO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYXV0aC1idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgdXNlcklkID0gdXNlcklkID09PSAxMDMwMzE1OTcgPyAwIDogMTAzMDMxNTk3O1xuICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFwidXNlcklkXCIsIHVzZXJJZCk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuXG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJldC1idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53ZWxjb21lX19iZXRcIikuY2xhc3NMaXN0LnRvZ2dsZShcImhpZGVcIilcbiAgICB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG59KSgpO1xuIiwiIl19
