import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import CONFIG from './config';
import { root as candidatesData } from './data/candidates_data.json';
import { office_list as officeList } from './data/offices.json';
import { randomString } from './utilities';
import VotolegalFP from './vendor/loadme';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    paymentStep: 'selectValue',
    amount: 0,
    referral: '',
    token: '',
    donation: {},
    iugu: {},
    messages: [],
    donor_names: {},
    candidate: {
      pending: true,
    },
    donations: [],
    donationsLoading: true,
    donors: [],
    todayDonations: {
      total_donated: 0,
      people_donated: 0,
    },
    donationsRecent: [],
    donationsRecentCount: 0,
    donationsRecentHasMore: false,
    recentDonation: {},
    address: {},
    paymentData: {},
    paymentWatingMessage: '',
    hasMoreDonations: false,
    lastDonationMarker: '',
    donationPlatforms: [],
    donationSources: [],
    offices: officeList,
    'hasMore:reviews': false,
    'lastMarker:reviews': '',
    projects: [],

    followers: [],
    'hasMore:followers': false,
    'lastMarker:followers': '',

    reviews: [],
    device: '',
    statusPaymentRequest: {},
    paymentError: '',

    content: '',

    validation: {
      errors: {
        email: '',
        zip_code: '',
        state: '',
        city: '',
        street: '',
        district: '',
      },
    },

    candidateId: '',
    userData: {},
    receipt: {},
    deposit: {
      donations: [],
      candidate: {
        id: 0,
        avatar: '',
        popular_name: '',
      },
      meta: {
        created_at: '',
      },
    },
  },

  mutations: {
    storeToState: (state, { name, data }) => {
      state[name] = data;
    },

    appendToStateList: (state, { name, payload }) => {
      state[`hasMore:${name}`] = payload.has_more || false;

      if (payload[name].length) {
        // eslint-disable-next-line no-underscore-dangle
        state[`lastMarker:${name}`] = payload[name][payload[name].length - 1]._marker;
      }

      state[name] = state[name].concat(payload[`candidate_${name}`] || payload[name]);
    },

    SET_PAYMENT_STEP(state, { data }) {
      state.paymentStep = data.step;
    },
    SET_PAYMENT_AMOUNT(state, { data }) {
      state.amount = data.amount;
    },
    SET_TOKEN(state, { token }) {
      state.token = token;
    },
    SET_REFERRAL(state, referral) {
      state.referral = referral;
    },
    SET_DONOR_NAMES(state, { user }) {
      state.donor_names = user;
    },
    SET_DONATION(state, { donation }) {
      state.donation = donation;
    },
    SET_IUGU(state, { iugu }) {
      state.iugu = iugu;
    },
    SET_MESSAGES(state, { messages }) {
      state.messages = messages;
    },
    SET_CANDIDATE(state, payload) {
      state.candidate = payload;
    },
    SET_DONATIONS: (state, payload) => {
      state.hasMoreDonations = payload.has_more || false;
      if (payload.donations.length) { // eslint-disable-next-line
        state.lastDonationMarker = payload.donations[payload.donations.length - 1]._marker;
      }

      state.donations = state.donations.concat(payload.donations);
    },
    SET_PLATFORMS(state, platforms) {
      state.donationPlatforms = platforms.sort((a) => (['voto legal', 'votolegal'].indexOf(a.name.toLowerCase()) !== -1 ? -1 : 1));
    },
    SET_SOURCES(state, platforms) {
      const donationSources = platforms.reduce((allTypes, item) => {
        const typeName = item.type.toLowerCase();
        if (typeName in allTypes) {
          allTypes[typeName].total_donated += item.total_donated;
          allTypes[typeName].people_donated += item.people_donated;
        } else {
          allTypes[typeName] = {
            name: item.type,
            total_donated: item.total_donated,
            people_donated: item.people_donated,
          };
        }
        return allTypes;
      }, {});

      state.donationSources = Object.keys(donationSources).map((key) => donationSources[key]);
    },
    SET_DONORS(state, { res }) {
      state.donors = res.names;
    },
    SET_RECENT_DONATION: (state, payload) => {
      state.recentDonation = payload;
    },
    REPLACE_DONATIONS: (state) => {
      const { donationsRecent } = state;

      if (donationsRecent.length) {
        // eslint-disable-next-line
        state.lastDonationMarker = donationsRecent[donationsRecent.length - 1]._marker;
      }
      state.donations = donationsRecent;
      state.hasMoreDonations = state.donationsRecentHasMore;
      state.donationsRecent = [];
      state.donationsRecentCount = 0;
      state.donationsRecentHasMore = false;
    },
    SET_RECENT_DONATIONS: (state, payload) => {
      const donationToCompare = state.donationsRecent.length === 0
        ? state.donations[0]
        : state.donationsRecent[0];
      if (donationToCompare) {
        const newDonations = payload.donations;

        if (state.donations.length === 0) {
          state.donationsRecentCount = newDonations.length;
          state.donationsRecent = newDonations;
          state.donationsRecentHasMore = payload.has_more;
        } else {
          let i = 0;

          while (newDonations[i] && newDonations[i].id !== donationToCompare.id) { // eslint-disable-line
            i += 1;
          }

          if (i > 0) {
            state.donationsRecentCount += i;
            state.donationsRecent = newDonations;
            state.donationsRecentHasMore = payload.has_more;
          }
        }
      }
    },
    SET_PAYMENT_DATA(state, { paymentData }) {
      state.paymentData = paymentData;
    },
    SET_DONATIONS_TODAY(state, payload) {
      if (state.todayDonations.total_donated !== payload.total_donated_by_votolegal) {
        state.todayDonations.total_donated += payload.total_donated_by_votolegal;
      }

      if (state.todayDonations.people_donated !== payload.count_donated_by_votolegal) {
        state.todayDonations.people_donated += payload.count_donated_by_votolegal;
      }
    },
    SET_DONATIONS_SUMMARY(state, summary) {
      if (state.candidate.total_donated !== summary.total_donated_by_votolegal) {
        state.candidate.total_donated = summary.total_donated_by_votolegal;
      }

      if (state.candidate.people_donated !== summary.count_donated_by_votolegal) {
        state.candidate.people_donated = summary.count_donated_by_votolegal;
      }

      if (state.candidate.raising_goal !== summary.raising_goal) {
        state.candidate.raising_goal = summary.raising_goal;
      }
    },
  },
  actions: {
    CHANGE_PAYMENT_AMOUNT({ commit }, data) {
      commit('SET_PAYMENT_STEP', { data });
      commit('SET_PAYMENT_AMOUNT', { data });
    },
    CHANGE_PAYMENT_STEP({ commit }, data) {
      commit('SET_PAYMENT_STEP', { data });
    },
    SAVE_DONOR_NAMES({ commit }, user) {
      commit('SET_DONOR_NAMES', { user });
    },
    ADD_TOKEN({ commit }, data) {
      commit('SET_TOKEN', { token: data });
    },
    GET_TOKEN({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          url: `${CONFIG.api}/api2/device-authentication`,
          data,
        })
          .then((response) => {
            const { device_authorization_token_id } = response.data;
            commit('SET_TOKEN', { token: device_authorization_token_id });
            resolve(response);
          })
          .catch((err) => {
            console.error(err.response || err.message || err);
            reject(err.response || err.message || err);
          });
      });
    },
    SAVE_PAYMENT_DATA({ commit }, data) {
      commit('SET_PAYMENT_DATA', { paymentData: data });
    },
    GET_DONATION({ commit }, data) {
      const { amount, email, cpf = '' } = data;

      const nonce = randomString(13);
      const str = `${nonce}${Number.parseInt(cpf.replace(/[^0-9]+/g, ''), 10) * -1}/\u00A0${amount}${email.toUpperCase()}`;
      const fp = new VotolegalFP({
        excludeUserAgent: true,
        dontUseFakeFontInCanvas: true,
      });
      const hash = fp.x64hash128(str);

      return new Promise((resolve, reject) => {
        const rejectionByTimeout = setTimeout(() => {
          clearTimeout(rejectionByTimeout);
          return reject(new Error('O servidor está ocupado. Tente novamente em alguns minutos.'));
        }, 1000 * 60);
        axios({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          url: `${CONFIG.api}/api2/donations`,
          data: { ...data, nc: nonce, sv: hash },
        }).then(
          (response) => {
            const { donation, ui } = response.data;
            commit('SET_DONATION', { donation });
            commit('SET_IUGU', { iugu: ui.messages[1] });
            commit('SET_MESSAGES', { messages: response.data.ui.messages });
            resolve(response.data);
          },
          (err) => {
            console.error(err.response || err.message || err);
            reject(err.response || err.message || err);
          },
        );
      });
    },
    START_DONATION({ commit, state }, payload) {
      const messages = [
        'Validando seu cartão.',
        'Processando pagamento.',
        'Quase lá. Aguarde mais um pouco, por favor.',
      ];

      let i = 1;

      const showMessage = setInterval(() => {
        if (messages[i]) {
          state.paymentWatingMessage = messages[i];
        } else {
          clearTimeout(showMessage);
        }
        i += 1;
      }, 1000 * 5);

      [state.paymentWatingMessage] = messages;
      state.donationsLoading = true;

      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          url: `${CONFIG.api}/api2/donations/${state.donation.id}?device_authorization_token_id=${state.token}&credit_card_token=${payload.id}&cc_hash=${payload.cc_hash}`,
        }).then(
          (response) => {
            const data = {
              step: 'finalMessage',
            };

            commit('SET_MESSAGES', { messages: response.data.ui.messages });
            commit('SET_PAYMENT_STEP', { data });

            resolve(response);
          },
          (err) => {
            console.error(err.response || err.message || err);
            reject(err.response || err.message || err);
          },
        ).then(() => {
          clearTimeout(showMessage);
          state.paymentWatingMessage = '';
          state.donationsLoading = true;
        });
      });
    },
    GET_CANDIDATE_INFO({ commit }, id) {
      return new Promise((resolve, reject) => axios.get(`${CONFIG.api}/public-api/candidate-summary/${id}`)
        .then((response) => {
          const { candidate, platforms } = response.data;

          if (candidate) {
            commit('SET_CANDIDATE', candidate);
          } else {
            throw new Error('candidate data missing');
          }
          if (platforms) {
            commit('SET_SOURCES', platforms);
          }
          resolve(response.data);
        })
        .catch((err) => {
          commit('SET_CANDIDATE', null);
          reject(err.response || err.message || err);
        }));
    },
    GET_DONATIONS({ commit, state }, id) {
      state.donationsLoading = true;

      return new Promise((resolve, reject) => {
        axios.get(`${CONFIG.api}/public-api/candidate-donations/${id}/${state.lastDonationMarker}`)
          .then((response) => {
            commit('SET_DONATIONS', response.data);
            if (response.data.platforms) {
              commit('SET_PLATFORMS', response.data.platforms);
            }
            state.donationsLoading = false;
            resolve(response.data.donations);
          },
          (err) => {
            reject(err.response || err.message || err);
            console.error(err);
          });
      });
    },
    GetDonorsNames({ commit }, id) {
      return new Promise((resolve, reject) => {
        axios.get(`${CONFIG.api}/public-api/candidate-donations/${id}/donators-name`).then(
          (response) => {
            commit('SET_DONORS', { res: response.data });
            resolve(response.data);
          },
          (err) => {
            reject(err.response || err.message || err);
            console.error(err);
          },
        );
      });
    },
    REFRESH_DONATIONS({ commit }) {
      commit('REPLACE_DONATIONS');
    },
    UPDATE_DONATIONS({
      commit,
    }, id) {
      setInterval(() => new Promise((resolve) => {
        axios.get(`${CONFIG.api}/public-api/candidate-donations/${id}`)
          .then((response) => {
            resolve(response.data.donations);
            commit('SET_RECENT_DONATIONS', response.data);
          });
      }), 1000 * 10);
    },
    UPDATE_DONATIONS_SUMMARY({
      commit,
    }, id) {
      setInterval(() => new Promise((resolve, reject) => {
        axios.get(`${CONFIG.api}/public-api/candidate-donations-summary/${id}`).then(
          (response) => {
            commit('SET_DONATIONS_SUMMARY', response.data.candidate);
            commit('SET_DONATIONS_TODAY', response.data.today);
            if (response.data.recent_donation) {
              commit('SET_RECENT_DONATION', response.data.recent_donation);
            }
            if (response.data.platforms) {
              commit('SET_SOURCES', response.data.platforms);
            }
            resolve();
          },
          (err) => {
            reject(err.response || err.message || err);
            console.error(err);
          },
        );
      }), 1000 * 60);
    },
    GET_ADDRESS: (_, cep) => new Promise((resolve, reject) => {
      axios
        .get(`https://api2020vl.appcivico.com/api/cep?cep=${cep}`)
        .then((response) => {
          // commit('SET_ADDRESS', response.data);
          resolve(response.data);
        })
        .catch((erro) => {
          reject(erro);
        });
    }),
    START_DONATION_BOLETO({ commit }, payload) {
      let token = '';
      if (window.localStorage) {
        token = localStorage.getItem(CONFIG.tokenName);
      }

      return new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          url: `${CONFIG.api}/api2/donations/${payload.donationId}?device_authorization_token_id=${token}`,
        }).then((response) => {
          const data = {
            step: 'printBoleto',
          };
          const { donation, ui } = response.data;
          commit('SET_DONATION', { donation });
          commit('SET_MESSAGES', {
            messages: ui,
          });
          commit('SET_PAYMENT_STEP', {
            data,
          });
          resolve(response);
        }, (error) => {
          commit('SET_MESSAGES', {
            messages: {
              messages: [{
                text: error.response.data[0].message,
              }],
            },
          });

          console.error(error.response);
          reject(error.response);
        });
      });
    },

    submitCandidateTestimony({ commit }, data) {
      return new Promise((resolve, reject) => {
        const keys = {
          candidate_id: 'candidate_id',
          testimony: 'content',
          device_authorization_token_id: 'device_authorization_token_id',
          birthdate: 'birthdate',
          email: 'email',
          name: 'first_name',
          surname: 'family_name',
          phone: 'mobile_phone',
        };

        const translatedAndCleanData = Object.keys(data).reduce((acc, cur) => {
          if (keys[cur]) {
            acc[keys[cur]] = data[cur];
          }
          return acc;
        }, {});

        axios({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          url: `${CONFIG.api}/api2/candidate-review`,
          data: translatedAndCleanData,
        }).then(
          (response) => {
            if (response.data && response.data.ui && response.data.ui.messages) {
              commit('SET_MESSAGES', { messages: response.data.ui.messages });
            }

            resolve();
          },
          (err) => {
            console.error(err.response);
            reject(err.response);
          },
        );
      });
    },

    requestToFollowCandidate({ commit }, data) {
      return new Promise((resolve, reject) => {
        const keys = {
          candidate_id: 'candidate_id',
          device_authorization_token_id: 'device_authorization_token_id',
          address_district: 'address_district',
          address_house_number: 'address_house_number',
          address_state: 'address_state',
          address_street: 'address_street',
          address_zipcode: 'address_zipcode',
          address_city: 'address_city',
          birthdate: 'birthdate',
          email: 'email',
          name: 'first_name',
          surname: 'family_name',
          phone: 'mobile_phone',
        };

        const translatedAndCleanData = Object.keys(data).reduce((acc, cur) => {
          if (keys[cur]) {
            acc[keys[cur]] = data[cur];
          }
          return acc;
        }, {});

        axios({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          url: `${CONFIG.api}/api2/candidate-followers`,
          data: translatedAndCleanData,
        })
          .then(
            (response) => {
              if (response.data && response.data.ui && response.data.ui.messages) {
                commit('SET_MESSAGES', { messages: response.data.ui.messages });
              }
              resolve();
            },
          )
          .catch((err) => {
            console.error(err.response);
            reject(err.response);
          });
      });
    },

    requestToUnfollowCandidate({ commit }, data) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          url: `${CONFIG.api}/api2/candidate-followers/unfollow`,
          data,
        }).then((response) => {
          if (response.data && response.data.ui && response.data.ui.messages) {
            commit('SET_MESSAGES', { messages: response.data.ui.messages });
          }

          resolve();
        },
        (err) => {
          console.error(err.response);
          reject(err.response);
        });
      });
    },

  },
  getters: {
    candidateWithProjectAndDonations: ({ candidate, donations, projects }) => {
      const candidateData = { ...candidatesData[candidate?.username] };
      const { overrides = {} } = candidateData;

      delete candidateData.overrides;

      return !candidate || candidate.pending
        ? {
          candidate,
        }
        : {
          candidate: {
            ...candidateData,
            ...candidate,
            ...overrides,
          },
          projects,
          donations,
        };
    },

    campaignStateWithGender: ({ candidate }) => {
      let candidateState = candidate.campaign_donation_type === 'campaign'
        ? 'Candidat'
        : 'Pré-candidat';

      switch (candidate.gender) {
        case 'female':
          candidateState += 'a';
          break;

        case 'male':
          candidateState += 'o';

          break;

        default:
          candidateState += 'o(a)';
          break;
      }

      return candidateState;
    },

    campaign: ({ candidate }) => (candidate.campaign_donation_type === 'campaign' ? 'Candidatura' : 'Pré-candidatura'),

    candidatePreposition: ({ candidate }) => {
      switch (candidate.gender) {
        case 'female':
          return 'da';

        case 'male':
          return 'do';

        default:
          return 'do(a)';
      }
    },

    partyAndName: ({ candidate }) => (candidate.party?.name?.toLowerCase().indexOf('partido') === -1
      ? `Partido ${candidate.party?.name}` : candidate.party?.name),

    runningFor: ({ candidate, offices }) => {
      // eslint-disable-next-line max-len
      const office = offices.find((x) => [candidate.office_id, candidate.office?.id].indexOf(x.id) > -1);
      return !candidate.gender
        ? office?.name
        : office?.byGender[candidate.gender] || office?.name;
    },

    goals: ({ candidate }) => candidate?.multiple_goals || [],

    candidateVideoId: (({ candidate }) => {
      const { video_url: videoUrl = '' } = candidate;

      const youtubeMatch = videoUrl.match(
        /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/,
      );
      if (youtubeMatch && youtubeMatch[1].length === 11) {
        return youtubeMatch[1];
      }
      return '';
    }),

    donationSources: ({ donationSources }) => {
      let opacity = 0;
      return donationSources.map((x) => {
        const y = x;
        y.opacity = opacity;
        opacity += 0.25;
        return y;
      });
    },

    totalAmount: ({ candidate }, { donationSources }) => (donationSources.length
      ? donationSources.reduce(
        (accumulator, currentValue) => accumulator + currentValue.total_donated,
        0,
      )
      : candidate.total_donated || 0),

    expected: ({ candidate }, { goals, totalAmount }) => {
      const { raising_goal: raisingGoal } = candidate;

      return (goals.find((x) => x.goal > totalAmount) || goals[goals.length - 1])?.goal
        || raisingGoal
        || 0;
    },

    goalsWithDescription: (_state, { goals }) => goals.filter((x) => !!x.description),

    currentAndPastGoals: (_state, { expected, goalsWithDescription }) => goalsWithDescription.filter((x) => x.goal <= expected).sort((a, b) => b.goal - a.goal),
  },
});
