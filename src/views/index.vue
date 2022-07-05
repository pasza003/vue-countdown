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
                                >
                                    <v-col
                                        align-self="center"
                                        cols="12"
                                        md="5"
                                    >
                                        <ValidationProvider
                                            name="Name"
                                            rules="required"
                                        >
                                            <v-text-field
                                                v-model="item.title"
                                                label="Name"
                                                autocomplete="off"
                                                dense
                                                outlined
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
                                                label="Datetime"
                                                v-model="item.date"
                                                ref="datetime"
                                                :text-field-props="{
                                                    appendIcon: 'mdi-calendar',
                                                    dense: true,
                                                    outlined: true
                                                }"
                                                :date-picker-props="{
                                                    firstDayOfWeek: 1
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
                                        cols="12"
                                        md="2"
                                        lg="1"
                                    >
                                        <v-btn
                                            type="submit"
                                            :disabled="invalid || pristine"
                                            color="primary"
                                        >
                                            {{ isEditing ? 'Save' : 'Create'}}
                                        </v-btn>
                                    </v-col>
                                    <v-col
                                        align-self="start"
                                        cols="12"
                                        md="2"
                                        lg="1"
                                    >
                                        <v-btn
                                            color="#ff0000"
                                            :disabled="!item.title && !item.date"
                                            @click="resetItemValues"
                                        >
                                            {{ isEditing ? 'Cancel' : 'Clear'}}
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
                                <h3 class="mt-4" style="color: red;">
                                    {{
                                        countdownItem.date.endsWith('00:00:00')
                                            ? countdownItem.date.substring(0, 10)
                                            : countdownItem.date
                                    }}
                                </h3>
                            </v-col>
                            <v-spacer />
                            <v-col
                                align-self="center"
                                cols="12"
                                md="4"
                            >
                                <h1 v-if="new Date(countdownItem.date).getTime() < new Date().getTime()">
                                    Time expired
                                </h1>
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
                                    Edit
                                </v-btn>
                                <v-btn
                                    class="ml-5"
                                    text
                                    @click="deleteCountdownItem(countdownItem.id)"
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
                this.$emit('showSnackBarMessage', 'green', 'Item succesfully edited');
            } else {
                this.countdownItems.push({
                    id: v4(),
                    title: this.item.title,
                    date
                });
                this.$emit('showSnackBarMessage', 'green', 'Item succesfully created');
            }
            this.resetItemValues();
        },
        deleteCountdownItem(id) {
            this.countdownItems = this.countdownItems.filter(countdownItem => countdownItem.id !== id);
            this.$emit('showSnackBarMessage', 'green', 'Item succesfully deleted');
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
        },
        resetItemValues() {
            this.isEditing = false;
            this.item = {};
            this.$refs.datetime.date = '';
            this.$refs.datetime.time = '00:00:00';
            this.sortCountdownData();
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
