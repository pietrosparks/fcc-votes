<template>
    <div>
        <navbar>
        </navbar>
        <div class="container">
            <div class="columns" v-if="selected_poll.name">

                <div class="column is-one-third">
                    <div class="box">
                        <div class="content">
                            <h2>{{selected_poll.name}}</h2>
                            by
                            <h4>{{selected_poll.user_name}}</h4>
                        </div>
                        <p>I'd Like to vote for...</p>
                        <hr>
                        <div v-for='option in selected_poll.options'>
                            <div class="option-button" @click="vote(option)">{{option.name}}</div>
                        </div>
                    </div>
                    <div class="share" @click="shareTwitter()">
                        <a v-bind:href="shareUrl" target="_blank"> Share on Twitter</a>
                    </div>
                    <div class="edit" @click="editPollModal = true" v-if="auth && id._id == selected_poll.user_id">
                        Edit Poll
                    </div>
                    <div class="delete_poll" @click="deletePoll()" v-if="auth && id._id == selected_poll.user_id">
                        Delete Poll
                    </div>
                </div>
                <div class="column is-two-thirds">
                    <div class="box">
                        <piechart v-if="chart_data.datasets" :chart-data="chart_data"></piechart>
                        <hr>
                        <div class="countbox" v-for="option in selected_poll.options">
                            {{option.name}} - {{option.count}}
                        </div>

                    </div>
                </div>


            </div>
            <div class='columns is-centered' v-else>
                <div class="column is-two-thirds">
                    <div class="box center">
                        <atom-spinner :size="100" :color="'#ff1d5e'" style="margin:0 auto" />
                    </div>
                </div>
            </div>
        </div>

        <!--Edit -->
        <div class="modal" :class="{'is-active':editPollModal}" v-if="selected_poll._id">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Edit {{selected_poll.name}}</p>
                    <button class="delete" aria-label="close" @click="createPollModal = false"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <div class="control">
                            <input type="text" class="input" placeholder="Name" v-model="selected_poll.name">
                        </div>
                    </div>
                    <div class="field">
                        <div class="control">
                            <input type="text" class="input adjust-inline" placeholder="Options" v-model="pollOptions.name">

                            <div class="adjust-inline">
                                <a class="button is-success" @click="addOptions()">Add</a>
                            </div>
                        </div>
                    </div>
                    <span v-if="selected_poll.options.length">
                        <span v-for="(option,index) in selected_poll.options" style="display: inline  ">
                            <div class="">
                                <span class="tag is-success is-medium">
                                    {{option.name}}
                                    <button class="delete is-small" @click="removeOption(index)"></button>
                                </span>
                            </div>

                        </span>
                    </span>


                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click="editPoll()">Save changes</button>
                    <button class="button" @click="editPollModal = false">Cancel</button>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
    import navbar from '@/components/Navbar'
    import piechart from '@/components/Chart'
    import random from 'random-id';
    import {
        AtomSpinner
    } from 'epic-spinners/dist/lib/epic-spinners.min.js'

    export default {
        name: 'Poll',
        data() {
            return {
                selected_poll: {},
                chart_data: {},
                shareUrl: '',
                id: '',
                auth: '',
                editPollModal: false,
                pollOptions: {}
            }
        },
        methods: {
            getPoll() {
                this.$axios.get(`/polls/${this.$route.params.id}`).then(resp => {
                    this.selected_poll = resp.data.data;
                    this.getChartLabels();
                    this.getChartData();
                    this.shareTwitter();


                }).catch(e => {

                })
            },
            editPoll() {
                this.$axios.put(`${this.id._id}/polls/${this.selected_poll.poll_id}`, this.selected_poll).then(resp => {
                    this.editPollModal = false;
                    this.$responseModal(resp.data.status, resp.data.message, resp.data.status)
                })
            },
            addOptions() {
                this.pollOptions.count = 0;
                this.pollOptions.id = random(7)
                this.selected_poll.options.push(this.pollOptions);
                this.pollOptions = {};
            },
            removeOption(index) {
                this.selected_poll.options.splice(index, 1)
            },
            vote(option) {
               

                if (localStorage.user) {
                    const user = JSON.parse(localStorage.user);
                    if (this.selected_poll.voters.includes(user._id) || this.selected_poll.voters.includes(localStorage
                            .ip)) {
                        return window.alert('You cant vote again for this poll')
                    } else {
                        option.count++;
                        this.selected_poll.voters.push(user._id)
                        this.selected_poll.voters.push(localStorage.ip)
                    }
                } else {
                    if (this.selected_poll.voters.includes(localStorage.ip)) {
                        return window.alert('You cant vote again for this poll')
                    } else {
                        option.count++;
                        this.selected_poll.voters.push(localStorage.ip)
                    }
                }

                this.$axios.put(`/polls/${this.selected_poll.poll_id}`, this.selected_poll).then(resp => {
                    this.chart_data = {};
                    this.getPoll()
                }).catch(e => {

                })
            },

            deletePoll() {

                this.$axios.delete(`${this.id._id}/polls/${this.selected_poll.poll_id}`).then(resp => {
                    this.$responseModal(resp.data.status, resp.data.message, resp.data.status)
                    setInterval(() => {
                        this.$router.push('/polls')
                    }, 1000)

                }).catch(e => {

                })
            },
            getChartLabels() {
                this.chart_data.labels = [];
                this.selected_poll.options.forEach(option => {
                    this.chart_data.labels.push(option.name);
                })
            },
            getChartData() {
                this.chart_data.datasets = [];
                let dataArray = []
                let colors = []
                this.selected_poll.options.forEach(option => {
                    dataArray.push(option.result)
                    colors.push(this.randomColor());
                })
                this.chart_data.datasets.push({
                    backgroundColor: colors,
                    data: dataArray
                })
            },
            randomColor() {
                const r = () => Math.floor(256 * Math.random());
                return `rgb(${r()}, ${r()}, ${r()})`;
            },
            shareTwitter() {
                const text =
                    `http://twitter.com/intent/tweet?text=Vote on the poll '+${this.selected_poll.name}+'+by+clicking+the+link+below+to+cast+a+vote+https://freecodevote.herokuapp.com/polls/${this.selected_poll.poll_id}`

                this.shareUrl = text
            }
        },
        created() {
            this.getPoll();
        },

        components: {
            navbar,
            piechart,
            AtomSpinner
        }
    }
</script>

<style scoped>
    .column {
        margin-top: 75px;
    }

    .option-button {
        padding: 5px;
        border-radius: 5px;
        background-color: teal;
        color: white;
        margin: 10px;
    }

    .share {
        padding: 5px;
        border-radius: 5px;
        background-color: #0084b4;
        color: white;
        margin: 5px;

    }

    .edit {
        padding: 5px;
        border-radius: 5px;
        background-color: grey;
        color: white;
        margin: 5px;

    }

    .delete_poll {
        padding: 5px;
        border-radius: 5px;
        background-color: red;
        color: white;
        margin: 5px;
    }

    .share a {
        color: white
    }

    .box.center {
        height: 300px;
        padding: 100px;
    }

    .countbox {
        padding: 10px;
        background-color: teal;
        display: inline;
        color: white;
        margin: 10px;
        border-radius: 5px;
    }
</style>