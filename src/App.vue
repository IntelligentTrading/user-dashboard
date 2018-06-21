<template>
  <div id="wow">
    <div v-show="showModal" class="modal-loading">
        <img class="animate-flicker" width="150px" :src="logo"/>
    </div>
    <router-view v-on:loaded="closeLoad"></router-view>
  </div>
</template>

<script>
import Settings from "./components/Settings";
import logo from "./assets/itf.jpg";

var loading = null;

export default {
  name: "App",
  components: {
    Settings
  },
  data() {
    return {
      showModal: true,
      logo: logo
    };
  },
  methods: {
    closeLoad: function() {
      console.log('OK close')
      this.showModal = false;
    }
  }
};
</script>

<style>
#wow {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.modal-loading {
  z-index: 100;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgb(255, 255, 255);
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes flickerAnimation {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-o-keyframes flickerAnimation {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-moz-keyframes flickerAnimation {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@-webkit-keyframes flickerAnimation {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.animate-flicker {
  -webkit-animation: flickerAnimation 2s infinite;
  -moz-animation: flickerAnimation 2s infinite;
  -o-animation: flickerAnimation 2s infinite;
  animation: flickerAnimation 2s infinite;
}
</style>
