<template>
    <div>
        <h1>Registrar Usuario</h1>
        <div class="form-container">
            <input type="email" placeholder="Email" v-model="email">
            <input type="password" placeholder="Contraseña" v-model="password">
            <button @click="signup">Registrar</button>
        </div>
    </div>
</template>

<script>
import firebase from "firebase";

export default {
    name: "SignUp",
    data(){
        return {
            email: "",
            password: "",
            initials: ""           
        }
    },
    methods: {
        signup() {
            firebase
                .auth()
                    .createUserWithEmailAndPassword(this.email,this.password)
                    .then(
                        (user) => {
                            console.log("signup method");
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
    background: rgb(147, 147, 255);
    outline: none;
    border: none;
    color: white;
}
</style>