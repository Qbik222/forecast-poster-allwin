(function () {
    const apiURL = 'https://fav-prom.com/api_forecast_poster';

    const
        unauthMsgs = document.querySelectorAll('.authBtn'),
        participateBtns = document.querySelectorAll('.predictBtn');

    const ukLeng = document.querySelector('#ukLeng');
    const enLeng = document.querySelector('#enLeng');

    let locale = 'uk';

    if (ukLeng) locale = 'uk';
    if (enLeng) locale = 'en';

    let i18nData = {};
    let userId;
    let elementsByMatchiD = {};
    let allMatches = [];
    let favDataByMatch = {};
    // userId = 7777777;

    function loadTranslations() {
        return fetch(`${apiURL}/translates/${locale}`).then(res => res.json())
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

            const betslipMatches = JSON.parse(localStorage.getItem('betslipMatches')) || [];
            for (const match of allMatches) {
                const matchDiv = elementsByMatchiD[match.matchId];
                addMatchToBetslip(match, matchDiv, betslipMatches);
            }
        });
    }

    const InitPage = () => {
        translate();
        initAddAllBtn();
        request('/matches').then(matches => {
            allMatches = matches || [];

            // const testData = [
            //     {
            //         matchId: '1',
            //         activeDate: new Date(),
            //         doneDate: new Date(),
            //         matchDate: new Date('2024-06-01'),
            //         link: '',
            //         title: 'ЄВРОПА | ЛІГА ЧЕМПІОНІВ. ЖІНКИ',
            //         status: '',
            //         outcome: 'Перемога Баварія Мюнхен',
            //         team1: 'Рома',
            //         team2: 'Баварія Мюнхен',
            //         serviceId: 1,
            //         eventId: 1,
            //         marketId: 3.60,
            //         outcomeId: 1
            //     },
            //     {
            //         matchId: '2',
            //         activeDate: new Date(),
            //         doneDate: new Date(),
            //         matchDate: new Date('2024-06-02'),
            //         link: '',
            //         title: 'АФРИКА | КУБОК АФРИКАНСЬКИХ НАЦІЙ 2023. КОТ-Д',
            //         status: '',
            //         outcome: 'Перемога Баварія Мюнхен',
            //         team1: 'Gen.G Global Academy',
            //         team2: 'Kwangdong Freecs Challengers',
            //         serviceId: 1,
            //         eventId: 1,
            //         marketId: 3.60,
            //         outcomeId: 1
            //     }
            // ];
            const betslipMatches = JSON.parse(localStorage.getItem('betslipMatches')) || [];
            initMatches(allMatches, betslipMatches);
            initSlider();
        });
    }

    function initMatches(matches, betslipMatches) {
        const container = document.querySelector('.welcome__row');
        container.innerHTML = '';

        for (let i = 0; i < matches.length; i += 2) {
            const rowWrap = document.createElement('div');
            rowWrap.className = 'welcome__row-wrap';

            for (let j = i; j < i + 2 && j < matches.length; j++) {
                const match = matches[j];
                const matchDiv = document.createElement('div');
                matchDiv.className = 'welcome__item';
                match.matchId = (+match.matchId);
                if (betslipMatches.includes(match.matchId)) {
                    matchDiv.classList.add('_done');
                }

                matchDiv.innerHTML = `
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
                    } else {
                        console.log(`No outcome data for ${match.matchId}`);
                    }
                })

                // click listener
                matchDiv.addEventListener('click', () => addMatchToBetslip(match, matchDiv, betslipMatches));
            }
            container.appendChild(rowWrap);
        }

        return container;
    }

    function addMatchToBetslip(match, matchDiv, betslipMatches) {
        if (!userId || betslipMatches.includes(match.matchId)) {
            return;
        }

        const favData = favDataByMatch[match.matchId];
        if (!favData || !favData.matchId) {
            console.log('No fav data for match id ' + match.matchId);
            return;
        }
        addToBetslip(favData);
        matchDiv.classList.add('_done');
        betslipMatches.push(match.matchId);
        localStorage.setItem('betslipMatches', JSON.stringify(betslipMatches));
    }

    function getMatchData(match, serviceId=0) {
        if (serviceId > 1) {
            console.log('No data for 0 and 1 service ids')
            return;
        }

        return fetch('/frontend_api2/', {
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

})();
