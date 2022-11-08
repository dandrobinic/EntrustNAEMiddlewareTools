<template>
    <div>
        <h1>Login</h1>
        <!-- <div class="form-container">
            <input type="email" placeholder="Email" v-model="email">
            <input type="password" placeholder="Contraseña" v-model="password">
            <button @click="login">Login</button>
        </div> -->
        <div id="login-container">
            <LoginV2 />
        </div>
    </div>
</template>

<script>
import firebase from "firebase";
import LoginV2 from '@/components/LoginV2.vue'

export default {
    name: "Login",
    components: {
        LoginV2
    },
    data(){
        return {
            email: "",
            password: "",
            initials: ""           
        }
    },
    methods: {
        login() {
            firebase
                .auth()
                    .signInWithEmailAndPassword(this.email,this.password)
                    .then(
                        (user) => {
                            console.log(user);
                        },
                        (err) => {
                            alert(err)
                        }
                    )
        }
    }
}
</script>

<style scoped>
input{
    margin: 10px;
    padding: 10px;
    border-radius: 5px;
    border: none;
    outline: none;
    background: #e2e2e2;
}
.form-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    margin: auto;
}

.form-container > input{
    width: 25%;
}
.form-container > button{
    width: 15%;
    margin: 10px;
    padding: 10px;
    background: #EF3829;
    outline: none;
    border: none;
    color: white;
}

</style>