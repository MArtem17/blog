export const state = () => ({
    post: {},
    posts: [],
})

export const getters = {

}

export const mutations = {
    setPosts(state, posts) {
        state.posts = []
        state.post = {}
        for (let i = 0; i < posts.length; i++) {
            if (i == 0) {
                state.post = posts[i]
            } else {
                state.posts.push(posts[i])
            }
        }
        console.log(state.post, state.posts)
    },
    createNewPost(state, post) {
        state.posts.reverse()
        state.posts.push(post)
        state.posts.reverse()
    }
}

export const actions = {
    createNewPost(state, post) {
        console.log("new post added", post)
    }
}