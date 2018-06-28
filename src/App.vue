<template>
  <div id="wow">
    <div v-show="showModal" class="modal-loading">
        <img class="animate-flicker" width="150px" :src="logo"/>
    </div>
    <router-view v-on:loaded="closeLoad"></router-view>
  </div>
</template>

<script>
import Main from "./components/Main";
import logo from "./assets/itf.jpg";

var loading = null;

export default {
  name: "App",
  components: {
    Main
  },
  data() {
    return {
      showModal: true,
      logo: logo
    };
  },
  methods: {
    closeLoad: function() {
      this.showModal = false;
    }
  }
};
</script>

<style>
li a {
  text-decoration: none;
}

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

.el-footer {
  height: 60px;
  position: fixed;
  bottom: 0px;
  width: 100%;
  margin: 0px;
  padding: 10px;
  left: 0px;
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

.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
