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
(function (_Number) {
  var apiURL = 'https://fav-prom.com/api_forecast_poster';
  var unauthMsgs = document.querySelectorAll('.authBtn'),
    participateBtns = document.querySelectorAll('.predictBtn'),
    counterSpan = document.querySelector('.counter'),
    eventsSpan = document.querySelector('.events'),
    welcomeBet = document.querySelector('.welcome__bet'),
    switchWrap = document.querySelector(".welcome__switch");
  var ukLeng = document.querySelector('#ukLeng');
  var enLeng = document.querySelector('#enLeng');

  // let locale = sessionStorage.getItem("locale") ?? 'uk';
  var locale = 'uk';
  if (ukLeng) locale = 'uk';
  if (enLeng) locale = 'en';
  var i18nData = {};
  var userId;
  var elementsByMatchiD = {};
  var allMatches = [];
  var favDataByMatch = {};
  userId = (_Number = Number(sessionStorage.getItem("userId"))) !== null && _Number !== void 0 ? _Number : 103031597;
  // userId = 103031597 ;

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
      // container.classList.remove('hide');
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
  document.addEventListener('click', function (e) {
    var target = e.target.closest('.welcome__item');
    if (target && !userId) {
      window.location.href = '/login';
    }
  });

  // test
  var switchBtn = document.querySelector(".welcome__switch-btn");
  switchBtn.addEventListener("click", function () {
    switchBtn.classList.toggle("active");
  });

  // document.querySelector(".dark-btn").addEventListener("click", () =>{
  //     document.body.classList.toggle("dark")
  // })
  //
  // document.querySelector(".lng-btn").addEventListener("click", () => {
  //     locale = locale === 'uk' ? 'en' : 'uk';
  //     sessionStorage.setItem("locale", locale);
  //     window.location.reload()
  // });

  document.querySelector(".auth-btn").addEventListener("click", function () {
    userId = userId === 103031597 ? 0 : 103031597;
    sessionStorage.setItem("userId", userId);
    window.location.reload();
  });

  // document.querySelector(".bet-btn").addEventListener("click", () => {
  //     document.querySelector(".welcome__bet").classList.toggle("hide")
  // });
})();
"use strict";
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzZWNvbmQuanMiXSwibmFtZXMiOlsiX051bWJlciIsImFwaVVSTCIsInVuYXV0aE1zZ3MiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJwYXJ0aWNpcGF0ZUJ0bnMiLCJjb3VudGVyU3BhbiIsInF1ZXJ5U2VsZWN0b3IiLCJldmVudHNTcGFuIiwid2VsY29tZUJldCIsInN3aXRjaFdyYXAiLCJ1a0xlbmciLCJlbkxlbmciLCJsb2NhbGUiLCJpMThuRGF0YSIsInVzZXJJZCIsImVsZW1lbnRzQnlNYXRjaGlEIiwiYWxsTWF0Y2hlcyIsImZhdkRhdGFCeU1hdGNoIiwiTnVtYmVyIiwic2Vzc2lvblN0b3JhZ2UiLCJnZXRJdGVtIiwibG9hZFRyYW5zbGF0aW9ucyIsImZldGNoIiwiY29uY2F0IiwidGhlbiIsInJlcyIsImpzb24iLCJ0cmFuc2xhdGUiLCJtdXRhdGlvbk9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm9ic2VydmUiLCJnZXRFbGVtZW50QnlJZCIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJlbGVtcyIsImxlbmd0aCIsImZvckVhY2giLCJlbGVtIiwia2V5IiwiZ2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwidHJhbnNsYXRlS2V5IiwicmVtb3ZlQXR0cmlidXRlIiwibWFpblBhZ2UiLCJjbGFzc0xpc3QiLCJhZGQiLCJkZWZhdWx0VmFsdWUiLCJyZXF1ZXN0IiwibGluayIsImV4dHJhT3B0aW9ucyIsIl9vYmplY3RTcHJlYWQiLCJoZWFkZXJzIiwiaW5pdEFkZEFsbEJ0biIsImFkZEFsbEJ0biIsImFkZEV2ZW50TGlzdGVuZXIiLCJnZXRCZXRzbGlwSXRlbXMiLCJiZXRzbGlwTWF0Y2hlcyIsIl9pdGVyYXRvciIsIl9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyIiwiX3N0ZXAiLCJzIiwibiIsImRvbmUiLCJtYXRjaCIsInZhbHVlIiwibWF0Y2hEaXYiLCJtYXRjaElkIiwiYWRkTWF0Y2hUb0JldHNsaXAiLCJlcnIiLCJlIiwiZiIsImNvbnNvbGUiLCJlcnJvciIsIkluaXRQYWdlIiwibWF0Y2hlcyIsImxvZyIsInNvcnQiLCJhIiwiYiIsIkRhdGUiLCJhY3RpdmVEYXRlIiwiaW5pdE1hdGNoZXMiLCJpbml0U2xpZGVyIiwiY29udGFpbmVyIiwiYWRkZWQiLCJpIiwicm93V3JhcCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJfbG9vcCIsImoiLCJzb21lIiwiZXZlbnRfaWQiLCJ0aXRsZSIsImZvcm1hdERhdGUiLCJtYXRjaERhdGUiLCJ0ZWFtMSIsInRlYW0yIiwib3V0Y29tZVRyYW5zbGF0aW9uIiwiZGVmYXVsdENvZWYiLCJhcHBlbmRDaGlsZCIsImNsb3NlQnRuIiwic3RvcFByb3BhZ2F0aW9uIiwicmVtb3ZlTWF0Y2hGcm9tQmV0c2xpcCIsInNldENvdW50ZXIiLCJ0YXJnZXQiLCJjb250YWlucyIsImZhdkRhdGEiLCJtZXRob2QiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInVzZXJpZCIsImV2ZW50SWQiLCJyZXNwb25zZSIsInN1Y2Nlc3MiLCJldmVudCIsImFkZFRvQmV0c2xpcCIsInVwZGF0ZUNvdW50ZXIiLCJpc1JlbW92ZWQiLCJyZW1vdmVGcm9tQmV0c2xpcCIsInJlbW92ZSIsImRpZmYiLCJjdXJyQ291bnRlciIsImxhc3REaWdpdCIsInRyYW5zbGF0aW9uS2V5IiwiZXZlbnRUcmFuc2xhdGlvbiIsImdldE1hdGNoRGF0YSIsInNlcnZpY2VJZCIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsImNvZWZEYXRhIiwicmVzdWx0IiwiZmluZCIsIm8iLCJtYXJrZXRfbmFtZSIsIm1hcmtldE5hbWUiLCJyZXN1bHRfdHlwZV9uYW1lIiwibWFya2V0VHlwZSIsIm91dGNvbWUiLCJvdXRjb21lcyIsIm91dGNvbWVfbmFtZSIsIm91dGNvbWVOYW1lIiwib3V0Y29tZUlkIiwib3V0Y29tZV9pZCIsIm91dGNvbWVDb2VmIiwib3V0Y29tZV9jb2VmIiwibWFya2V0SWQiLCJtYXJrZXRfaWQiLCJtIiwiZGF0ZSIsImQiLCJkYXkiLCJTdHJpbmciLCJnZXREYXRlIiwicGFkU3RhcnQiLCJtb250aCIsImdldE1vbnRoIiwid2luZG93IiwiYWRkQmV0c2xpcE91dGNvbWVzIiwicmVtb3ZlQmV0c2xpcEl0ZW1zIiwiUHJvbWlzZSIsInJlc29sdmUiLCJpbml0Iiwic3RvcmUiLCJzdGF0ZSIsImdldFN0YXRlIiwiYXV0aCIsImlzQXV0aG9yaXplZCIsImlkIiwiYyIsInNldEludGVydmFsIiwiZ191c2VyX2lkIiwiY2hlY2tVc2VyQXV0aCIsImNsZWFySW50ZXJ2YWwiLCJfaXRlcmF0b3IyIiwiX3N0ZXAyIiwidW5hdXRoTWVzIiwiX2l0ZXJhdG9yMyIsIl9zdGVwMyIsInBhcnRpY2lwYXRlQnRuIiwiX2l0ZXJhdG9yNCIsIl9zdGVwNCIsInNldFRpbWVvdXQiLCJpc0RyYWdnaW5nIiwic3RhcnRYIiwic2Nyb2xsTGVmdCIsImRyYWdnYWJsZUNvbnRhaW5lciIsIml0ZW1zV3JhcCIsInJvdyIsIml0ZW1zV3JhcExlbmd0aCIsInN0eWxlIiwibWF4V2lkdGgiLCJwYWdlWCIsIm9mZnNldExlZnQiLCJwcmV2ZW50RGVmYXVsdCIsIngiLCJ3YWxrIiwiY2xvc2VzdCIsImxvY2F0aW9uIiwiaHJlZiIsInN3aXRjaEJ0biIsInRvZ2dsZSIsInNldEl0ZW0iLCJyZWxvYWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsQ0FBQyxVQUFBQSxPQUFBLEVBQVk7RUFDVCxJQUFNQyxNQUFNLEdBQUcsMENBQTBDO0VBRXpELElBQ0lDLFVBQVUsR0FBR0MsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7SUFDbERDLGVBQWUsR0FBR0YsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7SUFDMURFLFdBQVcsR0FBR0gsUUFBUSxDQUFDSSxhQUFhLENBQUMsVUFBVSxDQUFDO0lBQ2hEQyxVQUFVLEdBQUdMLFFBQVEsQ0FBQ0ksYUFBYSxDQUFDLFNBQVMsQ0FBQztJQUM5Q0UsVUFBVSxHQUFHTixRQUFRLENBQUNJLGFBQWEsQ0FBQyxlQUFlLENBQUM7SUFDcERHLFVBQVUsR0FBR1AsUUFBUSxDQUFDSSxhQUFhLENBQUMsa0JBQWtCLENBQUM7RUFFM0QsSUFBTUksTUFBTSxHQUFHUixRQUFRLENBQUNJLGFBQWEsQ0FBQyxTQUFTLENBQUM7RUFDaEQsSUFBTUssTUFBTSxHQUFHVCxRQUFRLENBQUNJLGFBQWEsQ0FBQyxTQUFTLENBQUM7O0VBRWhEO0VBQ0EsSUFBSU0sTUFBTSxHQUFJLElBQUk7RUFFbEIsSUFBSUYsTUFBTSxFQUFFRSxNQUFNLEdBQUcsSUFBSTtFQUN6QixJQUFJRCxNQUFNLEVBQUVDLE1BQU0sR0FBRyxJQUFJO0VBRXpCLElBQUlDLFFBQVEsR0FBRyxDQUFDLENBQUM7RUFDakIsSUFBSUMsTUFBTTtFQUNWLElBQUlDLGlCQUFpQixHQUFHLENBQUMsQ0FBQztFQUMxQixJQUFJQyxVQUFVLEdBQUcsRUFBRTtFQUNuQixJQUFJQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO0VBQ3ZCSCxNQUFNLElBQUFmLE9BQUEsR0FBR21CLE1BQU0sQ0FBQ0MsY0FBYyxDQUFDQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsY0FBQXJCLE9BQUEsY0FBQUEsT0FBQSxHQUFJLFNBQVM7RUFDOUQ7O0VBRUEsU0FBU3NCLGdCQUFnQkEsQ0FBQSxFQUFHO0lBQ3hCLE9BQU9DLEtBQUssSUFBQUMsTUFBQSxDQUFJdkIsTUFBTSxzQkFBQXVCLE1BQUEsQ0FBbUJYLE1BQU0sQ0FBRSxDQUFDLENBQUNZLElBQUksQ0FBQyxVQUFBQyxHQUFHO01BQUEsT0FBSUEsR0FBRyxDQUFDQyxJQUFJLENBQUMsQ0FBQztJQUFBLEVBQUMsQ0FDckVGLElBQUksQ0FBQyxVQUFBRSxJQUFJLEVBQUk7TUFDVmIsUUFBUSxHQUFHYSxJQUFJO01BQ2ZDLFNBQVMsQ0FBQyxDQUFDO01BRVgsSUFBSUMsZ0JBQWdCLEdBQUcsSUFBSUMsZ0JBQWdCLENBQUMsVUFBVUMsU0FBUyxFQUFFO1FBQzdESCxTQUFTLENBQUMsQ0FBQztNQUNmLENBQUMsQ0FBQztNQUNGQyxnQkFBZ0IsQ0FBQ0csT0FBTyxDQUFDN0IsUUFBUSxDQUFDOEIsY0FBYyxDQUFDLGdCQUFnQixDQUFDLEVBQUU7UUFDaEVDLFNBQVMsRUFBRSxJQUFJO1FBQ2ZDLE9BQU8sRUFBRTtNQUNiLENBQUMsQ0FBQztJQUVOLENBQUMsQ0FBQztFQUNWO0VBRUEsU0FBU1AsU0FBU0EsQ0FBQSxFQUFHO0lBQ2pCLElBQU1RLEtBQUssR0FBR2pDLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUM7SUFDM0QsSUFBSWdDLEtBQUssSUFBSUEsS0FBSyxDQUFDQyxNQUFNLEVBQUU7TUFDdkJELEtBQUssQ0FBQ0UsT0FBTyxDQUFDLFVBQUFDLElBQUksRUFBSTtRQUNsQixJQUFNQyxHQUFHLEdBQUdELElBQUksQ0FBQ0UsWUFBWSxDQUFDLGdCQUFnQixDQUFDO1FBQy9DRixJQUFJLENBQUNHLFNBQVMsR0FBR0MsWUFBWSxDQUFDSCxHQUFHLENBQUM7UUFDbENELElBQUksQ0FBQ0ssZUFBZSxDQUFDLGdCQUFnQixDQUFDO01BQzFDLENBQUMsQ0FBQztJQUNOO0lBQ0EsSUFBSS9CLE1BQU0sS0FBSyxJQUFJLEVBQUU7TUFDakJnQyxRQUFRLENBQUNDLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLElBQUksQ0FBQztJQUNoQztFQUNKO0VBRUEsU0FBU0osWUFBWUEsQ0FBQ0gsR0FBRyxFQUFFUSxZQUFZLEVBQUU7SUFDckMsSUFBSSxDQUFDUixHQUFHLEVBQUU7TUFDTjtJQUNKO0lBQ0FRLFlBQVksR0FBR0EsWUFBWSxJQUFJUixHQUFHO0lBQ2xDLE9BQU8xQixRQUFRLENBQUMwQixHQUFHLENBQUMsSUFBSVEsWUFBWTtFQUN4QztFQUVBLElBQU1DLE9BQU8sR0FBRyxTQUFWQSxPQUFPQSxDQUFhQyxJQUFJLEVBQUVDLFlBQVksRUFBRTtJQUMxQyxPQUFPNUIsS0FBSyxDQUFDdEIsTUFBTSxHQUFHaUQsSUFBSSxFQUFBRSxhQUFBO01BQ3RCQyxPQUFPLEVBQUU7UUFDTCxRQUFRLEVBQUUsa0JBQWtCO1FBQzVCLGNBQWMsRUFBRTtNQUNwQjtJQUFDLEdBQ0dGLFlBQVksSUFBSSxDQUFDLENBQUMsQ0FDekIsQ0FBQyxDQUFDMUIsSUFBSSxDQUFDLFVBQUFDLEdBQUc7TUFBQSxPQUFJQSxHQUFHLENBQUNDLElBQUksQ0FBQyxDQUFDO0lBQUEsRUFBQztFQUM5QixDQUFDO0VBRUQsU0FBUzJCLGFBQWFBLENBQUEsRUFBRztJQUNyQixJQUFNQyxTQUFTLEdBQUdwRCxRQUFRLENBQUNJLGFBQWEsQ0FBQyxhQUFhLENBQUM7SUFDdkRnRCxTQUFTLENBQUNDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFNO01BQ3RDLElBQUksQ0FBQ3pDLE1BQU0sRUFBRTtRQUNUO01BQ0o7TUFFQTBDLGVBQWUsQ0FBQyxDQUFDLENBQUNoQyxJQUFJLENBQUMsVUFBQWlDLGNBQWMsRUFBSTtRQUFBLElBQUFDLFNBQUEsR0FBQUMsMEJBQUEsQ0FDakIzQyxVQUFVO1VBQUE0QyxLQUFBO1FBQUE7VUFBOUIsS0FBQUYsU0FBQSxDQUFBRyxDQUFBLE1BQUFELEtBQUEsR0FBQUYsU0FBQSxDQUFBSSxDQUFBLElBQUFDLElBQUEsR0FBZ0M7WUFBQSxJQUFyQkMsS0FBSyxHQUFBSixLQUFBLENBQUFLLEtBQUE7WUFDWixJQUFNQyxRQUFRLEdBQUduRCxpQkFBaUIsQ0FBQ2lELEtBQUssQ0FBQ0csT0FBTyxDQUFDO1lBQ2pEQyxpQkFBaUIsQ0FBQ0osS0FBSyxFQUFFRSxRQUFRLEVBQUVULGNBQWMsQ0FBQztVQUN0RDtRQUFDLFNBQUFZLEdBQUE7VUFBQVgsU0FBQSxDQUFBWSxDQUFBLENBQUFELEdBQUE7UUFBQTtVQUFBWCxTQUFBLENBQUFhLENBQUE7UUFBQTtNQUNMLENBQUMsQ0FBQyxTQUFNLENBQUMsVUFBQUYsR0FBRztRQUFBLE9BQUlHLE9BQU8sQ0FBQ0MsS0FBSyxDQUFDLDhCQUE4QixFQUFFSixHQUFHLENBQUM7TUFBQSxFQUFDO0lBQ3ZFLENBQUMsQ0FBQztFQUNOO0VBRUEsSUFBTUssUUFBUSxHQUFHLFNBQVhBLFFBQVFBLENBQUEsRUFBUztJQUNuQi9DLFNBQVMsQ0FBQyxDQUFDO0lBQ1gwQixhQUFhLENBQUMsQ0FBQztJQUNmTCxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUN4QixJQUFJLENBQUMsVUFBQW1ELE9BQU8sRUFBSTtNQUNoQ0gsT0FBTyxDQUFDSSxHQUFHLENBQUNELE9BQU8sQ0FBQztNQUNwQjNELFVBQVUsR0FBRyxDQUFDMkQsT0FBTyxJQUFJLEVBQUUsRUFBRUUsSUFBSSxDQUFDLFVBQUNDLENBQUMsRUFBRUMsQ0FBQztRQUFBLE9BQUssSUFBSUMsSUFBSSxDQUFDRixDQUFDLENBQUNHLFVBQVUsQ0FBQyxHQUFHLElBQUlELElBQUksQ0FBQ0QsQ0FBQyxDQUFDRSxVQUFVLENBQUM7TUFBQSxFQUFDO01BRTVGekIsZUFBZSxDQUFDLENBQUMsQ0FBQ2hDLElBQUksQ0FBQyxVQUFBaUMsY0FBYyxFQUFJO1FBQ3JDeUIsV0FBVyxDQUFDbEUsVUFBVSxFQUFFeUMsY0FBYyxDQUFDO1FBQ3ZDMEIsVUFBVSxDQUFDLENBQUM7TUFDaEIsQ0FBQyxDQUFDLFNBQU0sQ0FBQyxVQUFBZCxHQUFHO1FBQUEsT0FBSUcsT0FBTyxDQUFDQyxLQUFLLENBQUMsOEJBQThCLEVBQUVKLEdBQUcsQ0FBQztNQUFBLEVBQUM7SUFDdkUsQ0FBQyxDQUFDO0VBQ04sQ0FBQztFQUVELFNBQVNhLFdBQVdBLENBQUNQLE9BQU8sRUFBRWxCLGNBQWMsRUFBRTtJQUMxQyxJQUFNMkIsU0FBUyxHQUFHbEYsUUFBUSxDQUFDSSxhQUFhLENBQUMsZUFBZSxDQUFDO0lBQ3pEOEUsU0FBUyxDQUFDM0MsU0FBUyxHQUFHLEVBQUU7SUFFeEIsSUFBSTRDLEtBQUssR0FBRyxDQUFDO0lBQ2IsS0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdYLE9BQU8sQ0FBQ3ZDLE1BQU0sRUFBRWtELENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDeEMsSUFBTUMsT0FBTyxHQUFHckYsUUFBUSxDQUFDc0YsYUFBYSxDQUFDLEtBQUssQ0FBQztNQUM3Q0QsT0FBTyxDQUFDRSxTQUFTLEdBQUcsbUJBQW1CO01BQUMsSUFBQUMsS0FBQSxZQUFBQSxNQUFBLEVBRWM7UUFDbEQsSUFBTTFCLEtBQUssR0FBR1csT0FBTyxDQUFDZ0IsQ0FBQyxDQUFDO1FBQ3hCLElBQU16QixRQUFRLEdBQUdoRSxRQUFRLENBQUNzRixhQUFhLENBQUMsS0FBSyxDQUFDO1FBQzlDdEIsUUFBUSxDQUFDdUIsU0FBUyxHQUFHLGVBQWU7UUFDcEN6QixLQUFLLENBQUNHLE9BQU8sR0FBSSxDQUFDSCxLQUFLLENBQUNHLE9BQVE7UUFDaEMsSUFBSVYsY0FBYyxDQUFDbUMsSUFBSSxDQUFDLFVBQUFiLENBQUM7VUFBQSxPQUFJQSxDQUFDLENBQUNjLFFBQVEsSUFBSTdCLEtBQUssQ0FBQ0csT0FBTztRQUFBLEVBQUMsRUFBRTtVQUN2RGtCLEtBQUssRUFBRTtVQUNQbkIsUUFBUSxDQUFDckIsU0FBUyxDQUFDQyxHQUFHLENBQUMsT0FBTyxDQUFDO1FBQ25DO1FBRUFvQixRQUFRLENBQUN6QixTQUFTLGlVQUFBbEIsTUFBQSxDQUtGbUIsWUFBWSxDQUFDc0IsS0FBSyxDQUFDOEIsS0FBSyxDQUFDLGlHQUFBdkUsTUFBQSxDQUVId0UsVUFBVSxDQUFDL0IsS0FBSyxDQUFDZ0MsU0FBUyxDQUFDLDZGQUFBekUsTUFBQSxDQUUxQm1CLFlBQVksQ0FBQ3NCLEtBQUssQ0FBQ2lDLEtBQUssQ0FBQyxjQUFBMUUsTUFBQSxDQUFNbUIsWUFBWSxDQUFDc0IsS0FBSyxDQUFDa0MsS0FBSyxDQUFDLHVIQUFBM0UsTUFBQSxDQUUxRG1CLFlBQVksQ0FBQ3NCLEtBQUssQ0FBQ21DLGtCQUFrQixDQUFDLG1FQUFBNUUsTUFBQSxDQUN0Q3lDLEtBQUssQ0FBQ29DLFdBQVcsSUFBSSxDQUFDLGlEQUU5RDtRQUVHckYsaUJBQWlCLENBQUNpRCxLQUFLLENBQUNHLE9BQU8sQ0FBQyxHQUFHRCxRQUFRO1FBQzNDcUIsT0FBTyxDQUFDYyxXQUFXLENBQUNuQyxRQUFRLENBQUM7O1FBRTdCO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUFBLFFBQVEsQ0FBQ1gsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUNlLENBQUM7VUFBQSxPQUFLRixpQkFBaUIsQ0FBQ0osS0FBSyxFQUFFRSxRQUFRLEVBQUVULGNBQWMsRUFBRWEsQ0FBQyxDQUFDO1FBQUEsRUFBQztRQUNoRyxJQUFNZ0MsUUFBUSxHQUFHcEMsUUFBUSxDQUFDNUQsYUFBYSxDQUFDLHNCQUFzQixDQUFDO1FBQy9EZ0csUUFBUSxDQUFDL0MsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUNlLENBQUMsRUFBSztVQUN0Q0EsQ0FBQyxDQUFDaUMsZUFBZSxDQUFDLENBQUM7VUFDbkJDLHNCQUFzQixDQUFDeEMsS0FBSyxFQUFFRSxRQUFRLENBQUM7UUFDM0MsQ0FBQyxDQUFDO01BQ04sQ0FBQztNQTVDRCxLQUFLLElBQUl5QixDQUFDLEdBQUdMLENBQUMsRUFBRUssQ0FBQyxHQUFHTCxDQUFDLEdBQUcsQ0FBQyxJQUFJSyxDQUFDLEdBQUdoQixPQUFPLENBQUN2QyxNQUFNLEVBQUV1RCxDQUFDLEVBQUU7UUFBQUQsS0FBQTtNQUFBO01BNkNwRE4sU0FBUyxDQUFDaUIsV0FBVyxDQUFDZCxPQUFPLENBQUM7SUFDbEM7SUFDQWtCLFVBQVUsQ0FBQ3BCLEtBQUssQ0FBQztJQUNqQixPQUFPRCxTQUFTO0VBQ3BCO0VBRUEsU0FBU2hCLGlCQUFpQkEsQ0FBQ0osS0FBSyxFQUFFRSxRQUFRLEVBQUVULGNBQWMsRUFBRWEsQ0FBQyxFQUFFO0lBQzNELElBQUlBLENBQUMsRUFBRTtNQUNIRSxPQUFPLENBQUNJLEdBQUcsQ0FBQyxxQkFBcUIsR0FBR04sQ0FBQyxDQUFDb0MsTUFBTSxDQUFDN0QsU0FBUyxDQUFDO0lBQzNEO0lBQ0EyQixPQUFPLENBQUNJLEdBQUcsQ0FBQ1osS0FBSyxDQUFDO0lBQ2xCUSxPQUFPLENBQUNJLEdBQUcsQ0FBQ1YsUUFBUSxDQUFDO0lBQ3JCTSxPQUFPLENBQUNJLEdBQUcsQ0FBQ25CLGNBQWMsQ0FBQztJQUMzQixJQUFJLENBQUMzQyxNQUFNLElBQUkyQyxjQUFjLENBQUNtQyxJQUFJLENBQUMsVUFBQWIsQ0FBQztNQUFBLE9BQUlBLENBQUMsQ0FBQ2MsUUFBUSxJQUFJN0IsS0FBSyxDQUFDRyxPQUFPLElBQUtHLENBQUMsSUFBSUEsQ0FBQyxDQUFDb0MsTUFBTSxDQUFDN0QsU0FBUyxDQUFDOEQsUUFBUSxDQUFDLHFCQUFxQixDQUFFO0lBQUEsRUFBQyxFQUFFO01BQy9IO0lBQ0o7SUFFQW5DLE9BQU8sQ0FBQ0ksR0FBRyxDQUFDM0QsY0FBYyxDQUFDO0lBRTNCLElBQU0yRixPQUFPLEdBQUczRixjQUFjLENBQUMrQyxLQUFLLENBQUNHLE9BQU8sQ0FBQztJQUM3Q0ssT0FBTyxDQUFDSSxHQUFHLENBQUMsbUJBQW1CLEVBQUUzRCxjQUFjLENBQUM7SUFDaEQsSUFBSSxDQUFDMkYsT0FBTyxJQUFJLENBQUNBLE9BQU8sQ0FBQ3pDLE9BQU8sRUFBRTtNQUM5QkssT0FBTyxDQUFDSSxHQUFHLENBQUMsMkJBQTJCLEdBQUdaLEtBQUssQ0FBQ0csT0FBTyxDQUFDO01BQ3hEO0lBQ0o7SUFFQW5CLE9BQU8sQ0FBQyxTQUFTLEVBQUU7TUFDZjZELE1BQU0sRUFBRSxNQUFNO01BQ2RDLElBQUksRUFBRUMsSUFBSSxDQUFDQyxTQUFTLENBQUM7UUFDakJDLE1BQU0sRUFBRW5HLE1BQU07UUFDZG9HLE9BQU8sRUFBRWxELEtBQUssQ0FBQ0c7TUFDbkIsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDM0MsSUFBSSxDQUFDLFVBQUEyRixRQUFRLEVBQUk7TUFDaEIsSUFBSUEsUUFBUSxDQUFDQyxPQUFPLEVBQUU7UUFDbEI1QyxPQUFPLENBQUNJLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRXVDLFFBQVEsQ0FBQ0UsS0FBSyxDQUFDO1FBQzdDQyxZQUFZLENBQUNWLE9BQU8sQ0FBQztRQUNyQjFDLFFBQVEsQ0FBQ3JCLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLE9BQU8sQ0FBQztRQUMvQnlFLGFBQWEsQ0FBQyxDQUFDLENBQUM7TUFDcEIsQ0FBQyxNQUFNO1FBQ0gvQyxPQUFPLENBQUNDLEtBQUssQ0FBQyx5QkFBeUIsRUFBRTBDLFFBQVEsQ0FBQzFDLEtBQUssQ0FBQztNQUM1RDtJQUNKLENBQUMsQ0FBQyxTQUFNLENBQUMsVUFBQUEsS0FBSyxFQUFJO01BQ2RELE9BQU8sQ0FBQ0MsS0FBSyxDQUFDLHVCQUF1QixFQUFFQSxLQUFLLENBQUM7SUFDakQsQ0FBQyxDQUFDO0VBQ047RUFHQSxTQUFTK0Isc0JBQXNCQSxDQUFDeEMsS0FBSyxFQUFFRSxRQUFRLEVBQUU7SUFDN0MsSUFBSSxDQUFDcEQsTUFBTSxFQUFFO01BQ1Q7SUFDSjtJQUVBLElBQU04RixPQUFPLEdBQUczRixjQUFjLENBQUMrQyxLQUFLLENBQUNHLE9BQU8sQ0FBQztJQUM3QyxJQUFJLENBQUN5QyxPQUFPLElBQUksQ0FBQ0EsT0FBTyxDQUFDekMsT0FBTyxFQUFFO01BQzlCSyxPQUFPLENBQUNJLEdBQUcsQ0FBQywyQkFBMkIsR0FBR1osS0FBSyxDQUFDRyxPQUFPLENBQUM7TUFDeEQ7SUFDSjtJQUVBLElBQU1xRCxTQUFTLEdBQUdDLGlCQUFpQixDQUFDYixPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzlDLElBQUlZLFNBQVMsRUFBRTtNQUNYdEQsUUFBUSxDQUFDckIsU0FBUyxDQUFDNkUsTUFBTSxDQUFDLE9BQU8sQ0FBQztNQUNsQ0gsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JCO0VBQ0o7RUFFQSxTQUFTQSxhQUFhQSxDQUFDSSxJQUFJLEVBQUU7SUFDekIsSUFBTUMsV0FBVyxHQUFHLENBQUN2SCxXQUFXLENBQUNvQyxTQUFTO0lBQzFDZ0UsVUFBVSxDQUFDbUIsV0FBVyxHQUFHRCxJQUFJLENBQUM7RUFDbEM7RUFFQSxTQUFTbEIsVUFBVUEsQ0FBQ3hDLEtBQUssRUFBRTtJQUN2QjVELFdBQVcsQ0FBQ29DLFNBQVMsR0FBR3dCLEtBQUs7SUFFN0IsSUFBTTRELFNBQVMsR0FBRzVELEtBQUssR0FBRyxFQUFFO0lBQzVCLElBQUk2RCxjQUFjO0lBQ2xCLElBQUlELFNBQVMsS0FBSyxDQUFDLEVBQUU7TUFDakJDLGNBQWMsR0FBRyxRQUFRO0lBQzdCLENBQUMsTUFBTSxJQUFJRCxTQUFTLElBQUksQ0FBQyxJQUFJQSxTQUFTLElBQUksQ0FBQyxFQUFFO01BQ3pDQyxjQUFjLEdBQUcsUUFBUTtJQUM3QixDQUFDLE1BQU07TUFDSEEsY0FBYyxHQUFHLFFBQVE7SUFDN0I7SUFFQSxJQUFNQyxnQkFBZ0IsR0FBR3JGLFlBQVksQ0FBQ29GLGNBQWMsQ0FBQztJQUNyRHZILFVBQVUsQ0FBQ2tDLFNBQVMsR0FBR3NGLGdCQUFnQjtJQUV2QyxJQUFJOUQsS0FBSyxHQUFHLENBQUMsRUFBRTtNQUNYekQsVUFBVSxDQUFDcUMsU0FBUyxDQUFDNkUsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUN2QyxDQUFDLE1BQU07TUFDSGxILFVBQVUsQ0FBQ3FDLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUNwQztFQUNKO0VBRUEsU0FBU2tGLFlBQVlBLENBQUNoRSxLQUFLLEVBQWU7SUFBQSxJQUFiaUUsU0FBUyxHQUFBQyxTQUFBLENBQUE5RixNQUFBLFFBQUE4RixTQUFBLFFBQUFDLFNBQUEsR0FBQUQsU0FBQSxNQUFDLENBQUM7SUFDcEMsSUFBSUQsU0FBUyxHQUFHLENBQUMsRUFBRTtNQUNmekQsT0FBTyxDQUFDSSxHQUFHLENBQUMsaUNBQWlDLENBQUM7TUFDOUM7SUFDSjtJQUVBLE9BQU90RCxLQUFLLENBQUMsaUNBQWlDLEVBQUU7TUFDNUN1RixNQUFNLEVBQUUsTUFBTTtNQUNkQyxJQUFJLEVBQUVDLElBQUksQ0FBQ0MsU0FBUyxDQUFDO1FBQ2pCLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLElBQUksRUFBRSxFQUFFO1FBQ1IsUUFBUSxFQUFFLHFCQUFxQjtRQUMvQixRQUFRLEVBQUU7VUFDTixJQUFJLEVBQUU7WUFDRixNQUFNLEVBQUUsSUFBSTtZQUNaLFlBQVksRUFBRWlCLFNBQVM7WUFDdkIsVUFBVSxFQUFFakUsS0FBSyxDQUFDRztVQUN0QjtRQUNKO01BQ0osQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUNHM0MsSUFBSSxDQUFDLFVBQUFDLEdBQUc7TUFBQSxPQUFJQSxHQUFHLENBQUNDLElBQUksQ0FBQyxDQUFDO0lBQUEsRUFBQyxDQUN2QkYsSUFBSSxDQUFDLFVBQUFvRixPQUFPLEVBQUk7TUFDYixJQUFNd0IsUUFBUSxHQUFHeEIsT0FBTyxDQUFDeUIsTUFBTSxDQUFDQyxJQUFJLENBQUMsVUFBQUMsQ0FBQztRQUFBLE9BQUlBLENBQUMsQ0FBQ0MsV0FBVyxLQUFLeEUsS0FBSyxDQUFDeUUsVUFBVSxJQUFJRixDQUFDLENBQUNHLGdCQUFnQixLQUFLMUUsS0FBSyxDQUFDMkUsVUFBVTtNQUFBLEVBQUM7TUFDeEgsSUFBSVAsUUFBUSxFQUFFO1FBQ1YsSUFBTVEsT0FBTyxHQUFHUixRQUFRLENBQUNTLFFBQVEsQ0FBQ1AsSUFBSSxDQUFDLFVBQUFDLENBQUM7VUFBQSxPQUFJQSxDQUFDLENBQUNPLFlBQVksSUFBSTlFLEtBQUssQ0FBQytFLFdBQVc7UUFBQSxFQUFDO1FBQ2hGLElBQUksQ0FBQ0gsT0FBTyxFQUFFO1VBQ1YsT0FBT1osWUFBWSxDQUFDaEUsS0FBSyxFQUFFaUUsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUM3QztRQUNBLE9BQU87VUFDSGUsU0FBUyxFQUFFSixPQUFPLENBQUNLLFVBQVU7VUFDN0JDLFdBQVcsRUFBRU4sT0FBTyxDQUFDTyxZQUFZO1VBQ2pDQyxRQUFRLEVBQUVoQixRQUFRLENBQUNpQixTQUFTO1VBQzVCcEIsU0FBUyxFQUFFQSxTQUFTO1VBQ3BCOUQsT0FBTyxFQUFFSCxLQUFLLENBQUNHO1FBQ25CLENBQUM7TUFDTCxDQUFDLE1BQU07UUFDSCxPQUFPNkQsWUFBWSxDQUFDaEUsS0FBSyxFQUFFaUUsU0FBUyxHQUFHLENBQUMsQ0FBQztNQUM3QztJQUNKLENBQUMsQ0FBQyxDQUNEekcsSUFBSSxDQUFDLFVBQUE4SCxDQUFDLEVBQUk7TUFDUDlFLE9BQU8sQ0FBQ0ksR0FBRyxDQUFDMEUsQ0FBQyxDQUFDO01BQ2RySSxjQUFjLENBQUNxSSxDQUFDLENBQUNuRixPQUFPLENBQUMsR0FBR21GLENBQUM7TUFDN0IsT0FBT0EsQ0FBQztJQUNaLENBQUMsQ0FBQyxTQUNJLENBQUMsVUFBQTdFLEtBQUssRUFBSTtNQUNaRCxPQUFPLENBQUNJLEdBQUcsQ0FBQ0gsS0FBSyxDQUFDO0lBQ3RCLENBQUMsQ0FBQztFQUNWO0VBRUEsU0FBU3NCLFVBQVVBLENBQUN3RCxJQUFJLEVBQUU7SUFDdEIsSUFBSSxDQUFDQSxJQUFJLEVBQUU7TUFDUDtJQUNKO0lBQ0EsSUFBTUMsQ0FBQyxHQUFHLElBQUl4RSxJQUFJLENBQUN1RSxJQUFJLENBQUM7SUFDeEIsSUFBTUUsR0FBRyxHQUFHQyxNQUFNLENBQUNGLENBQUMsQ0FBQ0csT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUNoRCxJQUFNQyxLQUFLLEdBQUdILE1BQU0sQ0FBQ0YsQ0FBQyxDQUFDTSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDRixRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUN2RCxVQUFBckksTUFBQSxDQUFVa0ksR0FBRyxPQUFBbEksTUFBQSxDQUFJc0ksS0FBSztFQUMxQjtFQUVBLFNBQVN2QyxZQUFZQSxDQUFDdEQsS0FBSyxFQUFFO0lBQ3pCLElBQUksQ0FBQytGLE1BQU0sQ0FBQ0Msa0JBQWtCLEVBQUU7TUFDNUJ4RixPQUFPLENBQUNJLEdBQUcsQ0FBQyx5Q0FBeUMsQ0FBQztNQUN0RDtJQUNKO0lBQ0EsSUFBTWdFLE9BQU8sR0FBRztNQUNaLFdBQVcsRUFBRTVFLEtBQUssQ0FBQ2lFLFNBQVM7TUFDNUIsU0FBUyxFQUFFakUsS0FBSyxDQUFDRyxPQUFPO01BQ3hCLFVBQVUsRUFBRUgsS0FBSyxDQUFDb0YsUUFBUTtNQUMxQixXQUFXLEVBQUVwRixLQUFLLENBQUNnRjtJQUN2QixDQUFDO0lBQ0RlLE1BQU0sQ0FBQ0Msa0JBQWtCLENBQUMsQ0FBQ3BCLE9BQU8sQ0FBQyxDQUFDO0VBQ3hDO0VBRUEsU0FBU25CLGlCQUFpQkEsQ0FBQ3pELEtBQUssRUFBRTtJQUM5QixJQUFJLENBQUMrRixNQUFNLENBQUNFLGtCQUFrQixFQUFFO01BQzVCekYsT0FBTyxDQUFDSSxHQUFHLENBQUMsc0NBQXNDLENBQUM7TUFDbkQsT0FBTyxLQUFLLENBQUMsQ0FBQztJQUNsQjtJQUVBLElBQU1vRSxTQUFTLEdBQUdoRixLQUFLLENBQUNnRixTQUFTLENBQUMsQ0FBQzs7SUFFbkM7SUFDQSxJQUFNWCxNQUFNLEdBQUcwQixNQUFNLENBQUNFLGtCQUFrQixDQUFDLENBQUNqQixTQUFTLENBQUMsQ0FBQztJQUVyRCxJQUFJWCxNQUFNLElBQUlBLE1BQU0sWUFBWTZCLE9BQU8sRUFBRTtNQUNyQzdCLE1BQU0sQ0FDRDdHLElBQUksQ0FBQztRQUFBLE9BQU1nRCxPQUFPLENBQUNJLEdBQUcsMEdBQUFyRCxNQUFBLENBQStCeUgsU0FBUyxDQUFFLENBQUM7TUFBQSxFQUFDLFNBQzdELENBQUMsVUFBQTNFLEdBQUc7UUFBQSxPQUFJRyxPQUFPLENBQUNDLEtBQUssbUlBQUFsRCxNQUFBLENBQW9DeUgsU0FBUyxRQUFLM0UsR0FBRyxDQUFDO01BQUEsRUFBQztJQUMxRixDQUFDLE1BQU07TUFDSEcsT0FBTyxDQUFDSSxHQUFHLG9GQUFBckQsTUFBQSxDQUFtQjhHLE1BQU0sb0NBQUE5RyxNQUFBLENBQWtCeUgsU0FBUyxDQUFFLENBQUM7SUFDdEU7SUFFQSxPQUFPWCxNQUFNO0VBQ2pCO0VBRUEsU0FBUzdFLGVBQWVBLENBQUEsRUFBRztJQUN2QixJQUFJLENBQUN1RyxNQUFNLENBQUN2RyxlQUFlLEVBQUU7TUFDekJnQixPQUFPLENBQUNJLEdBQUcsQ0FBQyxzQ0FBc0MsQ0FBQztNQUNuRCxPQUFPc0YsT0FBTyxDQUFDQyxPQUFPLENBQUMsRUFBRSxDQUFDO0lBQzlCO0lBRUEsT0FBT0osTUFBTSxDQUFDdkcsZUFBZSxDQUFDLENBQUMsQ0FDMUJoQyxJQUFJLENBQUMsVUFBQTZHLE1BQU0sRUFBSTtNQUNaN0QsT0FBTyxDQUFDSSxHQUFHLENBQUMsZ0JBQWdCLEVBQUV5RCxNQUFNLENBQUM7TUFDckMsT0FBT0EsTUFBTTtJQUNqQixDQUFDLENBQUMsU0FDSSxDQUFDLFVBQUE1RCxLQUFLLEVBQUk7TUFDWkQsT0FBTyxDQUFDQyxLQUFLLENBQUMsMkJBQTJCLEVBQUVBLEtBQUssQ0FBQztNQUNqRCxPQUFPLEVBQUU7SUFDYixDQUFDLENBQUM7RUFDVjtFQUVBLFNBQVMyRixJQUFJQSxDQUFBLEVBQUc7SUFDWjFGLFFBQVEsQ0FBQyxDQUFDO0lBQ1YsSUFBSXFGLE1BQU0sQ0FBQ00sS0FBSyxFQUFFO01BQ2QsSUFBSUMsS0FBSyxHQUFHUCxNQUFNLENBQUNNLEtBQUssQ0FBQ0UsUUFBUSxDQUFDLENBQUM7TUFDbkN6SixNQUFNLEdBQUd3SixLQUFLLENBQUNFLElBQUksQ0FBQ0MsWUFBWSxJQUFJSCxLQUFLLENBQUNFLElBQUksQ0FBQ0UsRUFBRSxJQUFJLEVBQUU7SUFDM0QsQ0FBQyxNQUFNO01BQ0gsSUFBSUMsQ0FBQyxHQUFHLENBQUM7TUFDVCxJQUFJckYsQ0FBQyxHQUFHc0YsV0FBVyxDQUFDLFlBQVk7UUFDNUIsSUFBSUQsQ0FBQyxHQUFHLEVBQUUsRUFBRTtVQUNSLElBQUksQ0FBQyxDQUFDWixNQUFNLENBQUNjLFNBQVMsRUFBRTtZQUNwQi9KLE1BQU0sR0FBR2lKLE1BQU0sQ0FBQ2MsU0FBUztZQUN6QkMsYUFBYSxDQUFDLENBQUM7WUFDZkMsYUFBYSxDQUFDekYsQ0FBQyxDQUFDO1VBQ3BCO1FBQ0osQ0FBQyxNQUFNO1VBQ0h5RixhQUFhLENBQUN6RixDQUFDLENBQUM7UUFDcEI7TUFDSixDQUFDLEVBQUUsR0FBRyxDQUFDO0lBQ1g7SUFFQXdGLGFBQWEsQ0FBQyxDQUFDO0VBQ25CO0VBRUEsSUFBSUEsYUFBYSxHQUFHLFNBQWhCQSxhQUFhQSxDQUFBLEVBQVM7SUFDdEIsSUFBSWhLLE1BQU0sRUFBRTtNQUFBLElBQUFrSyxVQUFBLEdBQUFySCwwQkFBQSxDQUNnQjFELFVBQVU7UUFBQWdMLE1BQUE7TUFBQTtRQUFsQyxLQUFBRCxVQUFBLENBQUFuSCxDQUFBLE1BQUFvSCxNQUFBLEdBQUFELFVBQUEsQ0FBQWxILENBQUEsSUFBQUMsSUFBQSxHQUFvQztVQUFBLElBQXpCbUgsU0FBUyxHQUFBRCxNQUFBLENBQUFoSCxLQUFBO1VBQ2hCaUgsU0FBUyxDQUFDckksU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQ25DO01BQUMsU0FBQXVCLEdBQUE7UUFBQTJHLFVBQUEsQ0FBQTFHLENBQUEsQ0FBQUQsR0FBQTtNQUFBO1FBQUEyRyxVQUFBLENBQUF6RyxDQUFBO01BQUE7TUFDRDlELFVBQVUsQ0FBQ29DLFNBQVMsQ0FBQzZFLE1BQU0sQ0FBQyxNQUFNLENBQUM7TUFDbkMsSUFBTXBFLFNBQVMsR0FBR3BELFFBQVEsQ0FBQ0ksYUFBYSxDQUFDLGFBQWEsQ0FBQztNQUN2RGdELFNBQVMsQ0FBQ1QsU0FBUyxDQUFDNkUsTUFBTSxDQUFDLE1BQU0sQ0FBQztNQUNsQyxJQUFNdEMsU0FBUyxHQUFHbEYsUUFBUSxDQUFDSSxhQUFhLENBQUMsZUFBZSxDQUFDO01BQ3pEO0lBQ0osQ0FBQyxNQUFNO01BQ0hHLFVBQVUsQ0FBQ29DLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLE1BQU0sQ0FBQztNQUFBLElBQUFxSSxVQUFBLEdBQUF4SCwwQkFBQSxDQUNMdkQsZUFBZTtRQUFBZ0wsTUFBQTtNQUFBO1FBQTFDLEtBQUFELFVBQUEsQ0FBQXRILENBQUEsTUFBQXVILE1BQUEsR0FBQUQsVUFBQSxDQUFBckgsQ0FBQSxJQUFBQyxJQUFBLEdBQTRDO1VBQUEsSUFBbkNzSCxjQUFjLEdBQUFELE1BQUEsQ0FBQW5ILEtBQUE7VUFDbkJvSCxjQUFjLENBQUN4SSxTQUFTLENBQUNDLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDeEM7TUFBQyxTQUFBdUIsR0FBQTtRQUFBOEcsVUFBQSxDQUFBN0csQ0FBQSxDQUFBRCxHQUFBO01BQUE7UUFBQThHLFVBQUEsQ0FBQTVHLENBQUE7TUFBQTtNQUFBLElBQUErRyxVQUFBLEdBQUEzSCwwQkFBQSxDQUN1QjFELFVBQVU7UUFBQXNMLE1BQUE7TUFBQTtRQUFsQyxLQUFBRCxVQUFBLENBQUF6SCxDQUFBLE1BQUEwSCxNQUFBLEdBQUFELFVBQUEsQ0FBQXhILENBQUEsSUFBQUMsSUFBQSxHQUFvQztVQUFBLElBQXpCbUgsVUFBUyxHQUFBSyxNQUFBLENBQUF0SCxLQUFBO1VBQ2hCaUgsVUFBUyxDQUFDckksU0FBUyxDQUFDNkUsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUN0QztNQUFDLFNBQUFyRCxHQUFBO1FBQUFpSCxVQUFBLENBQUFoSCxDQUFBLENBQUFELEdBQUE7TUFBQTtRQUFBaUgsVUFBQSxDQUFBL0csQ0FBQTtNQUFBO0lBQ0w7RUFDSixDQUFDO0VBRURsRCxnQkFBZ0IsQ0FBQyxDQUFDLENBQ2JHLElBQUksQ0FBQzRJLElBQUksQ0FBQztFQUVmLElBQUl4SCxRQUFRLEdBQUcxQyxRQUFRLENBQUNJLGFBQWEsQ0FBQyxZQUFZLENBQUM7RUFDbkRrTCxVQUFVLENBQUM7SUFBQSxPQUFNNUksUUFBUSxDQUFDQyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxVQUFVLENBQUM7RUFBQSxHQUFFLElBQUksQ0FBQztFQUUxRCxTQUFTcUMsVUFBVUEsQ0FBQSxFQUFHO0lBQ2xCLElBQUlzRyxVQUFVLEdBQUcsS0FBSztJQUN0QixJQUFJQyxNQUFNO0lBQ1YsSUFBSUMsVUFBVTtJQUVkLElBQU1DLGtCQUFrQixHQUFHMUwsUUFBUSxDQUFDOEIsY0FBYyxDQUFDLG9CQUFvQixDQUFDO0lBQ3hFLElBQU02SixTQUFTLEdBQUczTCxRQUFRLENBQUNDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDO0lBQ2pFLElBQU0yTCxHQUFHLEdBQUc1TCxRQUFRLENBQUNJLGFBQWEsQ0FBQyxlQUFlLENBQUM7SUFDbkQsSUFBTXlMLGVBQWUsR0FBR0YsU0FBUyxDQUFDekosTUFBTTtJQUV4QyxRQUFRMkosZUFBZTtNQUNuQixLQUFLLENBQUM7UUFDRkQsR0FBRyxDQUFDRSxLQUFLLENBQUNDLFFBQVEsR0FBRyxRQUFRO1FBQzdCO01BQ0osS0FBSyxDQUFDO1FBQ0ZILEdBQUcsQ0FBQ0UsS0FBSyxDQUFDQyxRQUFRLEdBQUcsUUFBUTtRQUM3QjtNQUNKLEtBQUssQ0FBQztRQUNGSCxHQUFHLENBQUNFLEtBQUssQ0FBQ0MsUUFBUSxHQUFHLFFBQVE7UUFDN0I7TUFDSixLQUFLLENBQUM7UUFDRkgsR0FBRyxDQUFDRSxLQUFLLENBQUNDLFFBQVEsR0FBRyxPQUFPO1FBQzVCO01BQ0osS0FBSyxDQUFDO1FBQ0ZILEdBQUcsQ0FBQ0UsS0FBSyxDQUFDQyxRQUFRLEdBQUcsT0FBTztRQUM1QjtNQUNKO1FBQ0lILEdBQUcsQ0FBQ0UsS0FBSyxDQUFDQyxRQUFRLEdBQUcsUUFBUTtRQUM3QjtJQUNSO0lBRUFMLGtCQUFrQixDQUFDckksZ0JBQWdCLENBQUMsV0FBVyxFQUFFLFVBQUNlLENBQUMsRUFBSztNQUNwRG1ILFVBQVUsR0FBRyxJQUFJO01BQ2pCQyxNQUFNLEdBQUdwSCxDQUFDLENBQUM0SCxLQUFLLEdBQUdOLGtCQUFrQixDQUFDTyxVQUFVO01BQ2hEUixVQUFVLEdBQUdDLGtCQUFrQixDQUFDRCxVQUFVO0lBRTlDLENBQUMsQ0FBQztJQUVGQyxrQkFBa0IsQ0FBQ3JJLGdCQUFnQixDQUFDLFlBQVksRUFBRSxZQUFNO01BQ3BEa0ksVUFBVSxHQUFHLEtBQUs7SUFDdEIsQ0FBQyxDQUFDO0lBRUZHLGtCQUFrQixDQUFDckksZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFlBQU07TUFDakRrSSxVQUFVLEdBQUcsS0FBSztJQUN0QixDQUFDLENBQUM7SUFFRkcsa0JBQWtCLENBQUNySSxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsVUFBQ2UsQ0FBQyxFQUFLO01BQ3BELElBQUksQ0FBQ21ILFVBQVUsRUFBRTtNQUNqQm5ILENBQUMsQ0FBQzhILGNBQWMsQ0FBQyxDQUFDO01BQ2xCLElBQU1DLENBQUMsR0FBRy9ILENBQUMsQ0FBQzRILEtBQUssR0FBR04sa0JBQWtCLENBQUNPLFVBQVU7TUFDakQsSUFBTUcsSUFBSSxHQUFHLENBQUNELENBQUMsR0FBR1gsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDO01BQy9CRSxrQkFBa0IsQ0FBQ0QsVUFBVSxHQUFHQSxVQUFVLEdBQUdXLElBQUk7SUFDckQsQ0FBQyxDQUFDO0VBQ047RUFFQXBNLFFBQVEsQ0FBQ3FELGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFDZSxDQUFDLEVBQUs7SUFDdEMsSUFBTW9DLE1BQU0sR0FBR3BDLENBQUMsQ0FBQ29DLE1BQU0sQ0FBQzZGLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztJQUNqRCxJQUFJN0YsTUFBTSxJQUFJLENBQUM1RixNQUFNLEVBQUU7TUFDbkJpSixNQUFNLENBQUN5QyxRQUFRLENBQUNDLElBQUksR0FBRyxRQUFRO0lBQ25DO0VBQ0osQ0FBQyxDQUFDOztFQUVGO0VBQ0EsSUFBTUMsU0FBUyxHQUFHeE0sUUFBUSxDQUFDSSxhQUFhLENBQUMsc0JBQXNCLENBQUM7RUFFaEVvTSxTQUFTLENBQUNuSixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBVTtJQUMxQ21KLFNBQVMsQ0FBQzdKLFNBQVMsQ0FBQzhKLE1BQU0sQ0FBQyxRQUFRLENBQUM7RUFDeEMsQ0FBQyxDQUFDOztFQUVGO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7RUFFQXpNLFFBQVEsQ0FBQ0ksYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDaUQsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQU07SUFDaEV6QyxNQUFNLEdBQUdBLE1BQU0sS0FBSyxTQUFTLEdBQUcsQ0FBQyxHQUFHLFNBQVM7SUFDN0NLLGNBQWMsQ0FBQ3lMLE9BQU8sQ0FBQyxRQUFRLEVBQUU5TCxNQUFNLENBQUM7SUFDeENpSixNQUFNLENBQUN5QyxRQUFRLENBQUNLLE1BQU0sQ0FBQyxDQUFDO0VBRTVCLENBQUMsQ0FBQzs7RUFFRjtFQUNBO0VBQ0E7QUFZSixDQUFDLEVBQUUsQ0FBQztBQ3JnQkoiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYXBpVVJMID0gJ2h0dHBzOi8vZmF2LXByb20uY29tL2FwaV9mb3JlY2FzdF9wb3N0ZXInO1xuXG4gICAgY29uc3RcbiAgICAgICAgdW5hdXRoTXNncyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hdXRoQnRuJyksXG4gICAgICAgIHBhcnRpY2lwYXRlQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcmVkaWN0QnRuJyksXG4gICAgICAgIGNvdW50ZXJTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvdW50ZXInKSxcbiAgICAgICAgZXZlbnRzU3BhbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ldmVudHMnKSxcbiAgICAgICAgd2VsY29tZUJldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWxjb21lX19iZXQnKSxcbiAgICAgICAgc3dpdGNoV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2VsY29tZV9fc3dpdGNoXCIpO1xuXG4gICAgY29uc3QgdWtMZW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VrTGVuZycpO1xuICAgIGNvbnN0IGVuTGVuZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlbkxlbmcnKTtcblxuICAgIC8vIGxldCBsb2NhbGUgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwibG9jYWxlXCIpID8/ICd1ayc7XG4gICAgbGV0IGxvY2FsZSA9ICAndWsnO1xuXG4gICAgaWYgKHVrTGVuZykgbG9jYWxlID0gJ3VrJztcbiAgICBpZiAoZW5MZW5nKSBsb2NhbGUgPSAnZW4nO1xuXG4gICAgbGV0IGkxOG5EYXRhID0ge307XG4gICAgbGV0IHVzZXJJZDtcbiAgICBsZXQgZWxlbWVudHNCeU1hdGNoaUQgPSB7fTtcbiAgICBsZXQgYWxsTWF0Y2hlcyA9IFtdO1xuICAgIGxldCBmYXZEYXRhQnlNYXRjaCA9IHt9O1xuICAgIHVzZXJJZCA9IE51bWJlcihzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwidXNlcklkXCIpKSA/PyAxMDMwMzE1OTcgO1xuICAgIC8vIHVzZXJJZCA9IDEwMzAzMTU5NyA7XG5cbiAgICBmdW5jdGlvbiBsb2FkVHJhbnNsYXRpb25zKCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goYCR7YXBpVVJMfS9uZXctdHJhbnNsYXRlcy8ke2xvY2FsZX1gKS50aGVuKHJlcyA9PiByZXMuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4oanNvbiA9PiB7XG4gICAgICAgICAgICAgICAgaTE4bkRhdGEgPSBqc29uO1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIG11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9yZWNhc3RQb3N0ZXInKSwge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRyYW5zbGF0ZSgpIHtcbiAgICAgICAgY29uc3QgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10cmFuc2xhdGVdJylcbiAgICAgICAgaWYgKGVsZW1zICYmIGVsZW1zLmxlbmd0aCkge1xuICAgICAgICAgICAgZWxlbXMuZm9yRWFjaChlbGVtID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS10cmFuc2xhdGUnKTtcbiAgICAgICAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IHRyYW5zbGF0ZUtleShrZXkpO1xuICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXRyYW5zbGF0ZScpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9jYWxlID09PSAnZW4nKSB7XG4gICAgICAgICAgICBtYWluUGFnZS5jbGFzc0xpc3QuYWRkKCdlbicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNsYXRlS2V5KGtleSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdFZhbHVlID0gZGVmYXVsdFZhbHVlIHx8IGtleTtcbiAgICAgICAgcmV0dXJuIGkxOG5EYXRhW2tleV0gfHwgZGVmYXVsdFZhbHVlO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcXVlc3QgPSBmdW5jdGlvbiAobGluaywgZXh0cmFPcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBmZXRjaChhcGlVUkwgKyBsaW5rLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLi4uKGV4dHJhT3B0aW9ucyB8fCB7fSlcbiAgICAgICAgfSkudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0QWRkQWxsQnRuKCkge1xuICAgICAgICBjb25zdCBhZGRBbGxCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJlZGljdEJ0bicpO1xuICAgICAgICBhZGRBbGxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZ2V0QmV0c2xpcEl0ZW1zKCkudGhlbihiZXRzbGlwTWF0Y2hlcyA9PiB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBtYXRjaCBvZiBhbGxNYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoRGl2ID0gZWxlbWVudHNCeU1hdGNoaURbbWF0Y2gubWF0Y2hJZF07XG4gICAgICAgICAgICAgICAgICAgIGFkZE1hdGNoVG9CZXRzbGlwKG1hdGNoLCBtYXRjaERpdiwgYmV0c2xpcE1hdGNoZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKCdFcnJvciBnZXR0aW5nIGJldHNsaXAgaXRlbXM6JywgZXJyKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IEluaXRQYWdlID0gKCkgPT4ge1xuICAgICAgICB0cmFuc2xhdGUoKTtcbiAgICAgICAgaW5pdEFkZEFsbEJ0bigpO1xuICAgICAgICByZXF1ZXN0KCcvbWF0Y2hlcycpLnRoZW4obWF0Y2hlcyA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtYXRjaGVzKTtcbiAgICAgICAgICAgIGFsbE1hdGNoZXMgPSAobWF0Y2hlcyB8fCBbXSkuc29ydCgoYSwgYikgPT4gbmV3IERhdGUoYS5hY3RpdmVEYXRlKSAtIG5ldyBEYXRlKGIuYWN0aXZlRGF0ZSkpO1xuXG4gICAgICAgICAgICBnZXRCZXRzbGlwSXRlbXMoKS50aGVuKGJldHNsaXBNYXRjaGVzID0+IHtcbiAgICAgICAgICAgICAgICBpbml0TWF0Y2hlcyhhbGxNYXRjaGVzLCBiZXRzbGlwTWF0Y2hlcyk7XG4gICAgICAgICAgICAgICAgaW5pdFNsaWRlcigpO1xuICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGdldHRpbmcgYmV0c2xpcCBpdGVtczonLCBlcnIpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdE1hdGNoZXMobWF0Y2hlcywgYmV0c2xpcE1hdGNoZXMpIHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX3JvdycpO1xuICAgICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgICAgbGV0IGFkZGVkID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRjaGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgICAgICBjb25zdCByb3dXcmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICByb3dXcmFwLmNsYXNzTmFtZSA9ICd3ZWxjb21lX19yb3ctd3JhcCc7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSBpOyBqIDwgaSArIDIgJiYgaiA8IG1hdGNoZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IG1hdGNoZXNbal07XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgICAgICBtYXRjaERpdi5jbGFzc05hbWUgPSAnd2VsY29tZV9faXRlbSc7XG4gICAgICAgICAgICAgICAgbWF0Y2gubWF0Y2hJZCA9ICgrbWF0Y2gubWF0Y2hJZCk7XG4gICAgICAgICAgICAgICAgaWYgKGJldHNsaXBNYXRjaGVzLnNvbWUoYiA9PiBiLmV2ZW50X2lkID09IG1hdGNoLm1hdGNoSWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZGVkKys7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoRGl2LmNsYXNzTGlzdC5hZGQoJ19kb25lJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbWF0Y2hEaXYuaW5uZXJIVE1MID0gYFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLWNsb3NlXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tcm93XCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz1cImh0dHBzOi8vZmF2LXByb20uY29tL2h0bWwvZm9yZWNhc3QtcG9zdGVyL2ltZy93ZWxjb21lL2Zhdi5zdmdcIiBhbHQ9XCJGQVZCRVRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiR7dHJhbnNsYXRlS2V5KG1hdGNoLnRpdGxlKX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwid2VsY29tZV9faXRlbS1kYXRlXCI+JHtmb3JtYXREYXRlKG1hdGNoLm1hdGNoRGF0ZSl9PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tbWF4LXRpdGxlXCI+JHt0cmFuc2xhdGVLZXkobWF0Y2gudGVhbTEpfSDigJMgJHt0cmFuc2xhdGVLZXkobWF0Y2gudGVhbTIpfTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ3ZWxjb21lX19pdGVtLWluZm9cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tYmlkXCI+JHt0cmFuc2xhdGVLZXkobWF0Y2gub3V0Y29tZVRyYW5zbGF0aW9uKX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIndlbGNvbWVfX2l0ZW0tY29mXCI+JHttYXRjaC5kZWZhdWx0Q29lZiB8fCAwfTwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgYDtcblxuICAgICAgICAgICAgICAgIGVsZW1lbnRzQnlNYXRjaGlEW21hdGNoLm1hdGNoSWRdID0gbWF0Y2hEaXY7XG4gICAgICAgICAgICAgICAgcm93V3JhcC5hcHBlbmRDaGlsZChtYXRjaERpdik7XG5cbiAgICAgICAgICAgICAgICAvLyBnZXRNYXRjaERhdGEobWF0Y2gpLnRoZW4obSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGlmIChtKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBjb25zdCBjb2ZEaXYgPSBtYXRjaERpdi5xdWVyeVNlbGVjdG9yKCcud2VsY29tZV9faXRlbS1jb2YnKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGNvZkRpdi5pbm5lckhUTUwgPSBtLm91dGNvbWVDb2VmO1xuICAgICAgICAgICAgICAgIC8vICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coYE5vIG91dGNvbWUgZGF0YSBmb3IgJHttYXRjaC5tYXRjaElkfWApO1xuICAgICAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgICAgICAgICBtYXRjaERpdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBhZGRNYXRjaFRvQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYsIGJldHNsaXBNYXRjaGVzLCBlKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2xvc2VCdG4gPSBtYXRjaERpdi5xdWVyeVNlbGVjdG9yKCcud2VsY29tZV9faXRlbS1jbG9zZScpO1xuICAgICAgICAgICAgICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTWF0Y2hGcm9tQmV0c2xpcChtYXRjaCwgbWF0Y2hEaXYpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHJvd1dyYXApO1xuICAgICAgICB9XG4gICAgICAgIHNldENvdW50ZXIoYWRkZWQpO1xuICAgICAgICByZXR1cm4gY29udGFpbmVyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZE1hdGNoVG9CZXRzbGlwKG1hdGNoLCBtYXRjaERpdiwgYmV0c2xpcE1hdGNoZXMsIGUpIHtcbiAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdUYXJnZXQgY2xhc3MgbGlzdDogJyArIGUudGFyZ2V0LmNsYXNzTGlzdCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2cobWF0Y2gpO1xuICAgICAgICBjb25zb2xlLmxvZyhtYXRjaERpdik7XG4gICAgICAgIGNvbnNvbGUubG9nKGJldHNsaXBNYXRjaGVzKTtcbiAgICAgICAgaWYgKCF1c2VySWQgfHwgYmV0c2xpcE1hdGNoZXMuc29tZShiID0+IGIuZXZlbnRfaWQgPT0gbWF0Y2gubWF0Y2hJZCB8fCAoZSAmJiBlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3dlbGNvbWVfX2l0ZW0tY2xvc2UnKSkpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhmYXZEYXRhQnlNYXRjaCk7XG5cbiAgICAgICAgY29uc3QgZmF2RGF0YSA9IGZhdkRhdGFCeU1hdGNoW21hdGNoLm1hdGNoSWRdO1xuICAgICAgICBjb25zb2xlLmxvZygnRkFWIERBVEEgQlkgTUFUQ0gnLCBmYXZEYXRhQnlNYXRjaClcbiAgICAgICAgaWYgKCFmYXZEYXRhIHx8ICFmYXZEYXRhLm1hdGNoSWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdObyBmYXYgZGF0YSBmb3IgbWF0Y2ggaWQgJyArIG1hdGNoLm1hdGNoSWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdCgnL2V2ZW50cycsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHVzZXJpZDogdXNlcklkLFxuICAgICAgICAgICAgICAgIGV2ZW50SWQ6IG1hdGNoLm1hdGNoSWRcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXZlbnQgY3JlYXRlZDonLCByZXNwb25zZS5ldmVudCk7XG4gICAgICAgICAgICAgICAgYWRkVG9CZXRzbGlwKGZhdkRhdGEpO1xuICAgICAgICAgICAgICAgIG1hdGNoRGl2LmNsYXNzTGlzdC5hZGQoJ19kb25lJyk7XG4gICAgICAgICAgICAgICAgdXBkYXRlQ291bnRlcigxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNyZWF0ZSBldmVudDonLCByZXNwb25zZS5lcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNyZWF0aW5nIGV2ZW50OicsIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiByZW1vdmVNYXRjaEZyb21CZXRzbGlwKG1hdGNoLCBtYXRjaERpdikge1xuICAgICAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZmF2RGF0YSA9IGZhdkRhdGFCeU1hdGNoW21hdGNoLm1hdGNoSWRdO1xuICAgICAgICBpZiAoIWZhdkRhdGEgfHwgIWZhdkRhdGEubWF0Y2hJZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIGZhdiBkYXRhIGZvciBtYXRjaCBpZCAnICsgbWF0Y2gubWF0Y2hJZCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpc1JlbW92ZWQgPSByZW1vdmVGcm9tQmV0c2xpcChmYXZEYXRhKTsgLy8gRGlyZWN0bHkgYXNzaWduIHJlc3VsdFxuICAgICAgICBpZiAoaXNSZW1vdmVkKSB7XG4gICAgICAgICAgICBtYXRjaERpdi5jbGFzc0xpc3QucmVtb3ZlKCdfZG9uZScpO1xuICAgICAgICAgICAgdXBkYXRlQ291bnRlcigtMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVDb3VudGVyKGRpZmYpIHtcbiAgICAgICAgY29uc3QgY3VyckNvdW50ZXIgPSArY291bnRlclNwYW4uaW5uZXJIVE1MO1xuICAgICAgICBzZXRDb3VudGVyKGN1cnJDb3VudGVyICsgZGlmZik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0Q291bnRlcih2YWx1ZSkge1xuICAgICAgICBjb3VudGVyU3Bhbi5pbm5lckhUTUwgPSB2YWx1ZTtcblxuICAgICAgICBjb25zdCBsYXN0RGlnaXQgPSB2YWx1ZSAlIDEwO1xuICAgICAgICBsZXQgdHJhbnNsYXRpb25LZXk7XG4gICAgICAgIGlmIChsYXN0RGlnaXQgPT09IDEpIHtcbiAgICAgICAgICAgIHRyYW5zbGF0aW9uS2V5ID0gJ2V2ZW50MSc7XG4gICAgICAgIH0gZWxzZSBpZiAobGFzdERpZ2l0ID49IDIgJiYgbGFzdERpZ2l0IDw9IDQpIHtcbiAgICAgICAgICAgIHRyYW5zbGF0aW9uS2V5ID0gJ2V2ZW50Mic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cmFuc2xhdGlvbktleSA9ICdldmVudDMnO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXZlbnRUcmFuc2xhdGlvbiA9IHRyYW5zbGF0ZUtleSh0cmFuc2xhdGlvbktleSk7XG4gICAgICAgIGV2ZW50c1NwYW4uaW5uZXJIVE1MID0gZXZlbnRUcmFuc2xhdGlvbjtcblxuICAgICAgICBpZiAodmFsdWUgPiAwKSB7XG4gICAgICAgICAgICB3ZWxjb21lQmV0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdlbGNvbWVCZXQuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0TWF0Y2hEYXRhKG1hdGNoLCBzZXJ2aWNlSWQ9MCkge1xuICAgICAgICBpZiAoc2VydmljZUlkID4gMSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ05vIGRhdGEgZm9yIDAgYW5kIDEgc2VydmljZSBpZHMnKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZldGNoKCcvc2VydmljZS9saW5lb3V0L2Zyb250ZW5kX2FwaTIvJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgXCJqc29ucnBjXCI6IFwiMi4wXCIsXG4gICAgICAgICAgICAgICAgXCJpZFwiOiAxNixcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiBcImZyb250ZW5kL21hcmtldC9nZXRcIixcbiAgICAgICAgICAgICAgICBcInBhcmFtc1wiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiYnlcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJsYW5nXCI6ICd1aycsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlcnZpY2VfaWRcIjogc2VydmljZUlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJldmVudF9pZFwiOiBtYXRjaC5tYXRjaElkXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihmYXZEYXRhID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2VmRGF0YSA9IGZhdkRhdGEucmVzdWx0LmZpbmQobyA9PiBvLm1hcmtldF9uYW1lID09PSBtYXRjaC5tYXJrZXROYW1lICYmIG8ucmVzdWx0X3R5cGVfbmFtZSA9PT0gbWF0Y2gubWFya2V0VHlwZSk7XG4gICAgICAgICAgICAgICAgaWYgKGNvZWZEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG91dGNvbWUgPSBjb2VmRGF0YS5vdXRjb21lcy5maW5kKG8gPT4gby5vdXRjb21lX25hbWUgPT0gbWF0Y2gub3V0Y29tZU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW91dGNvbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRNYXRjaERhdGEobWF0Y2gsIHNlcnZpY2VJZCArIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRjb21lSWQ6IG91dGNvbWUub3V0Y29tZV9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGNvbWVDb2VmOiBvdXRjb21lLm91dGNvbWVfY29lZixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmtldElkOiBjb2VmRGF0YS5tYXJrZXRfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlSWQ6IHNlcnZpY2VJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoSWQ6IG1hdGNoLm1hdGNoSWQsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldE1hdGNoRGF0YShtYXRjaCwgc2VydmljZUlkICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKG0gPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG0pXG4gICAgICAgICAgICAgICAgZmF2RGF0YUJ5TWF0Y2hbbS5tYXRjaElkXSA9IG07XG4gICAgICAgICAgICAgICAgcmV0dXJuIG07XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXREYXRlKGRhdGUpIHtcbiAgICAgICAgaWYgKCFkYXRlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZCA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICBjb25zdCBkYXkgPSBTdHJpbmcoZC5nZXREYXRlKCkpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gU3RyaW5nKGQuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsICcwJyk7XG4gICAgICAgIHJldHVybiBgJHtkYXl9LiR7bW9udGh9YDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRUb0JldHNsaXAobWF0Y2gpIHtcbiAgICAgICAgaWYgKCF3aW5kb3cuYWRkQmV0c2xpcE91dGNvbWVzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTm8gYWRkQmV0c2xpcE91dGNvbWVzIG1ldGhvZCBpcyBkZWZpbmVkJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3V0Y29tZSA9IHtcbiAgICAgICAgICAgICdzZXJ2aWNlSWQnOiBtYXRjaC5zZXJ2aWNlSWQsXG4gICAgICAgICAgICAnZXZlbnRJZCc6IG1hdGNoLm1hdGNoSWQsXG4gICAgICAgICAgICAnbWFya2V0SWQnOiBtYXRjaC5tYXJrZXRJZCxcbiAgICAgICAgICAgICdvdXRjb21lSWQnOiBtYXRjaC5vdXRjb21lSWRcbiAgICAgICAgfTtcbiAgICAgICAgd2luZG93LmFkZEJldHNsaXBPdXRjb21lcyhbb3V0Y29tZV0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUZyb21CZXRzbGlwKG1hdGNoKSB7XG4gICAgICAgIGlmICghd2luZG93LnJlbW92ZUJldHNsaXBJdGVtcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cc0LXRgtC+0LQgcmVtb3ZlQmV0c2xpcEl0ZW1zINC90LUg0LfQvdCw0LnQtNC10L3QvicpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyDQl9C90LDRh9C10L3QvdGPINC30LAg0LfQsNC80L7QstGH0YPQstCw0L3QvdGP0LxcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG91dGNvbWVJZCA9IG1hdGNoLm91dGNvbWVJZDsgLy8g0J7RgtGA0LjQvNGD0ZTQvNC+INGC0ZbQu9GM0LrQuCBpZFxuXG4gICAgICAgIC8vINCS0LjQutC70LjQutCw0ZTQvNC+INC90L7QstC40Lkg0LzQtdGC0L7QtCDQtyDQvNCw0YHQuNCy0L7QvCDQsNC50LTRllxuICAgICAgICBjb25zdCByZXN1bHQgPSB3aW5kb3cucmVtb3ZlQmV0c2xpcEl0ZW1zKFtvdXRjb21lSWRdKTtcblxuICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIHJlc3VsdFxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IGNvbnNvbGUubG9nKGDQo9GB0L/RltGI0L3QviDQstC40LTQsNC70LXQvdC+IG91dGNvbWVJZCAke291dGNvbWVJZH1gKSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoYNCf0L7QvNC40LvQutCwINC/0YDQuCDQstC40LTQsNC70LXQvdC90ZYgb3V0Y29tZUlkICR7b3V0Y29tZUlkfTpgLCBlcnIpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGDQnNC10YLQvtC0INC/0L7QstC10YDQvdGD0LIgJHtyZXN1bHR9INC00LvRjyBvdXRjb21lSWQgJHtvdXRjb21lSWR9YCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEJldHNsaXBJdGVtcygpIHtcbiAgICAgICAgaWYgKCF3aW5kb3cuZ2V0QmV0c2xpcEl0ZW1zKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTm8gZ2V0QmV0c2xpcEl0ZW1zIG1ldGhvZCBpcyBkZWZpbmVkJyk7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3aW5kb3cuZ2V0QmV0c2xpcEl0ZW1zKClcbiAgICAgICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0JldHNsaXAgaXRlbXM6JywgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgaW4gZ2V0QmV0c2xpcEl0ZW1zOicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0KCkge1xuICAgICAgICBJbml0UGFnZSgpO1xuICAgICAgICBpZiAod2luZG93LnN0b3JlKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSB3aW5kb3cuc3RvcmUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICAgIHVzZXJJZCA9IHN0YXRlLmF1dGguaXNBdXRob3JpemVkICYmIHN0YXRlLmF1dGguaWQgfHwgJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgYyA9IDA7XG4gICAgICAgICAgICB2YXIgaSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYyA8IDUwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghIXdpbmRvdy5nX3VzZXJfaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IHdpbmRvdy5nX3VzZXJfaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja1VzZXJBdXRoKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hlY2tVc2VyQXV0aCgpO1xuICAgIH1cblxuICAgIGxldCBjaGVja1VzZXJBdXRoID0gKCkgPT4ge1xuICAgICAgICBpZiAodXNlcklkKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHVuYXV0aE1lcyBvZiB1bmF1dGhNc2dzKSB7XG4gICAgICAgICAgICAgICAgdW5hdXRoTWVzLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaFdyYXAuY2xhc3NMaXN0LnJlbW92ZShcImhpZGVcIilcbiAgICAgICAgICAgIGNvbnN0IGFkZEFsbEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcmVkaWN0QnRuJyk7XG4gICAgICAgICAgICBhZGRBbGxCdG4uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlbGNvbWVfX3JvdycpO1xuICAgICAgICAgICAgLy8gY29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3aXRjaFdyYXAuY2xhc3NMaXN0LmFkZChcImhpZGVcIilcbiAgICAgICAgICAgIGZvciAobGV0IHBhcnRpY2lwYXRlQnRuIG9mIHBhcnRpY2lwYXRlQnRucykge1xuICAgICAgICAgICAgICAgIHBhcnRpY2lwYXRlQnRuLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgdW5hdXRoTWVzIG9mIHVuYXV0aE1zZ3MpIHtcbiAgICAgICAgICAgICAgICB1bmF1dGhNZXMuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbG9hZFRyYW5zbGF0aW9ucygpXG4gICAgICAgIC50aGVuKGluaXQpO1xuXG4gICAgbGV0IG1haW5QYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZhdl9fcGFnZScpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gbWFpblBhZ2UuY2xhc3NMaXN0LmFkZCgnb3ZlcmZsb3cnKSwgMTAwMCk7XG5cbiAgICBmdW5jdGlvbiBpbml0U2xpZGVyKCkge1xuICAgICAgICBsZXQgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICBsZXQgc3RhcnRYO1xuICAgICAgICBsZXQgc2Nyb2xsTGVmdDtcblxuICAgICAgICBjb25zdCBkcmFnZ2FibGVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJhZ2dhYmxlQ29udGFpbmVyJyk7XG4gICAgICAgIGNvbnN0IGl0ZW1zV3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy53ZWxjb21lX19yb3ctd3JhcCcpXG4gICAgICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWxjb21lX19yb3cnKVxuICAgICAgICBjb25zdCBpdGVtc1dyYXBMZW5ndGggPSBpdGVtc1dyYXAubGVuZ3RoO1xuXG4gICAgICAgIHN3aXRjaCAoaXRlbXNXcmFwTGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgcm93LnN0eWxlLm1heFdpZHRoID0gJzIwOThweCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgcm93LnN0eWxlLm1heFdpZHRoID0gJzE2NjhweCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgcm93LnN0eWxlLm1heFdpZHRoID0gJzEyNThweCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcm93LnN0eWxlLm1heFdpZHRoID0gJzgyOHB4JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByb3cuc3R5bGUubWF4V2lkdGggPSAnNDE4cHgnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByb3cuc3R5bGUubWF4V2lkdGggPSAnMjA5OHB4JztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGRyYWdnYWJsZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZSkgPT4ge1xuICAgICAgICAgICAgaXNEcmFnZ2luZyA9IHRydWU7XG4gICAgICAgICAgICBzdGFydFggPSBlLnBhZ2VYIC0gZHJhZ2dhYmxlQ29udGFpbmVyLm9mZnNldExlZnQ7XG4gICAgICAgICAgICBzY3JvbGxMZWZ0ID0gZHJhZ2dhYmxlQ29udGFpbmVyLnNjcm9sbExlZnQ7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgZHJhZ2dhYmxlQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAgICAgICBpc0RyYWdnaW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRyYWdnYWJsZUNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKCkgPT4ge1xuICAgICAgICAgICAgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICBkcmFnZ2FibGVDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmICghaXNEcmFnZ2luZykgcmV0dXJuO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgeCA9IGUucGFnZVggLSBkcmFnZ2FibGVDb250YWluZXIub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIGNvbnN0IHdhbGsgPSAoeCAtIHN0YXJ0WCkgKiAyOyAvLyDQo9Cy0LXQu9C40YfRjNGC0LUg0LzQvdC+0LbQuNGC0LXQu9GMLCDRh9GC0L7QsdGLINC40LfQvNC10L3QuNGC0Ywg0YHQutC+0YDQvtGB0YLRjCDQv9GA0L7QutGA0YPRgtC60LhcbiAgICAgICAgICAgIGRyYWdnYWJsZUNvbnRhaW5lci5zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdCAtIHdhbGs7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQuY2xvc2VzdCgnLndlbGNvbWVfX2l0ZW0nKTtcbiAgICAgICAgaWYgKHRhcmdldCAmJiAhdXNlcklkKSB7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvbG9naW4nO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyB0ZXN0XG4gICAgY29uc3Qgc3dpdGNoQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53ZWxjb21lX19zd2l0Y2gtYnRuXCIpXG5cbiAgICBzd2l0Y2hCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHN3aXRjaEJ0bi5jbGFzc0xpc3QudG9nZ2xlKFwiYWN0aXZlXCIpXG4gICAgfSlcblxuICAgIC8vIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGFyay1idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+e1xuICAgIC8vICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoXCJkYXJrXCIpXG4gICAgLy8gfSlcbiAgICAvL1xuICAgIC8vIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG5nLWJ0blwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIC8vICAgICBsb2NhbGUgPSBsb2NhbGUgPT09ICd1aycgPyAnZW4nIDogJ3VrJztcbiAgICAvLyAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShcImxvY2FsZVwiLCBsb2NhbGUpO1xuICAgIC8vICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAvLyB9KTtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYXV0aC1idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgdXNlcklkID0gdXNlcklkID09PSAxMDMwMzE1OTcgPyAwIDogMTAzMDMxNTk3O1xuICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFwidXNlcklkXCIsIHVzZXJJZCk7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuXG4gICAgfSk7XG5cbiAgICAvLyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJldC1idG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAvLyAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53ZWxjb21lX19iZXRcIikuY2xhc3NMaXN0LnRvZ2dsZShcImhpZGVcIilcbiAgICAvLyB9KTtcblxuXG5cblxuXG5cblxuXG5cblxuXG59KSgpO1xuIiwiIl19
