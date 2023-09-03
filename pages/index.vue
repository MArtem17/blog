<template>
    <div v-if="loading">
        <v-row>
            <v-col cols="12" sm="12" md="12" lg="12" xl="12">
                <post :title="post.title" :author="post.author" :img="post.img" :text_demo="post.text_demo" :id="post.id" />
            </v-col>
            <v-col v-for="(item, i) in posts.length" :key="i" cols="12" sm="12" md="6" lg="6" xl="6">
                <post v-if="i >= min && i < max" :title="posts[i].title" :author="posts[i].author" :img="posts[i].img"
                    :text_demo="posts[i].text_demo" :id="posts[i].id" />
            </v-col>
        </v-row>
        <div class="text-center">
            <v-pagination v-model="page" :length="len" circle></v-pagination>
        </div>
    </div>
</template>

<script>
import post from "@/components/post"
import { mapState } from 'vuex'
import { mapMutations } from 'vuex'
export default {
    name: "index",
    components: {
        post
    },
    sockets: {
        connect() {
            console.log("IO connected")
        }
    },
    data: () => ({
        page: 1,
        len: 1,
        loading: false
    }),
    computed: {
        ...mapState(['posts', 'post']),
        min() {
            return (this.page - 1) * 4
        },
        max() {
            return this.page * 4
        }
    },
    async beforeMount() {
        const response = await fetch('/index', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const result = await response.json()
        if (result.status === false) {
            console.log('result status = ', result.status)
        } else if (result.status === true) {
            this.setPosts(result.data.posts)
        }
        this.len = Math.ceil((result.data.posts.length - 1) / 4)
        this.loading = true
    },
    methods: {
        ...mapMutations(["setPosts"]),
        goToPost(id) {
            const data = {
                id: id
            }
            sessionStorage.setItem('post_id', JSON.stringify(data))
            this.$router.push({
                name: "post",
                params: {
                    id: id
                }
            })
        }
    },
}
</script>