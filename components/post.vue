<template>
    <v-card class="mx-auto">
        <v-img class="white--text align-end" height="260px" :src="imagePath">
            <v-card-title>{{ title }}</v-card-title>
        </v-img>
        <v-card-text class="text--primary">
            <div>{{ text_demo }}</div>
        </v-card-text>

        <v-card-actions>
            <v-spacer />
            <v-btn color="orange" text @click="$parent.goToPost(id)">
                Подробнее
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    props: {
        title: String,
        img: String,
        text_demo: String,
        id: String
    },
    computed: {
        imagePath() {
            // return require(`static/image/${this.img}`)
            return require(`~/assets/image/${this.img}`)
        }
    }
}
</script>