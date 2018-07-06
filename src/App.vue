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
import favicon from "./assets/favicon-16x16.png";

var loading = null;

export default {
  name: "App",
  components: {
    Main
  },
  data() {
    return {
      showModal: true,
      logo: logo,
      favicon: favicon
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

.settings-button:hover{
  cursor: pointer;
}

.el-button:hover{
  cursor: pointer;
}

.nocursor:hover{
  cursor:default !important
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

.el-header {
  padding: 0px !important;
  height: auto !important;
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


.headerino {
  /*height: 40px !important;*/
  background: #36d1dc; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #5b86e5,
    #36d1dc
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #5b86e5,
    #36d1dc
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  
  font-weight: 600;
  color: whitesmoke;
  padding: 10px;
  width:100%
}
</style>
