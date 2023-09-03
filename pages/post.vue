<template>
    <div v-if="loading">
        <img :src="pathImage" alt="" width="100%">
        <h1>{{ post.title }}</h1>
        <p>{{ post.text_demo }}</p>
        <img :src="pathImage1" alt="" width="100%">
        <p>{{ post.text }}</p>
    </div>
</template>

<script>
export default {
    data: () => ({
        post: {},
        loading: false
    }),
    computed: {
        pathImage() {
            // return require(`static/image/${this.post.img}`)
            return require(`~/assets/image/${this.post.img}`)
        },
        pathImage1() {
            // return require(`static/image/${this.post.img1}`)
            return require(`~/assets/image/${this.post.img1}`)
        },
    },
    async beforeMount() {
        let data = {
            id: this.$route.params.id ? this.$route.params.id : JSON.parse(sessionStorage.getItem('post_id')).id
        }
        const response = await fetch('/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json()
        if (result.status === false) {
            console.log('result status = ', result.status)
        } else if (result.status === true) {
            this.post = result.data.post
        }
        console.log(this.post)
        this.loading = true
    }
}
</script>