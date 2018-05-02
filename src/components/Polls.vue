<template>
    <div>
        <navbar></navbar>
        <div class="container">
            <div class="bg">
                <h1>Freecodevote</h1>
                <h3>Select a poll below or signup/login to create one</h3>
            </div>
            <div class="columns is-centered" v-if="polls.length">
                <div class="column is-one-third">
                    <div class="box ">
                        <div class="control" v-if="auth">
                            <a class="button is-success" @click="createPollModal=true">New Poll</a>
                            <a class="button is-primary" @click="getMyPolls()">My Polls</a>
                            <a class="button is-primary" @click="myPolls=false">All Polls</a>
                        </div>
                        <hr>
                        <span v-if="myPolls == false">
                            <div class="box" v-for="poll in polls" @click='openPoll(poll)'>
                                <div class="content">
                                    <p>{{poll.name}}</p>
                                </div>
                            </div>
                        </span>
                        <span v-else>
                            <div class="box" v-for="poll in user_polls" @click='openPoll(poll)'>
                                <div class="content">
                                    <p>{{poll.name}}</p>
                                </div>
                            </div>
                        </span>

                    </div>
                </div>
            </div>
             <div class='columns is-centered' v-else  >
                <div class="column is-two-thirds">
                    <div class="box center">
                        <atom-spinner :size="100" :color="'#ff1d5e'" style="margin:0 auto" />
                    </div>
                </div>
                </div>
        </div>

        <!--Create Poll Modal -->
        <div class="modal" :class="{'is-active':createPollModal}">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Create a Poll</p>
                    <button class="delete" aria-label="close" @click="createPollModal = false"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <div class="control">
                            <input type="text" class="input" placeholder="Name" v-model="newPoll.name">
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
                    <span v-if="newPoll.options.length">
                        <span v-for="(option,index) in newPoll.options" style="display: inline  ">
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
                    <button class="button is-success" @click="createPoll()">Save changes</button>
                    <button class="button" @click="createPollModal = false">Cancel</button>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
    import navbar from '@/components/Navbar';
    import random from 'random-id';
    import {
        AtomSpinner
    } from 'epic-spinners/dist/lib/epic-spinners.min.js'

    export default {
        name: 'Polls',
        data() {
            return {
                polls: '',
                id: '',
                createPollModal: false,
                pollOptions: {},
                newPoll: {
                    options: [],
                },
                auth: null,
                myPolls: false,
                user_polls: null
            }
        },
       
        methods: {
            addOptions() {
                this.pollOptions.count = 0;
                this.pollOptions.id = random(7)
                this.newPoll.options.push(this.pollOptions);
                this.pollOptions = {};
            },
            removeOption(index) {
                this.newPoll.options.splice(index, 1)
            },
            getAllPolls() {
                this.$axios.get('/polls').then(resp => {
                    this.polls = resp.data.data;
                    localStorage.setItem('ip', resp.data.meta)
                }).catch(e => {
                    console.log(e);
                })
            },
            getMyPolls() {
                this.$axios.get(`${this.id._id}/polls`).then(resp => {
                    console.log(resp, "hdh")
                    this.user_polls = resp.data.data
                    this.myPolls = true;
                }).catch(e => {

                })
                this.myPolls = true;
            },
            createPoll() {
                this.$axios.post(`${this.id._id}/polls`, this.newPoll).then(resp => {
                    this.newPoll = {
                        options: []
                    }
                    this.createPollModal = false;
                    this.$responseModal(resp.data.status, resp.data.message, resp.data.status)
                    this.getAllPolls()
                }).catch(e => {
                    console.log(e.response)
                })
            },
            openPoll(poll) {
                this.$router.push({
                    path: `/polls/${poll.poll_id}`
                });
            }
        },
        components: {
            navbar,
            AtomSpinner
        },
        mounted() {
            this.getAllPolls()
        }
    }
</script>

<style scoped>
    .adjust-inline {
        display: inline !important;
    }

    .container .columns {
        margin-top: 30px;
    }

    h1 {
        font-size: 36px;
        
        font-family: 'Do Hyeon'
    }
    .bg{
        background-color: #fafafa;
        padding: 35px;
    }
</style>