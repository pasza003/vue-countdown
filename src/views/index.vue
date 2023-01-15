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
                            <form @submit.prevent="addOrEditCountdown">
                                <v-row
                                    justify="center"
                                    align="center"
                                    :class="{'mb-5': $vuetify.breakpoint.xs || $vuetify.breakpoint.sm}"
                                >
                                    <v-col
                                        align-self="center"
                                        cols="12"
                                        md="5"
                                    >
                                        <ValidationProvider
                                            v-slot="{ errors }"
                                            name="Name"
                                            rules="required"
                                        >
                                            <v-text-field
                                                v-model="item.title"
                                                label="Name"
                                                autocomplete="off"
                                                dense
                                                outlined
                                                :error-messages="errors"
                                            />
                                        </ValidationProvider>
                                    </v-col>
                                    <v-col
                                        align-self="start"
                                        cols="12"
                                        md="3"
                                    >
                                        <ValidationProvider
                                            name="Date"
                                            rules="required"
                                        >
                                            <v-datetime-picker
                                                label="Date"
                                                v-model="item.date"
                                                ref="datetime"
                                                clearText="DELETE"
                                                okText="OK"
                                                :text-field-props="{
                                                    appendIcon: 'mdi-calendar',
                                                    dense: true,
                                                    outlined: true,
                                                    hideDetails: true
                                                }"
                                                :date-picker-props="{
                                                    firstDayOfWeek: 1,
                                                    locale: 'hu'
                                                }"
                                                :time-picker-props="{
                                                    format: '24hr',
                                                    ampmInTitle: true,
                                                    scrollable: true
                                                }"
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
                                        cols="6"
                                        md="2"
                                        lg="1"
                                    >
                                        <v-btn
                                            type="submit"
                                            :disabled="invalid || pristine"
                                            medium
                                            color="primary"
                                        >
                                            <v-icon
                                                color="white"
                                                medium
                                            >
                                                {{ isEditing ? 'mdi-check' : 'mdi-plus'}}
                                            </v-icon>
                                        </v-btn>
                                    </v-col>
                                    <v-col
                                        align-self="start"
                                        cols="6"
                                        md="2"
                                        lg="1"
                                    >
                                        <v-btn
                                            color="#ff0000"
                                            :disabled="!item.title && !item.date"
                                            @click="resetItemValues"
                                            medium
                                        >
                                            <v-icon
                                                color="white"
                                                medium
                                            >
                                                mdi-close
                                            </v-icon>
                                        </v-btn>
                                    </v-col>
                                    <v-spacer />
                                </v-row>
                            </form>
                        </ValidationObserver>
                    </v-col>
                </v-row>
            </v-container>

            <h1 v-if="!countdownItems.length">
                Countdown List is empty.
            </h1>

            <div
                v-for="countdownItem in countdownItems"
                v-bind:key="countdownItem.id"
                class="mb-5"
            >
                <v-card
                    elevation="2"
                    outlined
                >
                    <v-card-text>
                        <v-row>
                            <v-col
                                class="white--text"
                                align-self="center"
                                cols="12"
                                md="6"
                            >
                                <h1>{{ countdownItem.title }}</h1>
                                <h3 class="mt-4" style="color: red;">{{ getCountdownItemDate(countdownItem.date) }}</h3>
                            </v-col>
                            <v-spacer />
                            <v-col
                                align-self="center"
                                cols="12"
                                md="4"
                            >
                                <h2 v-if="new Date(countdownItem.date).getTime() < new Date().getTime()">
                                    Date reached
                                </h2>
                                <flip-countdown
                                    v-else
                                    :deadline="countdownItem.date.toString()"
                                    countdown-size="xl"
                                    label-size="xl"
                                />
                            </v-col>
                            <v-col
                                align-self="center"
                                cols="12"
                                md="2"
                            >
                                <v-btn
                                    text
                                    @click="setEditItem(countdownItem.id)"
                                >
                                    <v-icon
                                        color="green"
                                        large
                                    >
                                        mdi-circle-edit-outline
                                    </v-icon>
                                </v-btn>
                                <v-btn
                                    class="ml-5"
                                    text
                                    @click="deleteCountdownItem(countdownItem.id)"
                                >
                                    <v-icon
                                        color="red"
                                        large
                                    >
                                        mdi-minus-circle
                                    </v-icon>
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
            countdownItems: null,
            item: {
                id: null,
                title: null,
                date: '',
            },
            isEditing: false,
        };
    },
    created() {
        this.countdownItems = JSON.parse(localStorage.getItem('countdownItems')) ?? [];
        this.sortCountdownData();
    },
    methods: {
        addOrEditCountdown() {
            const date = dateFormat(this.item.date, 'yyyy-mm-dd HH:MM:ss');
            if (this.isEditing) {
                let objIndex = this.countdownItems.findIndex(obj => obj.id === this.item.id);
                this.countdownItems[objIndex].title = this.item.title;
                this.countdownItems[objIndex].date = date;
                this.$emit('showSnackBarMessage', 'green', 'Item successfully edited');
            } else {
                this.countdownItems.push({
                    id: v4(),
                    title: this.item.title,
                    date
                });
                this.$emit('showSnackBarMessage', 'green', 'Item successfully added');
            }
            this.resetItemValues();
        },
        deleteCountdownItem(id) {
            this.countdownItems = this.countdownItems.filter(countdownItem => countdownItem.id !== id);
            this.$emit('showSnackBarMessage', 'green', 'Item successfully deleted');
            this.resetItemValues();
        },
        setEditItem(id) {
            window.scroll({
                top: 0,
                behavior: 'smooth'
            });

            const { title, date } = this.countdownItems.find(obj => obj.id === id);
            this.isEditing = true;
            this.item = {
                title,
                date: new Date(date),
                id
            };
        },
        sortCountdownData() {
            this.countdownItems.sort((a, b) => {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();

                return dateA < dateB ? -1 : (dateA > dateB ? 1 : 0);
            });
            this.setCountdownLang();
        },
        resetItemValues() {
            this.isEditing = false;
            this.item = {};
            this.$refs.datetime.date = '';
            this.$refs.datetime.time = '00:00:00';
            this.sortCountdownData();
        },
        getCountdownItemDate(date) {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return `${date.endsWith('00:00:00')
                ? date.substring(0, 10)
                : date}, ${days[new Date(date).getDay()]}`;
        },
        setCountdownLang() {
            setTimeout(() => {
                // eslint-disable-next-line max-len
                document.querySelectorAll('[id^="flip-card-days"] .flip-clock__slot').forEach(e => e.innerHTML = 'Days');
                // eslint-disable-next-line max-len
                document.querySelectorAll('[id^="flip-card-hours"] .flip-clock__slot').forEach(e => e.innerHTML = 'Hours');
                // eslint-disable-next-line max-len
                document.querySelectorAll('[id^="flip-card-minutes"] .flip-clock__slot').forEach(e => e.innerHTML = 'Minutes');
                // eslint-disable-next-line max-len
                document.querySelectorAll('[id^="flip-card-seconds"] .flip-clock__slot').forEach(e => e.innerHTML = 'Seconds');
            }, 50);
        }
    },
    watch: {
        countdownItems: {
            handler() {
                localStorage.setItem('countdownItems', JSON.stringify(this.countdownItems));
            },
            deep: true,
        },
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
