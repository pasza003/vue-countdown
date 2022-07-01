<template>
    <v-app>
        <v-app-bar
            app
            color="#cca900"
            dark
        >
            <div class="d-flex align-center">
                <v-btn
                    href="/"
                    text
                >
                    <v-img
                        alt="Vuetify Logo"
                        class="shrink mr-2"
                        contain
                        src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
                        transition="scale-transition"
                        width="40"
                    />
                    <span class="mr-2" style="text-shadow: 1px 1px 1px #000;">Countdown</span>
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
                <v-card height="500">
                    <v-card-title class="white--text mt-8">
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
                        <pre id="result"></pre>
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
                    this.importBtn = false,
                    // const formatted = JSON.stringify(result, null, 2);
                    // document.getElementById('result').innerHTML = formatted;
                    console.log(newCountdownItems);
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
