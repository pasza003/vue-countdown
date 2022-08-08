<template>
    <v-app>
        <v-app-bar
            app
            color="#ff0000"
            dark
        >
            <div class="d-flex text-center">
                <v-btn
                    to="/"
                    text
                >
                    <v-icon
                        class="mr-2"
                    >
                        mdi-timer-outline
                    </v-icon>
                    <h3>Countdown</h3>
                </v-btn>
            </div>

            <v-spacer></v-spacer>

            <v-btn
                text
                @click="importDialog = true"
            >
                <span class="mr-2">Import</span>
            </v-btn>
            <v-btn
                text
                @click="exportData"
            >
                <span class="mr-2">Export</span>
            </v-btn>
        </v-app-bar>

        <v-main>
            <v-dialog
                v-model="importDialog"
                width="500"
            >
                <v-card height="500" class="white--text">
                    <v-card-title class="mt-8">
                        <p class="ml-3">Import</p>
                    </v-card-title>
                    <v-card-text>
                        <v-container class="text-center">
                            <v-checkbox
                                v-model="eraseAllData"
                                label="Minden adat törlése"
                                dense
                                color="primary"
                            />
                            <v-file-input
                                id="selectFiles"
                                label="Import"
                                accept=".json"
                            />
                            <v-btn
                                text
                                @click="importFile"
                                id="import"
                            >
                                <span class="mr-2">File importálása</span>
                            </v-btn>
                        </v-container>
                        <h2 style="color: red;" class="mt-5" v-if="eraseAllData">Minden adat törlésre fog kerülni!</h2>
                        <ul class="white--text mt-2">
                            <li>A file tipusa JSON-nak kell lennie</li>
                            <li>Adatoknak szükséges adattagjai: title, date</li>
                        </ul>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <router-view @showSnackBarMessage="showSnackBarMessage"/>
            <v-snackbar
                v-model="snackbar.show"
                top
                :color="snackbar.color"
                timeout="2000"
                class="text-center"
            >
                <b>{{ snackbar.message }}</b>
            </v-snackbar>
        </v-main>
    </v-app>
</template>

<script>
import { v4 } from 'uuid';
import dateFormat from 'dateformat';

export default {
    name: 'App',

    data: () => ({
        importDialog: false,
        exportBtn: false,
        eraseAllData: false,
        snackbar: {
            show: false,
            message: null,
            color: null,
        },
    }),
    methods: {
        importFile() {
            const files = document.getElementById('selectFiles').files;
            if (files.length <= 0) {
                return;
            }

            const fileReader = new FileReader();

            fileReader.readAsText(files.item(0));
            fileReader.onload = e => {
                const result = JSON.parse(e.target.result);

                try {
                    const newCountdownItems = [];
                    result.forEach(item => {
                        const keys = Object.keys(item);

                        // must have title and date keys, but id is optional
                        let keyAmount = 2;
                        if (keys.includes('id')) {
                            keyAmount += 1;
                        }

                        if (keys.length != keyAmount) {
                            // eslint-disable-next-line max-len
                            this.showSnackBarMessage('red', 'Hiba történt importálás során, nem megfelelő számú adattagok');
                            throw new Error('Nem megfelelő számú adattagok');
                        }

                        if (!keys.includes('title') || !keys.includes('date')) {
                            this.showSnackBarMessage('red', 'Hiba történt importálás során, nem megfelelő adattagok');
                            throw new Error('Nem megfelelő adattagok');
                        }

                        newCountdownItems.push({
                            id: v4(),
                            title: item.title,
                            date: item.date
                        });
                    });

                    if (this.eraseAllData) {
                        localStorage.setItem('countdownItems', JSON.stringify(newCountdownItems));
                    } else {
                        const currentData = JSON.parse(localStorage.getItem('countdownItems'));
                        localStorage.setItem('countdownItems', JSON.stringify([...currentData, ...newCountdownItems]));
                    }
                    this.showSnackBarMessage('green', 'Sikeres importálás');
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                } catch (e) {
                    console.log(e);
                }
            };
        },
        exportData() {
            const file = new Blob(
                [ localStorage.getItem('countdownItems') ],
                { type: 'application/json' }
            );
            const a = document.createElement('a');
            const url = URL.createObjectURL(file);
            a.href = url;
            a.download = `vue-countdown-export-${dateFormat(new Date(), 'yyyy-mm-dd')}.json`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        },
        showSnackBarMessage(color, message) {
            this.snackbar = {
                show: true,
                color,
                message
            };
        }
    }
};
</script>
