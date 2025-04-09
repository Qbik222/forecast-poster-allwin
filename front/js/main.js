(function () {
    const apiURL = 'https://fav-prom.com/api_forecast_poster';

    const
        unauthMsgs = document.querySelectorAll('.authBtn'),
        counterSpan = document.querySelector('.counter'),
        eventsSpan = document.querySelector('.events'),
        welcomeBet = document.querySelector('.welcome__bet'),
        switchWrap = document.querySelector(".welcome__switch"),
        switchBtn = document.querySelector(".welcome__switch-btn");

    const ukLeng = document.querySelector('#ukLeng');
    const enLeng = document.querySelector('#enLeng');

    let locale = 'uk';
    if (ukLeng) locale = 'uk';
    if (enLeng) locale = 'en';

    let i18nData = {};
    let userId;
    // userId = 7777777;
    let elementsByMatchiD = {};
    let allMatches = [];
    let favDataByMatch = {};

    const savedSwitcherState = localStorage.getItem("switcherActive");
    if (savedSwitcherState === "1") {
        switchBtn.classList.add("active");
    }

    switchBtn.addEventListener("click", () => {
        switchBtn.style.pointerEvents = "none";
        setTimeout(() => {
            switchBtn.style.pointerEvents = "";
        }, 2000);

        const isActive = switchBtn.classList.toggle("active");
        localStorage.setItem("switcherActive", isActive ? "1" : "0");

        if (!userId) return;

        getBetslipItems().then(betslipMatches => {
            if (isActive) {
                allMatches.forEach((match, index) => {
                    const matchDiv = elementsByMatchiD[match.matchId];
                    setTimeout(() => {
                        addMatchToBetslip(match, matchDiv, betslipMatches);
                    }, index * 50);
                });
            } else {
                for (const match of allMatches) {
                    const matchDiv = elementsByMatchiD[match.matchId];
                    removeMatchFromBetslip(match, matchDiv);
                }
            }
        }).catch(err => console.error('Error getting betslip items:', err));
    });

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
        const elems = document.querySelectorAll('[data-translate]');
        elems.forEach(elem => {
            const key = elem.getAttribute('data-translate');
            elem.innerHTML = translateKey(key);
            elem.removeAttribute('data-translate');
        });
        if (locale === 'en') {
            mainPage.classList.add('en');
        }
    }

    function translateKey(key, defaultValue = key) {
        return i18nData[key] || defaultValue;
    }

    const request = (link, extraOptions) =>
        fetch(apiURL + link, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            ...(extraOptions || {})
        })
            .then(res => {
                if (!res.ok) throw new Error('API error');
                return res.json();
            })
            .catch(err => {
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

    function reportError(err) {
        const reportData = {
            origin: window.location.href,
            userid: userId,
            errorText: err?.error || err?.text || err?.message || 'Unknown error',
            type: err?.name || 'UnknownError',
            stack: err?.stack || ''
        };

        fetch('https://fav-prom.com/api-cms/reports/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reportData)
        }).catch(console.warn);
    }

    window.addEventListener('error', function (e) {
        reportError(e.error || e);
        return false;
    });

    window.addEventListener('unhandledrejection', function (e) {
        reportError(e.reason || e);
    });

    function initAddAllBtn() {
        const addAllBtn = document.querySelector('.predictBtn');
        addAllBtn.addEventListener('click', () => {
            if (!userId) return;

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
            allMatches = (matches || []).sort((a, b) => new Date(a.matchDate) - new Date(b.matchDate));

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

                getMatchData(match).then(m => {
                    if (m) {
                        const cofDiv = matchDiv.querySelector('.welcome__item-cof');
                        cofDiv.innerHTML = m.outcomeCoef;
                    }
                });

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
        if (!userId || betslipMatches.some(b => b.event_id == match.matchId || (e && e.target.classList.contains('welcome__item-close')))) {
            return;
        }

        const favData = favDataByMatch[match.matchId];
        if (!favData || !favData.matchId) return;

        request('/events', {
            method: 'POST',
            body: JSON.stringify({ userid: userId, eventId: match.matchId })
        }).then(response => {
            if (response.success) {
                addToBetslip(favData);
                matchDiv.classList.add('_done');
                updateCounter(1);

                const activeCount = document.querySelectorAll('.welcome__item._done').length;
                const totalCount = document.querySelectorAll('.welcome__item').length;

                if (activeCount === totalCount && !switchBtn.classList.contains("active")) {
                    switchBtn.classList.add("active");
                    localStorage.setItem("switcherActive", "1");
                }
            }
        }).catch(console.error);
    }

    function removeMatchFromBetslip(match, matchDiv) {
        if (!userId) return;

        const favData = favDataByMatch[match.matchId];
        if (!favData || !favData.matchId) return;

        const isRemoved = removeFromBetslip(favData);
        if (isRemoved) {
            matchDiv.classList.remove('_done');
            updateCounter(-1);

            // Скидаємо світчер, якщо був активний
            if (switchBtn.classList.contains("active")) {
                switchBtn.classList.remove("active");
                localStorage.setItem("switcherActive", "0");
            }
        }
    }

    function updateCounter(diff) {
        const currCounter = +counterSpan.innerHTML;
        setCounter(currCounter + diff);
    }

    function setCounter(value) {
        counterSpan.innerHTML = value;

        const lastDigit = value % 10;
        let translationKey = (lastDigit === 1) ? 'event1' : (lastDigit >= 2 && lastDigit <= 4) ? 'event2' : 'event3';

        eventsSpan.innerHTML = translateKey(translationKey);
        welcomeBet.classList.toggle('hide', value <= 0);
    }

    function getMatchData(match, serviceId = 0) {
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
        })
            .then(res => res.json())
            .then(favData => {
                const coefDataArray = favData.result.filter(o =>
                    o.market_name === match.marketName &&
                    o.result_type_name === match.marketType
                );

                if (!coefDataArray.length) return getMatchData(match, serviceId + 1);

                let foundOutcome = null;
                let selectedCoefData = null;

                coefDataArray.some(coefData => {
                    const outcome = coefData.outcomes.find(o => o.outcome_name === match.outcomeName);
                    if (outcome) {
                        foundOutcome = outcome;
                        selectedCoefData = coefData;
                        return true;
                    }
                    return false;
                });

                if (!foundOutcome || !selectedCoefData) return getMatchData(match, serviceId + 1);

                const result = {
                    outcomeId: foundOutcome.outcome_id,
                    outcomeCoef: foundOutcome.outcome_coef,
                    marketId: selectedCoefData.market_id,
                    serviceId: serviceId,
                    matchId: match.matchId,
                };

                favDataByMatch[match.matchId] = result;
                return result;
            });
    }

    function formatDate(date) {
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
    }

    function addToBetslip(match) {
        if (!window.addBetslipOutcomes) return;

        const outcome = {
            serviceId: match.serviceId,
            eventId: match.matchId,
            marketId: match.marketId,
            outcomeId: match.outcomeId
        };
        window.addBetslipOutcomes([outcome]);
    }

    function removeFromBetslip(match) {
        if (!window.removeBetslipItems) return false;

        const outcomeId = match.outcomeId;
        const result = window.removeBetslipItems([outcomeId]);
        return result;
    }

    function getBetslipItems() {
        if (!window.getBetslipItems) return Promise.resolve([]);

        return window.getBetslipItems()
            .then(result => result)
            .catch(() => []);
    }

    function init() {
        InitPage();
        if (window.store) {
            const state = window.store.getState();
            userId = state.auth.isAuthorized && state.auth.id || '';
        } else {
            let c = 0;
            const i = setInterval(() => {
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
            unauthMsgs.forEach(el => el.classList.add('hide'));
            switchWrap.classList.remove("hide");
        } else {
            switchWrap.classList.add("hide");
            unauthMsgs.forEach(el => el.classList.remove('hide'));
        }
    }

    function initSlider() {
        let isDragging = false;
        let startX;
        let scrollLeft;

        const draggableContainer = document.getElementById('draggableContainer');
        const itemsWrap = document.querySelectorAll('.welcome__row-wrap');
        const row = document.querySelector('.welcome__row');

        const widths = {
            5: '2098px',
            4: '1668px',
            3: '1258px',
            2: '828px',
            1: '418px',
            default: '2098px'
        };

        row.style.maxWidth = widths[itemsWrap.length] || widths.default;

        draggableContainer.addEventListener('mousedown', e => {
            isDragging = true;
            startX = e.pageX - draggableContainer.offsetLeft;
            scrollLeft = draggableContainer.scrollLeft;
        });

        draggableContainer.addEventListener('mouseleave', () => isDragging = false);
        draggableContainer.addEventListener('mouseup', () => isDragging = false);
        draggableContainer.addEventListener('mousemove', e => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - draggableContainer.offsetLeft;
            const walk = (x - startX) * 2;
            draggableContainer.scrollLeft = scrollLeft - walk;
        });
    }

    document.addEventListener('click', e => {
        const target = e.target.closest('.welcome__item');
        if (target && !userId) {
            window.location.href = '/login';
        }
    });

    let mainPage = document.querySelector('.fav__page');
    setTimeout(() => mainPage.classList.add('overflow'), 1000);

    loadTranslations().then(init);
})();
