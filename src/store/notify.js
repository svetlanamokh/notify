import loadMore from "../assets/js/loadMore.js"
import axios from 'axios'

export default {
    state: {
        messages: [],
        messagesMain: [],
        error: null,
        loading: false
    },
    mutations: {
        setMessages (state, payload) {
            state.messages = payload
        },
        setMessagesMain (state, payload) {
            state.messagesMain = payload
        },
        loadMessages (state, payload) {
            state.messagesMain = [...state.messagesMain, ...payload]
        },
        setError (state, payload) {
            state.error = payload
        },
        setLoading (state, payload) {
            state.loading = payload
        }
    },
    actions: {
        loadMessages ({commit, getters}) {
            let res = getters.getMessageFilter
            commit('loadMessages', loadMore(res))
        },
        getNotify ({commit}) {
            commit('setLoading', true)
            setTimeout ( () => {
                axios
                .get('https://tocode.ru/static/_secret/courses/1/notifyApi.php')
                    .then(response => {
                        let res = response.data.notify, 
                            messages = [],
                            messagesMain = [];

                        // filter
                        for (let i = 0; i < res.length; i++) {
                            if (res[i].main) {
                                messagesMain.push(res[i])
                            } else {
                                messages.push(res[i])
                            }
                        }
                        commit('setMessages', messages)
                        commit('setMessagesMain', messagesMain)
                    })
                    .catch(e => {
                        console.log(e)
                        commit('setError', 'Error: Network failed')
                    })
                    .finally (() => {
                        commit('setLoading', false)  
                    })  
            }, 1800)
            
        }
    },
    getters: {
        getMessage (state) {
            return state.messages
        },
        getMessageFilter (state) {
            return state.messages.filter(mes => {
                return mes.main === false
            })
        },
        getMessageMain (state) {
            return state.messagesMain
        },
        getError (state) {
            return state.error
        },
        getLoading (state) {
            return state.loading
        }
    }
}