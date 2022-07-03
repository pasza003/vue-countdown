<template>
    <v-row class="text-center mx-5 my-6">
        <v-col cols="12">
            <v-container>
                <v-row class="text-center">
                    <v-col cols="12">
                        <ValidationObserver
                            ref="observer"
                            v-slot="{ invalid, pristine }"
                        >
                            <form @submit.prevent="addCountdown">
                                <v-row
                                    justify="center"
                                    align="center"
                                >
                                    <v-col
                                        align-self="center"
                                        cols="5"
                                    >
                                        <ValidationProvider
                                            name="Name"
                                            rules="required"
                                        >
                                            <v-text-field
                                                v-model="item.title"
                                                label="Name"
                                                autocomplete="false"
                                                dense
                                                outlined
                                            />
                                        </ValidationProvider>
                                    </v-col>
                                    <v-col
                                        align-self="start"
                                        cols="3"
                                    >
                                        <ValidationProvider
                                            name="Date"
                                            rules="required"
                                        >
                                            <v-datetime-picker
                                                label="Datetime"
                                                v-model="item.date"
                                                :text-field-props="textFieldProps"
                                                :date-picker-props="dateProps"
                                                :time-picker-props="timeProps"
                                            >
                                                <template slot="dateIcon">
                                                    <v-icon>mdi-calendar</v-icon>
                                                </template>
                                                <template slot="timeIcon">
                                                    <v-icon>mdi-clock-outline</v-icon>
                                                </template>
                                            </v-datetime-picker>
                                        </ValidationProvider>
                                    </v-col>
                                    <v-col
                                        align-self="start"
                                        cols="1"
                                    >
                                        <v-btn
                                            type="submit"
                                            :disabled="invalid || pristine"
                                            color="primary"
                                        >
                                            {{ edit ? 'Edit' : 'Create'}}
                                        </v-btn>
                                    </v-col>
                                    <v-col
                                        align-self="start"
                                        cols="1"
                                    >
                                        <v-btn
                                            color="#ff0000"
                                            @click="clearBtnMethod"
                                        >
                                            Clear
                                        </v-btn>
                                    </v-col>
                                    <v-spacer />
                                </v-row>
                            </form>
                        </ValidationObserver>
                    </v-col>
                </v-row>
            </v-container>

            <p v-if="!countdown_items.length">
                Countdown List is empty.
            </p>

            <div
                v-bind:key="`${countdown_item.id}-${countdown_item.id}`"
                v-for="countdown_item in countdown_items"
                class="mb-5"
            >
                <v-card
                    elevation="2"
                    outlined
                >
                    <v-card-text>
                        <v-row>
                            <v-col
                                align-self="center"
                                cols="6"
                                class="white--text"
                            >
                                <h1>{{ countdown_item.title }}</h1>
                                <h3 class="mt-4" style="color: red;">
                                    {{
                                        countdown_item.date.endsWith('00:00:00')
                                            ? countdown_item.date.substring(0, 10)
                                            : countdown_item.date
                                    }}
                                </h3>
                            </v-col>
                            <v-spacer />
                            <v-col
                                align-self="center"
                                cols="4"
                            >
                                <h1 v-if="new Date(countdown_item.date).getTime() < new Date().getTime()">
                                    Time expired
                                </h1>
                                <flip-countdown
                                    v-else
                                    :deadline="countdown_item.date.toString()"
                                    countdown-size="xl"
                                    label-size="xl"
                                />
                            </v-col>
                            <v-col
                                align-self="center"
                                cols="2"
                            >
                                <v-btn
                                    color="lighten-2"
                                    text
                                    @click="editCountdownItem(countdown_item.id)"
                                >
                                    Edit
                                </v-btn>
                                <v-btn
                                    color="lighten-2"
                                    text
                                    @click="deleteCountdownItem(countdown_item.id)"
                                >
                                    Remove
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </div>
        </v-col>
    </v-row>
</template>

<script>
import countdownDataJSON from '../assets/data.json';
import flipCountdown from 'vue2-flip-countdown';
import dateFormat from 'dateformat';
import { v4 } from 'uuid';

export default {
    name: 'Countdown',
    components: {
        flipCountdown,
    },
    data() {
        return {
            countdown_items: null,
            item: {
                id: null,
                title: null,
                date: null,
            },
            dateMenu: false,
            edit: false,
            edit_data : {
                id: null,
                title: null,
                date: null,
            },
            textFieldProps: {
                appendIcon: 'mdi-calendar',
                dense: true,
                outlined: true
            },
            dateProps: {
                /* headerColor: 'red' */
            },
            timeProps: {
                format: '24hr',
                ampmInTitle: true,
                scrollable: true
            }
        };
    },
    created() {
        const local = localStorage.getItem('countdown_items');
        const localObj = JSON.parse(local);
        if (localObj == null) {
            this.countdown_items = countdownDataJSON;
            this.sortCountdownData();
        } else if (localObj.length == 0) {
            this.countdown_items = countdownDataJSON;
            this.sortCountdownData();
        } else {
            this.countdown_items = JSON.parse(local);
            this.sortCountdownData();
        }
    },
    methods: {
        addCountdown() {
            const dt = dateFormat(this.item.date, 'yyyy-mm-dd HH:MM:ss');
            if (this.edit) {
                let objIndex = this.countdown_items.findIndex(obj => obj.id === this.item.id);
                this.countdown_items[objIndex].title = this.item.title;
                this.countdown_items[objIndex].date = dt;
            } else {
                const newCountdownItem = {
                    id: v4(),
                    title: this.item.title,
                    date: dt
                };
                this.countdown_items = [newCountdownItem, ...this.countdown_items];
            }
            this.edit = false;
            this.item.id = null;
            this.item.title = null;
            let today = new Date();
            this.item.date = new Date(`${today.getFullYear()}-${today.getMonth() + 1}`);
            this.sortCountdownData();
        },
        deleteCountdownItem(id) {
            this.countdown_items = this.countdown_items.filter(countdown_item => countdown_item.id !== id);
            this.sortCountdownData();
        },
        editCountdownItem(id) {
            let objIndex = this.countdown_items.findIndex(obj => obj.id === id);
            this.edit_data.title = this.countdown_items[objIndex].title;
            this.edit_data.date = this.countdown_items[objIndex].date;
            this.edit_data.id = id;
        },
        sortCountdownData() {
            try {
                this.countdown_items.sort(function(a, b) {
                    const nameA = new Date(a.date).getTime();
                    const nameB = new Date(b.date).getTime();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
            } catch (e) {
                console.log(e);
            }
        },
        clearBtnMethod() {
            this.edit = false;
            let today = new Date();
            this.item = {
                id: null,
                title: null,
                date: new Date(`${today.getFullYear()}-${today.getMonth() + 1}`),
            };
        }
    },
    watch: {
        countdown_items: {
            handler() {
                localStorage.setItem('countdown_items', JSON.stringify(this.countdown_items));
            },
            deep: true,
        },
        title: {
            handler() {
                if (this.item.title === '') {
                    this.edit = false;
                }
            }
        },
        edit_data: {
            handler() {
                this.item.id = this.edit_data.id;
                this.item.title = this.edit_data.title;
                this.item.date = new Date(this.edit_data.date);
                this.edit = true;
            },
            deep: true,
        }
    },
};
</script>

<style lang="scss">
.flip-card__top,
.flip-card__bottom,
.flip-card__back-bottom,
.flip-card__back::before,
.flip-card__back::after,
.flip-card__top-4digits,
.flip-card__bottom-4digits,
.flip-card__back-bottom-4digits,
.flip-card__back-4digits::before,
.flip-card__back-4digits::after {
    color: #ff0000 !important;
}
</style>
