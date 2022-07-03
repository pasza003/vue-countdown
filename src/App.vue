<template>
    <v-app>
        <v-app-bar
            app
            color="#ff0000"
            dark
        >
            <div class="d-flex align-center">
                <v-btn
                    href="/"
                    text
                >
                    <v-icon
                        large
                        class="mr-2"
                    >
                        mdi-timer-outline
                    </v-icon>
                    <h2>Countdown</h2>
                </v-btn>
            </div>

            <v-spacer></v-spacer>

            <v-btn
                text
                @click="importBtn = true"
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
                v-model="importBtn"
                width="500"
            >
                <v-card height="500" class="white--text">
                    <v-card-title class="mt-8">
                        <p class="ml-3">Import</p>
                    </v-card-title>
                    <v-card-text class="text-center">
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
                            <span class="mr-2">Import the file</span>
                        </v-btn>
                        <h2 style="color: red; margin: 5px 0;">All current data will be lost!</h2>
                        <ul class="white--text">
                            <li>Must be a JSON File</li>
                            <li>Must only have title and date parameters</li>
                        </ul>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <router-view/>
        </v-main>
    </v-app>
</template>

<script>
import { v4 } from 'uuid';

export default {
    name: 'App',

    data: () => ({
        importBtn: false,
        exportBtn: false,
    }),
    methods: {
        importFile() {
            const files = document.getElementById('selectFiles').files;
            if (files.length <= 0) {
                return false;
            }

            const fr = new FileReader();

            fr.onload = e => {
                const result = JSON.parse(e.target.result);

                try {
                    const newCountdownItems = [];
                    result.forEach(i => {
                        console.log(i);
                        const keys = Object.keys(i);

                        let keyAmount = 2;
                        if (keys.includes('id')) {
                            keyAmount += 1;
                        }

                        if (keys.length != keyAmount) {
                            throw new Error('Not correct amount of keys');
                        }

                        if (!keys.includes('title') || !keys.includes('date')) {
                            throw new Error('Incorrect keys');
                        }

                        newCountdownItems.push({
                            'id': v4(),
                            'title': i.title,
                            'date': i.date
                        });
                    });

                    localStorage.setItem('countdown_items', JSON.stringify(newCountdownItems));
                    this.importBtn = false;
                    window.location.reload();
                } catch (e) {
                    console.log(e);
                }
            };
            fr.readAsText(files.item(0));
        },
        exportData() {
            const local = localStorage.getItem('countdown_items');
            const file = new Blob([local], {type: 'application/json'});
            let a = document.createElement('a'),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = 'export.json';
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }
};
</script>
