<template>
    <v-card>
        <v-card-title class="orange darken-1">
            <span>Создание нового поста</span>
            <v-spacer></v-spacer>
            <v-btn @click="goToPostsPages()">
                К списку статей
            </v-btn>
        </v-card-title>
        <v-container>
            <v-form ref="form" v-model="valid" lazy-validation>
                <h4>Введите Ваше имя</h4>
                <v-text-field v-model="name" :counter="50" :rules="nameRules" label="Name" required></v-text-field>
                <h4>Введите заголовок для нового поста</h4>
                <v-textarea v-model="title" required outlined :counter="100" :rules="titleRules" clearable name="input-text"
                    label="Заголовок нового поста" height="100px"></v-textarea>

                <h4>Введите краткое содержание (демотекст) для нового поста</h4>
                <v-textarea v-model="demo" required outlined :counter="250" :rules="demoRules" clearable name="input-text"
                    label="Введите демо текст вашего поста"></v-textarea>
                <h4>Введите содержание (текст) для нового поста</h4>
                <v-textarea v-model="text" required outlined :counter="1000" :rules="textRules" clearable name="input-text"
                    label="Введите демо текст вашего поста" height="300px"></v-textarea>
                <h4>Загрузите главное и вспомогательное изображение для нового поста</h4>
                <v-row>
                    <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                        <v-file-input accept="image/*" type="file" name="image" label="Главное изображение"
                            :rules="imgRules" />
                    </v-col>
                    <!-- <v-col cols="4" sm="3" md="2" lg="2" xl="2">
                        <v-btn v-if="!imagePost[0].length" color="orange" @click="uploadImage(0)">Загрузить
                        </v-btn>
                        <v-btn v-else color="orange" @click="deleteImage(0)"> Удалить </v-btn>
                    </v-col> -->
                    <v-col cols="12" sm="12" md="6" lg="6" xl="6">
                        <v-file-input accept="image/*" type="file" name="image" label="Вспомогательное изображение"
                            :rules="imgRules" />
                    </v-col>
                    <!-- <v-col cols="4" sm="3" md="2" lg="2" xl="2">
                        <v-btn v-if="!imagePost[1].length" color="orange" @click="uploadImage(1)">Загрузить
                        </v-btn>
                        <v-btn v-else color="orange" @click="deleteImage(1)"> Удалить </v-btn>
                    </v-col> -->
                </v-row>

                <v-alert v-if="saveSuccess" type="success">
                    Пост успешно создан
                </v-alert>

                <v-alert v-if="saveError" type="error">
                    Заполните все обязательные поля
                </v-alert>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="warning" @click="reset"> Очистить форму </v-btn>
                    <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
                        Сохранть
                    </v-btn>
                </v-card-actions>

            </v-form>

        </v-container>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        valid: false,
        name: "",
        nameRules: [
            (v) => !!v || "Введите имя",
            (v) => (v && v.length <= 50) || "Имя не должно превышать 50 символов",
        ],
        title: "",
        titleRules: [
            (v) => !!v || "Введите заголовок",
            (v) => (v && v.length <= 100) || "Заголовок не должен превышать 100 символов",
        ],
        demo: "",
        demoRules: [
            (v) => !!v || "Введите демо текст",
            (v) => (v && v.length <= 250) || "Демо текст не должен превышать 250 символов",
        ],
        text: "",
        textRules: [
            (v) => !!v || "Введите текст",
            (v) => (v && v.length <= 250) || "Текст не должен превышать 1000 символов",
        ],
        imagePost: ["", ""],
        imgRules: [
            (v) => !!v || "Выберите изображение",
        ],
        saveSuccess: false,
        saveError: false
    }),
    mounted() {
        addEventListener('keydown', (event) => {
            if (event.key == 'Enter' && this.valid) {
                this.validate();
            }
        });
    },
    methods: {
        validate() {
            this.saveError = false
            if (this.$refs.form.validate()) {
                this.uploadImage(0)
                this.uploadImage(1)
                console.log("go to save")
                setTimeout(() => { this.saveNewPost() }, 1000)
            } else {
                this.saveError = true
            }
        },
        reset() {
            this.$refs.form.reset()
        },
        async uploadImage(idx) {
            const formData = new FormData();
            const fileField = document.querySelectorAll('input[type="file"]')
            formData.append('image', fileField[idx].files[0])
            try {
                const response = await fetch('/new_post', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json()
                if (result.data) {
                    this.imagePost[idx] = result.data.name
                    console.log(result.data.name)
                }
            } catch (error) {
                console.error('Ошибка:', error)
            }
            this.imagePost = [...this.imagePost]
        },
        goToPostsPages() {
            this.$router.push({
                name: "index"
            })
        },
        saveNewPost() {
            const post = {
                author: this.name,
                title: this.title,
                text_demo: this.demo,
                text: this.text,
                img: this.imagePost
            }
            console.log("go to save socket")
            this.$socket.emit('new_post', post, data => {
                if (typeof data === 'string') {
                    console.error(data)
                } else if (typeof data === 'object') {
                    this.saveSuccess = true

                    console.log("go to posts")
                    setTimeout(() => { this.goToPostsPages() }, 500)
                }
            })
        }
    },
};
</script>