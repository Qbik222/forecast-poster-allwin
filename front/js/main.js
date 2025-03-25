(function () {
    const apiURL = 'https://fav-prom.com/api_forecast_poster';

    const
        unauthMsgs = document.querySelectorAll('.authBtn'),
        participateBtns = document.querySelectorAll('.predictBtn'),
        counterSpan = document.querySelector('.counter'),
        eventsSpan = document.querySelector('.events'),
        welcomeBet = document.querySelector('.welcome__bet');

    const ukLeng = document.querySelector('#ukLeng');
    const enLeng = document.querySelector('#enLeng');

    let locale = sessionStorage.getItem("locale") ?? 'uk';

    if (ukLeng) locale = 'uk';
    if (enLeng) locale = 'en';

    let i18nData = {};
    let userId;
    let elementsByMatchiD = {};
    let allMatches = [];
    let favDataByMatch = {};
    userId = 103031597;

    function loadTranslations() {
        return fetch(`${apiURL}/new-translates/${locale}`).then(res => res.json())
            .then(json => {
                i18nData = json;
                translate();

                var mutationObserver = new MutationObserver(function (mutations) {
                    translate();
                });
                mutationObserver.observe(document.getElementById('forecastPoster'), {
                    childList: true,
                    subtree: true,
                });

            });
    }

    function translate() {
        const elems = document.querySelectorAll('[data-translate]')
        if (elems && elems.length) {
            elems.forEach(elem => {
                const key = elem.getAttribute('data-translate');
                elem.innerHTML = translateKey(key);
                elem.removeAttribute('data-translate');
            })
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

    const request = function (link, extraOptions) {
        return fetch(apiURL + link, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            ...(extraOptions || {})
        }).then(res => res.json())
    }

    function initAddAllBtn() {
        const addAllBtn = document.querySelector('.predictBtn');
        addAllBtn.addEventListener('click', () => {
            if (!userId) {
                return;
            }

            getBetslipItems().then(betslipMatches => {
                for (const match of allMatches) {
                    const matchDiv = elementsByMatchiD[match.matchId];
                    addMatchToBetslip(match, matchDiv, betslipMatches);
                }
            }).catch(err => console.error('Error getting betslip items:', err));
        });
    }

    const InitPage = () => {
        translate();
        initAddAllBtn();
        request('/matches').then(matches => {
            console.log(matches);
            allMatches = (matches || []).sort((a, b) => new Date(a.activeDate) - new Date(b.activeDate));

            getBetslipItems().then(betslipMatches => {
                initMatches(allMatches, betslipMatches);
                initSlider();
            }).catch(err => console.error('Error getting betslip items:', err));
        });
    }

    function initMatches(matches, betslipMatches) {
        const container = document.querySelector('.welcome__row');
        container.innerHTML = '';

        let added = 0;
        for (let i = 0; i < matches.length; i += 2) {
            const rowWrap = document.createElement('div');
            rowWrap.className = 'welcome__row-wrap';

            for (let j = i; j < i + 2 && j < matches.length; j++) {
                const match = matches[j];
                const matchDiv = document.createElement('div');
                matchDiv.className = 'welcome__item';
                match.matchId = (+match.matchId);
                if (betslipMatches.some(b => b.event_id == match.matchId)) {
                    added++;
                    matchDiv.classList.add('_done');
                }

                matchDiv.innerHTML = `
                <div class="welcome__item-close"></div>
                <div class="welcome__item-row">
                    <div class="welcome__item-title">
                        <img src="https://fav-prom.com/html/forecast-poster/img/welcome/fav.svg" alt="FAVBET">
                        <span>${translateKey(match.title)}</span>
                    </div>
                    <div class="welcome__item-date">${formatDate(match.matchDate)}</div>
                </div>
                <div class="welcome__item-max-title">${translateKey(match.team1)} – ${translateKey(match.team2)}</div>
                <div class="welcome__item-info">
                    <div class="welcome__item-bid">${translateKey(match.outcomeTranslation)}</div>
                    <div class="welcome__item-cof">${match.defaultCoef || 0}</div>
                </div>
            `;

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

                matchDiv.addEventListener('click', (e) => addMatchToBetslip(match, matchDiv, betslipMatches, e));
                const closeBtn = matchDiv.querySelector('.welcome__item-close');
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeMatchFromBetslip(match, matchDiv);
                });
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
        if (!userId || betslipMatches.some(b => b.event_id == match.matchId || (e && e.target.classList.contains('welcome__item-close')))) {
            return;
        }

        console.log(favDataByMatch);

        const favData = favDataByMatch[match.matchId];
        console.log('FAV DATA BY MATCH', favDataByMatch)
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
        }).then(response => {
            if (response.success) {
                console.log('Event created:', response.event);
                addToBetslip(favData);
                matchDiv.classList.add('_done');
                updateCounter(1);
            } else {
                console.error('Failed to create event:', response.error);
            }
        }).catch(error => {
            console.error('Error creating event:', error);
        });
    }


    function removeMatchFromBetslip(match, matchDiv) {
        if (!userId) {
            return;
        }

        const favData = favDataByMatch[match.matchId];
        if (!favData || !favData.matchId) {
            console.log('No fav data for match id ' + match.matchId);
            return;
        }

        const isRemoved = removeFromBetslip(favData); // Directly assign result
        if (isRemoved) {
            matchDiv.classList.remove('_done');
            updateCounter(-1);
        }
    }

    function updateCounter(diff) {
        const currCounter = +counterSpan.innerHTML;
        setCounter(currCounter + diff);
    }

    function setCounter(value) {
        counterSpan.innerHTML = value;

        const lastDigit = value % 10;
        let translationKey;
        if (lastDigit === 1) {
            translationKey = 'event1';
        } else if (lastDigit >= 2 && lastDigit <= 4) {
            translationKey = 'event2';
        } else {
            translationKey = 'event3';
        }

        const eventTranslation = translateKey(translationKey);
        eventsSpan.innerHTML = eventTranslation;

        if (value > 0) {
            welcomeBet.classList.remove('hide');
        } else {
            welcomeBet.classList.add('hide');
        }
    }

    function getMatchData(match, serviceId=0) {
        if (serviceId > 1) {
            console.log('No data for 0 and 1 service ids')
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
        })
            .then(res => res.json())
            .then(favData => {
                const coefData = favData.result.find(o => o.market_name === match.marketName && o.result_type_name === match.marketType);
                if (coefData) {
                    const outcome = coefData.outcomes.find(o => o.outcome_name == match.outcomeName);
                    if (!outcome) {
                        return getMatchData(match, serviceId + 1);
                    }
                    return {
                        outcomeId: outcome.outcome_id,
                        outcomeCoef: outcome.outcome_coef,
                        marketId: coefData.market_id,
                        serviceId: serviceId,
                        matchId: match.matchId,
                    };
                } else {
                    return getMatchData(match, serviceId + 1);
                }
            })
            .then(m => {
                console.log(m)
                favDataByMatch[m.matchId] = m;
                return m;
            })
            .catch(error => {
                console.log(error);
            });
    }

    function formatDate(date) {
        if (!date) {
            return;
        }
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${day}.${month}`;
    }

    function addToBetslip(match) {
        if (!window.addBetslipOutcomes) {
            console.log('No addBetslipOutcomes method is defined');
            return;
        }
        const outcome = {
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

        const outcomeId = match.outcomeId; // Отримуємо тільки id

        // Викликаємо новий метод з масивом айді
        const result = window.removeBetslipItems([outcomeId]);

        if (result && result instanceof Promise) {
            result
                .then(() => console.log(`Успішно видалено outcomeId ${outcomeId}`))
                .catch(err => console.error(`Помилка при видаленні outcomeId ${outcomeId}:`, err));
        } else {
            console.log(`Метод повернув ${result} для outcomeId ${outcomeId}`);
        }

        return result;
    }

    function getBetslipItems() {
        if (!window.getBetslipItems) {
            console.log('No getBetslipItems method is defined');
            return Promise.resolve([]);
        }

        return window.getBetslipItems()
            .then(result => {
                console.log('Betslip items:', result);
                return result;
            })
            .catch(error => {
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
            let c = 0;
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

    let checkUserAuth = () => {
        if (userId) {
            for (const unauthMes of unauthMsgs) {
                unauthMes.classList.add('hide');
            }
            const addAllBtn = document.querySelector('.predictBtn');
            addAllBtn.classList.remove('hide');
            const container = document.querySelector('.welcome__row');
            container.classList.remove('hide');
        } else {
            for (let participateBtn of participateBtns) {
                participateBtn.classList.add('hide');
            }
            for (const unauthMes of unauthMsgs) {
                unauthMes.classList.remove('hide');
            }
        }
    }

    loadTranslations()
        .then(init);

    let mainPage = document.querySelector('.fav__page');
    setTimeout(() => mainPage.classList.add('overflow'), 1000);

    function initSlider() {
        let isDragging = false;
        let startX;
        let scrollLeft;

        const draggableContainer = document.getElementById('draggableContainer');
        const itemsWrap = document.querySelectorAll('.welcome__row-wrap')
        const row = document.querySelector('.welcome__row')
        const itemsWrapLength = itemsWrap.length;

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

        draggableContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - draggableContainer.offsetLeft;
            scrollLeft = draggableContainer.scrollLeft;

        });

        draggableContainer.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        draggableContainer.addEventListener('mouseup', () => {
            isDragging = false;
        });

        draggableContainer.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - draggableContainer.offsetLeft;
            const walk = (x - startX) * 2; // Увеличьте множитель, чтобы изменить скорость прокрутки
            draggableContainer.scrollLeft = scrollLeft - walk;
        });
    }

    // test
    const switchBtn = document.querySelector(".welcome__switch-btn")

    switchBtn.addEventListener("click", function(){
        switchBtn.classList.toggle("active")
    })

    document.querySelector(".dark-btn").addEventListener("click", () =>{
        document.body.classList.toggle("dark")
    })

    document.querySelector(".lng-btn").addEventListener("click", () => {
        locale = locale === 'uk' ? 'en' : 'uk';
        sessionStorage.setItem("locale", locale);
        window.location.reload()
    });



})();
